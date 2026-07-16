# Swift Runner Local Development

The local Swift runner provides three separate evidence layers: a credential-free deterministic mock, a contract-shaped loopback HTTP service, and the pinned Docker executor. Browser and component tests use the mock by default. Interactive local pages use the loopback service and Docker executor.

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
- Local executor: `tools/swift-runner/runner.mjs`
- Loopback HTTP service: `tools/swift-runner/server.mjs`
- Swift-enabled development supervisor: `scripts/dev-with-swift-runner.mjs`
- Service tests: `tests/swift-runner-service/server.test.mjs`
- Executor tests: `tests/swift-runner-executor/runner.test.mjs`
- Isolation contract: `docs/swift-runner-isolation.md`
- Public API policy: `docs/swift-runner-public-api.md`
- Local service decision: `docs/adr/2026-07-15-swift-runner-local-service.md`
- Production deployment decision: `docs/adr/2026-07-15-swift-runner-production-deployment.md`

## Commands

Run the contract and mock tests without Docker, network, accounts, or credentials:

```bash
npm run test:swift-runner-contract
npm run test:swift-runner-service
npm run test:swift-repl
```

Start Astro and the real local runner together:

```bash
npm run dev:swift
```

The site is available at `http://127.0.0.1:4321/tech-learning`. The supervisor configures `PUBLIC_SWIFT_RUNNER_URL=http://127.0.0.1:8787`, waits for the capability endpoint before starting Astro, and stops both processes on interrupt. Docker must be running when a job executes. The first run may need to obtain the pinned Swift image used by `tools/swift-runner/runner.mjs`.

Use different loopback ports when the defaults are occupied:

```bash
SWIFT_SITE_PORT=4322 SWIFT_RUNNER_PORT=8788 npm run dev:swift
```

The supervisor derives the allowed Astro origin from `SWIFT_SITE_PORT`. The service still binds only to `127.0.0.1`.

Start only the HTTP service when Astro is already running with the matching runner URL:

```bash
npm run swift-runner:local
```

With `npm run dev:swift` running, prove an edited source reaches the real Docker executor through the page:

```bash
npm run validate:swift-runner-local-browser
```

The validator checks the capability endpoint and rendered runner URL before launching Playwright. It opens the Kth Largest Element in a Stream page, selects the Swift practice tab, replaces the starter with a small program, runs it, and requires successful output plus the exact Swift 6.3.3 Linux evidence. This command requires Docker and is intentionally separate from the default pre-push workflow.

Run the exact Swift 6.3.3 executor integration tests when Docker and the pinned image are available:

```bash
npm run test:swift-runner-executor
```

The executor integration command creates ephemeral containers and removes them after success, failure, timeout, cancellation, or output limit. It does not start a persistent service or bind a host port. The compiler and program share one bounded output budget.

Run the isolated Astro and Playwright fixture without Docker, network services, accounts, or credentials:

```bash
npm run validate:swift-repl-browser
```

The browser validator serves only `tests/swift-repl/browser-fixture/`. It checks HTTP status, rendered markers, and the emitted component runtime before launching Chromium. The browser layer covers five independent REPLs, keyboard execution, reset, changed-source reruns, hidden-panel measurement, timeout, cancellation, compiler diagnostics, unavailable service, accessible names and status roles, a binary-search approach harness, mobile width, and console or page errors. Its deterministic client comes from `window.__SWIFT_RUNNER_CLIENT_FACTORY__`.

## Client Port

`SwiftRunnerClient` exposes four operations:

- Read runner capabilities.
- Create a versioned Swift job.
- Read the current job snapshot.
- Cancel an owned job idempotently.

The polling coordinator calls the same port for the HTTP adapter and deterministic mock. An abort signal calls `cancelJob`; it does not merely abandon the browser request.

The HTTP adapter validates every service response with Zod before the response reaches UI state. It sends no authorization header or embedded credential. The shared service validates the request again, accepts only the known harness and exact toolchain, rejects extra fields before executor allocation, deduplicates repeated request IDs, scopes jobs to a client identity, and bounds per-client submissions, outstanding jobs, polling, global active work, and queued work. Local development identifies the client by its loopback socket. A production adapter must supply trustworthy edge-derived identity and the deployment trust boundary required by Gate 1B.

## Browser Configuration

`SwiftRepl.astro` reads the public runner endpoint from its `runnerURL` prop or `PUBLIC_SWIFT_RUNNER_URL`. `npm run dev:swift` supplies the local value. When neither value exists, Run Swift reports `runner unavailable` and leaves the source in the editor.

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

The real executor creates a unique container and two tmpfs workspaces per job. Its `finally` path removes the container, and the executor suite fails if any runner-labeled container remains. The local service removes source from terminal job state, expires results after five minutes, aborts active work during shutdown, and keeps no volume or job directory. The development supervisor stops the service and Astro together. Repeated runs should leave no job containers, ports, volumes, source files, or compiled artifacts.

## Production Boundary

The loopback service is a local development adapter, not a live deployment. It has no public bind mode. The shared coordinator policy now covers R2.3 quotas, ownership, idempotency, polling, queueing, and request rejection. Gate 1B still tracks the provider identity resolver, isolated worker boundary, retention proof, metrics, alerts, spending limits, TLS, rollback, emergency shutdown, and proof from the published GitHub Pages origin.
