---
title: Operations
description: The disciplines that turn working code into running systems — Kubernetes, Helm, Terraform, GitOps, ArgoCD, MLOps, and branching workflows like Gitflow.
---

## Topics

### Platform

- [Kubernetes](./kubernetes/) — the container orchestrator: architecture, workloads, networking, storage, RBAC, autoscaling, footguns
- [Helm](./helm/) — the package manager for Kubernetes: charts, values, templates, releases, OCI distribution
- [Terraform](./terraform/) — infrastructure as code: providers, resources, state, modules, multi-environment patterns

### Delivery

- [GitOps](./gitops/) — Git as the source of truth for infrastructure, with a reconciliation agent doing the work
- [ArgoCD](./argocd/) — the reference GitOps controller for Kubernetes; Applications, sync waves, the footguns
- [Gitflow](./gitflow/) — Vincent Driessen's 2010 branching model, when it fits, and what people use instead

### Domain-specific

- [MLOps](./mlops/) — the engineering discipline around getting ML models into production and keeping them useful

## How the topics compose

Terraform provisions the infrastructure (VPC, EKS, RDS). Kubernetes runs on that infrastructure. Helm packages workloads for Kubernetes. ArgoCD applies those packages in a GitOps loop, with the branching strategy (Gitflow or otherwise) determining how changes flow through environments. MLOps is the same philosophy applied to models — which end up deployed via the same stack.
