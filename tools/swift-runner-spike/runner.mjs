import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";

export const DEFAULT_IMAGE =
  "swift:6.3.3-noble@sha256:66520bcba471018a34fd54ba09be97ba4abebd950a96ff5cb8c2bf50a2d33259";
export const CONTAINER_PREFIX = "tech-learning-swift-spike-";
export const EXPECTED_TOOLCHAIN = "Swift version 6.3.3";

const DEFAULT_LIMITS = Object.freeze({
  compileTimeoutMs: 10_000,
  maxOutputBytes: 64 * 1024,
  maxSourceBytes: 64 * 1024,
  runTimeoutMs: 3_000,
});

function boundedCollector(maxBytes, terminate) {
  const stdout = [];
  const stderr = [];
  let observedBytes = 0;

  function collect(target, chunk) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    const remaining = Math.max(0, maxBytes - Math.min(observedBytes, maxBytes));
    if (remaining > 0) target.push(buffer.subarray(0, remaining));
    observedBytes += buffer.length;
    if (observedBytes > maxBytes) terminate("output_limited");
  }

  return {
    stderr: (chunk) => collect(stderr, chunk),
    stdout: (chunk) => collect(stdout, chunk),
    value: () => ({
      observedBytes,
      stderr: Buffer.concat(stderr).toString("utf8"),
      stdout: Buffer.concat(stdout).toString("utf8"),
    }),
  };
}

function runProcess(command, args, options = {}) {
  const {
    input,
    maxOutputBytes = 16 * 1024,
    onTerminate,
    signal,
    timeoutMs = 20_000,
  } = options;

  return new Promise((resolve) => {
    const startedAt = performance.now();
    const child = spawn(command, args, { stdio: ["pipe", "pipe", "pipe"] });
    let reason = null;
    let settled = false;

    const terminate = (nextReason) => {
      if (reason) return;
      reason = nextReason;
      Promise.resolve(onTerminate?.()).catch(() => {});
      child.kill("SIGKILL");
    };

    const output = boundedCollector(maxOutputBytes, terminate);
    child.stdout.on("data", output.stdout);
    child.stderr.on("data", output.stderr);

    const timer = setTimeout(() => terminate("timed_out"), timeoutMs);
    const abort = () => terminate("cancelled");
    signal?.addEventListener("abort", abort, { once: true });
    if (signal?.aborted) abort();

    child.on("error", (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
      const captured = output.value();
      resolve({
        ...captured,
        code: null,
        durationMs: performance.now() - startedAt,
        error,
        reason: reason ?? "spawn_failed",
        signal: null,
      });
    });

    child.on("close", (code, childSignal) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
      resolve({
        ...output.value(),
        code,
        durationMs: performance.now() - startedAt,
        error: null,
        reason,
        signal: childSignal,
      });
    });

    if (input === undefined) child.stdin.end();
    else child.stdin.end(input);
  });
}

function terminalResult(status, stage, base, details = {}) {
  return {
    compileDurationMs: details.compileDurationMs ?? null,
    diagnostics: details.diagnostics ?? "",
    exitCode: base.code,
    outputLimited: status === "output_limited",
    runDurationMs: details.runDurationMs ?? null,
    stage,
    status,
    stderr: base.stderr,
    stdout: base.stdout,
    toolchain: details.toolchain ?? null,
  };
}

export async function runSwiftJob(options) {
  const {
    image = DEFAULT_IMAGE,
    limits: suppliedLimits = {},
    onStage,
    signal,
    source,
  } = options;
  const limits = { ...DEFAULT_LIMITS, ...suppliedLimits };
  const sourceBytes = Buffer.byteLength(source, "utf8");

  if (sourceBytes > limits.maxSourceBytes) {
    return {
      compileDurationMs: null,
      diagnostics: `Source exceeds ${limits.maxSourceBytes} bytes.`,
      exitCode: null,
      outputLimited: false,
      runDurationMs: null,
      stage: "validation",
      status: "rejected",
      stderr: "",
      stdout: "",
      toolchain: null,
    };
  }

  if (signal?.aborted) {
    return terminalResult("cancelled", "validation", {
      code: null,
      stderr: "",
      stdout: "",
    });
  }

  const containerName = `${CONTAINER_PREFIX}${process.pid}-${randomUUID()}`;
  let cleanupPromise = null;
  const cleanup = () => {
    if (!cleanupPromise) {
      cleanupPromise = runProcess("docker", ["rm", "--force", containerName], {
        maxOutputBytes: 4 * 1024,
        timeoutMs: 10_000,
      });
    }
    return cleanupPromise;
  };

  try {
    const stageContext = { containerName };
    onStage?.("starting", stageContext);
    const started = await runProcess(
      "docker",
      [
        "run",
        "--detach",
        "--rm",
        "--init",
        "--name",
        containerName,
        "--label",
        "tech-learning.swift-runner-spike=true",
        "--network",
        "none",
        "--read-only",
        "--cap-drop",
        "ALL",
        "--security-opt",
        "no-new-privileges",
        "--pids-limit",
        "64",
        "--memory",
        "1g",
        "--memory-swap",
        "1g",
        "--cpus",
        "1",
        "--ulimit",
        "nofile=64:64",
        "--tmpfs",
        "/work:rw,exec,size=256m,mode=1777",
        "--tmpfs",
        "/tmp:rw,exec,size=256m,mode=1777",
        "--user",
        "65534:65534",
        "--env",
        "HOME=/tmp",
        "--env",
        "TMPDIR=/tmp",
        image,
        "sh",
        "-c",
        "trap 'exit 0' TERM INT; while :; do sleep 3600 & wait $!; done",
      ],
      { maxOutputBytes: 8 * 1024, timeoutMs: 30_000 },
    );

    if (started.code !== 0) {
      return terminalResult("unavailable", "starting", started, {
        diagnostics: started.stderr || started.error?.message || "Unable to start Swift executor.",
      });
    }

    const version = await runProcess("docker", ["exec", containerName, "swiftc", "--version"], {
      maxOutputBytes: 8 * 1024,
      timeoutMs: 10_000,
    });
    if (version.code !== 0) {
      return terminalResult("unavailable", "capabilities", version, {
        diagnostics: version.stderr || "Unable to read Swift toolchain version.",
      });
    }
    const toolchain = version.stdout.trim();
    if (!toolchain.includes(EXPECTED_TOOLCHAIN)) {
      return terminalResult("unavailable", "capabilities", version, {
        diagnostics: `Expected ${EXPECTED_TOOLCHAIN}, received ${toolchain}.`,
        toolchain,
      });
    }

    const written = await runProcess(
      "docker",
      ["exec", "--interactive", containerName, "sh", "-c", "cat > /work/main.swift"],
      { input: source, maxOutputBytes: 8 * 1024, timeoutMs: 10_000 },
    );
    if (written.code !== 0) {
      return terminalResult("unavailable", "source", written, {
        diagnostics: written.stderr || "Unable to write source into the isolated workspace.",
        toolchain,
      });
    }

    onStage?.("compiling", stageContext);
    const compiled = await runProcess(
      "docker",
      [
        "exec",
        containerName,
        "swiftc",
        "-swift-version",
        "6",
        "-module-cache-path",
        "/tmp/module-cache",
        "/work/main.swift",
        "-o",
        "/work/main",
      ],
      {
        maxOutputBytes: limits.maxOutputBytes,
        onTerminate: cleanup,
        signal,
        timeoutMs: limits.compileTimeoutMs,
      },
    );

    if (compiled.reason === "cancelled") {
      return terminalResult("cancelled", "compiling", compiled, {
        compileDurationMs: compiled.durationMs,
        toolchain,
      });
    }
    if (compiled.reason === "timed_out") {
      return terminalResult("timed_out", "compiling", compiled, {
        compileDurationMs: compiled.durationMs,
        toolchain,
      });
    }
    if (compiled.reason === "output_limited") {
      return terminalResult("output_limited", "compiling", compiled, {
        compileDurationMs: compiled.durationMs,
        diagnostics: compiled.stderr,
        toolchain,
      });
    }
    if (compiled.code !== 0) {
      return terminalResult("compile_failed", "compiling", compiled, {
        compileDurationMs: compiled.durationMs,
        diagnostics: compiled.stderr,
        toolchain,
      });
    }

    onStage?.("running", stageContext);
    const executed = await runProcess("docker", ["exec", containerName, "/work/main"], {
      maxOutputBytes: limits.maxOutputBytes,
      onTerminate: cleanup,
      signal,
      timeoutMs: limits.runTimeoutMs,
    });

    if (executed.reason === "cancelled") {
      return terminalResult("cancelled", "running", executed, {
        compileDurationMs: compiled.durationMs,
        runDurationMs: executed.durationMs,
        toolchain,
      });
    }
    if (executed.reason === "timed_out") {
      return terminalResult("timed_out", "running", executed, {
        compileDurationMs: compiled.durationMs,
        runDurationMs: executed.durationMs,
        toolchain,
      });
    }
    if (executed.reason === "output_limited") {
      return terminalResult("output_limited", "running", executed, {
        compileDurationMs: compiled.durationMs,
        runDurationMs: executed.durationMs,
        toolchain,
      });
    }
    if (executed.code !== 0) {
      return terminalResult("runtime_failed", "running", executed, {
        compileDurationMs: compiled.durationMs,
        runDurationMs: executed.durationMs,
        toolchain,
      });
    }

    return terminalResult("succeeded", "running", executed, {
      compileDurationMs: compiled.durationMs,
      runDurationMs: executed.durationMs,
      toolchain,
    });
  } finally {
    await cleanup();
  }
}
