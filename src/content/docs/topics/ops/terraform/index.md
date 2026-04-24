---
title: Terraform
description: Infrastructure as code. Providers, resources, state, modules, workspaces, and the operational patterns — remote state with locking, per-environment isolation, module composition, drift detection — that make Terraform survive contact with a real team.
category: ops
tags: [terraform, iac, infrastructure, opentofu, cloud]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## What Terraform is

**Terraform is declarative infrastructure-as-code.** You write HCL (HashiCorp Configuration Language) describing cloud resources you want; Terraform figures out what's already there, computes a plan, and applies the difference.

- Written in Go, originally by HashiCorp, open-sourced in 2014.
- Supports hundreds of providers — AWS, GCP, Azure, Kubernetes, GitHub, PagerDuty, Datadog, Cloudflare, essentially any API worth talking to.
- **License changed in 2023** from MPL 2.0 to BUSL 1.1. The community forked to [OpenTofu](https://opentofu.org/) (Linux Foundation, MPL 2.0). For most teams the two are interchangeable today; OpenTofu is the long-term safe choice if licensing matters.

This page uses "Terraform" throughout; every pattern applies to OpenTofu.

## The mental model

```
┌─────────────┐     plan      ┌─────────────┐     apply    ┌─────────────┐
│ HCL config  │──────────────►│ Plan (diff) │─────────────►│ Cloud APIs  │
│ (desired)   │               │             │              │ (reality)   │
└─────────────┘               └─────────────┘              └─────────────┘
       ▲                                                          │
       │                                                          │
       │                        state file                        │
       └──────────────────── (what Terraform thinks exists) ◄─────┘
```

The **state file** is what distinguishes Terraform from `kubectl apply`. It's Terraform's record of every resource it manages, mapping HCL addresses to cloud resource IDs. Without it, Terraform can't tell what it created from what already existed.

## The anatomy of a Terraform project

```
infra/
├── main.tf              # resources + data sources
├── variables.tf         # inputs
├── outputs.tf           # outputs
├── versions.tf          # terraform + provider version pinning
├── backend.tf           # where state lives
├── providers.tf         # provider configuration
├── terraform.tfvars     # variable values (often env-specific)
└── modules/
    └── vpc/
        ├── main.tf
        ├── variables.tf
        └── outputs.tf
```

File names aren't special; Terraform reads every `*.tf` in the directory. The split is convention — keeps code readable.

### `versions.tf` — pin everything

```hcl
terraform {
  required_version = "~> 1.7"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.40"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.25"
    }
  }
}
```

Floating versions cause silent regressions. Pin to a minor; let patches flow.

### `backend.tf` — remote state

```hcl
terraform {
  backend "s3" {
    bucket         = "acme-terraform-state"
    key            = "infra/prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
```

This tells Terraform to store state in S3 with DynamoDB-based locking. **Never** check state files into Git. They contain resource IDs and sometimes secrets.

## Core concepts

### Resources

```hcl
resource "aws_s3_bucket" "logs" {
  bucket = "acme-logs-prod"

  tags = {
    Environment = "prod"
    ManagedBy   = "terraform"
  }
}
```

- **`resource`** keyword, resource type, local name.
- Terraform manages this resource's lifecycle — creates, updates, destroys.
- Referenced elsewhere as `aws_s3_bucket.logs.arn`.

### Data sources

```hcl
data "aws_availability_zones" "available" {
  state = "available"
}
```

- Read-only lookup. Terraform doesn't manage these; it just reads them.
- Used for "find the VPC ID of the network someone else provisioned."

### Variables

```hcl
variable "environment" {
  type        = string
  description = "Deployment environment"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "environment must be dev, staging, or prod."
  }
}

variable "instance_count" {
  type    = number
  default = 3
}
```

Referenced as `var.environment`. Values come from (in order):

1. CLI: `-var="environment=prod"`
2. `-var-file="prod.tfvars"`
3. `TF_VAR_environment` env vars
4. `terraform.tfvars` or `*.auto.tfvars` files
5. Defaults in the `variable` block

### Outputs

```hcl
output "vpc_id" {
  value       = aws_vpc.main.id
  description = "The VPC ID for downstream modules"
}

output "db_password" {
  value     = aws_db_instance.main.password
  sensitive = true    # masks in CLI output
}
```

Outputs are how modules communicate with callers, and how other Terraform configurations consume this one's state via `terraform_remote_state`.

### Locals

```hcl
locals {
  common_tags = {
    Environment = var.environment
    Team        = "platform"
    ManagedBy   = "terraform"
  }
  name_prefix = "${var.environment}-acme"
}
```

Reusable expressions. Don't overuse — too many locals obscure what's happening.

## Modules

A module is a reusable directory of resources. The root module is what you `cd` into and `terraform apply`.

```hcl
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  version = "5.7.0"

  name = "home-health-prod"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true

  tags = local.common_tags
}
```

Module sources:

- Registry: `terraform-aws-modules/vpc/aws` (most common).
- Git: `git::https://github.com/acme/tf-modules.git//vpc?ref=v1.2.0`.
- Local path: `source = "../modules/vpc"`.
- S3 / GCS archives.

**Pin module versions.** Module authors ship breaking changes without a migration path more often than they should.

### Your own modules

Structure:

```
modules/
└── rds-cluster/
    ├── main.tf           # resources
    ├── variables.tf      # inputs
    ├── outputs.tf        # outputs
    ├── versions.tf       # provider requirements
    └── README.md
```

Good module rules:

- **One responsibility.** A "vpc" module, an "rds" module — not a "whole-environment" module.
- **Accept variables, emit outputs.** No hidden side effects.
- **Validate inputs.** Use `validation` blocks; fail fast.
- **Document required provider versions** in `versions.tf`.
- **Don't hard-code names.** Take a `name_prefix` or similar and template.

## `count` and `for_each`

Two ways to create multiple of the same resource.

### `count` — indexed list

```hcl
resource "aws_instance" "worker" {
  count = var.worker_count
  ami   = "ami-abc123"
  # ...
}

# reference: aws_instance.worker[0], aws_instance.worker[1], ...
```

**Problem:** if you remove an element from the middle of a list, every subsequent resource's index shifts, and Terraform destroys/recreates them all. Catastrophic for persistent resources.

### `for_each` — keyed map (usually better)

```hcl
resource "aws_iam_user" "team" {
  for_each = toset(["alice", "bob", "carol"])
  name     = each.value
}

# reference: aws_iam_user.team["alice"]
```

Adding or removing a key only affects that one resource. **Prefer `for_each` over `count`** unless you have a specific reason. The tf-aws-modules community moved to `for_each` as the default years ago.

## State management

### Where to keep it

| Backend | Use for |
| --- | --- |
| Local (`./terraform.tfstate`) | Experiments; single-user projects |
| S3 + DynamoDB | The most common production backend |
| GCS + object versioning | GCP-native equivalent |
| Azure Blob Storage | Azure-native |
| Terraform Cloud / HCP Terraform | Managed, UI, RBAC, policy-as-code |
| Spacelift / Env0 / Scalr | Competing managed offerings |

### State locking

Critical: when two engineers run `terraform apply` at the same time, without locking, they corrupt the state file. Every serious backend provides locking:

- S3 backend uses a DynamoDB table (`LockID` primary key).
- GCS backend uses GCS object versioning + Cloud Build's lock system.
- Terraform Cloud uses internal locks.

If you see `Error: state locked`, check who's running Terraform before forcing the unlock. `terraform force-unlock <lock-id>` — only if you're sure the holding process crashed.

### Sensitive data in state

State contains *everything* — passwords set via `random_password`, RDS credentials, private keys. Even `sensitive = true` outputs are plain in the state file.

- Encrypt at rest (S3 server-side, GCS default encryption).
- Restrict IAM access tightly.
- Don't print state in CI logs.
- Never commit.

### State operations

```bash
terraform state list                       # all managed resources
terraform state show aws_vpc.main          # details of one
terraform state mv aws_s3.old aws_s3.new   # rename in state
terraform state rm aws_s3.legacy           # stop managing (doesn't delete)
terraform import aws_s3.existing acme-bucket  # start managing an existing resource
```

`state mv` and `state rm` are scalpels. They change Terraform's view of the world without touching the cloud. Use carefully.

### `terraform_remote_state` — reading other states

```hcl
data "terraform_remote_state" "network" {
  backend = "s3"
  config = {
    bucket = "acme-terraform-state"
    key    = "infra/network/terraform.tfstate"
    region = "us-east-1"
  }
}

resource "aws_instance" "api" {
  subnet_id = data.terraform_remote_state.network.outputs.private_subnet_ids[0]
}
```

Lets one Terraform project consume another's outputs. Useful for decomposing infra into layers (network → k8s → apps). **Read-only.** The consumer can't modify the producer's resources.

## Workspaces

Two meanings, depending on backend:

### Classic workspaces

`terraform workspace new prod`. All workspaces share the same backend path; Terraform appends the workspace name. Useful for quick experiments.

**Not a production pattern.** Workspaces don't isolate state enough — one mistake and you apply prod changes to dev.

### Terraform Cloud / HCP workspaces

Separate projects with separate state, variables, runs, and RBAC. This is what you actually want for production environment separation.

## Multi-environment patterns

### Directory per environment (most common)

```
infra/
├── modules/
│   ├── vpc/
│   ├── eks/
│   └── rds/
├── envs/
│   ├── dev/
│   │   ├── main.tf        # module "vpc" { source = "../../modules/vpc" ... }
│   │   ├── terraform.tfvars
│   │   └── backend.tf     # key = "infra/dev/terraform.tfstate"
│   ├── staging/
│   └── prod/
```

Each env is its own root module with its own state. Promoting a change = run in dev, run in staging, run in prod.

### Terragrunt

[Terragrunt](https://terragrunt.gruntwork.io/) is a wrapper that reduces the copy-paste between env directories. It generates backend configs, passes variables, enforces the DAG of dependencies. Popular when the envs/ pattern gets repetitive.

Terragrunt is worth it once you have more than three environments or want module-level DRY. Overkill for smaller setups.

### Monorepo vs polyrepo

- **Monorepo** — `infra/` contains all environments and all modules. Easier to refactor; everyone sees everyone's changes.
- **Polyrepo** — separate repos for network, shared services, per-app. Harder to coordinate; cleaner access control.

Start monorepo. Split later if team boundaries demand it.

## `plan` and `apply`

```bash
terraform init                     # download providers, initialize backend
terraform plan -out=tfplan         # compute diff, save
terraform apply tfplan             # apply the saved plan
terraform plan -destroy            # show destroy diff
terraform destroy                  # destroy everything (careful)
terraform fmt -recursive           # format all files
terraform validate                 # HCL + schema validation
```

**Always review `plan` output.** Every destroyed resource, every in-place update, every replacement. The number of production incidents caused by "I didn't read the plan carefully" is legendary.

Patterns:

- `-out=tfplan` in CI — compute plan on PR, apply on merge to `main`.
- `-refresh-only` — update state from reality without proposing changes (drift detection).
- `-target=aws_s3.bucket` — apply just one resource. Escape hatch only.

## Providers

Each provider is a separate plugin that speaks to one API. Pin the version:

```hcl
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = local.common_tags
  }
}

provider "aws" {
  alias  = "useast1"
  region = "us-east-1"
}
```

Aliased providers for multi-region or multi-account work. Pass them into modules explicitly:

```hcl
module "dns" {
  source = "./modules/dns"
  providers = {
    aws = aws.useast1   # ACM certs for CloudFront must be us-east-1
  }
}
```

## Drift detection

**Drift** is when reality diverges from the state. Someone clicks in the AWS console; Terraform doesn't know.

```bash
terraform plan -refresh-only
```

Refreshes state against reality and shows what Terraform didn't know about. Apply it to update state (but not reality). Or open a PR with the new reality codified.

Mature teams run `refresh-only` nightly and alert on drift. The fix is either to codify the change or to revert it.

## CI/CD patterns

### Plan on PR, apply on merge

```yaml
# .github/workflows/terraform.yml
on:
  pull_request:
    paths: ['infra/**']

jobs:
  plan:
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      - run: terraform init
      - run: terraform plan -out=tfplan
      - uses: actions/upload-artifact@v4
        with:
          name: tfplan
          path: tfplan
```

Apply step requires manual approval or runs on merge to main.

### Atlantis

[Atlantis](https://www.runatlantis.io/) is a GitHub app that runs `terraform plan` on every PR, posts the plan as a comment, and applies on a PR comment like `atlantis apply`. Open-source; the original way to do Terraform GitOps.

### Terraform Cloud / Spacelift / Env0

Managed services that do the same plus UI, RBAC, policy-as-code (OPA, Sentinel), cost estimation. Pay-to-play; the time savings are real.

## Alternatives

| Tool | Notes |
| --- | --- |
| **[OpenTofu](https://opentofu.org/)** | The MPL-2.0 fork of Terraform. Nearly drop-in replacement; actively developed. |
| **[Pulumi](https://www.pulumi.com/)** | IaC in TypeScript, Go, Python, C#. Real programming language instead of HCL. Best if your team already does one of those. |
| **[AWS CDK](https://docs.aws.amazon.com/cdk/)** | TypeScript/Python/Java for AWS. Compiles to CloudFormation. AWS-only. |
| **[CDK for Terraform](https://developer.hashicorp.com/terraform/cdktf)** | AWS CDK's API, Terraform's provider ecosystem. Interesting mid-ground. |
| **CloudFormation** | AWS-native YAML IaC. Use if you need tight AWS integration (e.g. CloudFormation stacks are first-class in some AWS services). Otherwise Terraform is more flexible. |
| **Ansible** | Config management, not infra provisioning. Complementary, not competitive. |
| **[Crossplane](https://www.crossplane.io/)** | Kubernetes-native IaC. Managed cloud resources as k8s CRDs. Valuable when your platform is already k8s-centric. |

## Common footguns

- **Removing a `count`-indexed resource from the middle.** Every subsequent index shifts and gets destroyed/recreated. Use `for_each`.
- **Forgetting `lifecycle { prevent_destroy = true }` on critical resources.** The person who types `terraform destroy` in the wrong directory has ruined many days.
- **Module version drift.** A floating module version updates on `terraform init` and your next plan shows 400 changes. Pin everything.
- **`count = var.enabled ? 1 : 0` in modules.** Works, but accessing `module.thing[0].output` is awkward. Use the new-style `count = var.enabled ? 1 : 0` at the module level only when necessary.
- **Using `terraform apply` in production without a saved plan.** Two people running apply race; state corrupts. Always `-out=tfplan`.
- **Secrets in `.tf` files.** They end up in Git. Use `random_password` + AWS Secrets Manager, or inject via CI from a vault.
- **`terraform destroy` on shared state.** If many projects share one state, `destroy` nukes everything. Partition state.
- **Importing incorrectly.** `terraform import` tells Terraform "you manage this." If the config differs from reality, the next plan will "fix" it — which might mean destroy and recreate. Import with an exact matching config.
- **Provider drift between plan and apply.** Providers update between the two runs; plan becomes stale. Use `-out=tfplan` and apply promptly.
- **Cyclic dependencies between modules.** Terraform's DAG refuses. Usually a sign you should merge or restructure the modules.
- **Terraform state in a public S3 bucket.** It's happened. Block Public Access on every state bucket.

## Operational patterns worth stealing

- **Two-repo architecture** — `infra/` for Terraform, `manifests/` for Kubernetes GitOps. Infra changes rarely; manifests change constantly. Different review cadences.
- **Small state files.** Split infra into layers (network, data, apps) with their own state. Smaller plans, faster iterations, blast radius per layer.
- **Pre-commit hooks.** `terraform fmt`, `terraform validate`, `tflint`, `tfsec` or `checkov`. Cheap, catches most common mistakes.
- **Policy-as-code.** Sentinel (Terraform Cloud), OPA (Conftest), or Spacelift policies. Enforce "no public S3 buckets," "all resources tagged," etc. at plan time.
- **Cost estimation.** Infracost in CI. Shows the delta cost of every PR.
- **`lifecycle { create_before_destroy = true }`** on stateful resources. Avoids brief outages during replacements.
- **State file backups.** S3 versioning + cross-region replication. States occasionally corrupt; restore from the last good version.

## Debugging

```bash
terraform plan -refresh-only          # show what drifted
terraform console                     # REPL for expressions
TF_LOG=DEBUG terraform apply          # very verbose logs
terraform graph | dot -Tsvg > g.svg   # visualize the DAG
terraform providers                   # show provider versions used
terraform state show <addr>           # what does Terraform think about this resource?
```

Most "what's happening?" questions end with `terraform state show` and `terraform plan -refresh-only`. Know what Terraform thinks before you fight with it.

## References

- [Terraform documentation](https://developer.hashicorp.com/terraform/docs)
- [OpenTofu documentation](https://opentofu.org/docs/)
- [Terraform Registry](https://registry.terraform.io/) — the canonical module + provider index
- [terraform-aws-modules](https://github.com/terraform-aws-modules) — excellent reference implementations
- [Terraform Best Practices — Anton Babenko](https://www.terraform-best-practices.com/)
- [Terragrunt](https://terragrunt.gruntwork.io/) — the DRY wrapper
- [Atlantis](https://www.runatlantis.io/) — open-source PR automation
- [Infracost](https://www.infracost.io/) — cost estimation in CI
- [tfsec](https://github.com/aquasecurity/tfsec) / [Checkov](https://www.checkov.io/) — static security analysis

## Related topics

- [Kubernetes](../kubernetes/) — what Terraform often provisions
- [Helm](../helm/) — deploys software into the cluster Terraform made
- [GitOps](../gitops/) — the adjacent philosophy for runtime (vs. provisioning) state
- [ArgoCD](../argocd/) — the runtime reconciler that complements Terraform's one-shot apply
