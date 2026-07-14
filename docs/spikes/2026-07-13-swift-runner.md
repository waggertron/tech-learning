# Swift Runner Executor Spike

**Date:** 2026-07-13
**Status:** R1.3 passed
**ADR:** `docs/adr/2026-07-13-swift-browser-execution.md`

The R1.6 hardening pass promoted this code into the maintained executor paths below. This document preserves the original spike evidence.

## Question

Can a project-owned runner compile source edited after site deployment with the exact stable Swift toolchain, return structured compiler and runtime evidence, enforce timeout and output bounds, cancel underlying work, isolate concurrent jobs, and clean every local artifact?

## Result

Yes, at the local executor boundary. The spike runs each submission in a new container from the official Swift 6.3.3 image pinned by digest. Source enters through standard input and is never mounted from the repository. Compilation uses Swift 6 language mode. Compilation and execution are separate stages with separate output, status, exit code, and timing fields.

The spike is not the browser component or public service. R1.4 still needs the contract mock and local API path. R1.5 still needs `SwiftRepl.astro`. R1.6 still owns production sandbox review and deployment limits.

## Files

- Executor: `tools/swift-runner/runner.mjs`
- Contract tests: `tests/swift-runner-executor/runner.test.mjs`
- Valid and deliberate invalid fixtures: `tests/swift-runner-executor/fixtures/`
- Command: `npm run test:swift-runner-executor`

## Toolchain

- Image tag: `swift:6.3.3-noble`
- Pinned image digest: `sha256:66520bcba471018a34fd54ba09be97ba4abebd950a96ff5cb8c2bf50a2d33259`
- Compiler: Swift 6.3.3 release
- Target: `aarch64-unknown-linux-gnu`
- Language mode: Swift 6

The executor rejects a container whose reported compiler does not contain `Swift version 6.3.3`. Linux compiler evidence does not establish iOS, simulator, device, UIKit, SwiftUI, or Apple SDK behavior.

## Evidence

The final run passed ten tests in 5.55 seconds:

| Case | Evidence |
| --- | --- |
| Edited valid source | Compiled after test startup and printed `swift runner ready`. The first full job completed in 1.03 seconds. |
| Compiler failure | Returned `compile_failed` with the Swift type diagnostic and never entered the run stage. |
| Runtime failure | Returned `runtime_failed`, a nonzero exit code, and fatal-error text on standard error. |
| Timeout | A deliberate infinite loop reached a 300 ms run deadline and returned `timed_out`. |
| Cancellation | An abort requested after the run stage began removed the job container and returned `cancelled`. |
| Output bound | A deliberate infinite writer crossed a 4 KiB test ceiling, stopped, and returned `output_limited`. |
| Concurrent jobs | Two containers ran together, had distinct names, and returned only their own output. |
| Container boundary | Docker inspection confirmed no network, read-only root, all capabilities dropped, no new privileges, private PID mode, 64-process ceiling, 1 GiB memory and swap ceilings, an unprivileged user, and only `/tmp` and `/work` tmpfs mounts. |
| Source bound | Oversized source returned `rejected` before a container was allocated. |
| Cleanup | The suite's final assertion found no container with the spike name prefix. |

## Executor Boundary

Each job applies these controls:

- No network namespace connection.
- No host bind mounts or Docker socket.
- Read-only image filesystem.
- Fresh executable tmpfs volumes for `/work` and `/tmp`.
- Unprivileged user `65534:65534`.
- All Linux capabilities dropped and `no-new-privileges` enabled.
- One CPU, 1 GiB memory, 1 GiB swap, 64 processes, and 64 open files.
- A 64 KiB source ceiling and 64 KiB combined output ceiling by default.
- A 10-second compile deadline and 3-second run deadline by default.
- Forced container removal on completion, failure, timeout, cancellation, or output limit.

These controls prove the local orchestration mechanics. They do not by themselves approve a public code-execution service. R1.6 must validate the production host, daemon boundary, queue, quotas, kernel isolation, monitoring, and failure recovery.

## Environment Matrix

| Environment or state | Result | Interpretation |
| --- | --- | --- |
| Managed sandbox, Docker socket reads | Intermittent permission denial | Codex sandbox behavior, not a repo or Docker defect. Docker validation must run in the owning host environment. |
| Host Docker with 134 MiB free | Swift layer registration failed with an input/output error | Host storage was causal. No repo workaround was appropriate. |
| Host Docker after unrelated unused images were absent and Docker restarted | Swift image pull and exact compiler check passed | Freed disk and healthy Docker metadata restored the authoritative path. |
| First post-recovery image operation | Severe one-time metadata latency | Not accepted as a clean cold-start measurement because storage recovery was still in progress. |
| Warm pinned image | Ten tests passed in 5.55 seconds | The executor path is fast enough to continue into the contract spike. |

The failed full-disk attempt left no repo change. The active PostgreSQL service was not modified by the spike. After the user restarted Docker Desktop, that unrelated container remained stopped and was left untouched.

## Decision Impact

R1.3 proves that editable source does not require a build-time-only workaround and that a first-party executor can satisfy the required result states locally. The public architecture remains behind the `SwiftRunnerClient` port from the ADR. Direct Docker orchestration is spike evidence, not a browser contract and not automatic approval for production.

Piston was not required for the smallest proof. It remains an executor candidate if R1.6 shows that its added job-management and isolation model improves the production boundary without losing the exact Swift toolchain or contract behavior.

## Remaining Work

1. R1.4 completed the versioned client contract, deterministic local mock, and HTTP adapter.
2. R1.5 completed the Swift editor and approach-block surface.
3. R1.6 promoted and hardened the maintained local isolation boundary. Public service abuse controls still precede deployment.
4. R1.7 must run browser, accessibility, cancellation, failure, cache, and mobile checks.
5. R1.8 must finish stable authoring rules and capability documentation.
