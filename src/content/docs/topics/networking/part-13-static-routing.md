---
title: "Part 13: Static Routing"
description: "How to configure static routes, default routes, floating static routes, and summary routes on Cisco routers."
parent: networking
tags: [networking, ccna]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

Static routes are routes you configure manually. The router does not learn them from a neighbor and does not adapt them when the network changes. That predictability is both their greatest strength and their sharpest limitation.

## Why it matters

Every network needs a routing decision for every packet. In small networks, stub networks, and edge devices, a dynamic routing protocol adds overhead without adding value. Static routes give you complete control: you decide the path, the administrative distance, and whether a backup path exists. In larger networks, static routes still appear at the edges as default routes or floating backups layered on top of dynamic protocols.

## When to use static routes

| Scenario | Reason |
|---|---|
| Stub network (one exit point) | No routing protocol needed; one default route suffices |
| Small network (under ~5 routers) | Manual config is manageable; no protocol overhead |
| Default route to ISP | Simple and explicit; matches all destinations |
| Backup path (floating static) | Activates only when primary dynamic route disappears |
| Route summarization at edge | Aggregate internal space before handing to upstream |

A stub network is a network with only one path in or out. Configuring OSPF or EIGRP there wastes CPU and adds complexity. One static default route is enough.

## Static route syntax

Cisco IOS gives you three ways to specify where traffic should go.

**Next-hop IP only:**

```text
R1(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.2
```

The router performs a recursive lookup: it looks up 10.0.0.2 in its own routing table to find the exit interface. Works on any interface type.

**Exit interface only:**

```text
R1(config)# ip route 192.168.2.0 255.255.255.0 GigabitEthernet0/1
```

No recursive lookup needed; the router sends traffic out that interface directly. On point-to-point serial links this is fine. On Ethernet, this creates a problem (see Gotchas below).

**Both exit interface and next-hop IP:**

```text
R1(config)# ip route 192.168.2.0 255.255.255.0 GigabitEthernet0/1 10.0.0.2
```

This is the recommended form for Ethernet interfaces. No recursive lookup, no proxy-ARP dependency.

The general syntax is:

```text
ip route <network> <mask> {<next-hop-ip> | <exit-interface> [<next-hop-ip>]} [<AD>]
```

## Default static route

A default route matches any destination not already in the routing table. It is the gateway of last resort.

```text
R1(config)# ip route 0.0.0.0 0.0.0.0 10.0.0.1
```

The 0.0.0.0 0.0.0.0 mask is the shortest possible prefix match and loses to any more specific route. Traffic for an unknown destination flows toward 10.0.0.1. You will see this on every edge router facing an ISP.

Verify it appears as gateway of last resort:

```text
R1# show ip route
...
Gateway of last resort is 10.0.0.1 to network 0.0.0.0

S*   0.0.0.0/0 [1/0] via 10.0.0.1
```

## Floating static route

A floating static route has a higher administrative distance than the primary dynamic route. It stays out of the routing table while the dynamic route exists and drops in automatically when the dynamic route disappears.

Default administrative distances:

| Source | AD |
|---|---|
| Connected | 0 |
| Static | 1 |
| EIGRP | 90 |
| OSPF | 110 |
| RIP | 120 |

To make a static route float above OSPF (AD 110), set its AD to something higher, like 200:

```text
R1(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.2 200
```

When OSPF has a valid route for 192.168.2.0/24, the static route is suppressed. When OSPF loses that route (link failure, neighbor timeout), the static route at AD 200 activates. This gives you automatic failover without running a full routing protocol on the backup link.

## Summary static route

Rather than installing one route per subnet, you can install a single summary route that covers a range of subnets.

If your network contains 192.168.0.0/24 through 192.168.3.0/24, you can summarize them as:

```text
R1(config)# ip route 192.168.0.0 255.255.252.0 10.0.0.2
```

The /22 mask covers all four /24s. The upstream router needs only one entry instead of four. This reduces routing table size and simplifies configuration, but it only works cleanly when your address space is contiguous and aligned on a bit boundary.

## IPv6 static routes

IPv6 static routes use `ipv6 route` and support the same three forms (next-hop, exit interface, or both). Link-local addresses are valid next-hops, but they require an exit interface because link-locals are not globally unique.

```text
R1(config)# ipv6 route 2001:db8:2::/64 GigabitEthernet0/1 FE80::2
```

Default IPv6 route:

```text
R1(config)# ipv6 route ::/0 GigabitEthernet0/1 FE80::1
```

Enable IPv6 routing if it is not already on:

```text
R1(config)# ipv6 unicast-routing
```

## Three-router topology example

```
         192.168.1.0/24         192.168.2.0/24
PC-A ---- R1 ---- 10.0.0.0/30 ---- R2 ---- 10.0.1.0/30 ---- R3 ---- PC-C
         Gi0/0   Gi0/1          Gi0/0   Gi0/1             Gi0/0   Gi0/1
         .1        .1             .2       .1               .2       .1
```

Static routes to give R1 full reachability:

```text
R1(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.2
R1(config)# ip route 10.0.1.0 255.255.255.252 10.0.0.2
R1(config)# ip route 192.168.3.0 255.255.255.0 10.0.0.2
```

Static routes on R3 to reach R1's network:

```text
R3(config)# ip route 192.168.1.0 255.255.255.0 10.0.1.1
R3(config)# ip route 10.0.0.0 255.255.255.252 10.0.1.1
```

R2 is already connected to both transit subnets and has connected routes for both. It needs routes for the far-end LANs:

```text
R2(config)# ip route 192.168.1.0 255.255.255.0 10.0.0.1
R2(config)# ip route 192.168.3.0 255.255.255.0 10.0.1.2
```

## Verifying static routes

Check the routing table for static entries (marked `S`):

```text
R1# show ip route static
S    192.168.2.0/24 [1/0] via 10.0.0.2
S*   0.0.0.0/0 [1/0] via 10.0.0.1
```

Look up a specific prefix:

```text
R1# show ip route 192.168.2.0
Routing entry for 192.168.2.0/24
  Known via "static", distance 1, metric 0
  Routing Descriptor Blocks:
  * 10.0.0.2
      Route metric is 0, traffic share count is 1
```

Test reachability end to end:

```text
R1# ping 192.168.2.1
R1# traceroute 192.168.2.1
```

Traceroute confirms the path follows the static routes you configured. If it does not, check for a more-specific route or a conflicting entry elsewhere in the table.

## Tradeoffs and gotchas

**Pros:**
- Completely predictable path: the packet goes exactly where you told it
- No routing protocol overhead: no hellos, no LSA flooding, no SPF calculations
- No CPU or memory used for route computation
- Works even if dynamic protocols are misconfigured or unavailable

**Cons:**
- Does not scale: 100 routers with full meshes means thousands of manual entries
- No automatic failover unless you add a floating static (and even then, it only activates when the dynamic route disappears, not when the actual destination becomes unreachable)
- Administrative burden: every topology change requires manual updates on every affected router
- Easy to introduce black holes or routing loops if entries are inconsistent

**Gotcha: exit-interface-only on Ethernet**

When you configure a static route with only an exit interface (no next-hop IP) on a multi-access network like Ethernet, the router treats the destination as directly connected. It sends an ARP request for every destination IP. The upstream router may respond via proxy-ARP, which works, but it generates unnecessary ARP traffic and can obscure routing problems. Always include the next-hop IP on Ethernet interfaces.

**Gotcha: recursive lookup depth**

A next-hop-only static route requires the router to look up the next-hop address in the routing table. If that lookup fails (the next-hop is unreachable), the static route becomes inactive. The route will not appear in `show ip route` even though it is configured. Check `show ip route 10.0.0.2` to verify the next-hop is reachable.

**Gotcha: floating static AD value**

The AD you assign must be higher than the dynamic protocol's AD. OSPF is 110, EIGRP is 90. A floating static of AD 100 would still preempt OSPF. Use 200 or higher to be safe and unambiguous.

## References

- [Cisco IOS IP Routing: Static Route Configuration Guide](https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_pi/configuration/xe-16/iri-xe-16-book/iri-static-routes.html)
- [RFC 1812: Requirements for IP Version 4 Routers](https://datatracker.ietf.org/doc/html/rfc1812)

## Related topics

- [Part 12: IP Routing Fundamentals](./part-12-ip-routing-fundamentals)
- [Part 14: OSPF](./part-14-ospf)
- [Part 15: EIGRP](./part-15-eigrp)
