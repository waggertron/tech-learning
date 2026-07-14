import {
  swiftJobRequestSchema,
  type SwiftJobRequest,
  type SwiftJobSnapshot,
  type SwiftJobStatus,
  type SwiftRunnerCapabilities,
  type SwiftRunnerClient,
} from "./contract";

export type SwiftMockOutcome = Exclude<
  SwiftJobStatus,
  "queued" | "compiling" | "running" | "cancelled"
>;

export interface SwiftMockFixture {
  compileDurationMs?: number | null;
  diagnostics?: string;
  exitCode?: number | null;
  outcome: SwiftMockOutcome;
  runDurationMs?: number | null;
  source: string;
  stderr?: string;
  stdout?: string;
}

interface MockJob {
  cancelled: boolean;
  fixture: SwiftMockFixture;
  jobID: string;
  polls: number;
}

const capabilities: SwiftRunnerCapabilities = {
  available: true,
  harnessVersions: ["swift-standard-v1"],
  languageMode: "6",
  limits: {
    compileTimeoutMs: 10_000,
    maxOutputBytes: 64 * 1024,
    maxSourceBytes: 64 * 1024,
    runTimeoutMs: 3_000,
  },
  platform: "mock-linux",
  toolchain: "6.3.3",
};

function blankSnapshot(jobID: string): SwiftJobSnapshot {
  return {
    compileDurationMs: null,
    diagnostics: "",
    exitCode: null,
    jobID,
    outputLimited: false,
    runDurationMs: null,
    stage: "queued",
    status: "queued",
    stderr: "",
    stdout: "",
    toolchain: "Swift version 6.3.3 (deterministic mock)",
  };
}

function terminalSnapshot(job: MockJob): SwiftJobSnapshot {
  const fixture = job.fixture;
  const didNotCompile = fixture.outcome === "rejected" || fixture.outcome === "unavailable";
  const didNotRun = didNotCompile || fixture.outcome === "compile_failed";
  const defaultExitCode =
    fixture.outcome === "succeeded"
      ? 0
      : fixture.outcome === "compile_failed" || fixture.outcome === "runtime_failed"
        ? 1
        : null;

  return {
    ...blankSnapshot(job.jobID),
    compileDurationMs: didNotCompile ? null : (fixture.compileDurationMs ?? 12),
    diagnostics: fixture.diagnostics ?? "",
    exitCode: fixture.exitCode ?? defaultExitCode,
    outputLimited: fixture.outcome === "output_limited",
    runDurationMs: didNotRun ? null : (fixture.runDurationMs ?? 4),
    stage:
      fixture.outcome === "compile_failed"
        ? "compiling"
        : didNotCompile
          ? "validation"
          : "complete",
    status: fixture.outcome,
    stderr: fixture.stderr ?? "",
    stdout: fixture.stdout ?? "",
  };
}

export function createMockSwiftRunnerClient(fixtures: SwiftMockFixture[]): SwiftRunnerClient {
  const fixturesBySource = new Map(fixtures.map((fixture) => [fixture.source, fixture]));
  const jobs = new Map<string, MockJob>();
  let nextJob = 1;

  function requireJob(jobID: string): MockJob {
    const job = jobs.get(jobID);
    if (!job) throw new Error(`Unknown Swift mock job: ${jobID}`);
    return job;
  }

  function cancelJob(jobID: string): SwiftJobSnapshot {
    const job = requireJob(jobID);
    job.cancelled = true;
    return {
      ...blankSnapshot(jobID),
      compileDurationMs: 1,
      exitCode: null,
      stage: "complete",
      status: "cancelled",
    };
  }

  return {
    async cancelJob(jobID) {
      return cancelJob(jobID);
    },

    async createJob(request: SwiftJobRequest) {
      const validRequest = swiftJobRequestSchema.parse(request);
      const fixture = fixturesBySource.get(validRequest.source) ?? {
        diagnostics: "No deterministic mock fixture matches this source.",
        outcome: "rejected" as const,
        source: validRequest.source,
      };
      const jobID = `swift-mock-${nextJob++}`;
      jobs.set(jobID, { cancelled: false, fixture, jobID, polls: 0 });
      return { jobID };
    },

    async getCapabilities() {
      return structuredClone(capabilities);
    },

    async getJob(jobID) {
      const job = requireJob(jobID);
      if (job.cancelled) return cancelJob(jobID);

      if (job.fixture.outcome === "rejected" || job.fixture.outcome === "unavailable") {
        return terminalSnapshot(job);
      }

      job.polls += 1;
      if (job.polls === 1) {
        return { ...blankSnapshot(jobID), stage: "compiling", status: "compiling" };
      }

      if (job.fixture.outcome !== "compile_failed" && job.polls === 2) {
        return { ...blankSnapshot(jobID), compileDurationMs: 12, stage: "running", status: "running" };
      }

      return terminalSnapshot(job);
    },
  };
}
