---
title: Kubernetes
description: The container orchestrator that turned "run my app on a server" into "declare what I want and the system will make it so." Architecture, the object model, workloads, networking, storage, RBAC, autoscaling, and the footguns that fill every production postmortem.
category: ops
tags: [kubernetes, k8s, containers, orchestration, cloud-native]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## The one-paragraph definition

**Kubernetes is a declarative control system for running containerized workloads across a fleet of machines.** You tell it what you want, "run 3 replicas of this image, expose it on port 80, give it a public IP", and a set of controllers continuously work to make reality match. It doesn't run your containers so much as it watches them and corrects deviations.

Originally from Google's Borg, open-sourced 2014, CNCF-hosted. Now the default platform for anything that isn't a single-server deployment or a strict serverless workload.

## What Kubernetes is *not*

Worth getting these out of the way:

- **Not a PaaS.** It won't build, push, or observe your app out of the box. Heroku does that; Kubernetes is the layer under a PaaS.
- **Not a container runtime.** It uses `containerd` or `CRI-O`; Docker Engine is no longer a supported runtime.
- **Not a database.** Stateful workloads work, but "running Postgres on k8s" is not the same as running it on RDS.
- **Not magic scaling.** Autoscaling is opt-in, often misconfigured, and will cheerfully scale to zero or to bankruptcy without guardrails.

## Architecture

Two kinds of nodes, one source of truth:

```
┌─────────────────── Control plane ───────────────────┐
│                                                     │
│  kube-apiserver ◄──────── etcd (strongly            │
│      ▲                     consistent store)        │
│      │                                              │
│      ├── kube-scheduler   (assigns pods to nodes)   │
│      ├── controller-manager (reconcile loops)       │
│      └── cloud-controller-manager                   │
│                                                     │
└─────────────────────────────────────────────────────┘
           ▲
           │ kubectl / any client
           │ kubelets on workers watch for their pods
           ▼
┌─────────────────── Worker nodes ────────────────────┐
│  kubelet ◄── talks to the API server                │
│  kube-proxy (programs iptables/IPVS for Services)   │
│  containerd / CRI-O (runs containers)               │
│  Pods (1+ containers sharing a network namespace)   │
└─────────────────────────────────────────────────────┘
```

The mental model: **everything is an API object in etcd. Every component is either writing to the API or reacting to changes via a watch.** There is no direct node-to-node coordination.

### Key control-plane components

- **`kube-apiserver`**, the only thing that talks to etcd. Everything else talks to the API server. If it's down, no new work happens (running workloads continue).
- **`etcd`**, distributed key-value store. The cluster's database. Loss of etcd = loss of the cluster.
- **`kube-scheduler`**, assigns unscheduled Pods to Nodes based on resource requests, taints, affinities.
- **`kube-controller-manager`**, runs built-in controllers (Deployment, ReplicaSet, Node, Service, etc.). Each controller reconciles its objects.
- **`cloud-controller-manager`**, talks to the cloud provider (AWS, GCP, Azure) for LoadBalancers, volumes, routes.

### Key node components

- **`kubelet`**, the agent on every node. Watches the API for Pods assigned to its node, starts/stops them, reports status.
- **`kube-proxy`**, programs iptables or IPVS rules so `Service` IPs resolve to Pod IPs.
- **Container runtime**, `containerd` in most production clusters; the actual "run this container" layer.

## The object model

Everything in Kubernetes is an API object with the same shape:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: home-health
  labels:
    app: api
spec:
  # what you want
status:
  # what is
```

- **`apiVersion`** / **`kind`**, the type.
- **`metadata.name`**, unique within its namespace and kind.
- **`metadata.labels`**, key/value pairs. Used for selection.
- **`spec`**, your desired state.
- **`status`**, populated by the controller to report reality.

You write `spec`. The controller writes `status`. If they don't match, the controller is either working on it or stuck.

## Workloads

Five primary workload resources:

### Deployment

The default for stateless services. Manages a ReplicaSet, which manages Pods.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels: { app: api }
  template:
    metadata:
      labels: { app: api }
    spec:
      containers:
        - name: api
          image: acme/api:sha-abc1234
          ports:
            - containerPort: 8000
          resources:
            requests:
              cpu: 100m
              memory: 256Mi
            limits:
              memory: 512Mi
          readinessProbe:
            httpGet:
              path: /healthz
              port: 8000
            initialDelaySeconds: 5
```

Rolling updates by default; configurable via `strategy`. Rollback with `kubectl rollout undo deployment/api`.

### StatefulSet

For workloads with stable network identity and persistent storage, databases, queues, stateful singletons.

- Pods named `<set>-0`, `<set>-1`, `<set>-2`, stable across restarts.
- Each Pod gets its own PVC via `volumeClaimTemplates`.
- Ordered startup, ordered shutdown, ordered rolling updates.

Use it when you actually need the ordering guarantees. A Redis cache doesn't need a StatefulSet; a Postgres primary does.

### DaemonSet

One Pod per Node (or per selected Node). For node-level agents: log forwarders, metrics exporters, CNI plugins, node problem detectors.

### Job / CronJob

- **`Job`**, run N pods to completion. Retries on failure.
- **`CronJob`**, schedule Jobs on a crontab. Every `@hourly`, every `0 2 * * *`, etc.

Gotcha: CronJobs can skip or pile up if the previous run hasn't finished. Set `concurrencyPolicy: Forbid` unless overlap is safe.

## Pod anatomy

A Pod is 1+ containers sharing:

- A network namespace (same IP, same port space).
- A process namespace (optional, via `shareProcessNamespace`).
- A volume namespace (mounted volumes visible to every container in the pod).

Typical patterns:

- **Single-container Pod**, 95% of cases.
- **Sidecar**, a second container that augments the main one (e.g. Envoy, log collector, cloud-SQL proxy).
- **Init containers**, run to completion before the main containers start. Setup, permissions, schema migrations.
- **Ephemeral containers**, injected at runtime for debugging. `kubectl debug`.

Pods are cattle, not pets. They die; new ones take their place with new IPs. Never assume a Pod is long-lived.

## Services and networking

Pods get their own IPs but aren't addressable directly (the IP changes). `Service` objects give you stable endpoints.

### Service types

| Type | What it gives you | When to use |
| --- | --- | --- |
| `ClusterIP` | Stable internal IP, cluster-only | Default; service-to-service inside the cluster |
| `NodePort` | Exposes on every node at a port in 30000–32767 | Rare; usually just an internal hop |
| `LoadBalancer` | Cloud-provider LB with an external IP | Public-facing services in a cloud cluster |
| `ExternalName` | CNAME to an external hostname | Forwarding to a non-k8s dependency |
| Headless (`clusterIP: None`) | No load-balancing; DNS returns Pod IPs | StatefulSets, custom service discovery |

### Ingress

A `LoadBalancer` per service gets expensive. `Ingress` is the HTTP-layer router:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api
spec:
  ingressClassName: nginx
  rules:
    - host: api.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api
                port:
                  number: 8000
  tls:
    - hosts: [api.example.com]
      secretName: api-tls
```

An `IngressController` (nginx, Traefik, HAProxy, cloud-managed) watches Ingress objects and configures itself. The controller is a real pod; the Ingress object is a declarative config.

### Gateway API

The successor to Ingress, splits into `Gateway` (the listener), `HTTPRoute` (the routing rules), `Service` (the backend). Better separation of concerns, broader protocol support (gRPC, TCP, TLS passthrough). New Kubernetes installations should start here; legacy Ingress still works fine.

### NetworkPolicy

Default: every Pod can reach every other Pod. `NetworkPolicy` restricts that:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-ingress
spec:
  podSelector:
    matchLabels: { app: api }
  policyTypes: [Ingress, Egress]
  ingress:
    - from:
        - podSelector:
            matchLabels: { app: gateway }
      ports:
        - port: 8000
```

Requires a CNI that enforces them (Calico, Cilium). Without one, NetworkPolicy objects are inert.

## Storage

Three related concepts:

- **`PersistentVolume`** (PV), a chunk of storage, cluster-level.
- **`PersistentVolumeClaim`** (PVC), a request for storage from a workload.
- **`StorageClass`**, "how to dynamically provision PVs." Ties into a CSI driver.

Workflow:

1. Admin creates a `StorageClass` (or uses the default).
2. A Pod references a PVC.
3. Kubernetes provisions a PV matching the PVC's size and storage class.
4. PVC binds to PV; the PV is mounted into the Pod.

The Container Storage Interface (CSI) is the standard API between Kubernetes and storage backends, AWS EBS, GCE PD, NFS, Ceph, etc.

**Gotcha:** `StatefulSet.volumeClaimTemplates` creates one PVC per Pod. The PVC survives Pod deletion. Deleting the StatefulSet does *not* delete the PVCs. Clean them up manually.

## Config and secrets

- **`ConfigMap`**, non-sensitive config. Mounted as files or env vars.
- **`Secret`**, base64 encoded (not encrypted!). Same usage shape.

Plain Kubernetes Secrets are only base64, not secret. Solutions:

- Encrypt etcd at rest.
- Use External Secrets Operator (pulls from AWS Secrets Manager, Vault, etc.).
- Use Sealed Secrets (encrypted at the source).

See the [GitOps topic](../gitops/) for the secret-management patterns.

## RBAC

Four primary objects:

- **`Role`**, a set of allowed verbs on resources, namespace-scoped.
- **`ClusterRole`**, the same, but cluster-scoped.
- **`RoleBinding`**, binds a Role to a subject (user, group, ServiceAccount) in a namespace.
- **`ClusterRoleBinding`**, cluster-scope version.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: api-reader
  namespace: home-health
rules:
  - apiGroups: [""]
    resources: [pods, services]
    verbs: [get, list, watch]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: api-reader-bind
  namespace: home-health
subjects:
  - kind: ServiceAccount
    name: api
    namespace: home-health
roleRef:
  kind: Role
  name: api-reader
  apiGroup: rbac.authorization.k8s.io
```

Every Pod runs as a ServiceAccount. Lock down what each ServiceAccount can do; don't use the `default` ServiceAccount for anything that talks to the API server.

## Autoscaling

Three orthogonal autoscalers:

- **HPA (Horizontal Pod Autoscaler)**, more Pods. Triggered by CPU, memory, or custom metrics.
- **VPA (Vertical Pod Autoscaler)**, bigger Pods. Mostly used in `recommend` mode because active mode restarts Pods.
- **Cluster Autoscaler / Karpenter**, more Nodes. CA is the old guard; Karpenter is the modern AWS-native replacement with better bin-packing and Spot support.

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 2
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

**KEDA** (Kubernetes Event-driven Autoscaling) extends HPA with triggers like queue depth, Kafka lag, HTTP request rate. Scale-to-zero for workloads that aren't always needed.

## Controllers and the reconcile pattern

Every Kubernetes feature is a controller running a reconcile loop:

```
for each object of kind X:
    observed = read from API
    desired = spec
    if observed != desired:
        take action to make observed closer to desired
sleep
```

That's it. The entire system is dozens of these loops. Deployment controller reconciles Deployments. Node controller reconciles Nodes. ArgoCD's application controller reconciles Applications.

**Level-triggered, not edge-triggered.** The controller doesn't care that a change happened; it cares what state exists right now. If a controller misses an event, the next reconcile fixes it. This is why Kubernetes is resilient in ways that pure message-driven systems aren't.

## CRDs and operators

You can add your own kinds. `CustomResourceDefinition` (CRD) teaches the API server a new type. An **operator** is a controller for that type.

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: postgresdbs.acme.io
spec:
  group: acme.io
  versions:
    - name: v1
      served: true
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          # ...
  scope: Namespaced
  names:
    plural: postgresdbs
    singular: postgresdb
    kind: PostgresDB
```

Now `kubectl apply -f` a `PostgresDB` object, and an operator (written by you, or cert-manager-style third-party) watches for them and does the work.

This is how Kubernetes extends to almost anything, Prometheus Operator, cert-manager, ArgoCD, Velero, Strimzi, the entire ecosystem.

## Namespaces, labels, selectors

- **Namespaces**, logical partitions. Most resources live in one. RBAC is usually per-namespace.
- **Labels**, `metadata.labels`. Key/value tags. The selection mechanism.
- **Selectors**, how one object references others by labels.

There is no "foreign key" to a Pod; Services select Pods by label match. This is decoupling as an architectural principle, and a footgun if your labels drift.

## Ingress controllers, service meshes, and the "what do I actually need" question

- **Ingress controller or Gateway API**, Pick one. NGINX, Traefik, HAProxy, cloud-native (ALB controller). Needed as soon as you have public-facing HTTP.
- **Service mesh** (Istio, Linkerd, Cilium Service Mesh), inter-service mTLS, retries, circuit breaking, fine-grained traffic routing. Adds real operational weight. Don't adopt it until you have a concrete need, multi-tenant clusters, strict compliance requirements, or advanced traffic-shaping for canaries.

Most teams never graduate past ingress + network policies.

## Common footguns

- **Missing `resources.requests`.** Without requests, the scheduler packs Pods onto nodes and OOM-kills them under load. Always set them.
- **Overly tight `limits.memory`.** OOMKilled loops. JVMs are famously hard to right-size.
- **Wrong liveness probe.** A heavy `/live` endpoint causes cascading restarts under load. Keep liveness cheap and independent of external deps.
- **Readiness without liveness.** Pod never gets traffic but also never restarts. Both probes serve different roles.
- **Default ServiceAccount used by app Pods.** Grants cluster-wide read access by default in some distributions. Use explicit ServiceAccounts.
- **`NodePort` exposed to the internet.** Doesn't go through a load balancer; bypasses most ingress features.
- **ConfigMap update that doesn't restart pods.** Pods don't automatically roll on ConfigMap changes. Use a checksum annotation on the Deployment template. The ["Stakater Reloader"](https://github.com/stakater/Reloader) operator automates this.
- **Namespace deletion stuck on finalizers.** Manually patch the finalizer to `null` or the namespace hangs forever.
- **PVCs that survive unintentionally.** Delete the StatefulSet and the PVCs remain. Document cleanup or use a delete policy.
- **HPA on deployments without requests.** HPA computes utilization as a percentage of requests; no requests = no metric = no scaling.
- **Running a database as a Deployment.** Use a StatefulSet, or better, a managed database outside the cluster.

## Debugging checklist

When something's broken:

1. **`kubectl describe pod <pod>`**, events section almost always names the problem.
2. **`kubectl logs <pod> -c <container>`**, with `-p` for the previous crash.
3. **`kubectl get events --sort-by=.lastTimestamp`**, cluster-wide recent events.
4. **`kubectl rollout status deployment/<name>`**, is the rollout stuck?
5. **`kubectl exec -it <pod> -- sh`**, shell in to poke around.
6. **`kubectl debug node/<node> -it --image=busybox`**, node-level debug container.
7. **`kubectl top pods`** / **`kubectl top nodes`**, live resource usage (needs metrics-server).

## Production essentials

A minimally professional production cluster has:

- **Metrics stack**, Prometheus + Grafana, or a managed equivalent (Datadog, Dynatrace).
- **Log aggregation**, Loki, Elasticsearch, or cloud-native (CloudWatch, Stackdriver).
- **Distributed tracing**, OpenTelemetry → Jaeger / Tempo / Datadog APM.
- **Secret management**, External Secrets Operator or similar.
- **RBAC scoped per team**, with tools like Kyverno or OPA Gatekeeper for policy enforcement.
- **Cluster autoscaling**, Karpenter (AWS) or Cluster Autoscaler elsewhere.
- **Backups**, Velero for cluster state + PVC snapshots.
- **Ingress + cert-manager**, automated TLS via Let's Encrypt or private CA.
- **GitOps**, ArgoCD or Flux. See the [GitOps topic](../gitops/).

That's the baseline. Everything beyond (service mesh, multi-cluster federation, progressive delivery) is a specialization you add when it earns its weight.

## References

- [Kubernetes documentation](https://kubernetes.io/docs/)
- [Kubernetes API reference](https://kubernetes.io/docs/reference/kubernetes-api/)
- [The Kubernetes Book, Nigel Poulton](https://www.amazon.com/Kubernetes-Book-Nigel-Poulton/dp/B0BG2TFVHW), approachable depth
- [CNCF landscape](https://landscape.cncf.io/), the ecosystem of tools
- [Kubernetes patterns, Roland Huß, Bilgin Ibryam](https://www.oreilly.com/library/view/kubernetes-patterns-2nd/9781098131678/)
- [kubectl cheat sheet](https://kubernetes.io/docs/reference/kubectl/quick-reference/)
- [Gateway API spec](https://gateway-api.sigs.k8s.io/)
- [Karpenter](https://karpenter.sh/), node autoscaling on AWS

## Related topics

- [Helm](../helm/), the package manager for Kubernetes
- [Terraform](../terraform/), provisioning the cluster itself
- [GitOps](../gitops/), deploying into the cluster declaratively
- [ArgoCD](../argocd/), the reference GitOps controller for Kubernetes
