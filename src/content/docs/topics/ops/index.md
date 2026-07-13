---
title: Operations
description: "The disciplines that turn working code into running systems, Kubernetes, Helm, Terraform, GitOps, ArgoCD, MLOps, and branching workflows like Gitflow."
---

## Topics

### Platform

- [Docker](./docker/), the container runtime: images, containers, volumes, Compose, Dockerfile best practices, and the relationship to Kubernetes
- [Kubernetes](./kubernetes/), the container orchestrator: architecture, workloads, networking, storage, RBAC, autoscaling, footguns
  - [Networking](./kubernetes/networking/), pod network model, CNI, kube-proxy, CoreDNS, NetworkPolicy
  - [Security Hardening](./kubernetes/security/), Pod Security Standards, admission controllers, RBAC lockdown, secrets
  - [Troubleshooting](./kubernetes/troubleshooting/), systematic debugging for every common failure mode
  - [Workloads Reference](./kubernetes/workloads/), Deployment, StatefulSet, DaemonSet, Job, CronJob, probes, resource management
- [Helm](./helm/), the package manager for Kubernetes: charts, values, templates, releases, OCI distribution
- [Terraform](./terraform/), infrastructure as code: providers, resources, state, modules, multi-environment patterns

### Delivery

- [GitOps](./gitops/), Git as the source of truth for infrastructure, with a reconciliation agent doing the work
- [ArgoCD](./argocd/), the reference GitOps controller for Kubernetes; Applications, sync waves, the footguns
- [Gitflow](./gitflow/), Vincent Driessen's 2010 branching model, when it fits, and what people use instead

### Security

- [Tokens, Keys, Secrets, and Environment Variables](./secrets-keys-tokens/), what each credential type is, how they differ, where they live, and the mistakes that expose them

### Domain-specific

- [MLOps](./mlops/), the engineering discipline around getting ML models into production and keeping them useful

## How the topics compose

Terraform provisions the infrastructure (VPC, EKS, RDS). Kubernetes runs on that infrastructure. Helm packages workloads for Kubernetes. ArgoCD applies those packages in a GitOps loop, with the branching strategy (Gitflow or otherwise) determining how changes flow through environments. MLOps is the same philosophy applied to models, which end up deployed via the same stack.
