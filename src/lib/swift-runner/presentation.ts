import type { SwiftJobSnapshot, SwiftJobStatus } from "./contract";

const statusLabels: Record<SwiftJobStatus, string> = {
  cancelled: "cancelled",
  compile_failed: "compile failed",
  compiling: "compiling...",
  output_limited: "output limited",
  queued: "queued...",
  rejected: "rejected",
  running: "running...",
  runtime_failed: "runtime failed",
  succeeded: "done",
  timed_out: "timed out",
  unavailable: "runner unavailable",
};

export function swiftStatusLabel(status: SwiftJobStatus): string {
  return statusLabels[status];
}

export function formatSwiftTiming(job: SwiftJobSnapshot): string {
  const parts: string[] = [];
  if (job.compileDurationMs !== null) {
    parts.push(`Compile: ${job.compileDurationMs.toFixed(1)}ms`);
  }
  if (job.runDurationMs !== null) {
    parts.push(`Run: ${job.runDurationMs.toFixed(1)}ms`);
  }
  parts.push(job.toolchain, job.platform, job.harnessID);
  return parts.join(" | ");
}

export function swiftResultMessage(job: SwiftJobSnapshot): string {
  switch (job.status) {
    case "cancelled":
      return "Execution was cancelled and the runner was asked to stop the owned job.";
    case "compile_failed":
      return "Swift did not compile. Review the compiler diagnostics.";
    case "output_limited":
      return "Execution stopped after reaching the output limit.";
    case "rejected":
      return "The runner rejected this request before execution.";
    case "runtime_failed":
      return "Swift compiled, then the program failed while running.";
    case "succeeded":
      return "Swift compiled and ran successfully.";
    case "timed_out":
      return "Execution stopped after reaching the time limit.";
    case "unavailable":
      return "The Swift runner is unavailable. Your source remains in the editor.";
    default:
      return swiftStatusLabel(job.status);
  }
}
