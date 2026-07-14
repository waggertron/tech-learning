import { z } from "zod";

export const swiftJobStatusSchema = z.enum([
  "queued",
  "compiling",
  "running",
  "succeeded",
  "compile_failed",
  "runtime_failed",
  "timed_out",
  "cancelled",
  "output_limited",
  "rejected",
  "unavailable",
]);

export const swiftJobStageSchema = z.enum([
  "validation",
  "queued",
  "compiling",
  "running",
  "complete",
]);

export const swiftJobRequestSchema = z.object({
  harnessID: z.string().min(1).max(100),
  requestID: z.string().min(1).max(100),
  source: z.string().max(64 * 1024),
  toolchain: z.literal("6.3.3"),
});

export const swiftJobSnapshotSchema = z.object({
  compileDurationMs: z.number().nonnegative().nullable(),
  diagnostics: z.string(),
  exitCode: z.number().int().nullable(),
  jobID: z.string().min(1),
  outputLimited: z.boolean(),
  runDurationMs: z.number().nonnegative().nullable(),
  stage: swiftJobStageSchema,
  status: swiftJobStatusSchema,
  stderr: z.string(),
  stdout: z.string(),
  toolchain: z.string(),
});

export const swiftRunnerCapabilitiesSchema = z.object({
  available: z.boolean(),
  harnessVersions: z.array(z.string().min(1)),
  languageMode: z.literal("6"),
  limits: z.object({
    compileTimeoutMs: z.number().int().positive(),
    maxOutputBytes: z.number().int().positive(),
    maxSourceBytes: z.number().int().positive(),
    runTimeoutMs: z.number().int().positive(),
  }),
  platform: z.string().min(1),
  toolchain: z.literal("6.3.3"),
});

export const swiftJobCreatedSchema = z.object({
  jobID: z.string().min(1),
});

export type SwiftJobRequest = z.infer<typeof swiftJobRequestSchema>;
export type SwiftJobSnapshot = z.infer<typeof swiftJobSnapshotSchema>;
export type SwiftJobStatus = z.infer<typeof swiftJobStatusSchema>;
export type SwiftRunnerCapabilities = z.infer<typeof swiftRunnerCapabilitiesSchema>;

export interface SwiftRunnerClient {
  cancelJob(jobID: string): Promise<SwiftJobSnapshot>;
  createJob(request: SwiftJobRequest): Promise<{ jobID: string }>;
  getCapabilities(): Promise<SwiftRunnerCapabilities>;
  getJob(jobID: string): Promise<SwiftJobSnapshot>;
}

const terminalStatuses = new Set<SwiftJobStatus>([
  "succeeded",
  "compile_failed",
  "runtime_failed",
  "timed_out",
  "cancelled",
  "output_limited",
  "rejected",
  "unavailable",
]);

export function isTerminalSwiftJob(job: SwiftJobSnapshot): boolean {
  return terminalStatuses.has(job.status);
}
