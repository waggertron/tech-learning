import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveSwiftRunnerClient } from "../../src/lib/swift-runner/browser-client";
import type { SwiftJobSnapshot, SwiftRunnerClient } from "../../src/lib/swift-runner/contract";
import {
  formatSwiftTiming,
  swiftResultMessage,
  swiftStatusLabel,
} from "../../src/lib/swift-runner/presentation";

function snapshot(overrides: Partial<SwiftJobSnapshot> = {}): SwiftJobSnapshot {
  return {
    compileDurationMs: 12,
    diagnostics: "",
    exitCode: 0,
    harnessID: "swift-standard-v1",
    jobID: "swift-job-1",
    outputLimited: false,
    platform: "aarch64-unknown-linux-gnu",
    runDurationMs: 4,
    stage: "complete",
    status: "succeeded",
    stderr: "",
    stdout: "ready\n",
    toolchain: "Swift version 6.3.3",
    ...overrides,
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Swift runner browser client selection", () => {
  it("stays unavailable when neither an endpoint nor a test factory exists", () => {
    vi.stubGlobal("window", {});

    expect(resolveSwiftRunnerClient({ endpoint: "", replID: "swift-1" })).toBeNull();
  });

  it("lets local browser tests inject the contract client", () => {
    const client = {} as SwiftRunnerClient;
    const factory = vi.fn(() => client);
    vi.stubGlobal("window", { __SWIFT_RUNNER_CLIENT_FACTORY__: factory });

    expect(resolveSwiftRunnerClient({ endpoint: "", replID: "swift-2" })).toBe(client);
    expect(factory).toHaveBeenCalledWith({ endpoint: "", replID: "swift-2" });
  });
});

describe("Swift result presentation", () => {
  it("labels every important execution state without collapsing failures", () => {
    expect(swiftStatusLabel("compile_failed")).toBe("compile failed");
    expect(swiftStatusLabel("runtime_failed")).toBe("runtime failed");
    expect(swiftStatusLabel("timed_out")).toBe("timed out");
    expect(swiftStatusLabel("cancelled")).toBe("cancelled");
    expect(swiftStatusLabel("unavailable")).toBe("runner unavailable");
  });

  it("reports compiler and runtime evidence with the exact execution boundary", () => {
    expect(formatSwiftTiming(snapshot())).toBe(
      "Compile: 12.0ms | Run: 4.0ms | Swift version 6.3.3 | aarch64-unknown-linux-gnu | swift-standard-v1",
    );
  });

  it("explains cancellation as a server job stop request", () => {
    expect(swiftResultMessage(snapshot({ status: "cancelled" }))).toContain(
      "runner was asked to stop the owned job",
    );
  });
});

describe("SwiftRepl component contract", () => {
  const source = readFileSync(
    new URL("../../src/components/SwiftRepl.astro", import.meta.url),
    "utf8",
  );

  it("ships Swift syntax support and distinct execution channels", () => {
    expect(source).toContain("StreamLanguage.define(swift)");
    expect(source).toContain("data-diagnostics");
    expect(source).toContain("data-stdout");
    expect(source).toContain("data-stderr");
  });

  it("includes accessible run, cancellation, status, and editor semantics", () => {
    expect(source).toContain("▶ Run Swift");
    expect(source).toContain("■ Cancel");
    expect(source).toContain('role="status"');
    expect(source).toContain("Editable Swift source");
  });

  it("labels Linux execution honestly and supports approach blocks", () => {
    expect(source).toContain("not the Apple SDK, an iOS simulator, or a device");
    expect(source).toContain("attachApproachRunner");
    expect(source).toContain("{{APPROACH}}");
  });
});
