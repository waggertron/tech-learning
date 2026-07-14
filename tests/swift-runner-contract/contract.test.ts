import { describe, expect, it, vi } from "vitest";
import { executeSwift } from "../../src/lib/swift-runner/execute";
import { createHttpSwiftRunnerClient, SwiftRunnerHttpError } from "../../src/lib/swift-runner/http-client";
import { createMockSwiftRunnerClient, type SwiftMockFixture } from "../../src/lib/swift-runner/mock";
import type { SwiftJobRequest, SwiftJobSnapshot } from "../../src/lib/swift-runner/contract";

const source = {
  cancellation: "while true {} // cancellation fixture",
  compileFailure: 'let count: Int = "wrong"',
  outputLimit: 'while true { print("bounded") }',
  runtimeFailure: 'fatalError("deliberate")',
  success: 'print("ready")',
  timeout: "while true {} // timeout fixture",
  unavailable: 'print("service check")',
};

const fixtures: SwiftMockFixture[] = [
  { outcome: "succeeded", source: source.success, stdout: "ready\n" },
  {
    diagnostics: "cannot convert value of type String to specified type Int",
    outcome: "compile_failed",
    source: source.compileFailure,
  },
  {
    outcome: "runtime_failed",
    source: source.runtimeFailure,
    stderr: "Fatal error: deliberate",
  },
  { outcome: "timed_out", source: source.timeout },
  { outcome: "output_limited", source: source.outputLimit, stdout: "bounded\n" },
  { outcome: "succeeded", source: source.cancellation },
  { outcome: "unavailable", source: source.unavailable },
];

function request(swiftSource: string): SwiftJobRequest {
  return {
    harnessID: "swift-standard-v1",
    requestID: `request-${swiftSource.length}`,
    source: swiftSource,
    toolchain: "6.3.3",
  };
}

describe("deterministic Swift runner mock", () => {
  it("reports the same versioned capabilities as the real contract", async () => {
    const client = createMockSwiftRunnerClient(fixtures);

    await expect(client.getCapabilities()).resolves.toMatchObject({
      available: true,
      harnessVersions: ["swift-standard-v1"],
      languageMode: "6",
      toolchain: "6.3.3",
    });
  });

  it.each([
    ["success", source.success, "succeeded"],
    ["compile failure", source.compileFailure, "compile_failed"],
    ["runtime failure", source.runtimeFailure, "runtime_failed"],
    ["timeout", source.timeout, "timed_out"],
    ["output limit", source.outputLimit, "output_limited"],
    ["unavailable service", source.unavailable, "unavailable"],
  ])("returns the configured %s result", async (_label, swiftSource, status) => {
    const client = createMockSwiftRunnerClient(fixtures);
    const result = await executeSwift(client, request(swiftSource), { pollIntervalMs: 0 });

    expect(result.status).toBe(status);
  });

  it("cancels the owned job when the caller aborts", async () => {
    const client = createMockSwiftRunnerClient(fixtures);
    const controller = new AbortController();
    const updates: SwiftJobSnapshot[] = [];

    const result = await executeSwift(client, request(source.cancellation), {
      onUpdate(job) {
        updates.push(job);
        if (job.status === "running") controller.abort();
      },
      pollIntervalMs: 0,
      signal: controller.signal,
    });

    expect(updates.map((job) => job.status)).toEqual(["compiling", "running"]);
    expect(result.status).toBe("cancelled");
  });

  it("rejects unregistered source instead of normalizing it into success", async () => {
    const client = createMockSwiftRunnerClient(fixtures);
    const result = await executeSwift(client, request('print("unknown")'), { pollIntervalMs: 0 });

    expect(result.status).toBe("rejected");
    expect(result.stage).toBe("validation");
    expect(result.compileDurationMs).toBeNull();
    expect(result.diagnostics).toContain("No deterministic mock fixture");
  });

  it("does not invent process evidence when the runner is unavailable", async () => {
    const client = createMockSwiftRunnerClient(fixtures);
    const result = await executeSwift(client, request(source.unavailable), { pollIntervalMs: 0 });

    expect(result).toMatchObject({
      compileDurationMs: null,
      exitCode: null,
      runDurationMs: null,
      stage: "validation",
      status: "unavailable",
    });
  });
});

describe("Swift runner HTTP adapter", () => {
  it("uses the versioned job endpoints without a browser credential", async () => {
    const terminal: SwiftJobSnapshot = {
      compileDurationMs: 10,
      diagnostics: "",
      exitCode: null,
      jobID: "job/with slash",
      outputLimited: false,
      runDurationMs: 2,
      stage: "complete",
      status: "cancelled",
      stderr: "",
      stdout: "",
      toolchain: "Swift version 6.3.3",
    };
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json({ jobID: terminal.jobID }))
      .mockResolvedValueOnce(Response.json(terminal))
      .mockResolvedValueOnce(Response.json(terminal));
    const client = createHttpSwiftRunnerClient("http://127.0.0.1:4317/", fetchMock);

    await client.createJob(request(source.success));
    await client.getJob(terminal.jobID);
    await client.cancelJob(terminal.jobID);

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "http://127.0.0.1:4317/v1/swift/jobs",
      expect.objectContaining({ method: "POST" }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "http://127.0.0.1:4317/v1/swift/jobs/job%2Fwith%20slash",
      expect.any(Object),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      "http://127.0.0.1:4317/v1/swift/jobs/job%2Fwith%20slash",
      expect.objectContaining({ method: "DELETE" }),
    );
    const firstHeaders = fetchMock.mock.calls[0][1]?.headers as Record<string, string>;
    expect(firstHeaders.Authorization).toBeUndefined();
  });

  it("rejects malformed service responses at the adapter boundary", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ status: "done" }));
    const client = createHttpSwiftRunnerClient("http://127.0.0.1:4317", fetchMock);

    await expect(client.getJob("bad-shape")).rejects.toThrow();
  });

  it("turns non-success HTTP responses into a typed error", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response("unavailable", { status: 503 }));
    const client = createHttpSwiftRunnerClient("http://127.0.0.1:4317", fetchMock);

    await expect(client.getCapabilities()).rejects.toEqual(
      expect.objectContaining<Partial<SwiftRunnerHttpError>>({ status: 503 }),
    );
  });
});
