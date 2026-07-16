import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { createSwiftRunnerServer, SWIFT_RUNNER_HOST } from "../../tools/swift-runner/server.mjs";

const runners = new Set();

const validRequest = Object.freeze({
  harnessID: "swift-standard-v1",
  requestID: "request-valid-success",
  source: 'print("ready")',
  toolchain: "6.3.3",
});

function successfulResult(source = validRequest.source) {
  return {
    compileDurationMs: 12,
    diagnostics: "",
    exitCode: 0,
    outputLimited: false,
    runDurationMs: 4,
    stage: "running",
    status: "succeeded",
    stderr: "",
    stdout: source.includes("ready") ? "ready\n" : "done\n",
    toolchain: "Swift version 6.3.3\nTarget: test-linux-gnu",
  };
}

async function startRunner(options = {}) {
  const runner = createSwiftRunnerServer(options);
  runners.add(runner);
  const address = await runner.listen(0);
  assert.equal(address.address, SWIFT_RUNNER_HOST);
  return {
    baseURL: `http://${SWIFT_RUNNER_HOST}:${address.port}`,
    runner,
  };
}

async function postJob(baseURL, body = validRequest, headers = {}) {
  return fetch(`${baseURL}/v1/swift/jobs`, {
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json", ...headers },
    method: "POST",
  });
}

async function waitForTerminal(baseURL, jobID, headers = {}) {
  const deadline = Date.now() + 2_000;
  while (Date.now() < deadline) {
    const response = await fetch(`${baseURL}/v1/swift/jobs/${encodeURIComponent(jobID)}`, {
      headers,
    });
    const snapshot = await response.json();
    if ([
      "succeeded",
      "compile_failed",
      "runtime_failed",
      "timed_out",
      "cancelled",
      "output_limited",
      "rejected",
      "unavailable",
    ].includes(snapshot.status)) return snapshot;
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
  throw new Error(`Swift job ${jobID} did not reach a terminal state.`);
}

afterEach(async () => {
  await Promise.all([...runners].map((runner) => runner.close()));
  runners.clear();
});

test("serves contract capabilities with an explicit local CORS policy", async () => {
  const { baseURL } = await startRunner({
    allowedOrigins: ["http://127.0.0.1:4321"],
    executeJob: async () => successfulResult(),
  });

  const response = await fetch(`${baseURL}/v1/swift/capabilities`, {
    headers: { Origin: "http://127.0.0.1:4321" },
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("access-control-allow-origin"), "http://127.0.0.1:4321");
  assert.deepEqual(await response.json(), {
    available: true,
    harnessVersions: ["swift-standard-v1"],
    languageMode: "6",
    limits: {
      compileTimeoutMs: 10_000,
      maxOutputBytes: 65_536,
      maxSourceBytes: 65_536,
      runTimeoutMs: 3_000,
    },
    platform: "linux-container",
    toolchain: "6.3.3",
  });

  const denied = await fetch(`${baseURL}/v1/swift/capabilities`, {
    headers: { Origin: "https://example.invalid" },
  });
  assert.equal(denied.status, 403);
  assert.equal(denied.headers.get("access-control-allow-origin"), null);
});

test("creates, observes, and expires a successful job without retaining it", async () => {
  const { baseURL } = await startRunner({
    executeJob: async ({ onStage, source }) => {
      onStage("compiling");
      onStage("running");
      return successfulResult(source);
    },
    retentionMs: 20,
    sweepIntervalMs: 5,
  });

  const createdResponse = await postJob(baseURL);
  assert.equal(createdResponse.status, 202);
  const created = await createdResponse.json();
  assert.match(created.jobID, /^[0-9a-f-]{36}$/);

  const terminal = await waitForTerminal(baseURL, created.jobID);
  assert.deepEqual(terminal, {
    compileDurationMs: 12,
    diagnostics: "",
    exitCode: 0,
    harnessID: "swift-standard-v1",
    jobID: created.jobID,
    outputLimited: false,
    platform: "test-linux-gnu",
    runDurationMs: 4,
    stage: "complete",
    status: "succeeded",
    stderr: "",
    stdout: "ready\n",
    toolchain: "Swift version 6.3.3\nTarget: test-linux-gnu",
  });

  await new Promise((resolve) => setTimeout(resolve, 30));
  const expired = await fetch(`${baseURL}/v1/swift/jobs/${created.jobID}`);
  assert.equal(expired.status, 404);
});

test("rejects malformed, unsupported, and oversized jobs before execution", async () => {
  let executions = 0;
  const { baseURL } = await startRunner({
    executeJob: async () => {
      executions += 1;
      return successfulResult();
    },
  });

  const cases = [
    {
      body: { ...validRequest, extra: true },
      label: "extra field",
      status: 400,
    },
    {
      body: { ...validRequest, harnessID: "unknown-v1" },
      label: "unknown harness",
      status: 422,
    },
    {
      body: { ...validRequest, toolchain: "6.2.0" },
      label: "wrong toolchain",
      status: 422,
    },
    {
      body: { ...validRequest, source: "x".repeat(65_537) },
      label: "oversized source",
      status: 413,
    },
  ];

  for (const fixture of cases) {
    const response = await postJob(baseURL, fixture.body);
    assert.equal(response.status, fixture.status, fixture.label);
  }
  assert.equal(executions, 0);
});

test("cancels the underlying active executor and keeps cancellation idempotent", async () => {
  let executorObservedAbort = false;
  let resolveExecutor;
  const executorSettled = new Promise((resolve) => { resolveExecutor = resolve; });
  const { baseURL } = await startRunner({
    executeJob: ({ onStage, signal }) => new Promise((resolve) => {
      onStage("running");
      signal.addEventListener("abort", () => {
        executorObservedAbort = true;
        resolve({
          ...successfulResult(),
          exitCode: null,
          stage: "running",
          status: "cancelled",
        });
        resolveExecutor();
      }, { once: true });
    }),
  });

  const created = await (await postJob(baseURL, {
    ...validRequest,
    requestID: "request-valid-cancellation",
    source: "while true {}",
  })).json();
  const cancelledResponse = await fetch(`${baseURL}/v1/swift/jobs/${created.jobID}`, {
    method: "DELETE",
  });
  assert.equal(cancelledResponse.status, 200);
  assert.equal((await cancelledResponse.json()).status, "cancelled");
  await executorSettled;
  assert.equal(executorObservedAbort, true);

  const repeated = await fetch(`${baseURL}/v1/swift/jobs/${created.jobID}`, {
    method: "DELETE",
  });
  assert.equal(repeated.status, 200);
  assert.equal((await repeated.json()).status, "cancelled");
});

test("bounds active work and rejects jobs beyond the configured queue", async () => {
  const { baseURL } = await startRunner({
    executeJob: async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      return successfulResult();
    },
    maxConcurrentJobs: 1,
    maxQueuedJobs: 1,
  });

  const first = await postJob(baseURL, { ...validRequest, requestID: "request-queue-1" });
  const second = await postJob(baseURL, { ...validRequest, requestID: "request-queue-2" });
  const third = await postJob(baseURL, { ...validRequest, requestID: "request-queue-3" });
  assert.equal(first.status, 202);
  assert.equal(second.status, 202);
  assert.equal(third.status, 429);

  const secondJob = await second.json();
  await waitForTerminal(baseURL, secondJob.jobID);
});

test("deduplicates identical request IDs and rejects conflicting reuse", async () => {
  let executions = 0;
  const { baseURL } = await startRunner({
    executeJob: async () => {
      executions += 1;
      await new Promise((resolve) => setTimeout(resolve, 10));
      return successfulResult();
    },
  });

  const firstResponse = await postJob(baseURL);
  assert.equal(firstResponse.status, 202);
  const first = await firstResponse.json();

  const duplicateResponse = await postJob(baseURL);
  assert.equal(duplicateResponse.status, 200);
  assert.deepEqual(await duplicateResponse.json(), first);

  const conflict = await postJob(baseURL, { ...validRequest, source: 'print("different")' });
  assert.equal(conflict.status, 409);
  assert.match((await conflict.json()).error, /different Swift job input/);

  await waitForTerminal(baseURL, first.jobID);
  assert.equal(executions, 1);
});

test("enforces submission and polling windows before allocating more work", async () => {
  let executions = 0;
  const { baseURL } = await startRunner({
    executeJob: async () => {
      executions += 1;
      return successfulResult();
    },
    maxPollsPerWindow: 1,
    maxSubmissionsPerWindow: 1,
    pollWindowMs: 5_000,
    submissionWindowMs: 5_000,
  });

  const firstResponse = await postJob(baseURL);
  const first = await firstResponse.json();
  const secondResponse = await postJob(baseURL, {
    ...validRequest,
    requestID: "request-rate-limited",
  });
  assert.equal(secondResponse.status, 429);
  assert.equal(secondResponse.headers.get("retry-after"), "5");

  const firstPoll = await fetch(`${baseURL}/v1/swift/jobs/${first.jobID}`);
  assert.equal(firstPoll.status, 200);
  const secondPoll = await fetch(`${baseURL}/v1/swift/jobs/${first.jobID}`);
  assert.equal(secondPoll.status, 429);
  assert.equal(secondPoll.headers.get("retry-after"), "5");
  assert.equal(executions, 1);
});

test("keeps job reads and cancellation scoped to the creating client", async () => {
  let finishExecution;
  const { baseURL } = await startRunner({
    executeJob: () => new Promise((resolve) => { finishExecution = resolve; }),
    resolveClientID: (request) => String(request.headers["x-test-client"] ?? "missing"),
  });
  const aliceHeaders = { "X-Test-Client": "alice" };
  const bobHeaders = { "X-Test-Client": "bob" };

  const created = await (await postJob(baseURL, validRequest, aliceHeaders)).json();
  const hiddenRead = await fetch(`${baseURL}/v1/swift/jobs/${created.jobID}`, {
    headers: bobHeaders,
  });
  assert.equal(hiddenRead.status, 404);
  const hiddenCancel = await fetch(`${baseURL}/v1/swift/jobs/${created.jobID}`, {
    headers: bobHeaders,
    method: "DELETE",
  });
  assert.equal(hiddenCancel.status, 404);

  const ownerRead = await fetch(`${baseURL}/v1/swift/jobs/${created.jobID}`, {
    headers: aliceHeaders,
  });
  assert.equal(ownerRead.status, 200);
  finishExecution(successfulResult());
  await waitForTerminal(baseURL, created.jobID, aliceHeaders);
});

test("caps outstanding jobs per client without blocking a different client", async () => {
  const resolvers = [];
  const { baseURL } = await startRunner({
    executeJob: () => new Promise((resolve) => resolvers.push(resolve)),
    maxConcurrentJobs: 2,
    maxOutstandingJobsPerClient: 1,
    resolveClientID: (request) => String(request.headers["x-test-client"] ?? "missing"),
  });

  const aliceFirst = await postJob(baseURL, validRequest, { "X-Test-Client": "alice" });
  const aliceSecond = await postJob(baseURL, {
    ...validRequest,
    requestID: "alice-second",
  }, { "X-Test-Client": "alice" });
  const bobFirst = await postJob(baseURL, {
    ...validRequest,
    requestID: "bob-first",
  }, { "X-Test-Client": "bob" });
  assert.equal(aliceFirst.status, 202);
  assert.equal(aliceSecond.status, 429);
  assert.equal(bobFirst.status, 202);

  for (const resolve of resolvers) resolve(successfulResult());
});

test("can require an exact browser origin for every route", async () => {
  const origin = "https://waggertron.github.io";
  const { baseURL } = await startRunner({
    allowedOrigins: [origin],
    executeJob: async () => successfulResult(),
    requireOrigin: true,
  });

  const missing = await fetch(`${baseURL}/v1/swift/capabilities`);
  assert.equal(missing.status, 403);
  const denied = await fetch(`${baseURL}/v1/swift/capabilities`, {
    headers: { Origin: "https://example.invalid" },
  });
  assert.equal(denied.status, 403);
  const allowed = await fetch(`${baseURL}/v1/swift/capabilities`, {
    headers: { Origin: origin },
  });
  assert.equal(allowed.status, 200);
  assert.equal(allowed.headers.get("access-control-allow-origin"), origin);
  assert.equal(allowed.headers.get("referrer-policy"), "no-referrer");
});
