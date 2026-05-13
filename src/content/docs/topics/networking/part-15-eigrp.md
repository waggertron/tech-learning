---
title: "Part 15: EIGRP"
description: "How EIGRP uses the DUAL algorithm to guarantee loop-free fast convergence, with successor and feasible successor concepts, configuration, and comparison to OSPF."
parent: networking
tags: [networking, ccna]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

EIGRP converges faster than OSPF in most topologies because it does not need to rerun a full SPF calculation when a link fails. If a backup path already satisfies the feasibility condition, EIGRP switches to it instantly with no recalculation at all. That instant failover is the reason network engineers still choose EIGRP for large enterprise campus networks despite it being a Cisco-developed protocol.

## Why it matters

OSPF computes shortest paths by building a complete topology map and running Dijkstra's algorithm. Every link-state change triggers a new SPF run. EIGRP takes a different approach: it stores precomputed backup paths in a topology table and checks them mathematically before a failure ever occurs. When the primary path fails, if a validated backup exists, it activates immediately. No neighbor queries, no SPF run, no waiting.

EIGRP was Cisco-proprietary for decades. In 2013 Cisco published it as an open standard (RFC 7868), though full interoperability with non-Cisco implementations remains limited in practice.

## EIGRP classification

EIGRP is often called a hybrid protocol. It behaves like a distance-vector protocol in that routers only communicate with directly connected neighbors and do not have a full topology map. But it adds link-state-like characteristics: it uses hello packets to discover neighbors, maintains a topology table, and converges through the DUAL algorithm rather than Bellman-Ford. The RFC categorizes it as an advanced distance-vector protocol.

## Key terminology

Before reading EIGRP output, you need these five terms exactly right. They appear on the CCNA exam with deliberate precision.

**Feasible Distance (FD):** The best metric from this router to the destination. This is the value installed in the routing table.

**Reported Distance (RD) / Advertised Distance (AD):** The metric a neighbor reports for reaching the destination. This is the neighbor's cost, not this router's cost. (CCNA uses both terms interchangeably; the IOS CLI uses "Reported Distance.")

**Successor:** The neighbor providing the best path (lowest FD) to a destination. Installed in the routing table.

**Feasible Successor (FS):** A backup neighbor whose Reported Distance is strictly less than this router's current Feasible Distance. Stored in the topology table, not the routing table. Activates instantly on successor failure.

**Feasibility Condition (FC):** The mathematical rule an FS must satisfy: RD of the neighbor < FD of the current successor. This guarantees the backup path is loop-free without running any algorithm.

```
           RD = 10                  FD = 15
  R2 ------+
           |
           R1 -----> 192.168.2.0   (Successor via R2, FD=15)
           |
  R3 ------+
           RD = 12

R3 RD (12) < R1 FD (15): FC satisfied. R3 is a Feasible Successor.
R3 activates instantly if R2 fails.
```

If no feasible successor exists and the successor fails, EIGRP enters **active state** and sends queries to all neighbors. This is the slow convergence path. Avoid it by designing summarization boundaries that limit query scope.

## EIGRP metric

The composite metric formula:

```
Metric = 256 * ((10^7 / min_bandwidth_kbps) + sum_of_delays_in_tens_of_microseconds)
```

By default EIGRP uses only bandwidth (of the slowest link on the path) and delay (cumulative). Load, reliability, and MTU are part of the K-value formula but are disabled by default (K1=1, K2=0, K3=1, K4=0, K5=0). Never enable them in production: they cause constant metric fluctuation and neighbor resets.

Delay is configured per interface with `delay <value>` (in tens of microseconds). Bandwidth is configured with `bandwidth <kbps>`. These are logical values EIGRP reads; they do not control actual interface speed.

## EIGRP tables

EIGRP maintains three tables:

| Table | Command | Contents |
|---|---|---|
| Neighbor table | `show ip eigrp neighbors` | Directly connected EIGRP neighbors, hold timers, uptime |
| Topology table | `show ip eigrp topology` | All known paths: successors, feasible successors, FD, RD |
| Routing table | `show ip route eigrp` | Best path (successor) per destination, marked `D` |

The topology table is the key differentiator. It holds every path EIGRP knows about, not just the best one. The routing table holds only the successor.

## EIGRP AS numbers

Routers form EIGRP neighbors only if they share the same Autonomous System (AS) number. The AS number is locally significant (unlike BGP AS numbers, which are globally registered). It identifies the EIGRP process, not a globally unique administrative domain.

```text
R1(config)# router eigrp 100
R2(config)# router eigrp 100    <- must match R1
R3(config)# router eigrp 200    <- will NOT neighbor with R1 or R2
```

## Configuration: classic mode

Classic mode is what you see on older IOS versions and most CCNA study material:

```text
R1(config)# router eigrp 100
R1(config-router)# network 192.168.1.0 0.0.0.255
R1(config-router)# network 10.0.0.0 0.0.0.3
R1(config-router)# no auto-summary
R1(config-router)# passive-interface GigabitEthernet0/2
```

The `network` command uses a wildcard mask. EIGRP activates on interfaces whose IP addresses fall within the range and advertises those networks to neighbors.

`no auto-summary` is critical. Auto-summary causes EIGRP to advertise classful network boundaries instead of the actual subnets. In a discontiguous network (same major network split across multiple locations), auto-summary creates routing black holes. Disable it always in modern configurations. It is off by default in IOS 15 and later, but the safe habit is to disable it explicitly.

`passive-interface` suppresses EIGRP hello packets on that interface. The network is still advertised; no neighbor forms on that segment.

## Configuration: named mode

Named mode (available in IOS 15.0(1)M and later) consolidates IPv4, IPv6, and multiple address families under one process. It is the preferred modern approach:

```text
R1(config)# router eigrp MYORG
R1(config-router)# address-family ipv4 unicast autonomous-system 100
R1(config-router-af)# network 192.168.1.0 0.0.0.255
R1(config-router-af)# network 10.0.0.0 0.0.0.3
R1(config-router-af)# af-interface GigabitEthernet0/2
R1(config-router-af-interface)# passive-interface
R1(config-router-af-interface)# exit-af-interface
```

Named mode also enables `no auto-summary` by default and supports per-interface configuration through `af-interface` sub-mode.

## Verification

Check neighbors (hold timer should be counting down, not stuck at 0):

```text
R1# show ip eigrp neighbors
IP-EIGRP neighbors for process 100
H   Address          Interface    Hold  Uptime    SRTT  RTO  Q  Seq
0   10.0.0.2         Gi0/0          13  01:23:45   10   200  0  42
1   10.0.1.2         Gi0/1          11  01:23:40   12   200  0  38
```

Check topology table for successors and feasible successors:

```text
R1# show ip eigrp topology
P 192.168.2.0/24, 1 successors, FD is 2816
    via 10.0.0.2 (2816/2048), GigabitEthernet0/0     <- successor
    via 10.0.1.2 (3072/2048), GigabitEthernet0/1     <- feasible successor
```

`P` = passive (stable). `A` = active (querying, slow convergence in progress).

Check EIGRP routes in the routing table (marked `D` for DUAL):

```text
R1# show ip route eigrp
D    192.168.2.0/24 [90/2816] via 10.0.0.2, GigabitEthernet0/0
D EX 10.1.0.0/24 [170/3072] via 10.0.0.2, GigabitEthernet0/0
```

`D` = internal EIGRP (AD 90). `D EX` = external EIGRP, redistributed from another source (AD 170).

## EIGRP vs OSPF comparison

| Attribute | EIGRP | OSPF |
|---|---|---|
| Algorithm | DUAL (distance-vector based) | Dijkstra SPF (link-state) |
| Standard | RFC 7868 (formerly Cisco only) | RFC 2328 (OSPFv2), RFC 5340 (OSPFv3) |
| Metric | Bandwidth + delay (composite) | Cost (reference BW / interface BW) |
| Convergence | Instant if FS exists; slow if active state | SPF recalculation on every topology change |
| CPU and memory | Lower (no full topology map) | Higher (LSDB + SPF per area) |
| Scalability | Good with summarization; queries can flood | Better with proper area design |
| Admin distance | 90 (internal), 170 (external) | 110 |
| Multivendor | Limited | Full |
| Auto-summary | Off by default (IOS 15+) | N/A |

## Summarization

EIGRP supports manual summarization on any interface, not just at area boundaries like OSPF. Configure it on the outgoing interface:

```text
R1(config-if)# ip summary-address eigrp 100 192.168.0.0 255.255.252.0
```

This summarizes 192.168.0.0/24 through 192.168.3.0/24 into one /22 advertisement. The local router installs a null0 route for the summary to prevent routing loops:

```text
D    192.168.0.0/22 is a summary, 00:01:23, Null0
```

Summarization at distribution-layer routers limits the scope of EIGRP queries. When a successor fails and no FS exists, queries only propagate as far as the summarization boundary. This is the primary tool for preventing SIA in large EIGRP networks.

## Tradeoffs and gotchas

**Gotcha: Stuck In Active (SIA)**

If a successor fails and no feasible successor exists, EIGRP sends queries to all neighbors. Those neighbors query their neighbors. If a reply does not come back within the active timer (default 3 minutes), the route goes SIA and the neighbor that did not reply is dropped. SIA is the major convergence failure mode in large, flat EIGRP networks. Fix it with summarization boundaries at distribution layer routers.

**Gotcha: auto-summary in discontiguous networks**

If your 10.0.0.0/8 space is split between two sites connected through a different network, auto-summary causes both sites to advertise 10.0.0.0/8. Routers in the middle see two equal-cost paths to 10.0.0.0/8 and load-balance, dropping traffic that goes to the wrong site. Always use `no auto-summary`.

**Gotcha: mismatched K values**

EIGRP neighbors will not form if their K values differ. The default K1=1, K2=0, K3=1, K4=0, K5=0. If someone has manually tuned K values on one router and not another, adjacency fails with a K-value mismatch message in the log.

**Gotcha: mismatched AS numbers**

This is the most common EIGRP configuration error. Routers log "neighbor not on common subnet" or simply never form adjacency. Check `show ip eigrp neighbors` and verify the AS number in `show run | section eigrp`.

## References

- [RFC 7868: Cisco's Enhanced Interior Gateway Routing Protocol (EIGRP)](https://datatracker.ietf.org/doc/html/rfc7868)
- [Cisco EIGRP Configuration Guide, IOS XE](https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_eigrp/configuration/xe-16/ire-xe-16-book/ire-enhanced-igrp.html)

## Related topics

- [Part 12: IP Routing Fundamentals](./part-12-ip-routing-fundamentals)
- [Part 14: OSPF](./part-14-ospf)
- [Part 16: NAT and PAT](./part-16-nat-and-pat)
