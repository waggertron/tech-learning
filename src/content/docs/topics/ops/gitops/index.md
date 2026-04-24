---
title: GitOps
description: Git as the single source of truth for infrastructure, with a controller that continuously reconciles the live cluster against what the repo says. A set of four principles that change how infrastructure changes happen.
category: ops
tags: [gitops, kubernetes, deployment, infrastructure, reconciliation]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## The one-sentence definition

**GitOps is operational change management where Git is the only place you change anything, and an automated controller makes reality match what the repo says.**

Everything else, tooling, debates about push vs pull, specific controllers, follows from that.

## The four principles (OpenGitOps)

The [OpenGitOps Working Group](https://opengitops.dev/) formalized four principles in 2022. They're short enough to memorize:

1. **Declarative**, the system's desired state is expressed declaratively.
2. **Versioned and immutable**, the desired state is stored in a way that enforces versioning and retains complete version history (i.e., Git).
3. **Pulled automatically**, approved changes to the desired state are automatically applied to the system.
4. **Continuously reconciled**, software agents continuously ensure the actual state matches the desired state, and alert on drift.

If any one of the four is missing, it's not GitOps, just "Git plus deploys."

## Why this is different from "CI/CD that deploys"

Traditional CI/CD:

```
developer → git push → CI runs → CI pushes to cluster → done
```

GitOps:

```
developer → git push → repo state changes → controller notices
                                          → controller applies to cluster
                                          → controller watches for drift
                                          → controller reconciles drift
```

The difference looks cosmetic. It isn't. Three things change:

- **The cluster credentials live inside the cluster**, not in CI. CI never needs cluster admin.
- **Reality drift is an automatic error**, not a silent "someone did something weird at 2am." The controller logs it, fixes it (or alerts), and the git log still tells you what was *intended*.
- **Rollback is a revert commit**, not a job you have to re-run in a specific way.

## Push vs pull

Two implementation styles, both legitimate GitOps:

### Pull-based (most common)

A controller *inside* the cluster watches the Git repo, pulls changes, applies them:

```
┌─────────────┐         ┌──────────────────────┐
│ Git repo    │◄────────│ ArgoCD / Flux        │
│ (desired)   │  poll   │ (in-cluster)         │
└─────────────┘         └──────────────────────┘
                                 │ apply
                                 ▼
                        ┌──────────────────────┐
                        │ Kubernetes API       │
                        └──────────────────────┘
```

Credentials stay in the cluster. The repo doesn't need to know about the cluster. Reconciliation runs continuously. This is what ArgoCD and Flux default to.

### Push-based

CI runs `kubectl apply` or `helm upgrade` after a merge:

```
Git merge → CI job → kubectl apply → cluster
```

Simpler to set up. No in-cluster controller. But:

- Credentials live in CI. Every CI runner is an admin cluster credential.
- No drift detection. If someone `kubectl edit`s something manually, CI doesn't know.
- Rollback requires running CI against an older SHA, which assumes CI works at that SHA.

Push works fine for simple setups. Most production systems graduate to pull within a year.

## What goes in the repo

Not just YAML. The whole **desired state** of the system:

- Kubernetes manifests (Deployments, Services, ConfigMaps).
- Helm charts or Kustomize overlays.
- CRDs and their instances (ArgoCD Applications, ExternalSecrets, KEDA ScaledObjects, cert-manager Certificates).
- RBAC (Roles, RoleBindings, ServiceAccounts).
- Infrastructure-as-code for the things that *host* the cluster (Terraform), though this often lives in a separate repo with its own apply loop.

The two-repo pattern is common:

- **`infra/`**, Terraform for VPC, EKS, IAM, RDS, etc. Applied via Terraform Cloud or Atlantis.
- **`manifests/`**, Kubernetes manifests, applied by ArgoCD.

The boundary is "things that exist before you can deploy anything" (infra) vs "things you deploy all day" (manifests).

## Secrets, the hardest part

You can't commit secrets to Git. Three patterns solve it:

### Sealed Secrets (Bitnami)

Encrypt secrets with a cluster-held key before committing. Only the in-cluster controller can decrypt.

### External Secrets Operator (ESO)

Store secrets in AWS Secrets Manager / GCP Secret Manager / HashiCorp Vault. Commit a manifest that *references* the secret:

```yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: db-password
spec:
  secretStoreRef:
    name: aws-secrets
    kind: ClusterSecretStore
  target:
    name: db-password
  data:
    - secretKey: password
      remoteRef:
        key: prod/postgres
        property: password
```

The controller fetches the actual secret and materializes it as a `Secret` object. The repo only has the pointer. This is the most common production pattern.

### SOPS (Mozilla)

Encrypt files in-place with age, GPG, or a KMS key. Git sees ciphertext; the controller decrypts on apply.

Pick one. Don't mix them.

## Environment promotion

The biggest operational question GitOps forces: how does a change move from dev → staging → prod?

Three popular patterns:

### 1. Directory per environment

```
manifests/
├── base/
├── envs/
│   ├── dev/
│   ├── staging/
│   └── prod/
```

Each environment has an overlay (Kustomize or Helm values). Promoting a change means updating the env-specific file.

### 2. Image tag as the variable

A CI step updates the image tag in the dev overlay after a build:

```yaml
# envs/dev/kustomization.yaml
images:
  - name: myapp
    newTag: sha-abc1234
```

Promotion to staging is a commit that bumps `envs/staging/kustomization.yaml` to the same tag. Prod is a separate, usually manual, commit.

### 3. Trunk per environment

Separate branches (`env/dev`, `env/prod`) each track their own tip. Cherry-pick or merge to promote. Less popular now, branches drift; dir-per-env is clearer.

## Drift detection, the underrated feature

GitOps controllers don't just apply on change. They **continuously reconcile**. If someone `kubectl scale deployment foo --replicas=10` by hand:

- ArgoCD will show the Application as `OutOfSync`.
- Depending on sync policy, it'll either auto-revert the change or page you.
- The fix is either to commit the change or to revert to the repo state.

This is the feature that turns GitOps from "automated deploys" into "continuously enforced reality." Drift isn't an oops someone discovers in a post-mortem; it's a diff the controller flagged at 14:02.

## Where GitOps doesn't fit (as well)

- **Data migrations.** Schemas evolve with data. Committing "drop this column" as a manifest is fine; executing it safely is a different problem. Most teams keep migrations in their app's deploy pipeline, not in the GitOps repo.
- **Stateful certbot-style renewals.** Things that change themselves. GitOps wants the repo to be the source of truth; self-rotating resources fight that. Solution: the controller (cert-manager, ESO) is the source of truth for the rotating value; the repo only declares the *policy*.
- **Imperative cluster operations.** "Restart this pod." "Cordon this node." These are operational, not intent. You still `kubectl` them; the GitOps controller just won't fight you for transient operations.

## Getting started, minimally

1. Pick a cluster you can break. Even a kind cluster works.
2. Install ArgoCD (`kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml`).
3. Create a Git repo with one `Deployment` and one `Service`.
4. Create one `Application` CRD pointing at the repo.
5. Watch ArgoCD apply it.
6. `kubectl delete deployment/foo`. Watch ArgoCD put it back within ~3 minutes.

That's the entire teaching loop. Everything after, App of Apps, ApplicationSets, progressive delivery, is variations on the same idea.

## Tooling landscape

| Tool | Focus | Notes |
| --- | --- | --- |
| [ArgoCD](https://argo-cd.readthedocs.io/) | Kubernetes | Largest user base, UI-first, Application CRDs |
| [Flux](https://fluxcd.io/) | Kubernetes | CNCF graduated, Kustomize-native, no UI by default |
| [Jenkins X](https://jenkins-x.io/) | Kubernetes + pipelines | Full lifecycle, less popular than pre-2022 |
| [Weave GitOps](https://docs.gitops.weaveworks.org/) | Kubernetes | Flux-based, commercial distribution available |
| [Atlantis](https://www.runatlantis.io/) | Terraform | PR-based workflow for Terraform, the GitOps pattern applied to IaC |
| [Crossplane](https://www.crossplane.io/) | Multi-cloud control plane | Manages cloud resources as Kubernetes CRDs |

## What changes culturally

Teams that adopt GitOps notice:

- **PR review becomes production review.** Once `main` is reality, reviewers stop waving changes through.
- **"Who deployed that?"** stops being a question. `git log` is the deploy log.
- **Emergency fixes** go from "ssh in and patch" to "open a PR, get it reviewed in 3 minutes, merge." This feels slow the first time and fast thereafter.
- **Drift** becomes a first-class concept. Engineers learn to look at the ArgoCD dashboard the way they used to look at CloudWatch.

## Gotchas

- **Sync loops.** A controller applies something that causes the cluster to update itself (labels, status fields). The next reconcile sees drift. Fix: `ignoreDifferences` on the noisy fields. Symptom: ArgoCD oscillating between Synced and OutOfSync.
- **CRD ordering.** You can't create an `Application` that references a `AppProject` that doesn't exist yet. Solution: sync waves (ArgoCD) or Kustomize ordering.
- **Manual hotfixes.** Someone patches prod by hand during an incident. The controller reverts it. Either disable auto-sync during incidents, or commit the hotfix immediately and come back to clean up.
- **Large repos.** Monolithic manifest repos slow down ArgoCD. Break into per-app or per-team repos once you pass ~1000 manifests.
- **PR-based approvals for deploys.** GitOps gives you deploy approvals for free via PR review, but it also means every config tweak needs PR review. Tune the approval rules by path so trivial changes don't require VP sign-off.

## References

- [OpenGitOps principles](https://opengitops.dev/), the canonical four-principle definition
- [ArgoCD docs](https://argo-cd.readthedocs.io/)
- [Flux docs](https://fluxcd.io/flux/)
- [Kelsey Hightower, "GitOps"](https://www.cncf.io/blog/2022/06/22/gitops-101-a-primer/), CNCF primer
- [Weaveworks, "Guide to GitOps"](https://www.weave.works/technologies/gitops/), the team that coined the term

## Related topics

- [ArgoCD](../argocd/), the reference controller
- [MLOps](../mlops/), GitOps patterns applied to ML systems
- [Django Part 10, Production](../../web/django/part-10-production/), deployment patterns that compose with GitOps
