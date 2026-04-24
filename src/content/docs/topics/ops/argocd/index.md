---
title: ArgoCD
description: The reference GitOps controller for Kubernetes. Application CRDs, sync waves, the App-of-Apps pattern, ApplicationSets, sync policies, ignoreDifferences, and the footguns every team hits in its first month.
category: ops
tags: [argocd, gitops, kubernetes, deployment, cncf]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## What it is

[ArgoCD](https://argo-cd.readthedocs.io/) is a GitOps controller that runs inside your Kubernetes cluster and continuously reconciles the cluster against manifests in a Git repository. CNCF graduated project. Web UI, CLI, and a rich CRD API. If you're doing GitOps on Kubernetes and you're not on Flux, you're on ArgoCD.

Pair it with the [GitOps topic](../gitops/) for the philosophy; this page is about the tool.

## The core primitive: `Application`

ArgoCD's single most important CRD:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: home-health-api
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/acme/manifests.git
    path: apps/home-health-api/envs/prod
    targetRevision: main
  destination:
    server: https://kubernetes.default.svc
    namespace: home-health-prod
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
      - ServerSideApply=true
```

One `Application` = one deployable unit. ArgoCD reads the manifests at `path` in the repo, compares them to the live cluster, and either shows you the diff (manual sync) or applies it automatically (`automated: {}`).

Key fields:

- **`source`**, where the manifests live. Can be plain YAML, Kustomize, Helm, or Jsonnet.
- **`destination`**, where to apply them. Same cluster as ArgoCD (`kubernetes.default.svc`) or a registered remote cluster.
- **`syncPolicy.automated.prune`**, delete resources that are no longer in Git.
- **`syncPolicy.automated.selfHeal`**, revert live changes that drift from Git.
- **`syncOptions.ServerSideApply=true`**, use Kubernetes server-side apply, which handles field ownership better than the legacy client-side apply.

## How it actually works

Three loops running continuously:

```
┌────────────────────────┐
│  Git refresh           │   poll repo every 3 min (configurable)
│  ───────────────────   │   fetch manifests for every Application
└────────────────────────┘

┌────────────────────────┐
│  Compare               │   diff repo state vs live cluster state
│  ───────────────────   │   mark Applications as Synced / OutOfSync
└────────────────────────┘

┌────────────────────────┐
│  Sync                  │   if auto-sync on → apply the diff
│  ───────────────────   │   if manual → wait for user to click Sync
└────────────────────────┘
```

An Application has two axes of status:

- **Sync status**, does the live cluster match the repo? (`Synced` / `OutOfSync`)
- **Health status**, is the live resource healthy? (`Healthy` / `Progressing` / `Degraded` / `Missing`)

A `Deployment` rollout that's mid-flight is `Synced` and `Progressing`. A crashlooping pod is `Synced` and `Degraded`. A pending PVC is `OutOfSync` or `Healthy` depending on whether the PVC exists yet. Learn to read both columns together.

## Sync waves, ordered apply within an Application

Some resources have to exist before others. A `Namespace` before a `Deployment`. A `CRD` before an instance of that CRD. A `Secret` before a `Deployment` that mounts it.

ArgoCD sync waves handle this with an annotation:

```yaml
metadata:
  annotations:
    argocd.argoproj.io/sync-wave: "-1"   # applied first (most negative = earliest)
```

Default is `0`. Common pattern:

- `-2`, namespaces, CRDs
- `-1`, RBAC, service accounts, secrets
- `0`, workloads (Deployments, StatefulSets)
- `1`, services, ingresses
- `2`, external-facing cert/DNS resources

All resources in the same wave apply in parallel. The next wave starts only after the previous wave's resources are **healthy**. A failing health check stalls the sync, which is usually what you want.

## Sync hooks, imperative steps inside a declarative apply

For the cases where declarative isn't enough (DB migrations, one-time init), hooks let you run a Job at a specific point:

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: db-migrate
  annotations:
    argocd.argoproj.io/hook: PreSync
    argocd.argoproj.io/hook-delete-policy: HookSucceeded
```

Hook types:

- **`PreSync`**, runs before the main sync. DB migrations, schema changes.
- **`Sync`**, runs as part of the sync. Rarely useful.
- **`PostSync`**, runs after sync completes. Smoke tests, cache warmup.
- **`SyncFail`**, runs if sync fails. Rollback hooks, paging.

`hook-delete-policy` controls when the Job is cleaned up. `HookSucceeded` is almost always what you want.

## App of Apps, the bootstrapping pattern

Your first `Application` is a pain to create by hand. Your hundredth is impossible. App of Apps solves it:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: root-apps
spec:
  source:
    repoURL: https://github.com/acme/manifests.git
    path: bootstrap/apps
  destination:
    server: https://kubernetes.default.svc
    namespace: argocd
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

The `bootstrap/apps/` directory in the repo contains more `Application` YAMLs. Each of those Applications deploys an actual workload. You apply the root Application once, by hand. It applies all the children. Adding a new workload = `git add bootstrap/apps/new-thing.yaml`; no kubectl.

## ApplicationSet, generators for apps

App of Apps works but hand-writes each child Application. `ApplicationSet` generates them:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: per-env-api
spec:
  generators:
    - list:
        elements:
          - env: dev
            cluster: https://kubernetes.default.svc
          - env: staging
            cluster: https://kubernetes.default.svc
          - env: prod
            cluster: https://kubernetes.default.svc
  template:
    metadata:
      name: "api-{{env}}"
    spec:
      source:
        repoURL: https://github.com/acme/manifests.git
        path: "apps/api/envs/{{env}}"
        targetRevision: main
      destination:
        server: "{{cluster}}"
        namespace: "api-{{env}}"
      syncPolicy:
        automated:
          prune: true
```

Generators include `list`, `git` (directories or files), `cluster`, `matrix`, and `pullRequest`. The PR generator is magic for preview environments, it creates an Application for every open PR.

## Sync policies

Four axes to tune:

### `automated: {}`

If present, ArgoCD auto-syncs on every detected diff. If absent, you click Sync by hand.

### `prune`

When `true`, resources removed from the repo get deleted from the cluster. When `false`, removed resources linger (ArgoCD marks them `OutOfSync` but doesn't touch them). Turn on for most apps; be careful for resources with attached data (PVCs).

### `selfHeal`

When `true`, drift gets auto-reverted. Someone `kubectl edit`s your Deployment to change replicas? ArgoCD puts it back within ~3 minutes. Essential for preventing config drift; annoying during incident response.

### `syncOptions`

A grab-bag:

- **`CreateNamespace=true`**, create the destination namespace if missing.
- **`ServerSideApply=true`**, use server-side apply. Handles controllers that own fields (HPAs, Karpenter).
- **`ApplyOutOfSyncOnly=true`**, skip applying unchanged resources. Faster large syncs.
- **`Replace=true`**, use `kubectl replace` instead of apply. Dangerous, don't use without a reason.

## `ignoreDifferences`, telling ArgoCD to stop complaining

Some fields change after a resource is created, by other controllers:

- `spec.replicas` on a Deployment owned by an HPA.
- `metadata.annotations["deployment.kubernetes.io/revision"]`.
- `spec.finalizers` added by an operator.
- Keda ScaledObject replica bumps.

Without `ignoreDifferences`, ArgoCD sees a diff, tries to revert it, the HPA re-scales, ArgoCD re-reverts, ad infinitum. This is the single most common ArgoCD problem.

Fix:

```yaml
spec:
  ignoreDifferences:
    - group: apps
      kind: Deployment
      jsonPointers:
        - /spec/replicas
    - group: apps
      kind: Deployment
      jqPathExpressions:
        - '.spec.template.spec.containers[] | select(.name == "sidecar") | .image'
```

Use `jsonPointers` for simple fields and `jqPathExpressions` for complex array filtering. Commit each exclusion with a comment explaining *why*, future-you will delete it by mistake otherwise.

## Multi-cluster

ArgoCD can manage clusters other than the one it's running in. Register each cluster:

```bash
argocd cluster add <kubecontext> --name prod-us-east
```

Under the hood ArgoCD creates a Secret in the `argocd` namespace storing the kubeconfig. Applications target remote clusters by setting `destination.server` to the registered cluster URL. The control plane runs in one cluster; the apps run across many.

A common topology: one "mgmt" cluster runs ArgoCD, Flux, observability, and CI; application workloads run in per-environment clusters.

## `AppProject`, scoping and RBAC

Not every team should be able to deploy to every namespace. `AppProject` scopes:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: home-health
spec:
  sourceRepos:
    - https://github.com/acme/manifests.git
  destinations:
    - namespace: home-health-*
      server: https://kubernetes.default.svc
  clusterResourceWhitelist:
    - group: ""
      kind: Namespace
  namespaceResourceBlacklist:
    - group: ""
      kind: ResourceQuota
  roles:
    - name: developer
      policies:
        - p, proj:home-health:developer, applications, sync, home-health/*, allow
```

Team members get role assignments; each role has per-action policies. Projects are the answer to "how do I stop Team A from accidentally deleting Team B's Applications."

## Progressive delivery (via Argo Rollouts)

ArgoCD deploys; it doesn't roll out progressively. For canary / blue-green, pair with [Argo Rollouts](https://argoproj.github.io/argo-rollouts/):

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: api
spec:
  strategy:
    canary:
      steps:
        - setWeight: 10
        - pause: { duration: 5m }
        - setWeight: 50
        - pause: { duration: 10m }
        - setWeight: 100
  selector: { matchLabels: { app: api } }
  template: { ... }
```

Rollout replaces Deployment; ArgoCD manages the Rollout resource. Analysis templates can gate promotion on Prometheus queries, Datadog SLOs, or any metric source.

## Common footguns

- **`ignoreDifferences` on `data` fields of Secrets.** If a controller mutates a Secret's contents, ArgoCD can't tell by field path alone. Use a `jqPathExpression` or exclude the Secret from the Application entirely.
- **Default `automated: {}` without `prune: true`.** Silent drift, you delete a resource from the repo, it stays in the cluster, nothing yells.
- **CRD and CRD-instance in the same Application.** Race condition: the instance applies before the CRD is established. Split into two Applications with sync waves.
- **Large Helm charts with server-side apply disabled.** Field ownership conflicts everywhere. Turn on `ServerSideApply=true`.
- **`ApplyOutOfSyncOnly=true` with Helm.** Sometimes Helm values change in a way that affects many resources; this option can skip apparently-unchanged ones. Test carefully.
- **Sync hooks that don't terminate.** A migration Job that hangs will stall the sync forever. Set `activeDeadlineSeconds`.
- **RBAC on `argocd` namespace.** ArgoCD stores Application secrets there. Give it tight RBAC; many teams leave it wide open.
- **Image tag as `latest`.** Breaks GitOps's "the repo is the source of truth." Always pin.

## Debugging checklist

When an Application is unhappy:

1. **Look at the UI's diff tab.** It shows the exact resource-by-resource delta.
2. **Sync with `--dry-run`.** ArgoCD renders what it would apply without doing it.
3. **Check events.** `kubectl get events -n <namespace> --sort-by=.lastTimestamp`.
4. **Look for `ignoreDifferences` candidates.** If the diff is on a field owned by another controller, you need one.
5. **Check sync waves.** If the sync stalls halfway, the previous wave may not have reached Healthy.
6. **Refresh.** `argocd app get <app> --refresh` forces a re-pull of the Git state.

## References

- [ArgoCD documentation](https://argo-cd.readthedocs.io/)
- [Sync waves](https://argo-cd.readthedocs.io/en/stable/user-guide/sync-waves/)
- [Sync hooks](https://argo-cd.readthedocs.io/en/stable/user-guide/resource_hooks/)
- [ApplicationSets](https://argo-cd.readthedocs.io/en/stable/operator-manual/applicationset/)
- [Argo Rollouts](https://argoproj.github.io/argo-rollouts/), progressive delivery companion
- [`ignoreDifferences`](https://argo-cd.readthedocs.io/en/stable/user-guide/diffing/)

## Related topics

- [GitOps](../gitops/), the philosophy ArgoCD implements
- [MLOps](../mlops/), ArgoCD for model deployment
