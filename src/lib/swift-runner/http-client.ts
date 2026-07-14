import {
  swiftJobCreatedSchema,
  swiftJobRequestSchema,
  swiftJobSnapshotSchema,
  swiftRunnerCapabilitiesSchema,
  type SwiftJobRequest,
  type SwiftJobSnapshot,
  type SwiftRunnerCapabilities,
  type SwiftRunnerClient,
} from "./contract";

export class SwiftRunnerHttpError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "SwiftRunnerHttpError";
  }
}

type Fetch = typeof fetch;

export function createHttpSwiftRunnerClient(baseURL: string, fetchImpl: Fetch = fetch): SwiftRunnerClient {
  const normalizedBaseURL = baseURL.replace(/\/$/, "");

  async function request(path: string, init?: RequestInit): Promise<unknown> {
    const response = await fetchImpl(`${normalizedBaseURL}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...init?.headers,
      },
    });

    if (!response.ok) {
      throw new SwiftRunnerHttpError(
        `Swift runner request failed with HTTP ${response.status}.`,
        response.status,
      );
    }

    return response.json();
  }

  return {
    async cancelJob(jobID: string): Promise<SwiftJobSnapshot> {
      const body = await request(`/v1/swift/jobs/${encodeURIComponent(jobID)}`, {
        method: "DELETE",
      });
      return swiftJobSnapshotSchema.parse(body);
    },

    async createJob(jobRequest: SwiftJobRequest): Promise<{ jobID: string }> {
      const validRequest = swiftJobRequestSchema.parse(jobRequest);
      const body = await request("/v1/swift/jobs", {
        body: JSON.stringify(validRequest),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      return swiftJobCreatedSchema.parse(body);
    },

    async getCapabilities(): Promise<SwiftRunnerCapabilities> {
      const body = await request("/v1/swift/capabilities");
      return swiftRunnerCapabilitiesSchema.parse(body);
    },

    async getJob(jobID: string): Promise<SwiftJobSnapshot> {
      const body = await request(`/v1/swift/jobs/${encodeURIComponent(jobID)}`);
      return swiftJobSnapshotSchema.parse(body);
    },
  };
}
