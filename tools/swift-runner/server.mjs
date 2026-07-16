import { randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { pathToFileURL } from "node:url";
import { EXPECTED_TOOLCHAIN, runSwiftJob } from "./runner.mjs";

export const SWIFT_RUNNER_HOST = "127.0.0.1";
export const DEFAULT_SWIFT_RUNNER_PORT = 8787;

const SUPPORTED_HARNESS = "swift-standard-v1";
const TOOLCHAIN_VERSION = "6.3.3";
const MAX_SOURCE_BYTES = 64 * 1024;
const MAX_BODY_BYTES = MAX_SOURCE_BYTES + 4 * 1024;
const DEFAULT_RETENTION_MS = 5 * 60 * 1000;
const TERMINAL_STATUSES = new Set([
  "succeeded",
  "compile_failed",
  "runtime_failed",
  "timed_out",
  "cancelled",
  "output_limited",
  "rejected",
  "unavailable",
]);

const capabilities = Object.freeze({
  available: true,
  harnessVersions: [SUPPORTED_HARNESS],
  languageMode: "6",
  limits: {
    compileTimeoutMs: 10_000,
    maxOutputBytes: 64 * 1024,
    maxSourceBytes: MAX_SOURCE_BYTES,
    runTimeoutMs: 3_000,
  },
  platform: "linux-container",
  toolchain: TOOLCHAIN_VERSION,
});

function httpError(status, message) {
  return Object.assign(new Error(message), { status });
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validateJobRequest(value) {
  if (!isObject(value)) throw httpError(400, "The request body must be a JSON object.");

  const expectedKeys = ["harnessID", "requestID", "source", "toolchain"];
  const receivedKeys = Object.keys(value).sort();
  if (
    receivedKeys.length !== expectedKeys.length ||
    receivedKeys.some((key, index) => key !== expectedKeys[index])
  ) {
    throw httpError(400, "The request body contains missing or unsupported fields.");
  }

  if (value.harnessID !== SUPPORTED_HARNESS) {
    throw httpError(422, `Unsupported Swift harness: ${String(value.harnessID)}.`);
  }
  if (value.toolchain !== TOOLCHAIN_VERSION) {
    throw httpError(422, `Unsupported Swift toolchain: ${String(value.toolchain)}.`);
  }
  if (
    typeof value.requestID !== "string" ||
    value.requestID.length < 1 ||
    value.requestID.length > 100
  ) {
    throw httpError(400, "requestID must contain 1 to 100 characters.");
  }
  if (typeof value.source !== "string") {
    throw httpError(400, "source must be a string.");
  }
  if (Buffer.byteLength(value.source, "utf8") > MAX_SOURCE_BYTES) {
    throw httpError(413, `Swift source exceeds ${MAX_SOURCE_BYTES} bytes.`);
  }

  return {
    harnessID: value.harnessID,
    requestID: value.requestID,
    source: value.source,
    toolchain: value.toolchain,
  };
}

async function readJsonBody(request) {
  if (!request.headers["content-type"]?.toLowerCase().startsWith("application/json")) {
    throw httpError(415, "Content-Type must be application/json.");
  }

  const chunks = [];
  let bytes = 0;
  let oversized = false;
  for await (const chunk of request) {
    bytes += chunk.length;
    if (bytes > MAX_BODY_BYTES) oversized = true;
    if (!oversized) chunks.push(chunk);
  }
  if (oversized) throw httpError(413, `Request body exceeds ${MAX_BODY_BYTES} bytes.`);

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw httpError(400, "Request body must be valid JSON.");
  }
}

function blankSnapshot(jobID, harnessID) {
  return {
    compileDurationMs: null,
    diagnostics: "",
    exitCode: null,
    harnessID,
    jobID,
    outputLimited: false,
    platform: capabilities.platform,
    runDurationMs: null,
    stage: "queued",
    status: "queued",
    stderr: "",
    stdout: "",
    toolchain: EXPECTED_TOOLCHAIN,
  };
}

function platformFromToolchain(toolchain) {
  if (typeof toolchain !== "string") return capabilities.platform;
  return /^Target:\s*(.+)$/m.exec(toolchain)?.[1]?.trim() || capabilities.platform;
}

function terminalStage(result) {
  if (result.status === "succeeded") return "complete";
  if (result.status === "compile_failed") return "compiling";
  if (result.status === "runtime_failed") return "running";
  if (["compiling", "running"].includes(result.stage)) return result.stage;
  return "validation";
}

function terminalSnapshot(job, result) {
  const toolchain = typeof result.toolchain === "string" && result.toolchain
    ? result.toolchain
    : EXPECTED_TOOLCHAIN;
  return {
    ...blankSnapshot(job.jobID, job.harnessID),
    compileDurationMs:
      typeof result.compileDurationMs === "number" ? result.compileDurationMs : null,
    diagnostics: typeof result.diagnostics === "string" ? result.diagnostics : "",
    exitCode: Number.isInteger(result.exitCode) ? result.exitCode : null,
    outputLimited: result.status === "output_limited" || result.outputLimited === true,
    platform: platformFromToolchain(toolchain),
    runDurationMs: typeof result.runDurationMs === "number" ? result.runDurationMs : null,
    stage: terminalStage(result),
    status: TERMINAL_STATUSES.has(result.status) ? result.status : "unavailable",
    stderr: typeof result.stderr === "string" ? result.stderr : "",
    stdout: typeof result.stdout === "string" ? result.stdout : "",
    toolchain,
  };
}

function cancelledSnapshot(job) {
  return {
    ...job.snapshot,
    exitCode: null,
    stage: "complete",
    status: "cancelled",
  };
}

function parseJobID(pathname) {
  const prefix = "/v1/swift/jobs/";
  if (!pathname.startsWith(prefix)) return null;
  const encoded = pathname.slice(prefix.length);
  if (!encoded || encoded.includes("/")) return null;
  try {
    return decodeURIComponent(encoded);
  } catch {
    return null;
  }
}

function defaultOrigins() {
  return ["http://127.0.0.1:4321", "http://localhost:4321"];
}

export function createSwiftRunnerServer(options = {}) {
  const executeJob = options.executeJob ?? runSwiftJob;
  const allowedOrigins = new Set(options.allowedOrigins ?? defaultOrigins());
  const maxConcurrentJobs = options.maxConcurrentJobs ?? 2;
  const maxQueuedJobs = options.maxQueuedJobs ?? 16;
  const maxStoredJobs = options.maxStoredJobs ?? 256;
  const retentionMs = options.retentionMs ?? DEFAULT_RETENTION_MS;
  const sweepIntervalMs = options.sweepIntervalMs ?? Math.min(retentionMs, 30_000);
  const jobs = new Map();
  const queue = [];
  let activeJobs = 0;
  let closing = false;

  function finishJob(job, snapshot) {
    if (job.terminalAt !== null) return;
    job.snapshot = snapshot;
    job.source = undefined;
    job.terminalAt = Date.now();
  }

  function sweepExpiredJobs(now = Date.now()) {
    for (const [jobID, job] of jobs) {
      if (job.terminalAt !== null && now - job.terminalAt >= retentionMs) jobs.delete(jobID);
    }
  }

  async function runJob(job) {
    activeJobs += 1;
    job.active = true;
    const source = job.source;
    try {
      const result = await executeJob({
        onStage(stage) {
          if (job.terminalAt !== null) return;
          if (stage === "compiling") {
            job.snapshot = { ...job.snapshot, stage: "compiling", status: "compiling" };
          } else if (stage === "running") {
            job.snapshot = { ...job.snapshot, stage: "running", status: "running" };
          }
        },
        signal: job.controller.signal,
        source,
      });
      finishJob(job, terminalSnapshot(job, result));
    } catch {
      finishJob(
        job,
        terminalSnapshot(job, {
          diagnostics: "The Swift executor failed before returning a result.",
          status: "unavailable",
        }),
      );
    } finally {
      job.active = false;
      activeJobs -= 1;
      drainQueue();
    }
  }

  function drainQueue() {
    if (closing) return;
    while (activeJobs < maxConcurrentJobs && queue.length > 0) {
      const jobID = queue.shift();
      const job = jobs.get(jobID);
      if (!job || job.terminalAt !== null) continue;
      job.task = runJob(job);
    }
  }

  function createJob(request) {
    sweepExpiredJobs();
    if (closing) throw httpError(503, "The local Swift runner is shutting down.");
    if (jobs.size >= maxStoredJobs) {
      throw httpError(503, "The local Swift runner job store is full.");
    }
    if (activeJobs >= maxConcurrentJobs && queue.length >= maxQueuedJobs) {
      throw httpError(429, "The local Swift runner queue is full.");
    }

    const jobID = randomUUID();
    const job = {
      active: false,
      controller: new AbortController(),
      harnessID: request.harnessID,
      jobID,
      requestID: request.requestID,
      snapshot: blankSnapshot(jobID, request.harnessID),
      source: request.source,
      task: null,
      terminalAt: null,
    };
    jobs.set(jobID, job);
    queue.push(jobID);
    drainQueue();
    return job;
  }

  function requireJob(jobID) {
    sweepExpiredJobs();
    const job = jobs.get(jobID);
    if (!job) throw httpError(404, "Swift job not found.");
    return job;
  }

  function cancelJob(jobID) {
    const job = requireJob(jobID);
    if (job.terminalAt !== null) return job;
    const queuedIndex = queue.indexOf(jobID);
    if (queuedIndex >= 0) queue.splice(queuedIndex, 1);
    job.controller.abort(new DOMException("Cancelled", "AbortError"));
    finishJob(job, cancelledSnapshot(job));
    drainQueue();
    return job;
  }

  function applyResponseHeaders(request, response) {
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("X-Content-Type-Options", "nosniff");
    const origin = request.headers.origin;
    if (origin && allowedOrigins.has(origin)) {
      response.setHeader("Access-Control-Allow-Origin", origin);
      response.setHeader("Vary", "Origin");
    }
  }

  function sendJson(request, response, status, body) {
    applyResponseHeaders(request, response);
    response.writeHead(status);
    response.end(JSON.stringify(body));
  }

  async function handleRequest(request, response) {
    const origin = request.headers.origin;
    if (origin && !allowedOrigins.has(origin)) {
      sendJson(request, response, 403, { error: "Origin is not allowed." });
      return;
    }

    if (request.method === "OPTIONS") {
      applyResponseHeaders(request, response);
      response.setHeader("Access-Control-Allow-Headers", "Content-Type");
      response.setHeader("Access-Control-Allow-Methods", "DELETE, GET, OPTIONS, POST");
      response.writeHead(204);
      response.end();
      return;
    }

    const url = new URL(request.url ?? "/", "http://127.0.0.1");
    if (request.method === "GET" && url.pathname === "/v1/swift/capabilities") {
      sendJson(request, response, 200, capabilities);
      return;
    }

    if (request.method === "POST" && url.pathname === "/v1/swift/jobs") {
      const jobRequest = validateJobRequest(await readJsonBody(request));
      const job = createJob(jobRequest);
      sendJson(request, response, 202, { jobID: job.jobID });
      return;
    }

    const jobID = parseJobID(url.pathname);
    if (request.method === "GET" && jobID !== null) {
      sendJson(request, response, 200, requireJob(jobID).snapshot);
      return;
    }
    if (request.method === "DELETE" && jobID !== null) {
      sendJson(request, response, 200, cancelJob(jobID).snapshot);
      return;
    }

    sendJson(request, response, 404, { error: "Route not found." });
  }

  const server = createServer((request, response) => {
    void handleRequest(request, response).catch((error) => {
      const status = Number.isInteger(error?.status) ? error.status : 500;
      const message = status === 500 ? "The local Swift runner failed." : error.message;
      if (!response.headersSent) sendJson(request, response, status, { error: message });
      else response.end();
    });
  });

  const sweepTimer = setInterval(sweepExpiredJobs, sweepIntervalMs);
  sweepTimer.unref();

  return {
    address() {
      return server.address();
    },

    async close() {
      if (closing) return;
      closing = true;
      clearInterval(sweepTimer);
      for (const job of jobs.values()) {
        if (job.terminalAt === null) {
          job.controller.abort(new DOMException("Runner shutting down", "AbortError"));
          finishJob(job, cancelledSnapshot(job));
        }
      }
      const serverClosed = new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
        server.closeIdleConnections?.();
      });
      await Promise.allSettled(
        [...jobs.values()].map((job) => job.task).filter((task) => task !== null),
      );
      await serverClosed;
      jobs.clear();
      queue.length = 0;
    },

    listen(port = 0) {
      return new Promise((resolve, reject) => {
        const onError = (error) => {
          server.off("listening", onListening);
          reject(error);
        };
        const onListening = () => {
          server.off("error", onError);
          resolve(server.address());
        };
        server.once("error", onError);
        server.once("listening", onListening);
        server.listen(port, SWIFT_RUNNER_HOST);
      });
    },

    sweepExpiredJobs,
  };
}

function localOriginsFromEnvironment() {
  const configured = process.env.SWIFT_RUNNER_ALLOWED_ORIGINS;
  if (!configured) return defaultOrigins();
  const origins = configured.split(",").map((origin) => origin.trim()).filter(Boolean);
  for (const origin of origins) {
    const hostname = new URL(origin).hostname;
    if (!["127.0.0.1", "localhost", "[::1]"].includes(hostname)) {
      throw new Error(`Local Swift runner origin must use a loopback host: ${origin}`);
    }
  }
  return origins;
}

async function main() {
  const port = Number(process.env.SWIFT_RUNNER_PORT ?? DEFAULT_SWIFT_RUNNER_PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error("SWIFT_RUNNER_PORT must be an integer from 1 to 65535.");
  }

  const runner = createSwiftRunnerServer({ allowedOrigins: localOriginsFromEnvironment() });
  await runner.listen(port);
  console.log(`Local Swift runner ready at http://${SWIFT_RUNNER_HOST}:${port}`);

  let stopping = false;
  const stop = async () => {
    if (stopping) return;
    stopping = true;
    await runner.close();
  };
  process.once("SIGINT", () => void stop().then(() => process.exit(0)));
  process.once("SIGTERM", () => void stop().then(() => process.exit(0)));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
