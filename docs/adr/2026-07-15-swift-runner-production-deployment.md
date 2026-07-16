# ADR: Production Swift Runner Deployment

**Date:** 2026-07-15
**Status:** Accepted for staging design; deployment requires owner approval
**Decision owner:** Zero to iOS Hero program

## Problem

The published site is static GitHub Pages content. Its editable Swift exercises need a separate HTTPS service that can accept public jobs and execute untrusted Swift without exposing credentials, a container control plane, other learners' data, or the service host.

The local runner proves the job contract and the pinned Swift 6.3.3 Linux executor, but its loopback Node service and Docker daemon are not a public deployment boundary. The production choice must fit a small educational site, preserve per-job isolation, support an emergency shutdown, and avoid paying for an orchestration platform before the workload needs one.

The launch envelope is deliberately small:

- At most two executing jobs and sixteen queued jobs.
- At most 64 KiB of source and 64 KiB of combined compiler and program output per job.
- Ten seconds for compilation and three seconds for program execution, plus bounded machine startup and cleanup time.
- An expected launch load below 100 jobs per day. Higher demand triggers measurement and a capacity review instead of automatic expansion.
- A hard service budget of $25 USD per month. Reaching 50 percent, 80 percent, or 100 percent of that ceiling must alert, throttle, or disable new jobs respectively.

The budget is a design ceiling, not authorization to create an account or incur charges.

## Options

### Option A: Dedicated runner host with Docker and gVisor

A small Linux VM could run the coordinator and the existing Docker executor. Each job would use the `runsc` runtime, no network, cgroup limits, a read-only root filesystem, dropped capabilities, and ephemeral mounts. gVisor is explicitly intended to isolate untrusted code with a per-sandbox application kernel and integrates with Docker through its OCI runtime.

This option offers a predictable fixed bill and the smallest adapter change. It also leaves this project responsible for the VM, kernel, Docker daemon, gVisor, firewall, image cache, disk pressure, security patches, monitoring, and recovery. Rootless Docker reduces daemon privilege, but it does not remove the single-host failure domain, and resource enforcement needs verified cgroup v2 delegation. A compromised coordinator could still reach the local execution control plane.

**Disposition:** Rejected for the first public deployment. Keep it as a future self-hosted option if provider cost or portability becomes more important than operational load.

References: [gVisor security introduction](https://gvisor.dev/docs/architecture_guide/intro/), [gVisor rootless operation](https://gvisor.dev/docs/user_guide/rootless/), and [Docker rootless mode](https://docs.docker.com/engine/security/rootless/).

### Option B: GKE Autopilot with GKE Sandbox

The service could create one Kubernetes Job per execution and select the gVisor runtime. Kubernetes would provide resource requests and limits, NetworkPolicy, active deadlines, job cleanup, workload identity controls, and mature queue and metrics integrations. Google documents GKE Sandbox for services that accept and run untrusted user code, with one userspace kernel per sandbox.

This is the strongest orchestration option in the comparison. It also introduces a cluster, Kubernetes policy, IAM, release-channel maintenance, and a larger operational surface than the expected traffic warrants. GKE charges a cluster-management fee, offset by a monthly free-tier credit for eligible billing accounts, plus workload compute. Depending on a billing-account credit as the cost model would make the design less portable and harder to forecast.

**Disposition:** Rejected for launch scale. Revisit when sustained load, multiple toolchains, regional capacity, or an operations team justifies a cluster.

References: [GKE Sandbox](https://docs.cloud.google.com/kubernetes-engine/docs/concepts/sandbox-pods) and [GKE pricing](https://cloud.google.com/kubernetes-engine/pricing).

### Option C: One Fly Machine per job

A trusted coordinator can create a disposable worker through the Machines API. Fly Machines use Firecracker microVMs and are documented for hostile user-code execution. Each worker can boot from the pinned runner image, accept one authenticated job over a private network, return the result on the same connection, and then be deleted. Machine network policies can make egress default deny.

This removes the project-owned Docker daemon and gives every job a hardware-virtualized boundary. Started Machines are billed by use, which fits low and irregular traffic. The tradeoffs are a provider-specific adapter, large-image cold starts, best-effort regional capacity, and continued project ownership of the coordinator, worker image, job protocol, network policy, quotas, cleanup, monitoring, and spending controls.

**Disposition:** Selected for staging and the first public deployment, subject to the staging evidence in this ADR.

References: [running user code on Fly Machines](https://fly.io/docs/machines/guides-examples/functions-with-machines/), [Machine network policies](https://fly.io/docs/machines/guides-examples/network-policies/), [Fly architecture](https://fly.io/docs/reference/architecture/), and [Fly pricing](https://fly.io/docs/about/pricing/).

### Option D: Cloud Run around the current Docker executor

Cloud Run could host trusted HTTP coordination code, but it cannot preserve the current nested Docker execution boundary. It has no equivalent to Docker privileged mode, restricts kernel capabilities and mounts, and would place multiple public executions inside the coordinator instance unless another execution service were added.

**Disposition:** Rejected as the execution worker. A future trusted coordinator may run there only if its executor remains a separate isolated service.

Reference: [Cloud Run container runtime contract](https://docs.cloud.google.com/run/docs/container-contract).

## Decision

Use a trusted public coordinator and a disposable Fly Machine worker for each accepted job. GitHub Pages communicates only with the coordinator. The coordinator is the only process that holds a narrowly scoped Machines API token. Neither browser code nor worker images receive that token.

The worker app has no public Fly Proxy service and runs on a custom private network. The coordinator creates a worker in `sjc`, waits for its private health endpoint, and sends one job with a single-use random capability. The worker invalidates that capability before compilation begins, closes its listener to additional work, compiles and runs the job, and returns the bounded result on the existing private request. It never initiates a network connection.

A worker network policy allows the private inbound worker port and defines egress as default deny with no allowed egress ports. Staging must prove denial with direct IPv4 and IPv6 targets, not only a DNS failure. The worker has no service credentials, volumes, host mounts, package download path, or cross-job cache. Source is never placed in Machine metadata, environment variables, command arguments, image layers, or provider API payloads.

The production executor will not run Docker inside the Machine. The pinned Swift image becomes a worker image whose entry point contains the compile and run boundary directly. Shared executor behavior moves behind an adapter so local development can continue to use Docker while production uses the Machines API.

The first region is San Jose (`sjc`) because the project owner and initial validation are on the United States west coast. Chicago (`ord`) is the capacity fallback after a failed placement retry. The coordinator records only region, timing, status, bounded-size counters, and opaque identifiers. It does not log source, diagnostics, standard output, or standard error.

## Implementation Details

### Control-plane boundary

The coordinator owns request validation, CORS, quotas, deduplication, queueing, result retention, cancellation, Machine creation, and cleanup. The Machines API is unreachable from the browser and absent from worker state. Provider credentials use the narrowest available app scope and rotate independently from the worker image.

The worker owns one compilation and execution. It runs as a non-root user with no added capabilities, a bounded writable workspace, process and file-descriptor limits, one shared CPU, and 1 GiB of memory unless the staging spike proves that this size is insufficient. The root filesystem is disposable, and no persistent volume is attached.

### Lifecycle and recovery

For each accepted job, the coordinator:

1. Reserves a concurrency slot before creating a Machine.
2. Creates a worker from an image pinned by digest and waits for a bounded healthy state.
3. Sends one authenticated request over the custom private network.
4. Propagates client cancellation to worker shutdown.
5. Records the bounded terminal result, removes source from coordinator memory, and deletes the Machine.
6. Releases the slot only after deletion succeeds or the orphan sweeper owns the cleanup record.

Creation receives one retry in the primary region, then one retry in the fallback region with jitter. Execution is never automatically retried because a program may be nondeterministic and duplicate work would weaken quota accounting. If the coordinator restarts, queued jobs become unavailable, active jobs are cancelled, and a reconciliation pass deletes Machines carrying this service's opaque job label. A periodic sweeper deletes workers older than the maximum job lifetime. The emergency switch rejects new jobs while preserving capabilities, polling for retained results, cancellation, and the editor's unavailable state.

### Patch and operations ownership

Fly owns the physical host, Firecracker platform, regional infrastructure, and platform patching. This project owns the coordinator, worker userspace, Swift toolchain image, dependency updates, network policy, token scope, API abuse controls, metrics, retention, and incident response.

The pinned Swift image is rebuilt at least monthly and after relevant high-severity security advisories. Staging runs the full success, compiler failure, runtime failure, timeout, cancellation, output limit, egress denial, cleanup, cold-start, and image-digest checks before production promotion. Rollback selects the previous coordinator release and worker digest. The public API remains disabled when either artifact cannot pass its focused checks.

### Cost controls

The current Fly list price for a continuously running shared CPU Machine with 256 MiB is about $2.02 per month, while a shared CPU Machine with 1 GiB is about $5.92 per month. Workers are expected to run only for bounded jobs, but image startup time must be measured because the Swift image is large. The deployment must set provider spending alerts and enforce application-side daily and monthly execution budgets before its public origin is enabled.

The $25 monthly ceiling includes coordinator compute, worker compute, certificates, storage, and transfer. No automatic quota increase may raise that ceiling. If the measured staging estimate exceeds $15 per month at the launch envelope, do not publish the endpoint. If actual cost reaches $20, reject new work except operator probes. At $25, activate the emergency switch.

## Required Staging Evidence

This decision permits implementation of the provider adapter, but not a public launch. R2.6 cannot complete until staging proves:

- The exact Swift 6.3.3 image boots and completes representative compile and run jobs within the service deadline.
- Worker IPv4, IPv6, DNS, private-network lateral movement, and cloud metadata access are denied except for the single coordinator request.
- A worker cannot read coordinator credentials, another job, a persistent disk, or provider metadata.
- Success, compiler failure, runtime failure, timeout, cancellation, output limiting, coordinator restart, regional placement failure, and forced Machine deletion all reach bounded terminal states.
- Every terminal path deletes the worker, and the sweeper removes deliberately orphaned workers.
- Cold-start and execution measurements keep the projected launch bill below $15 per month and the enforced ceiling at $25.
- The public coordinator can be disabled without rebuilding GitHub Pages, leaving editing and reset behavior intact.

## Consequences

Positive consequences:

- Every public job receives a separate microVM instead of sharing the coordinator's kernel or Docker daemon.
- Low traffic pays mainly for bounded execution time without introducing a Kubernetes cluster.
- The browser contract, Linux-only evidence, and local Docker workflow remain stable.
- Default-deny worker egress and a private one-shot handoff preserve the existing no-network executor promise.

Costs and limits:

- The production adapter and operations workflow are specific to Fly Machines.
- Large Swift images may produce a visible cold start and must be measured honestly.
- Provider regional capacity is best effort, so unavailable is a normal terminal state.
- Hardware isolation does not replace request quotas, resource limits, output bounds, cleanup, image patching, or source-retention controls.
- This service still proves only pinned Swift on Linux. It does not provide Apple SDKs, SwiftUI, UIKit, simulator, signing, entitlement, or device execution.

## Revisit Triggers

Revisit this decision if sustained demand exceeds two concurrent jobs or 100 jobs per day, the monthly estimate exceeds $15, the bill reaches $20, cold-start latency fails the product target, Fly cannot enforce the required network boundary, a provider incident changes the isolation model, multiple language toolchains are added, or GKE Sandbox becomes operationally justified.
