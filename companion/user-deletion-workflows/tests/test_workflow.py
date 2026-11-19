"""Exercise real PostgreSQL transactions; no provider or queue calls occur."""
import os
import selectors
import stat
import subprocess
import time
import unittest
from uuid import UUID


def uid(number):
    return str(UUID(int=number))


def sql(statement, *, app="deletion-spec-test"):
    result = subprocess.run(
        ["psql", "-XqAt", "-v", "ON_ERROR_STOP=1", "-c", statement],
        check=True, capture_output=True, text=True,
        env={**os.environ, "PGAPPNAME": app}, timeout=10,
    )
    return result.stdout.strip()


class Session:
    def __init__(self, name):
        self.process = subprocess.Popen(
            ["psql", "-XqAt", "-v", "ON_ERROR_STOP=1"],
            stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
            text=True, bufsize=1, env={**os.environ, "PGAPPNAME": name},
        )
        self.selector = selectors.DefaultSelector()
        self.selector.register(self.process.stdout, selectors.EVENT_READ)

    def send(self, statement):
        self.process.stdin.write(statement + "\n")
        self.process.stdin.flush()

    def read(self):
        if not self.selector.select(8):
            raise AssertionError("Timed out waiting for a PostgreSQL session result")
        value = self.process.stdout.readline().strip()
        if not value and self.process.poll() is not None:
            raise AssertionError(self.process.stderr.read())
        return value

    def close(self):
        if self.process.poll() is None:
            try:
                self.send("ROLLBACK;\\q")
                self.process.communicate(timeout=3)
            except (BrokenPipeError, subprocess.TimeoutExpired):
                self.process.kill()
                self.process.communicate(timeout=3)
        self.selector.close()


class WorkflowTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if sql("SELECT current_setting('deletion_specimen.test_cluster', true)") != "on":
            raise RuntimeError("Refusing to mutate a database outside the disposable test cluster")
        if sql("SHOW listen_addresses") != "":
            raise RuntimeError("The disposable cluster must not expose TCP listeners")
        if stat.S_IMODE(os.stat(os.environ["PGHOST"]).st_mode) != 0o700:
            raise RuntimeError("The disposable socket directory must be private")
        print("PostgreSQL evidence:", sql("SHOW server_version"))

    def setUp(self):
        sql("TRUNCATE deletion_dispatches, deletion_steps, deletion_jobs, users CASCADE")
        self.user = uid(1)
        sql(f"INSERT INTO users(id) VALUES ('{self.user}')")
        self.sessions = []

    def tearDown(self):
        for session in self.sessions:
            session.close()

    def session(self, name):
        session = Session(name)
        self.sessions.append(session)
        return session

    def wait_for_lock(self, name):
        deadline = time.monotonic() + 5
        while time.monotonic() < deadline:
            if sql(f"SELECT count(*) FROM pg_stat_activity WHERE application_name='{name}' AND wait_event_type='Lock'") == "1":
                return
        self.fail("Expected a real lock wait, but none was observed")

    def wait_for_lease_expiry(self, step):
        deadline = time.monotonic() + 5
        while time.monotonic() < deadline:
            if sql(f"SELECT lease_until <= clock_timestamp() FROM deletion_steps WHERE id='{step}'") == "t":
                return
        self.fail("Expected the committed lease deadline to pass")

    def wait_for_query_age(self, name):
        deadline = time.monotonic() + 5
        while time.monotonic() < deadline:
            if sql(f"SELECT count(*) FROM pg_stat_activity WHERE application_name='{name}' AND query_start <= clock_timestamp()-interval '200 milliseconds'") == "1":
                return
        self.fail("Expected the blocked query's elapsed time to pass its requested lease")

    def scheduled(self, due=True):
        instant = "2026-01-01 00:00:00+00" if due else "2099-01-01 00:00:00+00"
        return sql(f"SELECT schedule_deletion('{self.user}', '{instant}')")

    def executing(self):
        job = self.scheduled()
        self.assertEqual(sql(f"SELECT begin_deletion('{job}')"), "t")
        return job

    def step(self, job, service):
        return sql(f"SELECT id FROM deletion_steps WHERE job_id='{job}' AND service='{service}'")

    def claim(self, step, token):
        return sql(f"SELECT count(*) FROM claim_step('{step}', '{token}')")

    def complete_external(self, job):
        for index, service in enumerate(["stripe", "s3", "crm"], 10):
            step = self.step(job, service)
            self.assertEqual(self.claim(step, uid(index)), "1")
            self.assertEqual(sql(f"SELECT complete_step('{step}', '{uid(index)}')"), "t")

    def test_schedule_is_idempotent_and_uses_720_elapsed_hours(self):
        job = sql(f"SET TIME ZONE 'America/Los_Angeles'; SELECT schedule_deletion('{self.user}', '2026-03-01 12:00:00-08')")
        self.assertEqual(sql(f"SELECT extract(epoch FROM delete_after-requested_at) FROM deletion_jobs WHERE id='{job}'"), "2592000.000000")
        self.assertEqual(sql(f"SELECT schedule_deletion('{self.user}', '2026-03-10 00:00:00+00')"), job)
        self.assertEqual(sql(f"SELECT count(*) FROM deletion_steps WHERE job_id='{job}'"), "4")

    def test_concurrent_schedule_reuses_the_active_job_without_resetting_deadline(self):
        first = self.session("schedule-first")
        first.send(f"BEGIN; SELECT schedule_deletion('{self.user}', '2026-01-01 00:00:00+00');")
        job = first.read()
        second = self.session("schedule-waits")
        second.send(f"SELECT schedule_deletion('{self.user}', '2026-02-01 00:00:00+00');")
        self.wait_for_lock("schedule-waits")
        first.send("COMMIT;")
        self.assertEqual(second.read(), job)
        self.assertEqual(sql(f"SELECT count(*) FROM deletion_jobs WHERE user_id='{self.user}'"), "1")
        self.assertEqual(sql(f"SELECT count(*) FROM deletion_steps WHERE job_id='{job}'"), "4")
        self.assertEqual(sql(f"SELECT requested_at='2026-01-01 00:00:00+00' FROM deletion_jobs WHERE id='{job}'"), "t")

    def test_future_job_cannot_start_and_overdue_job_can_still_cancel(self):
        future = self.scheduled(False)
        self.assertEqual(sql(f"SELECT begin_deletion('{future}')"), "f")
        self.assertEqual(sql(f"SELECT cancel_deletion('{future}')"), "t")
        overdue = self.scheduled()
        self.assertEqual(sql(f"SELECT cancel_deletion('{overdue}')"), "t")
        self.assertEqual(sql(f"SELECT begin_deletion('{overdue}')"), "f")
        self.assertEqual(sql("SELECT enqueue_due_steps()"), "0")
        self.assertEqual(sql(f"SELECT writes_enabled FROM users WHERE id='{self.user}'"), "t")

    def test_cancellation_wins_real_race_against_execution(self):
        job = self.scheduled()
        cancel = self.session("cancel-first")
        cancel.send(f"BEGIN; SELECT cancel_deletion('{job}');")
        self.assertEqual(cancel.read(), "t")
        start = self.session("execution-waits")
        start.send(f"SELECT begin_deletion('{job}');")
        self.wait_for_lock("execution-waits")
        cancel.send("COMMIT;")
        self.assertEqual(start.read(), "f")

    def test_execution_wins_real_race_and_freezes_writes(self):
        job = self.scheduled()
        start = self.session("execution-first")
        start.send(f"BEGIN; SELECT begin_deletion('{job}');")
        self.assertEqual(start.read(), "t")
        cancel = self.session("cancel-waits")
        cancel.send(f"SELECT cancel_deletion('{job}');")
        self.wait_for_lock("cancel-waits")
        start.send("COMMIT;")
        self.assertEqual(cancel.read(), "f")
        self.assertEqual(sql(f"SELECT writes_enabled FROM users WHERE id='{self.user}'"), "f")

    def test_one_claim_wins_with_overlapping_update(self):
        job = self.executing()
        step = self.step(job, "stripe")
        first = self.session("claim-first")
        first.send(f"BEGIN; SELECT count(*) FROM claim_step('{step}', '{uid(20)}');")
        self.assertEqual(first.read(), "1")
        second = self.session("claim-waits")
        second.send(f"SELECT count(*) FROM claim_step('{step}', '{uid(21)}');")
        self.wait_for_lock("claim-waits")
        first.send("COMMIT;")
        self.assertEqual(second.read(), "0")

    def test_expired_claim_is_recoverable_and_stale_mutations_are_fenced(self):
        job = self.executing()
        step = self.step(job, "stripe")
        self.assertEqual(self.claim(step, uid(30)), "1")
        sql(f"UPDATE deletion_steps SET lease_until=clock_timestamp()-interval '1 second' WHERE id='{step}'")
        self.assertEqual(sql(f"SELECT complete_step('{step}', '{uid(30)}')"), "f")
        self.assertEqual(self.claim(step, uid(31)), "1")
        self.assertEqual(sql(f"SELECT complete_step('{step}', '{uid(30)}')"), "f")
        self.assertEqual(sql(f"SELECT retry_step('{step}', '{uid(30)}', clock_timestamp(), 'timeout')"), "f")
        self.assertEqual(sql(f"SELECT pause_step('{step}', '{uid(30)}', 'denied')"), "f")
        self.assertEqual(sql(f"SELECT complete_step('{step}', '{uid(31)}')"), "t")
        self.assertEqual(sql(f"SELECT attempts FROM deletion_steps WHERE id='{step}'"), "2")

    def test_retry_deadline_pause_and_local_claim_prerequisites(self):
        job = self.executing()
        step = self.step(job, "s3")
        local = self.step(job, "local_db")
        self.assertEqual(self.claim(local, uid(40)), "0")
        self.assertEqual(self.claim(step, uid(41)), "1")
        self.assertEqual(sql(f"SELECT retry_step('{step}', '{uid(41)}', clock_timestamp()+interval '1 hour', 'rate_limited')"), "t")
        self.assertEqual(self.claim(step, uid(42)), "0")
        sql(f"UPDATE deletion_steps SET next_attempt_at=clock_timestamp()-interval '1 second' WHERE id='{step}'")
        self.assertEqual(self.claim(step, uid(43)), "1")
        self.assertEqual(sql(f"SELECT pause_step('{step}', '{uid(43)}', 'permission_denied')"), "t")
        self.assertEqual(self.claim(step, uid(44)), "0")
        self.assertEqual(sql(f"SELECT count(*) FROM users WHERE id='{self.user}'"), "1")

    def test_local_finalization_is_atomic_and_job_survives_user(self):
        job = self.executing()
        local = self.step(job, "local_db")
        self.assertEqual(sql(f"SELECT finalize_deletion('{local}', '{uid(50)}')"), "f")
        self.complete_external(job)
        self.assertEqual(self.claim(local, uid(50)), "1")
        self.assertEqual(sql(f"SELECT complete_step('{local}', '{uid(50)}')"), "f")
        sql(f"BEGIN; SELECT finalize_deletion('{local}', '{uid(50)}'); ROLLBACK;")
        self.assertEqual(sql(f"SELECT count(*) FROM users WHERE id='{self.user}'"), "1")
        self.assertEqual(sql(f"SELECT status FROM deletion_jobs WHERE id='{job}'"), "executing")
        self.assertEqual(sql(f"SELECT finalize_deletion('{local}', '{uid(50)}')"), "t")
        self.assertEqual(sql(f"SELECT count(*) FROM users WHERE id='{self.user}'"), "0")
        self.assertEqual(sql(f"SELECT status FROM deletion_jobs WHERE id='{job}'"), "completed")
        self.assertEqual(sql(f"SELECT count(*) FROM deletion_steps WHERE job_id='{job}' AND status='completed'"), "4")

    def test_reconciliation_redispatches_pending_work_after_publication(self):
        job = self.executing()
        self.assertEqual(sql("SELECT enqueue_due_steps()"), "3")
        self.assertEqual(sql("SELECT enqueue_due_steps()"), "0")
        sql("UPDATE deletion_dispatches SET published_at=clock_timestamp()")
        self.assertEqual(sql("SELECT enqueue_due_steps()"), "0")
        sql("UPDATE deletion_dispatches SET created_at=clock_timestamp()-interval '2 minutes'")
        self.assertEqual(sql("SELECT enqueue_due_steps()"), "3")
        self.assertEqual(sql(f"SELECT count(*) FROM deletion_dispatches d JOIN deletion_steps s ON s.id=d.step_id WHERE s.job_id='{job}'"), "6")

    def test_dispatch_batch_limit_does_not_starve_other_steps(self):
        self.executing()
        self.assertEqual(sql("SELECT enqueue_due_steps(1)"), "1")
        self.assertEqual(sql("SELECT enqueue_due_steps(1)"), "1")
        self.assertEqual(sql("SELECT enqueue_due_steps(1)"), "1")
        self.assertEqual(sql("SELECT enqueue_due_steps(1)"), "0")

    def test_execution_waits_for_user_before_locking_the_job(self):
        job = self.scheduled()
        holder = self.session("user-row-holder")
        holder.send(f"BEGIN; SELECT id FROM users WHERE id='{self.user}' FOR UPDATE;")
        self.assertEqual(holder.read(), self.user)
        start = self.session("begin-user-waits")
        start.send(f"SELECT begin_deletion('{job}');")
        self.wait_for_lock("begin-user-waits")
        # If begin_deletion locked job first, this NOWAIT probe would fail.
        self.assertEqual(sql(f"BEGIN; SELECT id FROM deletion_jobs WHERE id='{job}' FOR UPDATE NOWAIT; COMMIT;"), job)
        holder.send("COMMIT;")
        self.assertEqual(start.read(), "t")

    def test_claim_lease_starts_after_waiting_for_the_step_lock(self):
        job = self.executing()
        step = self.step(job, "stripe")
        holder = self.session("claim-row-holder")
        holder.send(f"BEGIN; SELECT id FROM deletion_steps WHERE id='{step}' FOR UPDATE;")
        self.assertEqual(holder.read(), step)
        claimant = self.session("fresh-lease-waits")
        claimant.send(f"SELECT lease_until > clock_timestamp() FROM claim_step('{step}', '{uid(70)}', interval '100 milliseconds');")
        self.wait_for_lock("fresh-lease-waits")
        self.wait_for_query_age("fresh-lease-waits")
        holder.send("COMMIT;")
        self.assertEqual(claimant.read(), "t")

    def test_completion_retry_and_pause_reject_lease_expired_during_lock_wait(self):
        job = self.executing()
        for number, service in enumerate(["stripe", "s3", "crm"], 80):
            with self.subTest(service=service):
                step, token = self.step(job, service), uid(number)
                self.assertEqual(self.claim(step, token), "1")
                sql(f"UPDATE deletion_steps SET lease_until=clock_timestamp()+interval '300 milliseconds' WHERE id='{step}'")
                holder = self.session("mutation-holder-" + service)
                holder.send(f"BEGIN; SELECT id FROM deletion_steps WHERE id='{step}' FOR UPDATE;")
                self.assertEqual(holder.read(), step)
                worker = self.session("mutation-waits-" + service)
                call = {
                    "stripe": f"complete_step('{step}', '{token}')",
                    "s3": f"retry_step('{step}', '{token}', clock_timestamp(), 'timeout')",
                    "crm": f"pause_step('{step}', '{token}', 'denied')",
                }[service]
                worker.send("SELECT " + call + ";")
                self.wait_for_lock("mutation-waits-" + service)
                self.wait_for_lease_expiry(step)
                holder.send("COMMIT;")
                self.assertEqual(worker.read(), "f")
                self.assertEqual(sql(f"SELECT status FROM deletion_steps WHERE id='{step}'"), "running")

    def test_finalizer_rejects_lease_expired_during_unchanged_step_lock_wait(self):
        job = self.executing()
        self.complete_external(job)
        local, token = self.step(job, "local_db"), uid(90)
        self.assertEqual(self.claim(local, token), "1")
        sql(f"UPDATE deletion_steps SET lease_until=clock_timestamp()+interval '300 milliseconds' WHERE id='{local}'")
        holder = self.session("finalize-row-holder")
        holder.send(f"BEGIN; SELECT id FROM deletion_steps WHERE id='{local}' FOR UPDATE;")
        self.assertEqual(holder.read(), local)
        worker = self.session("finalize-waits")
        worker.send(f"SELECT finalize_deletion('{local}', '{token}');")
        self.wait_for_lock("finalize-waits")
        self.wait_for_lease_expiry(local)
        holder.send("COMMIT;")
        self.assertEqual(worker.read(), "f")
        self.assertEqual(sql(f"SELECT count(*) FROM users WHERE id='{self.user}'"), "1")
        self.assertEqual(sql(f"SELECT status FROM deletion_jobs WHERE id='{job}'"), "executing")
