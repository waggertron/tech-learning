import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { after, test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  CONTAINER_PREFIX,
  DEFAULT_IMAGE,
  EXPECTED_TOOLCHAIN,
  runSwiftJob,
} from "../../tools/swift-runner/runner.mjs";

const fixtures = path.join(path.dirname(fileURLToPath(import.meta.url)), "fixtures");

function fixture(name) {
  return readFileSync(path.join(fixtures, name), "utf8");
}

function runnerContainers() {
  const output = execFileSync(
    "docker",
    ["ps", "--all", "--filter", `name=${CONTAINER_PREFIX}`, "--format", "{{.Names}}"],
    { encoding: "utf8" },
  );
  return output.trim().split("\n").filter(Boolean);
}

after(() => {
  assert.deepEqual(runnerContainers(), [], "runner containers should always be removed");
});

test("reports the exact stable Swift toolchain and captures successful output", async () => {
  const result = await runSwiftJob({ source: fixture("success.swift") });

  assert.equal(result.status, "succeeded");
  assert.match(result.toolchain, /Swift version 6\.3\.3/);
  assert.match(result.toolchain, /aarch64-unknown-linux-gnu/);
  assert.equal(result.stdout.trim(), "swift runner ready");
  assert.equal(result.stderr, "");
  assert.ok(result.compileDurationMs > 0);
  assert.ok(result.runDurationMs > 0);
});

test("returns compiler diagnostics without entering the run stage", async () => {
  const result = await runSwiftJob({ source: fixture("compile-failure.swift") });

  assert.equal(result.status, "compile_failed");
  assert.equal(result.stage, "compiling");
  assert.match(result.diagnostics, /cannot convert value of type 'String' to specified type 'Int'/);
  assert.equal(result.runDurationMs, null);
});

test("separates runtime failure from compiler failure", async () => {
  const result = await runSwiftJob({ source: fixture("runtime-failure.swift") });

  assert.equal(result.status, "runtime_failed");
  assert.equal(result.stage, "running");
  assert.match(result.stderr, /Fatal error: deliberate runtime failure/);
  assert.notEqual(result.exitCode, 0);
});

test("enforces a wall-clock timeout and removes the underlying container", async () => {
  const result = await runSwiftJob({
    limits: { runTimeoutMs: 300 },
    source: fixture("timeout.swift"),
  });

  assert.equal(result.status, "timed_out");
  assert.equal(result.stage, "running");
  assert.deepEqual(runnerContainers(), []);
});

test("enforces the compiler wall-clock deadline", async () => {
  const result = await runSwiftJob({
    limits: { compileTimeoutMs: 1 },
    source: fixture("success.swift"),
  });

  assert.equal(result.status, "timed_out");
  assert.equal(result.stage, "compiling");
  assert.deepEqual(runnerContainers(), []);
});

test("cancellation stops the underlying run instead of only abandoning the client", async () => {
  const controller = new AbortController();
  const result = await runSwiftJob({
    onStage(stage) {
      if (stage === "running") setTimeout(() => controller.abort(), 100);
    },
    signal: controller.signal,
    source: fixture("cancellation.swift"),
  });

  assert.equal(result.status, "cancelled");
  assert.equal(result.stage, "running");
  assert.deepEqual(runnerContainers(), []);
});

test("bounds runaway output", async () => {
  const result = await runSwiftJob({
    limits: { maxOutputBytes: 4 * 1024 },
    source: fixture("output-limit.swift"),
  });

  assert.equal(result.status, "output_limited");
  assert.equal(result.outputLimited, true);
  assert.ok(Buffer.byteLength(result.stdout) <= 4 * 1024);
});

test("applies one output budget across compiler diagnostics and program output", async () => {
  const maxOutputBytes = 512;
  const result = await runSwiftJob({
    limits: { maxOutputBytes },
    source: `
#warning("deliberate compiler warning for the combined output test")
while true {
  print("deliberate program output")
}
`,
  });

  assert.equal(result.status, "output_limited");
  assert.match(result.diagnostics, /deliberate compiler warning/);
  assert.ok(result.stdout.length > 0);
  assert.ok(
    Buffer.byteLength(result.diagnostics) +
      Buffer.byteLength(result.stdout) +
      Buffer.byteLength(result.stderr) <=
      maxOutputBytes,
  );
});

test("isolates concurrent jobs and routes output to the correct caller", async () => {
  const containerNames = new Set();
  const [first, second] = await Promise.all([
    runSwiftJob({
      onStage(_stage, context) {
        containerNames.add(context.containerName);
      },
      source: fixture("isolation-a.swift"),
    }),
    runSwiftJob({
      onStage(_stage, context) {
        containerNames.add(context.containerName);
      },
      source: fixture("isolation-b.swift"),
    }),
  ]);

  assert.equal(first.status, "succeeded");
  assert.equal(second.status, "succeeded");
  assert.equal(containerNames.size, 2);
  assert.equal(first.stdout.trim(), "job-a");
  assert.equal(second.stdout.trim(), "job-b");
});

test("applies the declared container isolation boundary", async () => {
  const controller = new AbortController();
  let inspection;
  const result = await runSwiftJob({
    onStage(stage, context) {
      if (stage !== "running") return;
      inspection = JSON.parse(
        execFileSync("docker", ["inspect", context.containerName], { encoding: "utf8" }),
      )[0];
      controller.abort();
    },
    signal: controller.signal,
    source: fixture("cancellation.swift"),
  });

  assert.equal(result.status, "cancelled");
  assert.equal(inspection.HostConfig.NetworkMode, "none");
  assert.equal(inspection.HostConfig.IpcMode, "none");
  assert.equal(inspection.HostConfig.ReadonlyRootfs, true);
  assert.deepEqual(inspection.HostConfig.CapDrop, ["ALL"]);
  assert.ok(inspection.HostConfig.SecurityOpt.includes("no-new-privileges"));
  assert.equal(inspection.HostConfig.PidsLimit, 64);
  assert.equal(inspection.HostConfig.Memory, 1024 ** 3);
  assert.equal(inspection.HostConfig.MemorySwap, 1024 ** 3);
  assert.equal(inspection.HostConfig.NanoCpus, 1_000_000_000);
  assert.equal(inspection.Config.User, "65534:65534");
  assert.equal(inspection.Config.WorkingDir, "/work");
  assert.equal(inspection.HostConfig.PidMode, "");
  assert.deepEqual(
    inspection.HostConfig.Ulimits,
    [
      { Hard: 0, Name: "core", Soft: 0 },
      { Hard: 64, Name: "nofile", Soft: 64 },
    ],
  );
  assert.ok(inspection.Mounts.every((mount) => mount.Type === "tmpfs"));
  assert.ok(inspection.Mounts.every((mount) => ["/tmp", "/work"].includes(mount.Destination)));
  assert.match(inspection.HostConfig.Tmpfs["/tmp"], /\bnoexec\b/);
  assert.match(inspection.HostConfig.Tmpfs["/tmp"], /\bnosuid\b/);
  assert.match(inspection.HostConfig.Tmpfs["/tmp"], /\bnodev\b/);
  assert.match(inspection.HostConfig.Tmpfs["/work"], /\bexec\b/);
  assert.match(inspection.HostConfig.Tmpfs["/work"], /\bnosuid\b/);
  assert.match(inspection.HostConfig.Tmpfs["/work"], /\bnodev\b/);
  assert.equal(inspection.Mounts.some((mount) => mount.Source.includes("docker.sock")), false);
  assert.equal(
    inspection.Config.Env.some((entry) => /(?:TOKEN|SECRET|PASSWORD|CREDENTIAL|AUTH)=/i.test(entry)),
    false,
  );
});

test("keeps host files, environment, and the container socket outside the job", async () => {
  const directory = mkdtempSync(path.join(tmpdir(), "swift-runner-host-"));
  const hostFile = path.join(directory, "sentinel.txt");
  writeFileSync(hostFile, "host-only", "utf8");
  process.env.SWIFT_RUNNER_TEST_SECRET = "REDACTED";

  try {
    const result = await runSwiftJob({
      source: `
import Glibc

print("host-file=\\(access(${JSON.stringify(hostFile)}, F_OK) == 0)")
print("container-socket=\\(access(\"/var/run/docker.sock\", F_OK) == 0)")
print("host-environment=\\(getenv(\"SWIFT_RUNNER_TEST_SECRET\") != nil)")
`,
    });

    assert.equal(result.status, "succeeded");
    assert.equal(
      result.stdout.trim(),
      "host-file=false\ncontainer-socket=false\nhost-environment=false",
    );
  } finally {
    delete process.env.SWIFT_RUNNER_TEST_SECRET;
    rmSync(directory, { force: true, recursive: true });
  }
});

test("rejects oversized source before allocating a container", async () => {
  const result = await runSwiftJob({
    limits: { maxSourceBytes: 8 },
    source: fixture("success.swift"),
  });

  assert.equal(result.status, "rejected");
  assert.equal(result.stage, "validation");
  assert.deepEqual(runnerContainers(), []);
});

test("uses the pinned image name", () => {
  assert.match(DEFAULT_IMAGE, /^swift:6\.3\.3-noble@sha256:[a-f0-9]{64}$/);
  assert.equal(EXPECTED_TOOLCHAIN, "Swift version 6.3.3");
});
