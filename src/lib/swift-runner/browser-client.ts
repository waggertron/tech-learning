import type { SwiftRunnerClient } from "./contract";
import { createHttpSwiftRunnerClient } from "./http-client";

export interface SwiftRunnerBrowserContext {
  endpoint: string;
  replID: string;
}

export type SwiftRunnerClientFactory = (
  context: SwiftRunnerBrowserContext,
) => SwiftRunnerClient;

declare global {
  interface Window {
    __SWIFT_RUNNER_CLIENT_FACTORY__?: SwiftRunnerClientFactory;
  }
}

export function resolveSwiftRunnerClient(
  context: SwiftRunnerBrowserContext,
): SwiftRunnerClient | null {
  const injectedFactory = window.__SWIFT_RUNNER_CLIENT_FACTORY__;
  if (injectedFactory) return injectedFactory(context);
  if (context.endpoint) return createHttpSwiftRunnerClient(context.endpoint);
  return null;
}
