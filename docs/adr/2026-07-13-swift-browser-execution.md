# ADR: Swift Browser Execution Boundary

**Date:** 2026-07-13
**Status:** Proposed, selected for R1.3 spike
**Decision owner:** Zero to iOS Hero program

## Problem Statement

The site needs an editable Swift practice surface with real compiler diagnostics and execution. It must support raw source changed after the static site build, capture standard output and errors, stop runaway work, cancel active work, and remain usable across several REPLs on one page.

The existing site is deployed on GitHub Pages. GitHub describes Pages as a static host for HTML, CSS, and JavaScript, so it cannot compile Swift or run a server-side sandbox itself. Any server execution path must live at a separate origin. Any browser-only path must ship everything it needs as static assets. See [What is GitHub Pages?](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

Swift 6.3.3 has an official WebAssembly SDK. The documented workflow installs an exactly matching host toolchain and SDK, then uses `swift build` or `swift run` to produce or execute a Wasm module. The documentation does not provide a browser-hosted Swift compiler artifact. This means Swift-to-Wasm is a valid execution target, but not by itself a way to compile source edited in a deployed page. See [Getting Started with Swift SDKs for WebAssembly](https://www.swift.org/documentation/articles/wasm-getting-started.html) and the [Swift compiler overview](https://www.swift.org/documentation/swift-compiler/).

The compatibility baseline is recorded in [Swift Browser Runner](../swift-browser-runner.md). The first runner scope is Swift language exercises and coding-problem harnesses. It does not promise UIKit, SwiftUI, Apple SDK frameworks, app signing, simulator behavior, or iOS runtime parity.

### Decision Drivers

The selected path must account for:

- Editable source after the static deployment is complete.
- Exact Swift compiler and language-mode versioning.
- Compiler diagnostics, standard output, standard error, runtime failure, timeout, cancellation, and service-unavailable states.
- CPU, wall-clock, memory, output, process, filesystem, and network limits.
- GitHub Pages compatibility and a credential-free browser client.
- Low first-run bundle cost and acceptable repeat-run latency.
- Clear privacy behavior for learner source code.
- Abuse resistance for a public educational site.
- Local development and contract tests without cloud credentials.
- An explicit harness contract shared by editable starters and worked approaches.
- A maintenance path that can follow the stable Swift matrix.

## Options Evaluated

### Option A: Syntax-Only Editor

Add Swift highlighting and editing, but do not compile or execute source.

| Pros | Cons |
| --- | --- |
| Works entirely on GitHub Pages. | Does not satisfy editable execution, diagnostics, timing, timeout, or cancellation. |
| Has the smallest runtime and operational cost. | Can create false confidence because syntax highlighting is not compiler validation. |
| Keeps source in the browser and works offline after site assets are cached. | Breaks parity with the current Python, TypeScript, and Go practice experience. |
| Remains useful as a service-unavailable fallback. | Cannot complete R1.3 or R1.5. |

**Disposition:** Rejected as the primary runner. Retained as graceful degradation when execution is unavailable. The UI must not label syntax-only behavior as Run.

### Option B: Precompiled Swift WebAssembly

Compile known Swift programs during the site build, publish their Wasm artifacts, and run those artifacts in a browser worker.

| Pros | Cons |
| --- | --- |
| Runs on GitHub Pages without a service. | Cannot compile arbitrary edits made after deployment. |
| Keeps learner input in the browser if input is limited to predefined data. | One artifact per fixed program does not implement an editable REPL. |
| A worker can be terminated for runtime timeout and cancellation. | Full Swift Wasm artifacts carry runtime weight per program or shared bundle. |
| Can work offline once artifacts are cached. | Build time, storage, cache invalidation, and toolchain coupling grow with the catalog. |

Official Swift documentation says the full Wasm SDK supports all Swift features available on that target, while experimental Embedded Swift produces much smaller artifacts by supporting only a subset. The course cannot silently substitute the Embedded subset for Swift 6 language lessons.

**Disposition:** Rejected for editable practice. It remains suitable for fixed demonstrations where the input contract is data rather than source code.

### Option C: Swift Compiler in the Browser

Ship a Swift compiler, standard library, linker, virtual filesystem, and Wasm runtime to the browser. Compile edited source inside a dedicated worker, then execute the result in another bounded worker.

| Pros | Cons |
| --- | --- |
| Keeps source on the learner's device. | No supported browser-hosted distribution of the official Swift 6.3.3 compiler was found in the reviewed primary sources. |
| Can work offline after a successful first download and cache. | Compiler, SDK, standard library, linker, and filesystem assets would make the largest and most complex first-run payload. |
| Avoids a public code-execution backend. | Mobile memory pressure, worker startup, browser compatibility, and cache eviction become product risks. |
| Worker termination can provide local timeout and cancellation. | The site would own compiler packaging, browser ports, diagnostics transport, and every toolchain upgrade. |

Swift's official Wasm support compiles applications for Wasm using an installed host Swift toolchain. That is materially different from compiling the Swift compiler itself into a browser-delivered artifact. A custom Swift-like compiler or interpreter would also fail the exact-toolchain requirement unless it demonstrated full compatibility with the supported language surface.

**Disposition:** Rejected for the first implementation. Reconsider only when the official project distributes a browser-suitable compiler or a maintained compatible artifact proves acceptable bundle, memory, diagnostics, and version behavior.

### Option D: Sandboxed First-Party Compile and Run Service

Keep the editor on GitHub Pages and send source to a separately deployed service whose public contract is owned by this project. The service compiles and executes with a pinned Swift toolchain inside an isolated job, returns structured results, and exposes real job cancellation.

| Pros | Cons |
| --- | --- |
| Compiles source edited after deployment with the exact selected Swift version. | Requires a separately hosted service, monitoring, patching, capacity, and cost control. |
| Keeps the browser bundle near the existing REPL size. | Learner source leaves the browser, so the privacy boundary must be visible and documented. |
| Can return compiler diagnostics and separate compile and run results. | Public untrusted-code execution creates a serious abuse and isolation responsibility. |
| Can impose server-enforced limits and cancel the underlying job. | Does not work offline and adds network plus queue latency. |
| A project-owned adapter can stay stable while the sandbox engine changes. | The browser cannot safely hold a service secret, so the endpoint must tolerate unauthenticated public traffic. |
| A local implementation and contract mock can support development without cloud credentials. | Stable Swift upgrades require image rebuilds, harness validation, and controlled rollout. |

Piston is a candidate sandbox engine for the spike because its documented API separates compile and run results, supports Swift, exposes time and memory controls, caps output, disables outgoing network access by default, isolates jobs with Linux namespaces and cgroups, and has a WebSocket signal path. Its public hosted API is not an acceptable production dependency: as of 2026-02-15 it requires authorization, limits eligible uses, and cannot place its token in public JavaScript. See the [Piston project and API documentation](https://github.com/engineer-man/piston).

Self-hosting Piston would make it an internal engine behind the first-party contract. It is not automatically approved. The spike must prove that it can install the exact supported Swift release and that its isolation works in the intended host environment. A different executor may replace it without changing the browser component.

**Disposition:** Selected for the R1.3 spike and as the provisional production architecture.

### Option E: Third-Party Runner

Call a hosted compiler or code-execution API directly from the browser, or proxy it through a thin project service.

| Pros | Cons |
| --- | --- |
| Has the fastest path to an initial demo when a suitable API is available. | Availability, retention, privacy, quotas, version cadence, and breaking changes belong to another operator. |
| Avoids maintaining the compiler and sandbox engine directly. | A browser-visible API credential is not secret; a proxy restores much of the service work this option seeks to avoid. |
| May already provide compiler and runtime limits. | Exact Swift 6.3.3 support and cancellation may not be available. |
| Can validate the client contract during exploration. | Provider outages or policy changes can disable every Swift exercise. |

SwiftWasm demonstrates cloud compilation followed by browser execution, but its public site describes the project as needing more testing and polishing and does not publish the service contract needed here. Piston's hosted API now requires approval and a token. These services are useful evidence that remote Swift compilation is feasible, but neither is a stable direct dependency for this public static site. See [SwiftWasm](https://swiftwasm.org/) and the [Piston public API policy](https://github.com/engineer-man/piston#public-api).

**Disposition:** Rejected as the production boundary. A third-party service may be used manually during a disposable spike, but no provider contract or credential may leak into shipped client code.

## Comparison

| Driver | Syntax only | Precompiled Wasm | Browser compiler | First-party service | Third-party runner |
| --- | --- | --- | --- | --- | --- |
| Editable source execution | No | No | Yes in theory | Yes | Usually |
| GitHub Pages fit | Native | Native | Native if assets are practical | Separate origin required | Direct API or proxy required |
| Browser bundle | Small | Per-program Wasm and runtime | Very large or unknown | Small client | Small client |
| First-run latency | Low | Artifact download | Compiler asset download and initialization | Network, queue, compile, and run | Provider network, queue, compile, and run |
| Offline execution | Editor only | Yes after cache | Yes after cache | No | No |
| Source privacy | Stays local | Stays local | Stays local | Sent to project service | Sent to provider or proxy |
| Backend abuse surface | None | None | None | High and project-owned | Provider-owned, with project quota risk |
| Exact toolchain | No compiler proof | Pinned at site build | Must package exact compiler | Pinned service image | Limited to provider inventory |
| Timeout and cancellation | Not applicable | Worker termination | Worker termination | Server job cancellation required | Provider-dependent |
| Maintenance | Low | Catalog artifact pipeline | Highest client toolchain burden | High service and sandbox burden | Lower initially, high dependency risk |

## Decision

Adopt a project-owned Swift runner contract backed by a sandboxed first-party service. Use R1.3 to prove the contract locally before accepting the ADR for production. Piston is the first executor candidate, not part of the public browser contract and not a permanent dependency decision.

The browser component will remain a hexagonal adapter. It knows how to create, observe, and cancel a Swift job through `SwiftRunnerClient`; it does not know whether the executor is Piston, a custom worker pool, or another sandbox. The same contract will have a deterministic local mock for browser and content tests.

```text
  STATIC GITHUB PAGES                     FIRST-PARTY RUNNER
  ┌──────────────────────────────┐         ┌──────────────────────────────┐
  │ SwiftRepl                    │ request │ Runner API                   │
  │ CodeMirror + state machine   ├────────>│ validation + quota           │
  │ SwiftRunnerClient            │<────────┤ structured job result        │
  └──────────────────────────────┘ result  ├──────────────────────────────┤
                                           │ Executor adapter             │
                                           ├──────────────────────────────┤
                                           │ isolated Swift 6.3.3 job     │
                                           └──────────────────────────────┘
```

The service runtime is Swift 6.3.3 on Linux in Swift 6 language mode. The UI and response metadata must name that platform. Standard-library exercises can be validated there; Apple framework examples cannot. The service denies network access and does not resolve arbitrary package dependencies.

This status remains Proposed until the R1.3 spike passes. If exact Swift versioning, cancellation, isolation, or usable latency cannot be proved, reject this decision and reopen the option comparison with the new evidence. Do not weaken the runner into syntax-only behavior while keeping execution labels.

## Implementation Details

### Public Contract

Start with a versioned asynchronous job API so cancellation stops server work rather than only abandoning a browser request:

- `POST /v1/swift/jobs` validates source, harness identifier, and requested toolchain, then returns a job identifier.
- `GET /v1/swift/jobs/{jobID}` returns the current stage or terminal result.
- `DELETE /v1/swift/jobs/{jobID}` requests cancellation and is idempotent.
- `GET /v1/swift/capabilities` returns availability, toolchain, language mode, platform, limits, and supported harness version.

The initial request contains source, harness identifier, and a client-generated request identifier. It does not accept shell flags, filesystem paths, environment variables, package URLs, or arbitrary command arguments.

Terminal results distinguish:

- `succeeded`
- `compile_failed`
- `runtime_failed`
- `timed_out`
- `cancelled`
- `output_limited`
- `rejected`
- `unavailable`

Every result includes the exact toolchain, platform, harness version, compile duration, run duration when reached, standard output, standard error, compiler diagnostics, exit status, and whether any field was truncated.

### Trust Boundary

The spike starts with explicit, testable ceilings rather than engine defaults:

- Source size: 64 KiB.
- Compile wall time: 10 seconds.
- Run wall time: 3 seconds.
- Compile memory: 512 MiB, subject to measurement during the spike.
- Run memory: 128 MiB, subject to measurement during the spike.
- Combined output: 64 KiB.
- Process and file counts: the smallest values that still permit `swiftc` and one executable.
- Filesystem: a fresh ephemeral job directory removed after completion.
- Network: no outbound or inbound access from the job.
- Privilege: unique unprivileged job identity with no host mounts, service credentials, or container control socket.

Cancellation must terminate compilation or execution, reap descendant processes, delete the job directory, and produce one terminal `cancelled` result. Client disconnect is not proof of cancellation.

### Privacy and Abuse

The REPL must state that source is sent to the runner before the first execution. The service does not log source, compiler input, or full output. Initial implementation retains no source or compiled artifact after the terminal result expires.

The public endpoint cannot depend on a secret embedded in the static site. It needs request size validation, per-origin CORS policy, per-IP and global quotas, bounded queues, concurrency limits, rejection before sandbox allocation, and operational kill switches. CORS is defense in depth, not authentication.

### Local Development

R1.4 will provide two local paths behind the same client port:

1. A contract mock with deterministic fixtures for compile success, compile failure, runtime failure, timeout, cancellation, output limit, and unavailable service.
2. A local executor path that compiles and runs one Swift file in an isolated environment without cloud credentials.

The mock is the default for browser tests. The real local executor is used for contract and integration tests. Repeated runs must clean containers, processes, job directories, ports, and generated artifacts.

### Harness Boundary

Editable starters and approach blocks submit one composed source file through a named harness version. Composition happens in a pure local function that can be tested without the service. The service accepts only known harness identifiers and does not trust arbitrary client-provided shell or compiler configuration.

The initial harness supports standard Swift and coding-problem helpers only. Any future Foundation allowance must be explicit and tested on the runner platform. Apple SDK imports return a clear unsupported-platform diagnostic before job allocation.

### Spike Exit Criteria

R1.3 accepts the first-party service path only if one local spike proves all of the following:

1. Edited Swift source compiles under Swift 6.3.3 in Swift 6 language mode.
2. Successful output, compiler diagnostics, and runtime failure are returned as distinct structured fields.
3. An infinite loop reaches a server-enforced timeout without leaving a process or job directory.
4. Cancellation stops the underlying compile or run job and returns `cancelled`.
5. Output limiting stops or truncates a runaway writer without unbounded memory growth.
6. Two concurrent jobs cannot read, write, signal, or observe each other's workspace or output.
7. The job has no network path and cannot read host files, environment secrets, or container control sockets.
8. The browser-facing client can swap between the mock and real executor without changing REPL state logic.
9. Cold and warm latency are measured and recorded rather than estimated.
10. The executor version and Swift toolchain are pinned and reported by the capabilities endpoint.

## Consequences

Positive consequences:

- Learners receive real Swift compiler behavior rather than a syntax approximation.
- GitHub Pages stays static and does not gain credentials.
- The browser component, local mock, and executor can evolve independently behind a versioned port.
- Security and cleanup requirements become executable acceptance criteria before public deployment.

Costs and risks:

- The project takes ownership of a public untrusted-code service.
- Offline Swift execution is unavailable.
- Learner source crosses the network and needs a visible privacy explanation.
- Deployment, quotas, alerts, patches, and stable Swift image updates become ongoing work.
- Linux runner evidence must never be presented as iOS, simulator, device, or Apple framework evidence.

## Revisit Triggers

Reopen this ADR when:

- Swift ships an official browser-hosted compiler artifact.
- A maintained client compiler proves full Swift compatibility at an acceptable download and memory cost.
- The runner cannot meet its isolation, cancellation, latency, or operating-cost gates.
- The stable Swift matrix changes.
- A trustworthy provider offers a documented Swift version, privacy policy, cancellation contract, quotas, and service agreement that materially reduce project risk.

## Sources Reviewed

- [GitHub Pages static hosting](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), reviewed 2026-07-13.
- [Swift SDKs for WebAssembly](https://www.swift.org/documentation/articles/wasm-getting-started.html), reviewed 2026-07-13.
- [Swift compiler architecture](https://www.swift.org/documentation/swift-compiler/), reviewed 2026-07-13.
- [SwiftWasm browser and cloud compilation](https://swiftwasm.org/), reviewed 2026-07-13.
- [Piston execution API and isolation model](https://github.com/engineer-man/piston), reviewed 2026-07-13.
