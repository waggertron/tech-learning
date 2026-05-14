---
title: Kubernetes Networking
description: "The flat pod-to-pod network model, how CNI plugins implement it, kube-proxy modes, CoreDNS service discovery, NetworkPolicy syntax and enforcement, and a comparison of Calico, Cilium, and Flannel."
parent: kubernetes
tags: [kubernetes, networking, cni, network-policy, coredns]
status: draft
created: 2026-05-14
updated: 2026-05-14
---

## The networking contract

Kubernetes imposes one invariant on every CNI plugin: every pod can reach every other pod using its pod IP, with no NAT. That's it. How the plugin implements it is its own problem.

The full model:

- Every pod gets a unique IP from the cluster's pod CIDR.
- A pod's IP is routable from any other node in the cluster.
- Nodes can reach pod IPs directly.
- Services get a stable virtual IP from a separate service CIDR. The virtual IP is not assigned to any network interface.

## How pods get their IPs: CNI

The Container Network Interface (CNI) is a spec that defines how the container runtime calls out to a networking plugin at pod creation time. The kubelet calls the CNI plugin with the pod's network namespace. The plugin assigns an IP, sets up routes, and returns.

```
kubelet creates pod namespace
       |
       v
CNI plugin called (e.g. calico-cni)
       |
       +-> assigns IP from pod CIDR
       +-> creates veth pair (one end in pod, one in host)
       +-> programs routes so pod IP is reachable from other nodes
       |
pod is reachable at its IP
```

The CNI plugin also handles cross-node routing. On a three-node cluster, node A needs to know how to reach pods on nodes B and C. Plugins solve this differently:

- **Overlay (VXLAN or IPIP)**: encapsulate pod packets in a tunnel. Simpler to set up, small MTU overhead.
- **Underlay (BGP)**: advertise pod CIDR routes natively over BGP. No encapsulation overhead, but requires a BGP-capable network.
- **Host-local routing**: only works when all nodes are on the same L2 subnet.

## kube-proxy

`kube-proxy` runs on every node. Its job: implement Service virtual IPs. When a pod sends a packet to a service IP, kube-proxy intercepts it and rewrites the destination to a healthy pod IP.

### iptables mode (default)

kube-proxy writes iptables DNAT rules that rewrite service VIPs to pod IPs. The kernel handles the rewrite inline.

Downside: iptables rules are processed linearly. At 10,000+ services, rule traversal adds measurable latency. kube-proxy rewrites the entire ruleset on every service change, which is expensive.

### IPVS mode

kube-proxy programs IPVS (IP Virtual Server) in the kernel instead. IPVS uses hash tables, so lookup is O(1) regardless of service count. Enable with `--proxy-mode=ipvs` on the kube-proxy DaemonSet. Choose this for large clusters.

### eBPF mode (Cilium)

Cilium bypasses kube-proxy entirely and implements service load-balancing in eBPF programs attached to network interfaces. Lower latency, direct socket dispatch (skips the network stack for same-node communication), native support for topology-aware routing.

## DNS: CoreDNS

CoreDNS is the cluster DNS server. It watches the Kubernetes API and answers queries like:

```
<service>.<namespace>.svc.cluster.local
<pod-ip-dashes>.<namespace>.pod.cluster.local
```

Every pod's `/etc/resolv.conf` points at the CoreDNS service IP, with a search domain list:

```
nameserver 10.96.0.10
search default.svc.cluster.local svc.cluster.local cluster.local
options ndots:5
```

The `ndots:5` setting means any name with fewer than 5 dots gets the search domains appended before trying it as an absolute name. `postgres` resolves to `postgres.default.svc.cluster.local`. But `api.example.com` (three dots) also gets search domains appended first, causing extra DNS round-trips before it tries the bare name.

For external names you know are absolute, append a trailing dot (`api.example.com.`) to bypass the search list.

Common DNS failure patterns:

- **`ndots:5` extra lookups**: observable as doubled DNS latency on external names. Lower `ndots` per-pod via `dnsConfig`, or use fully qualified names with a trailing dot.
- **Stale CoreDNS cache**: TTL is usually 30s. New service DNS may not resolve immediately after creation.
- **CoreDNS OOM**: under high query rates. Tune the `cache` plugin and memory limits.
- **Custom `/etc/resolv.conf`**: if an init container modifies it, Kubernetes may overwrite it when the pod starts.

## Services and endpoints

A Service selects pods by label. kube-proxy reads `EndpointSlice` objects to know which pod IPs back each service.

When a pod fails its readiness probe, it's removed from the `EndpointSlice`. kube-proxy stops sending traffic to it within seconds. This is why readiness probes matter: they control traffic, not just restarts.

```
Service VIP 10.96.0.5:80
      |
      v
EndpointSlice: [10.244.0.3:8080, 10.244.1.7:8080]
      |
      v
kube-proxy: DNAT 10.96.0.5:80 -> one of the above (round-robin)
```

Headless services (`clusterIP: None`) skip the VIP entirely. DNS returns all pod IPs directly. StatefulSets use headless services to give each pod a stable DNS name (`pod-0.svc.ns.svc.cluster.local`).

## NetworkPolicy

By default, every pod can reach every other pod and every service. `NetworkPolicy` objects restrict that.

A policy selects pods by `podSelector`. It then lists allowed ingress and egress rules. Traffic not matching any rule is dropped.

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: restrict-api
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes: [Ingress, Egress]
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: production
          podSelector:
            matchLabels:
              app: gateway
      ports:
        - protocol: TCP
          port: 8000
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: postgres
      ports:
        - protocol: TCP
          port: 5432
    - to:
        - namespaceSelector: {}
      ports:
        - protocol: UDP
          port: 53   # allow DNS to CoreDNS
```

NetworkPolicy is enforced by the CNI plugin, not by kube-proxy. Flannel does not enforce NetworkPolicy objects. Calico, Cilium, and Weave Net do.

Common mistakes:

- **Forgetting DNS egress**: locking down egress without allowing UDP 53 breaks all service discovery.
- **Conflating `namespaceSelector` and `podSelector` scope**: both selectors in the same `from` entry require both to match simultaneously. Separate `from` entries create an OR condition.
- **Not listing `policyTypes: [Egress]`**: without it, egress is unrestricted even if you add egress rules.
- **Assuming `podSelector: {}` selects all pods in the cluster**: it selects all pods in the policy's namespace only.

### Default-deny baseline

Apply this to any namespace that should use explicit allowlists:

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

Then add specific allow policies per workload on top.

## Ingress and Gateway API

`Ingress` is the HTTP-layer router. One `LoadBalancer` Service per app gets expensive; Ingress routes many apps through a single load balancer.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
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

An IngressController (nginx, Traefik, HAProxy, or cloud-managed) watches Ingress objects and configures itself. The controller is a real pod running in the cluster.

**Gateway API** is the successor to Ingress. It splits the concerns:

- **`Gateway`**: the listener (port, protocol, TLS).
- **`HTTPRoute`**: the routing rules (host, path, header matching).
- **`Service`**: the backend.

New clusters should start with Gateway API. Ingress still works but won't receive new features.

## CNI plugin comparison

| Plugin | Transport | NetworkPolicy | eBPF | Notes |
| --- | --- | --- | --- | --- |
| Flannel | VXLAN overlay | No (needs Calico) | No | Simple, limited features |
| Calico | BGP or VXLAN | Yes | Optional | Most common in self-managed clusters |
| Cilium | eBPF | Yes, L7 aware | Yes | Best performance; higher ops complexity |
| Weave Net | Overlay | Yes | No | Largely superseded |

Cilium is the right choice for clusters that need L7 policy (block specific HTTP paths), WireGuard encryption between pods, service mesh features without a sidecar, or the Hubble observability layer. Calico is the pragmatic default for most production clusters.

## Service mesh

A service mesh (Istio, Linkerd, Cilium Service Mesh) adds a sidecar proxy or eBPF equivalent to every pod. It intercepts all inbound and outbound traffic to provide:

- Mutual TLS between services (mTLS) without application changes.
- Fine-grained traffic routing: canary releases, circuit breaking, retries.
- Distributed tracing and per-route metrics.

The operational cost is real: a second container per pod, a control plane to manage, and configuration that can fail silently. Don't adopt a service mesh because it's available. Adopt it for a specific need: strict mTLS requirements for compliance, progressive delivery with traffic weights, or deep per-service observability that can't be served by Ingress metrics alone.

Most clusters need Ingress plus NetworkPolicy and nothing else in the networking layer.

## References

- [Kubernetes networking concepts](https://kubernetes.io/docs/concepts/cluster-administration/networking/)
- [CNI spec](https://github.com/containernetworking/cni)
- [Calico documentation](https://docs.tigera.io/calico/latest/)
- [Cilium documentation](https://docs.cilium.io/)
- [NetworkPolicy editor (visual)](https://editor.networkpolicy.io/)
- [CoreDNS documentation](https://coredns.io/manual/toc/)
- [Gateway API spec](https://gateway-api.sigs.k8s.io/)

## Related topics

- [Kubernetes](./), the parent topic
- [Kubernetes Security Hardening](./security/), NetworkPolicy as a security boundary
- [Kubernetes Troubleshooting](./troubleshooting/), diagnosing DNS and connectivity failures
- [ArgoCD](../argocd/), deploying network configurations via GitOps
