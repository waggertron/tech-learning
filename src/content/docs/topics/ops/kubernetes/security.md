---
title: Kubernetes Security Hardening
description: "Pod Security Standards, admission controllers, RBAC lockdown, secret management patterns, image supply chain verification, and audit logging for production clusters."
parent: kubernetes
tags: [kubernetes, security, rbac, pod-security, admission-controllers]
status: draft
created: 2026-05-14
updated: 2026-05-14
---

## The attack surface

A Kubernetes cluster has more attack surface than a single server. The control plane API is a privileged management interface for all workloads. A misconfiguration that grants write access to the API effectively owns every pod in the cluster.

The main categories:

- **Container escape**: a compromised process breaks out of its container namespace onto the host.
- **Pod escalation**: a pod with an overly permissive ServiceAccount calls the API to create privileged pods.
- **Secret exposure**: credentials in environment variables, ConfigMaps, or application logs.
- **Supply chain**: a malicious or vulnerable image runs in production.
- **Lateral movement**: a compromised pod reaches other pods or services it shouldn't.

Hardening is layered. No single control covers all categories.

## Pod Security Standards

Pod Security Standards (PSS) replace the deprecated PodSecurityPolicy (removed in Kubernetes 1.25). Three levels:

| Level | What it allows | When to use |
| --- | --- | --- |
| `privileged` | No restrictions | Node-level agents (CNI plugins, storage drivers) |
| `baseline` | Blocks host namespaces, privileged containers, hostPath | Broad app compatibility |
| `restricted` | Adds non-root requirement, seccomp, dropped capabilities | All application workloads |

Enforce via namespace labels:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/warn: restricted
    pod-security.kubernetes.io/audit: restricted
```

Three modes per level:

- **`enforce`**: rejects pods that violate the standard.
- **`warn`**: allows the pod but emits a warning. Good for gradual migration.
- **`audit`**: allows and logs. No user-visible warning.

To meet `restricted`, pods need this security context:

```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  seccompProfile:
    type: RuntimeDefault
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true
  capabilities:
    drop: [ALL]
```

## Admission controllers

Admission controllers run when any API request arrives. They can reject or mutate objects before they're stored in etcd.

Built-in controllers worth knowing:

- **`NodeRestriction`**: limits what kubelets can write to the API. Prevents node-level compromises from escalating.
- **`ResourceQuota`**: enforces namespace-level resource ceilings.
- **`LimitRange`**: applies default resource requests/limits to pods that don't set them, preventing unbounded consumption.

Policy engines run as external webhooks via `ValidatingAdmissionWebhook` and `MutatingAdmissionWebhook`.

### Kyverno

Kyverno uses Kubernetes-native YAML policies. No Rego required:

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: require-non-root
spec:
  rules:
    - name: check-non-root
      match:
        resources:
          kinds: [Pod]
      validate:
        message: "Containers must run as non-root."
        pattern:
          spec:
            containers:
              - (securityContext):
                  runAsNonRoot: true
```

Kyverno can also generate objects (create a NetworkPolicy whenever a Namespace is created) and mutate (inject a label onto every Pod). Lower learning curve than OPA for most teams.

### OPA / Gatekeeper

Open Policy Agent with the Gatekeeper controller. Policies are written in Rego as `ConstraintTemplate` objects. More expressive for complex cross-object policies. Example: block images not from an approved registry:

```yaml
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: AllowedRepos
metadata:
  name: allowed-repos
spec:
  match:
    kinds:
      - apiGroups: [""]
        kinds: [Pod]
  parameters:
    repos:
      - "ghcr.io/myorg/"
      - "gcr.io/distroless/"
```

Pick Kyverno for simpler policy authoring and built-in mutation/generation. Pick Gatekeeper if you already have OPA expertise or need complex multi-object Rego policies.

## RBAC hardening

The `default` ServiceAccount in every namespace has no cluster permissions by default, but `cluster-admin` ClusterRoleBindings accumulate over time, especially from quick tool installs (`helm install`, `kubectl apply -f` from docs that ask for too much).

Audit current cluster-admin bindings:

```bash
kubectl get clusterrolebindings -o json | \
  jq '.items[] | select(.roleRef.name=="cluster-admin") | .subjects'
```

Rules to enforce:

- **Explicit ServiceAccount per workload**: no pod should use the `default` ServiceAccount for anything that calls the Kubernetes API.
- **Namespace-scoped Roles over ClusterRoles**: give the minimum verb set for the minimum scope.
- **No `*` verbs in production**: wildcards make it impossible to audit what a role can actually do.
- **Rotate tokens**: use bound ServiceAccount tokens (time-limited, pod-bound) via projected volumes instead of auto-mounted long-lived secrets.

Bound token, replacing the auto-mounted secret:

```yaml
volumes:
  - name: token
    projected:
      sources:
        - serviceAccountToken:
            path: token
            expirationSeconds: 3600
            audience: api
```

Disable auto-mounting cluster-wide on the ServiceAccount itself:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: api
  namespace: production
automountServiceAccountToken: false
```

## Secret management

Kubernetes Secrets are base64-encoded by default, not encrypted. Anyone who can `kubectl get secret` gets the value in plaintext. Harden in layers:

**Layer 1: Encrypt etcd at rest.** Configure `--encryption-provider-config` on the API server. Protects against etcd backup theft.

**Layer 2: Restrict Secret read access via RBAC.** `get` and `list` on Secrets is a high-value permission. Most pods need only the specific secrets they mount, not the ability to list all Secrets in a namespace.

**Layer 3: Use an external secrets manager.** Pull secrets from AWS Secrets Manager, HashiCorp Vault, or GCP Secret Manager at runtime:

- **External Secrets Operator (ESO)**: a controller that syncs external secrets into Kubernetes Secret objects. Pods use the Secret normally; ESO handles rotation. The Kubernetes Secret is a cache, not the source of truth.
- **Vault Agent Injector**: mutates pods to inject a sidecar that authenticates to Vault and writes secrets to a shared in-memory volume. The secret is never persisted as a Kubernetes object.

**Layer 4: Sealed Secrets (Bitnami).** Encrypts secrets for storage in Git. The in-cluster controller holds the private key and decrypts at apply time. Fits a GitOps workflow where you want secrets in the repo.

See [Tokens, Keys, Secrets, and Environment Variables](../secrets-keys-tokens/) for the broader context on credential types.

## Image supply chain

A vulnerability in a base image can affect thousands of containers. Steps to reduce risk:

- **Minimal base images**: `distroless`, `alpine`, or `-slim` variants. Fewer packages means fewer CVEs and smaller attack surface.
- **Pin to digest, not tag**: `nginx@sha256:abc123...` is immutable. `nginx:latest` is not. Pin in production.
- **Scan images in CI**: Trivy and Grype catch CVEs before images reach a registry. Block on critical findings.
- **Enforce allowed registries**: via Kyverno or Gatekeeper policy. Reject images from uncontrolled sources.
- **Sign and verify**: Cosign (part of Sigstore) signs images at build time. An admission controller verifies the signature before the image runs.

```bash
# sign at build time (in CI)
cosign sign --key cosign.key ghcr.io/myorg/api@sha256:abc123

# verify (in admission webhook or locally)
cosign verify --key cosign.pub ghcr.io/myorg/api@sha256:abc123
```

## Network segmentation

Default-deny all ingress and egress for a namespace, then add explicit allowlists:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny
  namespace: production
spec:
  podSelector: {}
  policyTypes: [Ingress, Egress]
```

Per-workload allow policies go on top of this baseline. See [Kubernetes Networking](./networking/) for the full NetworkPolicy syntax and CNI enforcement details.

## Audit logging

The API server logs every API call when configured with `--audit-policy-file`. This is the forensic record for incident response.

A minimal policy:

```yaml
apiVersion: audit.k8s.io/v1
kind: Policy
rules:
  - level: RequestResponse
    resources:
      - group: ""
        resources: [secrets]
    verbs: [get, list, watch]
  - level: Request
    verbs: [create, update, patch, delete]
    resources:
      - group: ""
        resources: [pods, configmaps]
  - level: None
    users: [system:kube-proxy]
    verbs: [watch]
    resources:
      - group: ""
        resources: [endpoints, services]
  - level: Metadata
    omitStages: [RequestReceived]
```

Levels: `None` (drop), `Metadata` (headers only), `Request` (include body), `RequestResponse` (include body and response). Full `RequestResponse` for everything is expensive. Be selective; Secrets reads warrant it.

## CIS Kubernetes Benchmark

The Center for Internet Security publishes scored checks for every Kubernetes component. Run `kube-bench` to audit a cluster against these checks:

```bash
kubectl apply -f https://raw.githubusercontent.com/aquasecurity/kube-bench/main/job.yaml
kubectl logs job/kube-bench
```

It checks etcd encryption, API server flags, kubelet configuration, RBAC, and more. The output is a prioritized list of failures. Aim for zero high-severity findings before calling a cluster production-ready.

## References

- [Kubernetes security documentation](https://kubernetes.io/docs/concepts/security/)
- [Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/)
- [Kyverno](https://kyverno.io/)
- [OPA Gatekeeper](https://open-policy-agent.github.io/gatekeeper/)
- [External Secrets Operator](https://external-secrets.io/)
- [Sigstore / Cosign](https://sigstore.dev/)
- [kube-bench](https://github.com/aquasecurity/kube-bench)
- [CIS Kubernetes Benchmark](https://www.cisecurity.org/benchmark/kubernetes)

## Related topics

- [Kubernetes](./), the parent topic
- [Kubernetes Networking](./networking/), NetworkPolicy as a security boundary
- [Tokens, Keys, Secrets, and Environment Variables](../secrets-keys-tokens/), credential types and where they belong
- [GitOps](../gitops/), keeping security configurations in version control
