---
title: "Part 12: Routing Fundamentals"
description: "How routers forward packets using the routing table, longest prefix match, administrative distance, and metrics."
parent: networking
tags: [networking, ccna]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

A router's job is deceptively simple: look at a packet's destination IP address, find the best match in the routing table, and send the packet toward its destination. Everything else, spanning tree, VLANs, NAT, ACLs, is built on top of that forwarding decision. Understanding exactly how a router makes that decision, which route wins and why, is the mental model that makes everything else click.

## What a router does

Routers operate at Layer 3 (Network layer). When a packet arrives on an interface:

1. The router strips the Layer 2 frame (Ethernet, PPP, etc.).
2. It reads the destination IP address from the Layer 3 header.
3. It looks up the destination in the routing table.
4. It encapsulates the packet in a new Layer 2 frame with the next-hop's MAC address.
5. It sends the frame out the correct interface.

Critically, the router decrements the TTL by 1. If TTL reaches 0, the router drops the packet and sends an ICMP Time Exceeded message back to the source. This prevents packets from looping forever in a misconfigured network.

Routers do not forward frames (Layer 2). Switches do not forward packets (Layer 3). The boundary is clean.

## The routing table

The routing table is the router's map. Each entry (route) contains:

- **Destination network**: IP prefix and prefix length
- **Route source**: how the router learned about this route
- **Administrative distance (AD)**: trustworthiness of the source
- **Metric**: cost within a routing protocol
- **Next-hop**: IP address of the next router, or "directly connected"
- **Outgoing interface**: which interface to send the packet out
- **Age**: how long since the route was last updated

View the full routing table:

```text
R1# show ip route
Codes: C - connected, L - local, S - static, R - RIP, M - mobile, B - BGP
       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area
       N1 - OSPF NSSA external type 1, N2 - OSPF NSSA external type 2
       E1 - OSPF external type 1, E2 - OSPF external type 2
       i - IS-IS, su - IS-IS summary, L1 - IS-IS level-1, L2 - IS-IS level-2
       ia - IS-IS inter area, * - candidate default, + - per-user static route

Gateway of last resort is 203.0.113.1 to network 0.0.0.0

      10.0.0.0/8 is variably subnetted, 4 subnets, 2 masks
C        10.0.0.0/30 is directly connected, GigabitEthernet0/1
L        10.0.0.1/32 is directly connected, GigabitEthernet0/1
C        10.0.1.0/24 is directly connected, GigabitEthernet0/0
L        10.0.1.1/32 is directly connected, GigabitEthernet0/0
      192.168.1.0/24 is variably subnetted, 2 subnets, 2 masks
O        192.168.1.0/24 [110/2] via 10.0.0.2, 00:15:32, GigabitEthernet0/1
S        192.168.2.0/24 [1/0] via 203.0.113.1
S*    0.0.0.0/0 [1/0] via 203.0.113.1
```

Reading a route entry:

```
O     192.168.1.0/24   [110/2]   via 10.0.0.2,   00:15:32,   GigabitEthernet0/1
^     ^                 ^ ^       ^                ^            ^
|     |                 | |       |                |            outgoing interface
|     |                 | metric  next-hop IP      age
|     destination       AD
route source (OSPF)
```

The `[110/2]` means AD=110, metric=2.

## Route sources and their codes

| Code | Source | Notes |
|------|--------|-------|
| C | Connected | Interface is up and has an IP address |
| L | Local | /32 route for the router's own interface address |
| S | Static | Manually configured with `ip route` |
| O | OSPF | Open Shortest Path First |
| D | EIGRP | Enhanced Interior Gateway Routing Protocol |
| R | RIP | Routing Information Protocol |
| B | BGP | Border Gateway Protocol |
| i | IS-IS | Intermediate System to Intermediate System |

## How a router makes a forwarding decision

Three criteria, applied in order:

### 1. Longest prefix match

The most specific route wins, regardless of source or metric. A /26 always beats a /24 for an address that falls in both.

```
Routing table contains:
  192.168.1.0/24  via 10.0.0.1
  192.168.1.64/26 via 10.0.0.2

Packet destined for 192.168.1.100:
  Falls in 192.168.1.0/24?   YES (100 is in 0-255)
  Falls in 192.168.1.64/26?  YES (100 is in 64-127)
  Longer prefix wins: /26 -> forward via 10.0.0.2
```

This is why a default route (0.0.0.0/0) only matches when nothing more specific exists. It is the least specific possible prefix.

### 2. Administrative distance

If the same prefix is learned from multiple sources (e.g., both OSPF and a static route), AD breaks the tie. Lower AD wins.

```
  192.168.1.0/24 [1/0]   via 10.0.0.1   (static, AD=1)
  192.168.1.0/24 [110/5] via 10.0.0.2   (OSPF, AD=110)
  --> static wins, only static route is installed in RIB
```

### 3. Metric

If the same prefix is learned from multiple instances of the same routing protocol (e.g., two OSPF paths), metric breaks the tie. Lower metric wins. If metrics are equal, the router load-balances across all equal-cost paths (ECMP).

## Administrative distance table

| Route Source | AD |
|-------------|----|
| Directly connected | 0 |
| Static route | 1 |
| EIGRP summary route | 5 |
| External BGP (eBGP) | 20 |
| EIGRP internal | 90 |
| OSPF | 110 |
| IS-IS | 115 |
| RIP | 120 |
| EIGRP external | 170 |
| Internal BGP (iBGP) | 200 |
| Unknown / unbelievable | 255 |

AD=255 means the route is administratively unreachable and will never be used. This is how you "poison" a specific route: `ip route 192.168.1.0 255.255.255.0 Null0 255`.

AD is local to the router. It is not advertised in routing protocol updates. Two routers on the same network can have different ADs for the same route if one has a static route and the other does not.

**Floating static routes**: a static route with a manually elevated AD, used as a backup. If the primary OSPF route (AD=110) goes away, the floating static (AD=115, or any value higher than 110) becomes active.

```text
R1(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.5 115
```

## Metrics by protocol

Each routing protocol uses a different definition of "cost":

| Protocol | Metric | Details |
|----------|--------|---------|
| RIP | Hop count | Maximum 15 hops. 16 = unreachable. Simple but ignores bandwidth. |
| OSPF | Cost | 10^8 / interface bandwidth (bps). Lower is better. 100 Mbps = cost 1, 10 Mbps = cost 10. |
| EIGRP | Composite | Primarily bandwidth (lowest in path) + delay (sum). Can include reliability, load, MTU (not recommended). |
| BGP | Path attributes | AS path length, local preference, MED, and many more. Not a simple metric. |
| IS-IS | Cost | Configurable integer per interface, default 10. |

OSPF cost gotcha: the reference bandwidth defaults to 100 Mbps. A FastEthernet (100 Mbps) and a GigabitEthernet (1000 Mbps) both get cost 1 because the formula truncates. Fix this:

```text
R1(config-router)# auto-cost reference-bandwidth 10000
```

This sets the reference to 10 Gbps, so GigabitEthernet = cost 10, FastEthernet = cost 100, which correctly reflects the speed difference.

## Routed protocols vs. routing protocols

These terms are frequently confused:

- **Routed protocol**: the protocol being forwarded. IPv4 and IPv6 are routed protocols. They carry user data from source to destination.
- **Routing protocol**: the protocol that builds the routing table. OSPF, EIGRP, RIP, and BGP are routing protocols. They exchange topology information between routers so each router knows where to forward routed protocol packets.

The distinction matters: OSPF routes IP packets, but OSPF itself runs over IP. RIP carries information about IP networks in UDP packets. Routing protocols are infrastructure; routed protocols are what the infrastructure serves.

## Connected and local routes

When you configure an IP address on a router interface and bring it up, IOS automatically installs two routes:

- **Connected route (C)**: the network prefix for the interface's subnet. E.g., if Gi0/0 has 192.168.1.1/24, a C route for 192.168.1.0/24 is installed.
- **Local route (L)**: a /32 host route for the router's own interface address (192.168.1.1/32). Used for locally destined traffic.

```text
C        192.168.1.0/24 is directly connected, GigabitEthernet0/0
L        192.168.1.1/32 is directly connected, GigabitEthernet0/0
```

If the interface goes down, both routes are removed. Routing protocols detect the topology change and update their tables accordingly.

## Default route

The default route matches any destination not covered by a more specific route. It is the "gateway of last resort."

```
0.0.0.0/0 -- prefix length 0, matches all 32-bit addresses
```

Configure a static default route:

```text
R1(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1
```

In `show ip route`, the default route appears as:

```text
Gateway of last resort is 203.0.113.1 to network 0.0.0.0
S*    0.0.0.0/0 [1/0] via 203.0.113.1
```

The `*` marks it as a candidate default route. Routers can receive the default route from a routing protocol (OSPF default-information originate, BGP network 0.0.0.0) instead of configuring it statically.

## Packet forwarding flow diagram

```
Packet arrives on Gi0/0 (dst: 192.168.1.100)
          |
          v
   +------+------+
   | Routing     |
   | Table Lookup|
   +------+------+
          |
          | Match found?
    YES   |              NO
  (use    |         +-----------+
  longest |         | Default   |
  prefix) |         | route?    |
          |         +-----------+
          |              |
          |       YES    |    NO
          |              |    --> Drop packet
          |              |        Send ICMP Unreachable
          v              v
   +------+------+  +---+------+
   | Forward via |  | Forward  |
   | matched     |  | via 0/0  |
   | next-hop    |  | gateway  |
   +------+------+  +----------+
          |
          v
   ARP for next-hop MAC (if not cached)
          |
          v
   Encapsulate in new Layer 2 frame
          |
          v
   Transmit on outgoing interface
```

## Static routes (teaser for Part 13)

The `ip route` command syntax:

```text
R1(config)# ip route <network> <mask> {next-hop-ip | exit-interface} [AD]
```

Examples:

```text
! Route to 192.168.2.0/24 via next-hop IP
R1(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.2

! Route using exit interface (only use on point-to-point; causes ARP issues on Ethernet)
R1(config)# ip route 192.168.2.0 255.255.255.0 GigabitEthernet0/1

! Default route
R1(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1

! Floating static (backup, higher AD than OSPF)
R1(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.5 115
```

Part 13 covers static routing in detail. Dynamic routing protocols (OSPF, EIGRP) are in Parts 14 and 15.

## Tradeoffs and gotchas

- **Recursive lookup failure**: a route can exist in the routing table but still be unusable if its next-hop is unreachable. The router does a recursive lookup: it looks up the next-hop IP in the routing table to find the exit interface. If the next-hop itself has no route, the packet is dropped even though the destination route exists. This is why `show ip route` having a route does not guarantee reachability.

  ```text
  R1# show ip route 192.168.1.0
  Routing entry for 192.168.1.0/24
    Known via "static", ...
    Routing Descriptor Blocks:
    * 10.5.5.1, via GigabitEthernet0/1
        Route metric is 0, traffic share count is 1
  
  R1# show ip route 10.5.5.1
  % Network not in table    <-- recursive lookup fails, route is unusable
  ```

- **ECMP (Equal-Cost Multi-Path)**: when multiple routes for the same prefix have the same AD and metric, IOS installs all of them and load-balances. By default, IOS uses per-destination (CEF) load balancing, not per-packet.

- **CEF (Cisco Express Forwarding)**: modern IOS uses CEF for hardware-accelerated forwarding. CEF pre-computes the adjacency table (next-hop MAC address + outgoing interface) so each packet does not trigger a separate ARP lookup. `show ip cef` and `show adjacency` are useful for troubleshooting.

- **Route vs. adjacency**: having a route does not mean the Layer 2 adjacency exists. A router may know the next-hop IP but fail to resolve its MAC address (ARP failure). The packet is dropped even though the routing table entry is valid.

- **Connected route removed on shutdown**: `shutdown` on an interface removes both C and L routes. Any routing protocol routes that depended on that connected network for reachability also disappear after their dead timer expires.

## References

- [Cisco IOS IP Routing: Protocol-Independent Configuration Guide](https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_pi/configuration/xe-16/iri-xe-16-book.html)
- [RFC 1812 - Requirements for IP Version 4 Routers](https://datatracker.ietf.org/doc/html/rfc1812)
- [Understanding Cisco Express Forwarding - Cisco](https://www.cisco.com/c/en/us/support/docs/routers/12000-series-routers/47321-ciscoef.html)

## Related topics

- [Part 10: IPv4 Addressing and Subnetting](./part-10-ipv4-addressing-and-subnetting)
- [Part 11: IPv6 Addressing](./part-11-ipv6-addressing)
- [Part 13: Static Routing](./part-13-static-routing)
