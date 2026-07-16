# ADR: Local Swift Runner Service

**Date:** 2026-07-15
**Status:** Accepted for local development
**Decision owner:** Zero to iOS Hero program

## Problem

`SwiftRepl.astro` already speaks a versioned asynchronous job contract, and the maintained Docker executor already compiles and runs Swift 6.3.3 under resource and isolation limits. The normal Astro development server did not connect those two pieces. A local page therefore rendered the editor but reported `runner unavailable` when a learner selected Run Swift.

The missing service must exercise the same HTTP boundary intended for a future live runner without turning a developer laptop into a public code-execution host. It must require no cloud account or credential, reject unsupported input before allocating an executor, propagate cancellation to the container, clean up on shutdown, and leave deterministic browser tests independent of Docker.

## Options

### Option A: Compile with the host `swiftc`

The service could spawn the Swift compiler installed on the developer machine.

This has the smallest implementation, but it does not preserve the pinned Swift 6.3.3 Linux target. It would execute edited source with the developer account's filesystem, network, environment, and process permissions unless a separate host sandbox were designed. The local machine's toolchain also differs from the supported browser matrix.

**Disposition:** Rejected. Host compilation is useful for trusted source validation, not browser-submitted code.

### Option B: Use the deterministic browser mock

The normal site could install the existing mock client and return recorded outcomes for known sources.

This path is fast, credential-free, and deterministic. It cannot compile arbitrary edits, so presenting it as local execution would misrepresent fixture playback as compiler evidence.

**Disposition:** Retained for component and browser contract tests. Rejected as the interactive local runner.

### Option C: Add a loopback HTTP service around the Docker executor

A small Node service can implement the existing job endpoints, validate the public request shape, queue bounded work, and call the maintained executor. A supervisor can start that service and Astro with `PUBLIC_SWIFT_RUNNER_URL` set for the current process.

This reuses the exact client and executor boundaries intended for deployment. It requires Docker and the pinned image when code runs, and it adds a local process and port that need coordinated cleanup.

**Disposition:** Selected.

## Decision

Add a project-owned local service at `tools/swift-runner/server.mjs`. The command-line entry binds only to `127.0.0.1`. It does not accept a host override. Its CORS configuration accepts loopback origins only, and the default Astro origin is `http://127.0.0.1:4321`.

Add `npm run dev:swift` as the normal interactive workflow. The supervisor starts the runner first, waits for the capability endpoint, starts Astro with the runner URL in its environment, and forwards shutdown to both children. `npm run dev` remains the static-site workflow and keeps the honest unavailable state.

The deterministic mock remains the default browser test adapter. The local service has a separate no-Docker contract suite with an injected executor. The maintained Docker suite remains the evidence for compiler behavior, container isolation, and cleanup.

## Implementation Details

The service implements:

- `GET /v1/swift/capabilities`
- `POST /v1/swift/jobs`
- `GET /v1/swift/jobs/{jobID}`
- `DELETE /v1/swift/jobs/{jobID}`

The network boundary accepts only `harnessID`, `requestID`, `source`, and `toolchain`. It requires harness `swift-standard-v1` and toolchain `6.3.3`, limits the body and UTF-8 source size, rejects extra fields, and never accepts compiler flags, environment values, filesystem paths, image names, packages, or shell input.

Jobs use opaque UUIDs. Local defaults allow two active jobs, sixteen queued jobs, and 256 retained job records. Terminal records expire after five minutes. Source is removed from the in-memory job record as soon as the job reaches a terminal state. Shutdown aborts active executors and waits for their cleanup paths.

The service reports the pinned Linux boundary. It parses the executor target from `swiftc --version` when available and keeps compiler diagnostics, standard output, standard error, timing, exit code, and output-limit state separate.

## Consequences

Positive consequences:

- A learner can run arbitrary standard-library Swift edits from a normal local documentation page.
- Local browser behavior crosses the same versioned HTTP port planned for the live site.
- No browser credential, cloud account, or third-party compiler service is required.
- The mock, service contract, and Docker isolation tests remain separate evidence layers.

Costs and limits:

- Interactive execution requires a running Docker daemon and the pinned image.
- The local service is not approved for a public network, even if a reverse proxy could reach it.
- Queue limits and CORS are local safety controls, not a complete public abuse model.
- Linux standard-library success remains distinct from SwiftUI, UIKit, Apple SDK, simulator, signing, entitlement, and device evidence.

## Revisit Triggers

Revisit this decision when the production deployment boundary is chosen, the public job contract changes, Docker is replaced as the executor, Swift ships a supported browser compiler, or the local workflow needs to support a non-loopback development origin.
