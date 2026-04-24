---
title: Helm
description: The package manager for Kubernetes. Charts, values, templates, releases, repositories, and the patterns (values layering, library charts, the ConfigMap-hash trick) that keep a Helm-driven deployment sane across 10 environments and 4 charts.
category: ops
tags: [helm, kubernetes, templating, packaging, deployment]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## What Helm is

**Helm is a package manager for Kubernetes.** A "chart" is a parameterized bundle of Kubernetes manifests. You install a chart with a set of values; Helm renders the templates into concrete YAML and applies it to the cluster. You get:

- Reusable, versioned packages.
- A single command to deploy complex apps (`helm install`).
- Upgrade and rollback semantics with revision history.
- Dependency composition (charts that depend on other charts).

CNCF graduated project. On v3.x since 2019 (v3 dropped Tiller, the server-side component of v2 that caused every security problem Helm ever had). Pair with the [Kubernetes topic](../kubernetes/) for what Helm is installing *onto*.

## Anatomy of a chart

```
mychart/
├── Chart.yaml              # metadata: name, version, dependencies
├── values.yaml             # default values
├── values.schema.json      # (optional) JSON Schema for values
├── charts/                 # subcharts / dependencies (vendored or downloaded)
├── templates/              # Go templates rendered into manifests
│   ├── _helpers.tpl        # partial templates / helper functions
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── configmap.yaml
│   ├── ingress.yaml
│   ├── NOTES.txt           # shown after install/upgrade
│   └── tests/              # helm test targets
├── crds/                   # CRDs installed before any templates
└── README.md
```

### `Chart.yaml`

```yaml
apiVersion: v2
name: home-health-api
description: Django API for the home-health platform
type: application
version: 1.2.3            # chart version (semver)
appVersion: "2.0.1"       # app version, informational

dependencies:
  - name: postgresql
    version: "12.x.x"
    repository: https://charts.bitnami.com/bitnami
    condition: postgresql.enabled
```

**`version`** is the chart version (bumped when you change templates). **`appVersion`** is the thing being deployed (your app's git tag). They move independently.

### `values.yaml`

```yaml
replicaCount: 3
image:
  repository: acme/home-health-api
  tag: ""                  # defaults to .Chart.AppVersion if empty
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80
  targetPort: 8000

resources:
  requests:
    cpu: 100m
    memory: 256Mi
  limits:
    memory: 512Mi

ingress:
  enabled: false
  className: nginx
  hosts:
    - host: api.example.com
      paths:
        - path: /
          pathType: Prefix

postgresql:
  enabled: true
  auth:
    database: home_health
```

Values are the contract between the chart author and the chart user. Name them carefully, changing a values key is a breaking change.

### `templates/`

Go templates with [Sprig](https://masterminds.github.io/sprig/) function extensions. Each `.yaml` in here renders into a manifest at install time:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "mychart.fullname" . }}
  labels:
    {{- include "mychart.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      {{- include "mychart.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels:
        {{- include "mychart.selectorLabels" . | nindent 8 }}
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - name: http
              containerPort: {{ .Values.service.targetPort }}
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
```

The template language is the single biggest learning curve in Helm. It's Go templates, which are *ugly* compared to Jinja2 or Liquid. Live with it.

### `_helpers.tpl`

Partial templates, named by `define`:

```go
{{- define "mychart.fullname" -}}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "mychart.labels" -}}
helm.sh/chart: {{ printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
app.kubernetes.io/name: {{ .Chart.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
{{- end }}
```

Call them from `.yaml` templates with `{{ include "mychart.labels" . }}`. Keep naming and labeling logic here; don't repeat it in every manifest.

## The release lifecycle

```
helm install   → create a new release
helm upgrade   → apply changes to an existing release
helm rollback  → revert to a previous revision
helm uninstall → delete the release and all its resources
```

Each install or upgrade creates a **revision**. Helm stores the rendered manifest and values for every revision in a Secret (by default) in the release's namespace. This is what makes rollback instant, no re-render, no re-fetch.

```bash
helm install home-health ./mychart --namespace home-health --create-namespace
helm upgrade home-health ./mychart --set image.tag=v2.1.0
helm rollback home-health 3    # back to revision 3
helm history home-health       # all revisions with timestamps
helm uninstall home-health
```

## Values layering, the multi-env workflow

For a service deployed to dev / staging / prod, don't copy-paste. Layer values files:

```
deploy/home-health/
├── values.yaml           # shared defaults
├── values-dev.yaml       # dev overrides
├── values-staging.yaml   # staging overrides
└── values-prod.yaml      # prod overrides
```

```bash
helm upgrade --install home-health ./chart \
  -f deploy/home-health/values.yaml \
  -f deploy/home-health/values-prod.yaml \
  --namespace home-health
```

**Precedence (later wins):**

1. `values.yaml` inside the chart itself.
2. Each `-f values-file.yaml` in the order given.
3. `--set key=value` on the command line.
4. `--set-file key=@path` for loading a file as a value.

Lint the composition:

```bash
helm template home-health ./chart -f values.yaml -f values-prod.yaml > rendered.yaml
# inspect rendered.yaml; verify the output is what you expect
```

`helm template` is a powerful debugging tool. Render locally, diff, commit the diff in your PR. You catch misconfigurations before they become events in a cluster.

## Dependencies and subcharts

Your chart can depend on other charts:

```yaml
# Chart.yaml
dependencies:
  - name: postgresql
    version: "12.x.x"
    repository: https://charts.bitnami.com/bitnami
    condition: postgresql.enabled
    alias: db
```

```bash
helm dependency update   # fetches dependencies into charts/
helm dependency build    # builds from Chart.lock
```

Dependency values live under a top-level key named after the dependency (or `alias`):

```yaml
# values.yaml
postgresql:
  enabled: true
  auth:
    database: home_health
```

**Umbrella chart**, your chart's only job is to wire together dependencies. `templates/` is nearly empty.

**Library chart**, a chart of only helpers (no resources). `type: library` in `Chart.yaml`. Other charts depend on it to share `_helpers.tpl`-style partials. Useful when you have 10 service charts that all need the same labels, probes, and image-pull config.

## The ConfigMap hash pattern, how to roll Pods on config changes

A ConfigMap change alone does not roll Deployments. Pods continue using the old config until they restart. Common Helm idiom:

```yaml
apiVersion: apps/v1
kind: Deployment
# ...
spec:
  template:
    metadata:
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
```

When the ConfigMap renders differently, the sha changes, the Pod template hash changes, Kubernetes rolls the Deployment. No external controller required.

Same pattern for Secrets (though be aware this puts secret contents through sha256sum; for sensitive values, use a version string instead).

## Hooks

Lifecycle hooks let you run Kubernetes resources at specific points:

```yaml
metadata:
  annotations:
    "helm.sh/hook": pre-install,pre-upgrade
    "helm.sh/hook-weight": "-5"
    "helm.sh/hook-delete-policy": hook-succeeded
```

**Hook types:**

- `pre-install`, `post-install`
- `pre-upgrade`, `post-upgrade`
- `pre-delete`, `post-delete`
- `pre-rollback`, `post-rollback`
- `test`, `helm test <release>` runs only these

Use for database migrations, one-time schema jobs, validation runs. Hooks run outside the normal sync so they don't show up in `helm list` resources.

## Tests

A `templates/tests/*.yaml` with the `helm.sh/hook: test` annotation:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: "{{ .Release.Name }}-connection-test"
  annotations:
    "helm.sh/hook": test
spec:
  containers:
    - name: test
      image: curlimages/curl
      command: ["curl", "-f", "http://{{ include "mychart.fullname" . }}:{{ .Values.service.port }}/healthz"]
  restartPolicy: Never
```

Run after install: `helm test home-health`. Good for smoke tests; won't catch much beyond that.

## Repositories

**Traditional HTTP repository:**

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm install my-pg bitnami/postgresql
```

**OCI registries** (the modern default):

```bash
helm push mychart-1.2.3.tgz oci://ghcr.io/acme/charts
helm pull oci://ghcr.io/acme/charts/mychart --version 1.2.3
helm install my-app oci://ghcr.io/acme/charts/mychart --version 1.2.3
```

OCI charts live alongside container images in the same registry, one credential, one auth story. Since Helm 3.8 (2022), this is the recommended distribution method.

## Alternatives and when to pick them

| Tool | Strengths | When to pick |
| --- | --- | --- |
| **Helm** | Mature, huge chart ecosystem, dependency composition, revisions | Distributing software; complex configs with many knobs |
| **Kustomize** | No templates, patches; built into kubectl | Smallish in-house apps; base + overlay pattern |
| **Jsonnet / Tanka** | Real programming language | Heavy config generation; shared libraries across teams |
| **Timoni** | CUE-based, type-checked | Schema-first workflows; teams that want guardrails |
| **Pulumi / CDK8s** | Write manifests in TypeScript/Go/Python | You already write IaC in a general-purpose language |
| **Plain YAML** | Zero complexity | Tiny deployments where templating isn't earning its keep |

Most production stacks pick Helm for third-party apps and Kustomize for their own. Both can be applied by ArgoCD.

## Common footguns

- **Template whitespace.** Go templates render literal newlines; YAML is sensitive. Use `{{- ... -}}` and `nindent` religiously, or your output has blank lines or trailing garbage.
- **The `.` reassignment.** Inside a `range`, `.` changes. Save the outer scope at the top (`{{ $ := . }}`) or use `$` directly.
- **Secrets in values.** `helm install --set password=...` persists in the release Secret. Not ideal. Use external secret management.
- **`helm install` vs `helm upgrade --install`.** The latter is idempotent; use it in CI. The former fails if the release already exists.
- **Breaking values changes without a `version` bump.** Consumers upgrade and suddenly their values don't work. Bump `version` (the chart version) on every breaking change; document migration.
- **Missing the `values.schema.json`.** Users pass wrong types, Helm renders nonsense, and you find out at `kubectl apply` time. Schemas catch misuse at `helm template`.
- **Overly clever helper functions.** Helm template debugging is hard. `helm template --debug` is your friend. Keep helpers simple and well-tested.
- **Subcharts that override each other's values.** Two dependencies each define a key named `service`, whichever loads last wins. Use aliases (`alias: db`) to namespace.
- **`helm upgrade` on a chart with schema changes to CRDs.** Helm won't update CRDs from `crds/` after initial install. Manually apply CRD updates before upgrading.
- **Rollback of a deletion.** `helm rollback` can't recover a resource the chart no longer defines. Roll *forward* to a fixed version.

## Debugging

```bash
helm template <release> <chart> -f values.yaml --debug    # render and show
helm install <release> <chart> --dry-run --debug          # render + validate
helm lint <chart>                                         # syntactic + schema checks
helm get values <release>                                 # values used on current revision
helm get manifest <release>                               # final rendered YAML
helm history <release>                                    # revision history
```

`helm get manifest | kubectl diff -f -` shows the real diff between cluster and release.

## Operational patterns worth stealing

- **One values file per environment, layered on top of shared defaults.** The foundation of sane multi-env.
- **Library charts for labels, probes, image-pull config.** Write the boilerplate once.
- **CRDs in `crds/`, not `templates/`.** They install before templates and aren't touched by upgrades.
- **`values.schema.json`** on every chart you publish. Schema is documentation that tools enforce.
- **Commit `Chart.lock`.** Pin subchart versions for reproducibility.
- **`helm template` in CI.** Render and diff on every PR so reviewers see the resulting manifests.
- **`helm-secrets` or equivalent** for encrypted values-file sections, so you can commit production configuration without leaking secrets.

## References

- [Helm documentation](https://helm.sh/docs/)
- [Chart best practices](https://helm.sh/docs/chart_best_practices/)
- [Template function list (Go + Sprig)](https://helm.sh/docs/chart_template_guide/function_list/)
- [Artifact Hub](https://artifacthub.io/), the canonical public chart registry
- [Bitnami charts](https://github.com/bitnami/charts), large collection of production-ready dependency charts
- [helm-secrets](https://github.com/jkroepke/helm-secrets), SOPS-backed encrypted values
- [Timoni](https://timoni.sh/), the CUE-based alternative
- [Kustomize](https://kustomize.io/), the template-free alternative

## Related topics

- [Kubernetes](../kubernetes/), the substrate Helm deploys to
- [ArgoCD](../argocd/), applies Helm charts in a GitOps loop
- [GitOps](../gitops/), the deployment philosophy Helm plugs into
- [Terraform](../terraform/), provisions the cluster Helm runs on
