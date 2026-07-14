# Swift Runner Isolation

R1.6 promotes the Swift executor spike into the maintained execution boundary under `tools/swift-runner/`. Each source submission receives a new container from the digest-pinned Swift 6.3.3 image. The browser contract cannot change compiler flags, image names, filesystem paths, process settings, environment values, or Docker arguments.

This document covers untrusted-code isolation. It does not claim that a public HTTP service is ready to deploy. A public service still needs the queue, quota, CORS, retention, observability, and kill-switch controls in the architecture decision record.

## Maintained Command

```bash
npm run test:swift-runner-executor
```

The command requires Docker access and the pinned image. It creates short-lived containers, runs all terminal paths, and fails if a runner container remains.

## Enforced Boundary

| Resource | Enforcement |
| --- | --- |
| CPU | Docker limits each job to one CPU. Compile and run stages also have separate wall-clock deadlines. |
| Memory | Docker limits memory and memory plus swap to 1 GiB for the complete job. Both writable tmpfs mounts count against the container boundary. |
| Output | Source is limited to 64 KiB. Compiler diagnostics, standard output, and standard error share one 64 KiB job budget. Crossing it removes the container and returns `output_limited`. |
| Processes | The container has a 64-process ceiling, a 64-file-descriptor ceiling, no core dumps, and Docker's private PID namespace. |
| Filesystem | The image root is read-only. `/work` and `/tmp` are private 256 MiB tmpfs mounts with `nosuid` and `nodev`; `/tmp` is also `noexec`. Source enters through standard input, not a host mount. |
| Network and IPC | Docker network mode and IPC mode are both `none`. |
| Privilege | The process runs as user and group 65534 with all Linux capabilities dropped and no-new-privileges enabled. |
| Host boundary | No host directory, Docker socket, environment credential, or service credential is mounted or forwarded into the container. |
| Cleanup | Timeout, cancellation, output limiting, compiler failure, runtime failure, and normal completion all reach the same forced-container cleanup path. |

The compiler runs with `-swift-version 6` and a fixed module-cache and output path. The request surface accepts only source text and internal test overrides. It does not accept shell fragments, compiler flags, environment variables, package URLs, image names, container names, or host paths from the browser contract.

## Test Evidence

The maintained suite proves:

- Exact Swift 6.3.3 toolchain and successful output.
- Compiler failure and runtime failure remain distinct.
- Run timeout removes the container.
- Compiler timeout removes the container.
- Cancellation removes the underlying job instead of only abandoning a client request.
- Runaway output cannot exceed the configured job budget.
- Compiler warnings and program output share one budget.
- Concurrent jobs use different containers and cannot mix output.
- Docker inspection matches the declared CPU, memory, process, filesystem, network, IPC, user, capability, and mount controls.
- A host-only temporary file, a host-only environment value, and `/var/run/docker.sock` are not visible to submitted Swift code.
- Oversized source is rejected before container allocation.
- Every run leaves zero runner containers.

The final R1.6 run passed 13 tests in 11.53 seconds on the local Docker host. A managed Codex sandbox denied direct Docker socket access, while the same suite passed outside that sandbox. This is an environment permission boundary, not evidence that the executor can run without Docker access.

## Known Limits

- Docker and its default seccomp profile remain part of the trusted computing base.
- The 1 GiB memory ceiling is shared by compilation and execution. A future worker can split those phases into different containers if measurements justify tighter run memory.
- The executor is Linux-only. It cannot validate SwiftUI, UIKit, Apple SDK imports, simulator behavior, signing, entitlements, or device behavior.
- Foundation is not part of the initial public harness contract even when the Linux image happens to contain it.
- Public abuse controls belong in the service layer before any internet deployment.

## Maintenance Rule

Any change to the image digest, Swift version, Docker arguments, timeout, output collector, source transfer, workspace, or cleanup path must run the full executor suite. Update this document and the architecture decision record when the effective trust boundary changes.
