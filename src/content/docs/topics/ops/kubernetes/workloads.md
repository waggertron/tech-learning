---
title: Kubernetes Workloads Reference
description: "Deep coverage of every Kubernetes workload type: Deployment rollout strategy, StatefulSet stable identity, DaemonSet scheduling, Job and CronJob configuration, probes, and resource management."
parent: kubernetes
tags: [kubernetes, workloads, deployment, statefulset, daemonset]
status: draft
created: 2026-05-14
updated: 2026-05-14
---

## Overview

Kubernetes has five built-in workload controllers. Each wraps a pod template and adds a different management contract:

| Controller | Pods are... | Ordered | Stable identity | Use for |
| --- | --- | --- | --- | --- |
| Deployment | Interchangeable | No | No | Stateless services |
| StatefulSet | Named and stable | Yes | Yes | Stateful workloads |
| DaemonSet | One per node | No | No | Node-level agents |
| Job | Run-to-completion | No | No | Batch tasks |
| CronJob | Scheduled Jobs | No | No | Recurring batch |

Every controller manages a pod template. When you update the template, the controller reconciles running pods toward the new spec.

## Deployment

The default for any stateless service.

### Rolling update strategy

```yaml
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # max pods above desired during rollout
      maxUnavailable: 0  # max pods below desired during rollout
```

With `maxUnavailable: 0`: Kubernetes creates the new pod first (allowed by `maxSurge: 1`), waits for it to pass readiness, then terminates one old pod. Zero downtime, but you need capacity for one extra pod.

With `maxUnavailable: 1` and `maxSurge: 0`: Kubernetes terminates first, then creates. Use when you can't temporarily over-provision.

`Recreate` terminates all old pods before creating new ones. Use only when the app can't run two versions simultaneously.

### Rollback

```bash
kubectl rollout history deployment/<name> -n <ns>
kubectl rollout undo deployment/<name> -n <ns>                  # to previous
kubectl rollout undo deployment/<name> --to-revision=3 -n <ns>  # to specific
```

Kubernetes keeps the last 10 revisions by default (`revisionHistoryLimit`). Reduce this if etcd is under storage pressure.

### Blue-green pattern

Kubernetes doesn't have native blue-green. Simulate with two Deployments and a Service selector swap:

```bash
# deploy green alongside blue
kubectl apply -f deployment-green.yaml
kubectl rollout status deployment/api-green

# swap the Service selector
kubectl patch service api -p '{"spec":{"selector":{"version":"green"}}}'

# remove blue after validation
kubectl delete deployment api-blue
```

For frequent releases, use Argo Rollouts or Flagger instead.

### Canary pattern

Run a small Deployment with the new version alongside the main one. Since both match the Service selector, traffic splits proportionally to replica count:

```
api (20 replicas, v1) + api-canary (2 replicas, v2)
Service selects both -> ~9% traffic to canary
```

This is coarse-grained: percentage is controlled only by pod count. Argo Rollouts and Flagger give weighted traffic splits without changing replica counts.

## StatefulSet

For workloads that need stable network identity and persistent storage.

### What "stable" means

Each pod gets a name like `postgres-0`, `postgres-1`, `postgres-2`. That name is stable across restarts: if `postgres-1` crashes and restarts, it comes back as `postgres-1` with the same network identity and the same PVC.

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  serviceName: postgres   # headless service for DNS
  replicas: 3
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:16
          volumeMounts:
            - name: data
              mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
    - metadata:
        name: data
      spec:
        accessModes: [ReadWriteOnce]
        resources:
          requests:
            storage: 20Gi
        storageClassName: fast-ssd
```

`volumeClaimTemplates` creates one PVC per pod: `data-postgres-0`, `data-postgres-1`, `data-postgres-2`. Each pod always mounts its own PVC.

### DNS for StatefulSets

With `serviceName: postgres` pointing at a headless service, each pod gets a DNS entry:

```
postgres-0.postgres.default.svc.cluster.local
postgres-1.postgres.default.svc.cluster.local
```

Use these names when the application needs to connect to a specific replica (the primary) or enumerate all replicas (a distributed system).

### Partition updates

```yaml
spec:
  updateStrategy:
    type: RollingUpdate
    rollingUpdate:
      partition: 2   # only update pods with ordinal >= 2
```

`partition` enables canary updates: update one pod, validate, then lower the partition threshold. Set to `N-1`, verify pod `N-1`, then `N-2`, and so on.

`OnDelete` updates pods only when you manually delete them. Full control over timing.

### Ordering guarantees

By default, scale-up creates `n+1` only after `n` is Ready. Scale-down terminates in reverse order. For workloads that don't need ordering, disable it with `podManagementPolicy: Parallel`.

**Gotcha**: deleting a StatefulSet does not delete its PVCs. Clean them up manually or the storage persists indefinitely.

## DaemonSet

Runs exactly one pod per node (or per selected subset of nodes).

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: log-forwarder
spec:
  selector:
    matchLabels:
      app: log-forwarder
  template:
    metadata:
      labels:
        app: log-forwarder
    spec:
      tolerations:
        - key: node-role.kubernetes.io/control-plane
          operator: Exists
          effect: NoSchedule
      containers:
        - name: forwarder
          image: fluent/fluent-bit:3.0
          volumeMounts:
            - name: varlog
              mountPath: /var/log
      volumes:
        - name: varlog
          hostPath:
            path: /var/log
```

The `toleration` allows this pod to run on control-plane nodes. Without it, DaemonSet pods skip tainted nodes.

To run only on specific nodes:

```yaml
spec:
  template:
    spec:
      nodeSelector:
        node-type: worker
```

Use `RollingUpdate` (default) to replace pods one at a time. Use `OnDelete` when you want explicit control over which nodes are updated and when.

## Job

A Job runs pods to completion. When the required number of successful completions is reached, the Job is done.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migration
spec:
  completions: 1
  parallelism: 1
  backoffLimit: 3
  ttlSecondsAfterFinished: 3600
  template:
    spec:
      restartPolicy: OnFailure   # required for Jobs: OnFailure or Never
      containers:
        - name: migrate
          image: acme/api:latest
          command: ["python", "manage.py", "migrate"]
```

### Parallelism patterns

- **`completions: 1, parallelism: 1`**: single run. Common for migrations and seed scripts.
- **`completions: N, parallelism: M`**: work queue model. Run M pods at a time until N total completions.
- **Indexed Jobs** (`completionMode: Indexed`): each pod gets a `JOB_COMPLETION_INDEX` env var (0 to N-1). Use to partition a dataset across pods.

### Failure handling

`backoffLimit` counts pod-level failures. The Job retries until `backoffLimit` is exhausted, then marks itself `Failed`.

`restartPolicy: Never` creates a new pod on each failure (the failed pod stays for inspection). `restartPolicy: OnFailure` restarts the container in the same pod. Use `Never` when you need to inspect failed pod logs; use `OnFailure` for cleaner cleanup.

## CronJob

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: nightly-report
spec:
  schedule: "0 2 * * *"      # 2 AM UTC
  timeZone: "America/Chicago"
  concurrencyPolicy: Forbid
  startingDeadlineSeconds: 300
  successfulJobsHistoryLimit: 3
  failedJobsHistoryLimit: 1
  jobTemplate:
    spec:
      template:
        spec:
          restartPolicy: OnFailure
          containers:
            - name: reporter
              image: acme/reporter:latest
```

### concurrencyPolicy

- **`Allow`** (default): multiple runs can overlap. Dangerous if the job has global side effects.
- **`Forbid`**: skip the new run if the previous is still running.
- **`Replace`**: terminate the running job and start the new one.

`Forbid` is right for most data jobs. `Replace` is occasionally right for health checks that should always run the latest version.

### CronJob footguns

- **Missing runs**: if the control plane is down when a job should fire, the run is skipped. `startingDeadlineSeconds` controls how late a missed run can start.
- **History accumulation**: without `successfulJobsHistoryLimit`, old Job objects pile up in etcd.
- **Clock skew**: the schedule uses control-plane time. Use the `timeZone` field (stable since 1.27) to be explicit.
- **No readiness probe needed**: CronJob pods complete and exit. They don't serve traffic, so readiness isn't applicable.

## Probes

Three probe types with distinct purposes:

| Probe | What it controls | Failure action |
| --- | --- | --- |
| `readinessProbe` | Traffic: added/removed from Service endpoints | Remove from endpoint slice |
| `livenessProbe` | Container health | Kill and restart the container |
| `startupProbe` | Startup gate for slow-starting apps | Kill if startup exceeds threshold |

### Readiness probe

Use readiness to gate traffic. A failing readiness probe removes the pod from Service endpoints without restarting it. A good readiness endpoint checks application-level dependencies: can the app reach the database? Is the cache loaded?

```yaml
readinessProbe:
  httpGet:
    path: /health/ready
    port: 8000
  initialDelaySeconds: 5
  periodSeconds: 10
  failureThreshold: 3
```

### Liveness probe

Liveness triggers a container restart. Keep it cheap and independent of external dependencies. A liveness probe that calls the database will restart the container when the database is slow, which can cascade into a full outage.

A good liveness check: is the main process responding at all?

```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 8000
  initialDelaySeconds: 30
  periodSeconds: 20
  failureThreshold: 3
```

### Startup probe

For apps with long startup times (JVMs, model loading), a startup probe delays liveness checks:

```yaml
startupProbe:
  httpGet:
    path: /health/live
    port: 8000
  failureThreshold: 30   # 30 * 10s = 5 minutes max startup
  periodSeconds: 10
```

Once the startup probe succeeds once, liveness takes over.

## Resource management

### requests vs limits

```yaml
resources:
  requests:
    cpu: 100m        # 0.1 CPU core; what the scheduler reserves
    memory: 256Mi    # scheduler reserve; also affects OOM eviction priority
  limits:
    cpu: 500m        # soft ceiling; CPU is throttled at this point
    memory: 512Mi    # hard ceiling; OOMKilled if exceeded
```

CPU is compressible: exceeding the limit slows the container without killing it. Memory is not: exceeding the limit kills the container immediately.

Always set `requests`. They're the scheduler's input. Without them, pods are assigned to nodes that may already be full.

Set `limits.memory` tightly (within 2x of typical usage). Avoid `limits.cpu` unless you have a specific reason: CPU throttling causes latency spikes even when the node has spare capacity.

### QoS classes

Kubernetes assigns a QoS class based on resource spec:

| Class | Condition | OOM eviction priority |
| --- | --- | --- |
| `Guaranteed` | requests == limits for all resources | Evicted last |
| `Burstable` | requests set, but not equal to limits | Evicted based on usage |
| `BestEffort` | No requests or limits | Evicted first |

Aim for `Guaranteed` or `Burstable` for production workloads.

### LimitRange and ResourceQuota

`LimitRange` sets default requests/limits and per-container bounds for a namespace:

```yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: defaults
  namespace: production
spec:
  limits:
    - type: Container
      default:
        cpu: 200m
        memory: 256Mi
      defaultRequest:
        cpu: 100m
        memory: 128Mi
      max:
        cpu: "4"
        memory: 4Gi
```

`ResourceQuota` caps total consumption across all pods in a namespace:

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: team-quota
  namespace: team-a
spec:
  hard:
    requests.cpu: "10"
    requests.memory: 20Gi
    limits.memory: 40Gi
    pods: "50"
```

## Init containers and sidecars

### Init containers

Run to completion before any main container starts. Run sequentially in order:

```yaml
spec:
  initContainers:
    - name: wait-for-db
      image: busybox
      command: ['sh', '-c', 'until nc -z db 5432; do sleep 2; done']
    - name: run-migrations
      image: acme/api:latest
      command: ["python", "manage.py", "migrate"]
  containers:
    - name: api
      image: acme/api:latest
```

All init containers must succeed before the main containers start. If one fails, the pod restarts from that init container.

### Sidecar containers (Kubernetes 1.29+)

Native sidecars are init containers with `restartPolicy: Always`. They start before the main container and continue running alongside it. Kubernetes holds SIGTERM on the sidecar until all main containers have exited, fixing the lifecycle ordering problems that plagued the old pattern.

```yaml
initContainers:
  - name: envoy
    image: envoyproxy/envoy:v1.29
    restartPolicy: Always   # marks this as a sidecar
```

Before 1.29, sidecars were regular containers with no guaranteed startup order relative to the main container.

## References

- [Kubernetes workloads documentation](https://kubernetes.io/docs/concepts/workloads/)
- [Deployment rolling updates](https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/)
- [StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)
- [Jobs documentation](https://kubernetes.io/docs/concepts/workloads/controllers/job/)
- [Configure liveness, readiness, and startup probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
- [Resource management](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)
- [Argo Rollouts](https://argoproj.github.io/rollouts/), blue-green and canary with traffic control

## Related topics

- [Kubernetes](./), the parent topic
- [Kubernetes Troubleshooting](./troubleshooting/), diagnosing workload failures
- [Helm](../helm/), packaging workload configurations into charts
- [ArgoCD](../argocd/), deploying and managing workloads via GitOps
