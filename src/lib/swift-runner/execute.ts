import {
  isTerminalSwiftJob,
  type SwiftJobRequest,
  type SwiftJobSnapshot,
  type SwiftRunnerClient,
} from "./contract";

interface ExecuteSwiftOptions {
  onUpdate?: (job: SwiftJobSnapshot) => void;
  pollIntervalMs?: number;
  signal?: AbortSignal;
}

function waitForPoll(milliseconds: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason ?? new DOMException("Cancelled", "AbortError"));
      return;
    }

    const abort = () => {
      clearTimeout(timer);
      reject(signal?.reason ?? new DOMException("Cancelled", "AbortError"));
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", abort);
      resolve();
    }, milliseconds);
    signal?.addEventListener("abort", abort, { once: true });
  });
}

export async function executeSwift(
  client: SwiftRunnerClient,
  request: SwiftJobRequest,
  options: ExecuteSwiftOptions = {},
): Promise<SwiftJobSnapshot> {
  const created = await client.createJob(request);

  try {
    while (true) {
      if (options.signal?.aborted) return client.cancelJob(created.jobID);

      const job = await client.getJob(created.jobID);
      options.onUpdate?.(job);
      if (isTerminalSwiftJob(job)) return job;

      await waitForPoll(options.pollIntervalMs ?? 250, options.signal);
    }
  } catch (error) {
    if (options.signal?.aborted) return client.cancelJob(created.jobID);
    throw error;
  }
}
