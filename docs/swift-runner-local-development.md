# Swift Runner Local Development

R1.4 provides a credential-free browser contract, deterministic mock, and local executor evidence for the Swift runner. Browser and component tests should use the mock by default. Docker is reserved for executor integration tests.

## Contract Files

- Schemas and `SwiftRunnerClient` port: `src/lib/swift-runner/contract.ts`
- HTTP adapter: `src/lib/swift-runner/http-client.ts`
- Polling and cancellation coordinator: `src/lib/swift-runner/execute.ts`
- Deterministic mock: `src/lib/swift-runner/mock.ts`
- Browser client selection: `src/lib/swift-runner/browser-client.ts`
- Result presentation: `src/lib/swift-runner/presentation.ts`
- Editable browser component: `src/components/SwiftRepl.astro`
- Contract tests: `tests/swift-runner-contract/contract.test.ts`
- Component tests: `tests/swift-repl/component.test.ts`
- Local executor: `tools/swift-runner-spike/runner.mjs`
- Executor tests: `tests/swift-runner-spike/runner.test.mjs`

## Commands

Run the contract and mock tests without Docker, network, accounts, or credentials:

```bash
npm run test:swift-runner-contract
npm run test:swift-repl
```

Run the exact Swift 6.3.3 executor integration tests when Docker and the pinned image are available:

```bash
npm run test:swift-runner-spike
```

The integration command creates ephemeral containers and removes them after success, failure, timeout, cancellation, or output limit. It does not start a persistent service or bind a host port.

## Client Port

`SwiftRunnerClient` exposes four operations:

- Read runner capabilities.
- Create a versioned Swift job.
- Read the current job snapshot.
- Cancel an owned job idempotently.

The polling coordinator calls the same port for the HTTP adapter and deterministic mock. An abort signal calls `cancelJob`; it does not merely abandon the browser request.

The HTTP adapter validates every service response with Zod before the response reaches UI state. It sends no authorization header or embedded credential. A future public endpoint must be safe for unauthenticated traffic and enforce its own quotas and trust boundary as required by the ADR.

## Browser Configuration

`SwiftRepl.astro` reads the public runner endpoint from its `runnerURL` prop or `PUBLIC_SWIFT_RUNNER_URL`. When neither value exists, Run Swift reports `runner unavailable` and leaves the source in the editor.

Local browser tests can install `window.__SWIFT_RUNNER_CLIENT_FACTORY__` before the component script attaches. The factory receives the public endpoint and REPL identifier, then returns any `SwiftRunnerClient`. It takes precedence over HTTP so tests can inject `createMockSwiftRunnerClient(...)` without opening a port or using credentials.

The component accepts an optional `approachTemplate`. Put `{{APPROACH}}` where a Swift approach block should be inserted into a complete test harness. Without that marker, an approach block runs as its own source file.

The rendered surface keeps compiler diagnostics, standard output, and standard error separate. It reports compile time, run time, exact toolchain, Linux target, and harness identifier. The boundary note states that this evidence does not cover the Apple SDK, iOS Simulator, or a physical device.

## Result States

The contract distinguishes:

- `succeeded`
- `compile_failed`
- `runtime_failed`
- `timed_out`
- `cancelled`
- `output_limited`
- `rejected`
- `unavailable`

Nonterminal snapshots use `queued`, `compiling`, or `running`. Every terminal snapshot preserves the exact toolchain string and carries separate standard output, standard error, compiler diagnostics, exit status, compile timing, run timing, and output-limit state.

## Deterministic Fixtures

The mock accepts an explicit map from exact source strings to outcomes. It does not infer success from syntax, normalize invalid data, or call the real executor. Unknown source returns `rejected` at the validation stage with no compile timing.

Keep fixtures separated by contract intent:

- Valid source for normal success behavior.
- Deliberate type-invalid source for compiler diagnostics.
- Valid compiling source that deliberately fails at runtime.
- Separate infinite-loop source for timeout.
- Separate long-running source for cancellation.
- Separate infinite-writer source for output limiting.
- Explicit unavailable-service fixture.

This separation keeps a test for one boundary from accidentally passing because another boundary failed first.

## Toolchain Boundary

The browser request asks for Swift 6.3.3 and harness `swift-standard-v1`. The mock reports a clearly labeled mock Linux platform. The real executor reports `aarch64-unknown-linux-gnu` from the official Swift 6.3.3 container.

Neither path is iOS evidence. SwiftUI, UIKit, Apple SDK frameworks, simulator behavior, signing, entitlements, and physical-device behavior remain outside the browser runner.

## Cleanup

The mock creates only in-memory jobs. Each mock client instance owns its own monotonically numbered job ids and loses all state when the test ends.

The real executor creates a unique container and two tmpfs workspaces per job. Its `finally` path removes the container, and the executor suite fails if any spike-labeled container remains. Repeated test runs should leave no job containers, ports, volumes, source files, or compiled artifacts.

## Next Integration

R1.6 should harden the service boundary around the proved executor. R1.7 should exercise multiple components, hidden tabs, keyboard and screen-reader semantics, mobile layout, cancellation, timeout, output limiting, unavailable service, and one representative approach harness in a real browser.
