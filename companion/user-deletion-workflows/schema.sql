-- PostgreSQL 18 specimen. All functions are SECURITY INVOKER.
-- Execute as the trusted workflow service, not as an end-user authorization API.
CREATE TABLE users (
  id uuid PRIMARY KEY,
  writes_enabled boolean NOT NULL DEFAULT true
);

CREATE TABLE deletion_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  requested_at timestamptz NOT NULL,
  delete_after timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'executing', 'completed', 'cancelled')),
  completed_at timestamptz,
  CHECK (delete_after = requested_at + interval '720 hours'),
  CHECK ((status = 'completed') = (completed_at IS NOT NULL))
);
CREATE UNIQUE INDEX deletion_jobs_one_active_idx ON deletion_jobs(user_id)
  WHERE status IN ('scheduled', 'executing');
CREATE INDEX deletion_jobs_due_idx ON deletion_jobs(delete_after, id)
  WHERE status = 'scheduled';

CREATE TABLE deletion_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES deletion_jobs(id),
  service text NOT NULL CHECK (service IN ('stripe', 's3', 'crm', 'local_db')),
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'running', 'completed', 'needs_attention')),
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  next_attempt_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  lease_token uuid,
  lease_until timestamptz,
  completed_at timestamptz,
  error_code text CHECK (length(error_code) <= 64),
  UNIQUE (job_id, service),
  CHECK ((status = 'running' AND lease_token IS NOT NULL AND lease_until IS NOT NULL)
    OR (status <> 'running' AND lease_token IS NULL AND lease_until IS NULL)),
  CHECK ((status = 'completed') = (completed_at IS NOT NULL))
);
CREATE INDEX deletion_steps_due_idx ON deletion_steps(next_attempt_at, id)
  WHERE status = 'pending';
CREATE INDEX deletion_steps_expired_idx ON deletion_steps(lease_until, id)
  WHERE status = 'running';

CREATE TABLE deletion_dispatches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  step_id uuid NOT NULL REFERENCES deletion_steps(id),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  published_at timestamptz
);
CREATE UNIQUE INDEX deletion_dispatches_unpublished_idx
  ON deletion_dispatches(step_id) WHERE published_at IS NULL;

CREATE FUNCTION schedule_deletion(p_user uuid, p_requested_at timestamptz)
RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE v_job uuid;
BEGIN
  -- Every operation that needs both rows locks user, then job, then step.
  PERFORM 1 FROM users WHERE id = p_user FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'User does not exist'; END IF;
  SELECT id INTO v_job FROM deletion_jobs
    WHERE user_id = p_user AND status IN ('scheduled', 'executing') FOR UPDATE;
  IF FOUND THEN RETURN v_job; END IF;

  INSERT INTO deletion_jobs(user_id, requested_at, delete_after)
    VALUES (p_user, p_requested_at, p_requested_at + interval '720 hours')
    ON CONFLICT (user_id) WHERE status IN ('scheduled', 'executing')
      DO UPDATE SET user_id = EXCLUDED.user_id
    RETURNING id INTO v_job;
  INSERT INTO deletion_steps(job_id, service)
    SELECT v_job, service FROM unnest(ARRAY['stripe', 's3', 'crm', 'local_db']) AS service
    ON CONFLICT (job_id, service) DO NOTHING;
  RETURN v_job;
END;
$$;

CREATE FUNCTION cancel_deletion(p_job uuid) RETURNS boolean LANGUAGE plpgsql AS $$
BEGIN
  UPDATE deletion_jobs SET status = 'cancelled'
    WHERE id = p_job AND status = 'scheduled';
  RETURN FOUND;
END;
$$;

CREATE FUNCTION begin_deletion(p_job uuid) RETURNS boolean LANGUAGE plpgsql AS $$
DECLARE v_user uuid;
BEGIN
  SELECT user_id INTO v_user FROM deletion_jobs WHERE id = p_job;
  IF NOT FOUND THEN RETURN false; END IF;
  PERFORM 1 FROM users WHERE id = v_user FOR UPDATE;
  IF NOT FOUND THEN RETURN false; END IF;
  UPDATE deletion_jobs SET status = 'executing'
    WHERE id = p_job AND status = 'scheduled' AND delete_after <= clock_timestamp();
  IF NOT FOUND THEN RETURN false; END IF;
  UPDATE users SET writes_enabled = false WHERE id = v_user;
  RETURN true;
END;
$$;

CREATE FUNCTION claim_step(p_step uuid, p_token uuid, p_lease interval DEFAULT interval '2 minutes')
RETURNS SETOF deletion_steps LANGUAGE plpgsql AS $$
DECLARE v_now timestamptz;
BEGIN
  IF p_token IS NULL OR p_lease IS NULL OR p_lease <= interval '0 seconds' THEN
    RAISE EXCEPTION 'A token and positive lease are required';
  END IF;
  PERFORM 1 FROM deletion_steps WHERE id = p_step FOR UPDATE;
  IF NOT FOUND THEN RETURN; END IF;
  v_now := clock_timestamp();
  RETURN QUERY
    UPDATE deletion_steps AS s
    SET status = 'running', attempts = s.attempts + 1,
        lease_token = p_token, lease_until = v_now + p_lease, error_code = NULL
    FROM deletion_jobs AS j
    WHERE s.id = p_step AND j.id = s.job_id
      AND j.status = 'executing' AND j.delete_after <= v_now
      AND ((s.status = 'pending' AND s.next_attempt_at <= v_now)
        OR (s.status = 'running' AND s.lease_until <= v_now))
      AND (s.service <> 'local_db' OR NOT EXISTS (
        SELECT 1 FROM deletion_steps AS prerequisite
        WHERE prerequisite.job_id = j.id AND prerequisite.service <> 'local_db'
          AND prerequisite.status <> 'completed'
      ))
    RETURNING s.*;
END;
$$;

-- Lock first, then read wall-clock expiry. A statement may wait on an
-- unchanged row, so a lease predicate evaluated before the wait is insufficient.
CREATE FUNCTION lock_owned_step(p_step uuid, p_token uuid) RETURNS boolean LANGUAGE plpgsql AS $$
DECLARE v_step deletion_steps;
BEGIN
  SELECT * INTO v_step FROM deletion_steps WHERE id = p_step FOR UPDATE;
  IF NOT FOUND THEN RETURN false; END IF;
  RETURN coalesce(v_step.status = 'running' AND v_step.lease_token = p_token
    AND v_step.lease_until > clock_timestamp(), false);
END;
$$;

CREATE FUNCTION complete_step(p_step uuid, p_token uuid) RETURNS boolean LANGUAGE plpgsql AS $$
BEGIN
  IF NOT lock_owned_step(p_step, p_token) THEN RETURN false; END IF;
  IF (SELECT service = 'local_db' FROM deletion_steps WHERE id = p_step) THEN RETURN false; END IF;
  UPDATE deletion_steps SET status = 'completed', completed_at = clock_timestamp(),
      lease_token = NULL, lease_until = NULL, error_code = NULL WHERE id = p_step;
  RETURN true;
END;
$$;

CREATE FUNCTION retry_step(p_step uuid, p_token uuid, p_retry_at timestamptz, p_code text)
RETURNS boolean LANGUAGE plpgsql AS $$
BEGIN
  IF NOT lock_owned_step(p_step, p_token) THEN RETURN false; END IF;
  UPDATE deletion_steps SET status = 'pending', next_attempt_at = p_retry_at,
      lease_token = NULL, lease_until = NULL, error_code = p_code WHERE id = p_step;
  RETURN true;
END;
$$;

CREATE FUNCTION pause_step(p_step uuid, p_token uuid, p_code text)
RETURNS boolean LANGUAGE plpgsql AS $$
BEGIN
  IF NOT lock_owned_step(p_step, p_token) THEN RETURN false; END IF;
  UPDATE deletion_steps SET status = 'needs_attention',
      lease_token = NULL, lease_until = NULL, error_code = p_code WHERE id = p_step;
  RETURN true;
END;
$$;

CREATE FUNCTION finalize_deletion(p_step uuid, p_token uuid) RETURNS boolean LANGUAGE plpgsql AS $$
DECLARE v_job uuid; v_user uuid;
BEGIN
  SELECT job_id INTO v_job FROM deletion_steps WHERE id = p_step AND service = 'local_db';
  IF NOT FOUND THEN RETURN false; END IF;
  SELECT user_id INTO v_user FROM deletion_jobs WHERE id = v_job;
  PERFORM 1 FROM users WHERE id = v_user FOR UPDATE;
  PERFORM 1 FROM deletion_jobs WHERE id = v_job AND status = 'executing' FOR UPDATE;
  IF NOT FOUND THEN RETURN false; END IF;
  IF NOT lock_owned_step(p_step, p_token) THEN RETURN false; END IF;
  IF EXISTS (SELECT 1 FROM deletion_steps WHERE job_id = v_job
    AND service <> 'local_db' AND status <> 'completed') THEN RETURN false; END IF;

  DELETE FROM users WHERE id = v_user;
  UPDATE deletion_steps SET status = 'completed', completed_at = clock_timestamp(),
    lease_token = NULL, lease_until = NULL, error_code = NULL WHERE id = p_step;
  UPDATE deletion_jobs SET status = 'completed', completed_at = clock_timestamp() WHERE id = v_job;
  RETURN true;
END;
$$;

-- This creates durable dispatch intent only. A real leased publisher and SQS
-- acknowledgement are intentionally outside the specimen.
CREATE FUNCTION enqueue_due_steps(p_limit integer DEFAULT 100, p_redispatch_after interval DEFAULT interval '1 minute')
RETURNS integer LANGUAGE plpgsql AS $$
DECLARE v_count integer; v_now timestamptz := clock_timestamp();
BEGIN
  IF p_limit IS NULL OR p_limit NOT BETWEEN 1 AND 1000
    OR p_redispatch_after IS NULL OR p_redispatch_after <= interval '0 seconds' THEN
    RAISE EXCEPTION 'Require a batch of 1-1000 and a positive redispatch interval';
  END IF;
  INSERT INTO deletion_dispatches(step_id)
    SELECT s.id FROM deletion_steps AS s JOIN deletion_jobs AS j ON j.id = s.job_id
    WHERE j.status = 'executing' AND j.delete_after <= v_now
      AND ((s.status = 'pending' AND s.next_attempt_at <= v_now)
        OR (s.status = 'running' AND s.lease_until <= v_now))
      AND (s.service <> 'local_db' OR NOT EXISTS (
        SELECT 1 FROM deletion_steps AS prerequisite
        WHERE prerequisite.job_id = j.id AND prerequisite.service <> 'local_db'
          AND prerequisite.status <> 'completed'
      ))
      AND NOT EXISTS (SELECT 1 FROM deletion_dispatches AS d WHERE d.step_id = s.id
        AND (d.published_at IS NULL OR d.created_at > v_now - p_redispatch_after))
    ORDER BY s.next_attempt_at, s.id LIMIT p_limit
    ON CONFLICT (step_id) WHERE published_at IS NULL DO NOTHING;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;
