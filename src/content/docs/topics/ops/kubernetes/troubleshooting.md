---
title: Kubernetes Troubleshooting
description: "Systematic kubectl-based debugging: what each pod phase means, how to diagnose scheduling, networking, storage, and rollout failures, with copy-paste commands for the most common failure modes."
parent: kubernetes
tags: [kubernetes, debugging, troubleshooting, kubectl]
status: draft
created: 2026-05-14
updated: 2026-05-14
---

## The mental model

Kubernetes has two kinds of problems: things that are broken and things that are misconfigured. Broken things usually generate events. Misconfigured things usually don't.

Start here, always:

```bash
kubectl describe pod <pod> -n <ns>
kubectl logs <pod> -c <container> -n <ns>
kubectl get events -n <ns> --sort-by='.lastTimestamp'
```

The `describe` events section catches 80% of problems. After that, logs. After that, `exec` into the container and poke around.

## Pod phases and what they mean

```
Pending -> Running -> Succeeded
               |
               +--> Failed
               |
               +--> Unknown (node lost contact)
```

`kubectl get pod` shows the phase plus a status string that is more informative:

| Status | Cause | Where to look |
| --- | --- | --- |
| `Pending` | Not yet scheduled | `describe pod` events, node resources, taints |
| `ContainerCreating` | Image pull or volume mount in progress | `describe pod` events |
| `ImagePullBackOff` | Can't pull the image | Registry credentials, image name/tag |
| `CrashLoopBackOff` | Container starts and crashes repeatedly | `logs -p` (previous run), exit code |
| `OOMKilled` | Exceeded memory limit | Increase `limits.memory`, profile the app |
| `RunContainerError` | Runtime error before process started | `describe pod`, wrong entrypoint, missing volume |
| `Terminating` | Stuck on finalizer or preStop hook | Patch finalizers to `[]` |
| `Evicted` | Node under resource pressure | `describe pod`, check node conditions |

## Pending pods

A pod stuck in `Pending` has not been scheduled. `describe pod` shows why in the events:

```
Events:
  Warning  FailedScheduling  0/3 nodes are available:
    1 Insufficient memory.
    2 node(s) had untolerated taint {node.kubernetes.io/not-ready: }.
```

Checklist:

1. **Resources**: does any node have enough CPU and memory to satisfy the pod's `requests`?
2. **Taints**: does the pod have a `toleration` for any taint on the target nodes?
3. **Node selectors and affinity**: do the labels match any node?
4. **PVC not bound**: a pod waiting on a `PersistentVolumeClaim` that isn't `Bound` stays `Pending`. Check `kubectl get pvc -n <ns>`.
5. **Namespace quota**: `kubectl describe resourcequota -n <ns>`.

## CrashLoopBackOff

The container starts and exits. Kubernetes restarts it with an exponential backoff (caps at 5 minutes).

```bash
# current run logs
kubectl logs <pod> -c <container> -n <ns>

# previous (crashed) run logs
kubectl logs <pod> -c <container> -n <ns> -p

# exit code
kubectl describe pod <pod> -n <ns> | grep "Exit Code"
```

Exit codes to know:

- `1`: application error (check logs).
- `137`: OOMKilled or SIGKILL. `kubectl describe pod` shows `OOMKilled: true` in the container status.
- `139`: segfault.
- `143`: SIGTERM that didn't complete within `terminationGracePeriodSeconds`.

For a container that crashes immediately, run the image standalone to debug startup:

```bash
kubectl run debug --image=acme/api:latest -it --rm --restart=Never -- sh
```

## ImagePullBackOff

The image can't be pulled. Check the events:

```bash
kubectl describe pod <pod> -n <ns>
# look for: Failed to pull image "...": ...
```

Common causes:

- Typo in the image name or a tag that doesn't exist.
- Private registry without credentials: create a `docker-registry` Secret and add `imagePullSecrets`.
- Network issue: can the node reach the registry? Check node-level DNS and firewall rules.
- [Rate limiting](../../../system-design/rate-limiting/): Docker Hub rate-limits unauthenticated pulls. Use an authenticated pull Secret.

```bash
kubectl create secret docker-registry regcred \
  --docker-server=ghcr.io \
  --docker-username=<user> \
  --docker-password=<token> \
  -n <ns>
```

Then in the pod spec:

```yaml
imagePullSecrets:
  - name: regcred
```

## Networking issues

### Service not reachable from a pod

```bash
# does the service exist and have endpoints?
kubectl get svc <svc> -n <ns>
kubectl get endpoints <svc> -n <ns>

# is DNS resolving?
kubectl exec -it <pod> -n <ns> -- nslookup <svc>.<ns>.svc.cluster.local

# can the pod reach the port?
kubectl exec -it <pod> -n <ns> -- curl http://<svc>:<port>/healthz
```

If `endpoints` is empty, the service selector doesn't match any pod labels, or all matching pods are failing readiness.

### DNS not resolving

```bash
kubectl exec -it <pod> -n <ns> -- cat /etc/resolv.conf
kubectl exec -it <pod> -n <ns> -- nslookup kubernetes.default

# check CoreDNS
kubectl get pods -n kube-system -l k8s-app=kube-dns
kubectl logs -n kube-system -l k8s-app=kube-dns
```

### NetworkPolicy blocking traffic

Silent drops (timeout, not connection refused) usually mean NetworkPolicy. Confirm by temporarily removing all policies from the namespace:

```bash
kubectl get networkpolicy -n <ns>
kubectl delete networkpolicy --all -n <ns>
```

If that fixes it, add policies back one at a time. Use Cilium's Hubble or Calico's flow logs to see exactly which rule is dropping a specific flow.

See [Kubernetes Networking](../networking/) for the common NetworkPolicy mistakes.

## Storage issues

### PVC stuck in Pending

```bash
kubectl describe pvc <pvc> -n <ns>
# Events: no persistent volumes available for this claim
```

Common causes:

- No StorageClass that satisfies the request (check `accessModes` and `storageClassName`).
- The provisioner pod for the StorageClass isn't running.
- Requested capacity exceeds any available PV.

```bash
kubectl get storageclass
kubectl get pv
```

### Volume mount failure

Pod stays in `ContainerCreating` and `describe` shows `FailedMount`. Common causes: the volume is still attached to another node (happens with `ReadWriteOnce` volumes after a node failure), or the CSI driver pod is down.

```bash
kubectl get pv -o wide
kubectl get pods -n kube-system | grep csi
```

For a `ReadWriteOnce` PV stuck on a dead node, manually delete the `VolumeAttachment` object:

```bash
kubectl get volumeattachment
kubectl delete volumeattachment <name>
```

## Deployment rollout issues

### Rollout stuck

```bash
kubectl rollout status deployment/<name> -n <ns>
kubectl describe deployment/<name> -n <ns>
```

Common causes:

- New pods are failing readiness: old pods stay until new ones are Ready. Check new pod logs.
- `maxUnavailable: 0` and `maxSurge: 0`: no pods can be created or removed (misconfigured strategy).
- Resource quota hit: no capacity to create the surge pod.

```bash
# roll back if the new version is broken
kubectl rollout undo deployment/<name> -n <ns>

# roll back to a specific revision
kubectl rollout history deployment/<name> -n <ns>
kubectl rollout undo deployment/<name> --to-revision=3 -n <ns>
```

### HPA not scaling

```bash
kubectl describe hpa <name> -n <ns>
# look for: "unable to get metrics" or "Conditions: ScalingActive=False"
```

Common causes:

- `metrics-server` not installed or not running.
- Pod `resources.requests` not set: HPA computes utilization as used/requested; no requests means no metric.
- Target already at `maxReplicas`.
- Custom metrics adapter not returning data.

## RBAC errors

Forbidden errors in pod logs usually mean the app is calling the Kubernetes API without the right ServiceAccount permissions.

```bash
# check what the ServiceAccount can do
kubectl auth can-i --list \
  --as=system:serviceaccount:<ns>:<sa-name> \
  -n <ns>

# test a specific permission
kubectl auth can-i get pods \
  --as=system:serviceaccount:<ns>:<sa-name> \
  -n <ns>
```

Create a Role and RoleBinding for the specific verbs and resources the pod needs. Avoid granting cluster-wide permissions for namespace-scoped needs.

## Node issues

```bash
kubectl get nodes
kubectl describe node <node>
# look for: MemoryPressure, DiskPressure, PIDPressure, NotReady
```

A node in `NotReady` stops accepting new pods. Pods on it get evicted after `pod-eviction-timeout` (default 5 minutes).

```bash
kubectl top nodes
kubectl get pods --all-namespaces --field-selector spec.nodeName=<node>

# cordon (stop scheduling) then drain (evict pods)
kubectl cordon <node>
kubectl drain <node> --ignore-daemonsets --delete-emptydir-data
```

Disk pressure is common when container logs or images accumulate. Check node disk usage by running a privileged debug pod:

```bash
kubectl debug node/<node> -it --image=busybox -- df -h
```

## Control-plane issues

If the API server is down, `kubectl` returns connection errors. Running workloads continue; no new scheduling happens.

On a self-managed cluster, control-plane pods are static (managed by kubelet, not the API server):

```bash
# on the control-plane node
ls /etc/kubernetes/manifests/
systemctl status kubelet
journalctl -u kubelet --since "10 minutes ago"
```

etcd health:

```bash
kubectl exec -n kube-system etcd-<node> -- \
  etcdctl endpoint health \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key
```

## Quick reference

```bash
# general state
kubectl get all -n <ns>
kubectl get events -n <ns> --sort-by='.lastTimestamp'

# pod debugging
kubectl describe pod <pod> -n <ns>
kubectl logs <pod> -c <container> -p         # -p = previous run
kubectl exec -it <pod> -n <ns> -- sh

# service debugging
kubectl get endpoints <svc> -n <ns>
kubectl exec -it <pod> -- nslookup <svc>.<ns>.svc.cluster.local

# rollout
kubectl rollout status deployment/<name> -n <ns>
kubectl rollout undo deployment/<name> -n <ns>

# resource usage
kubectl top pods -n <ns>
kubectl top nodes

# RBAC
kubectl auth can-i --list --as=system:serviceaccount:<ns>:<sa>

# node ops
kubectl cordon <node>
kubectl drain <node> --ignore-daemonsets --delete-emptydir-data
kubectl uncordon <node>
```

## References

- [Kubernetes application debugging documentation](https://kubernetes.io/docs/tasks/debug/debug-application/)
- [kubectl quick reference](https://kubernetes.io/docs/reference/kubectl/quick-reference/)
- [Debugging DNS resolution](https://kubernetes.io/docs/tasks/administer-cluster/dns-debugging-resolution/)
- [Debugging services](https://kubernetes.io/docs/tasks/debug/debug-application/debug-service/)

## Related topics

- [Kubernetes](./), the parent topic
- [Kubernetes Networking](../networking/), DNS and NetworkPolicy failure modes
- [Kubernetes Security Hardening](../security/), RBAC and admission debugging
- [Kubernetes Workloads Reference](../workloads/), rollout strategy and probe configuration
