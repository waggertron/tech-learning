import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { after, test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  CONTAINER_PREFIX,
  DEFAULT_IMAGE,
  EXPECTED_TOOLCHAIN,
  runSwiftJob,
} from "../../tools/swift-runner-spike/runner.mjs";

const fixtures = path.join(path.dirname(fileURLToPath(import.meta.url)), "fixtures");

function fixture(name) {
  return readFileSync(path.join(fixtures, name), "utf8");
}

function spikeContainers() {
  const output = execFileSync(
    "docker",
    ["ps", "--all", "--filter", `name=${CONTAINER_PREFIX}`, "--format", "{{.Names}}"],
    { encoding: "utf8" },
  );
  return output.trim().split("\n").filter(Boolean);
}

after(() => {
  assert.deepEqual(spikeContainers(), [], "spike containers should always be removed");
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
  assert.deepEqual(spikeContainers(), []);
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
  assert.deepEqual(spikeContainers(), []);
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
  assert.equal(inspection.HostConfig.ReadonlyRootfs, true);
  assert.deepEqual(inspection.HostConfig.CapDrop, ["ALL"]);
  assert.ok(inspection.HostConfig.SecurityOpt.includes("no-new-privileges"));
  assert.equal(inspection.HostConfig.PidsLimit, 64);
  assert.equal(inspection.HostConfig.Memory, 1024 ** 3);
  assert.equal(inspection.HostConfig.MemorySwap, 1024 ** 3);
  assert.equal(inspection.Config.User, "65534:65534");
  assert.equal(inspection.HostConfig.PidMode, "");
  assert.ok(inspection.Mounts.every((mount) => mount.Type === "tmpfs"));
  assert.ok(inspection.Mounts.every((mount) => ["/tmp", "/work"].includes(mount.Destination)));
});

test("rejects oversized source before allocating a container", async () => {
  const result = await runSwiftJob({
    limits: { maxSourceBytes: 8 },
    source: fixture("success.swift"),
  });

  assert.equal(result.status, "rejected");
  assert.equal(result.stage, "validation");
  assert.deepEqual(spikeContainers(), []);
});

test("uses the pinned image name", () => {
  assert.match(DEFAULT_IMAGE, /^swift:6\.3\.3-noble@sha256:[a-f0-9]{64}$/);
  assert.equal(EXPECTED_TOOLCHAIN, "Swift version 6.3.3");
});
