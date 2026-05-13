---
title: "Part 14: OSPF"
description: "How OSPF builds a complete topology map and computes shortest paths using Dijkstra's algorithm, with configuration and verification commands."
parent: networking
tags: [networking, ccna]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

OSPF gives every router in an area an identical map of the network. Each router runs Dijkstra's SPF algorithm on that map independently and computes the shortest path to every destination. No routing loop is possible within an area: every router sees the same topology and agrees on the best path.

## Why it matters

Distance-vector protocols like RIP send routing tables to neighbors and trust them blindly. A router using RIP knows the destination is reachable via a neighbor but has no idea what the actual path looks like. Link-state protocols like OSPF share raw topology information instead. Each router builds its own link-state database (LSDB), containing the state of every link in the area, and computes its own shortest-path tree. The result is faster convergence, better scalability, and loop-free routing by design.

OSPF is defined in RFC 2328 (OSPFv2, for IPv4) and RFC 5340 (OSPFv3, which supports both IPv6 and IPv4). CCNA focuses on OSPFv2.

## OSPF areas

Large OSPF deployments use areas to limit the scope of the LSDB and SPF recalculations.

```
                    Area 0 (Backbone)
          +-----------------------------+
          |   R1 --- R2 --- R3          |
          +----+-------------------+----+
               |                   |
          Area 1                 Area 2
          R4 - R5               R6 - R7
               |
          (ABR = R1, R3)
```

Every non-backbone area must connect to Area 0, either directly or through a virtual link. Area 0 is the backbone and the transit point for all inter-area traffic.

**Router roles:**

| Role | Description |
|---|---|
| Internal router | All interfaces in a single area |
| Backbone router | At least one interface in Area 0 |
| ABR (Area Border Router) | Interfaces in two or more areas; summarizes routes between them |
| ASBR (AS Boundary Router) | Redistributes routes from outside OSPF into OSPF |

**Benefits of areas:**
- Each area has its own LSDB. SPF recalculation triggered by a link failure is contained to that area.
- ABRs can summarize routes between areas, reducing the size of the routing table in other areas.
- Fewer LSAs flood across the network.

## DR and BDR election

On a multi-access network like Ethernet, if every OSPF router formed a full adjacency with every other router, you would have n*(n-1)/2 adjacencies. With 10 routers that is 45 adjacencies, all exchanging LSAs every time anything changes.

OSPF solves this by electing a Designated Router (DR) and a Backup Designated Router (BDR) on each multi-access segment. All other routers (DROTHERs) form adjacency only with the DR and BDR, reducing adjacencies to n-1.

```
         DROTHER      DROTHER
            R3            R4
             \            /
              \          /
        -------DR------BDR-------
              R1        R2
             /            \
            R5            R6
         DROTHER      DROTHER
```

LSA updates go to the DR's multicast address (224.0.0.6). The DR retransmits them to all OSPF routers (224.0.0.5). The BDR monitors the DR and takes over if the DR fails.

**Election rules:**
1. Highest OSPF priority wins (default priority is 1; range 0-255; priority 0 means the router is ineligible)
2. Tie: highest Router ID wins
3. Router ID selection order: manually configured > highest loopback IP > highest active interface IP

The election is non-preemptive. If a higher-priority router comes online after the DR is already elected, it does not displace the current DR. You must either reset OSPF (`clear ip ospf process`) or wait for the current DR to fail.

## OSPF neighbor states

OSPF routers progress through these states before reaching Full adjacency:

```
Down -> Init -> 2-Way -> Exstart -> Exchange -> Loading -> Full
```

| State | Meaning |
|---|---|
| Down | No hellos received from neighbor |
| Init | Hello received but own Router ID not in that hello |
| 2-Way | Bidirectional communication confirmed; DR/BDR election happens here |
| Exstart | Master/slave relationship established for DBD exchange |
| Exchange | Database Description (DBD) packets exchanged; routers learn what LSAs the other has |
| Loading | LSRs (Link State Requests) sent; LSUs (Link State Updates) received |
| Full | LSDBs are synchronized; full adjacency achieved |

DROTHERs reach Full only with the DR and BDR. They remain at 2-Way with each other. This is expected and correct behavior, not an error.

## OSPF cost

OSPF uses cost as its metric. The formula is:

```
Cost = 10^8 / interface bandwidth (bps)
```

| Interface | Bandwidth | Default Cost |
|---|---|---|
| Serial (T1) | 1.544 Mbps | 64 |
| FastEthernet | 100 Mbps | 1 |
| GigabitEthernet | 1000 Mbps | 1 |
| 10 GigabitEthernet | 10 Gbps | 1 |

FastEthernet and GigabitEthernet have the same default cost of 1. OSPF cannot distinguish between them. Fix this by raising the reference bandwidth to match your fastest links:

```text
R1(config-router)# auto-cost reference-bandwidth 10000
```

This sets the reference to 10 Gbps (10,000 Mbps). Now:
- GigabitEthernet: cost = 10,000 / 1,000 = 10
- FastEthernet: cost = 10,000 / 100 = 100
- 10G Ethernet: cost = 10,000 / 10,000 = 1

Set this consistently on all routers in the OSPF domain. Mismatched reference bandwidths lead to asymmetric path selection.

You can also set cost manually on an interface:

```text
R1(config-if)# ip ospf cost 5
```

## Configuring OSPF

```text
R1(config)# router ospf 1
R1(config-router)# router-id 1.1.1.1
R1(config-router)# network 192.168.1.0 0.0.0.255 area 0
R1(config-router)# network 10.0.0.0 0.0.0.3 area 0
R1(config-router)# passive-interface GigabitEthernet0/1
R1(config-router)# auto-cost reference-bandwidth 10000
```

The `network` command uses a wildcard mask (inverse of subnet mask). The router enables OSPF on any interface whose IP address falls within the specified range and assigns it to the given area.

The process ID (1 in `router ospf 1`) is locally significant only. Two routers with different process IDs can still become OSPF neighbors. It has no effect on adjacency formation.

**Passive interface** suppresses OSPF hello packets on that interface. The network attached to the interface is still advertised into OSPF. It just does not send or receive hellos. Use this on interfaces connected to end hosts or stub segments where no OSPF neighbor will ever exist. Sending hellos on user-facing ports wastes bandwidth and can confuse hosts.

## Redistributing a default route

To advertise a default route into OSPF (for example, on an internet-facing router):

```text
R1(config-router)# default-information originate
```

This injects a Type 5 External LSA for 0.0.0.0/0 into OSPF. Other OSPF routers install it as an E2 external route. Add `always` if you want OSPF to advertise the default even when R1 does not have a default route itself:

```text
R1(config-router)# default-information originate always
```

## Verifying OSPF

Check neighbor adjacencies:

```text
R1# show ip ospf neighbor

Neighbor ID   Pri   State     Dead Time   Address       Interface
2.2.2.2         1   FULL/DR   00:00:35    10.0.0.2      GigabitEthernet0/0
3.3.3.3         1   FULL/BDR  00:00:38    10.0.0.3      GigabitEthernet0/0
```

Check the LSDB:

```text
R1# show ip ospf database
```

Check OSPF routes in the routing table (marked `O`):

```text
R1# show ip route ospf
O    192.168.2.0/24 [110/2] via 10.0.0.2, GigabitEthernet0/0
O IA 192.168.3.0/24 [110/3] via 10.0.0.2, GigabitEthernet0/0
```

`O` = intra-area. `O IA` = inter-area (from an ABR). `O E1`/`O E2` = external (from an ASBR).

Check OSPF on a specific interface:

```text
R1# show ip ospf interface GigabitEthernet0/0
```

This shows hello/dead timers, DR/BDR status, cost, and neighbor count.

## Tradeoffs and gotchas

**Gotcha: hello and dead timer mismatch**

OSPF neighbors will not form adjacency if hello or dead timers do not match. Default timers on broadcast networks are hello=10s, dead=40s. On point-to-point or non-broadcast networks they are hello=30s, dead=120s. Verify with `show ip ospf interface`. Change them with:

```text
R1(config-if)# ip ospf hello-interval 5
R1(config-if)# ip ospf dead-interval 20
```

**Gotcha: area ID mismatch**

If two routers configure the same interface subnet into different areas, they will not form adjacency. Always double-check area assignments.

**Gotcha: stub flag mismatch**

Stub areas use a flag in the hello packet. If one router has the area configured as stub and the other does not, adjacency fails. Both sides must agree on the stub setting.

**Gotcha: same cost for FastEthernet and GigabitEthernet**

This is the most common OSPF cost mistake on CCNA exams and in real networks. Always set `auto-cost reference-bandwidth` to match your environment before configuring any OSPF neighbors.

**Gotcha: Router ID change requires OSPF reset**

If you change the router ID after OSPF is running, it does not take effect until you reset the OSPF process (`clear ip ospf process`). Adjacencies will drop and reform during the reset.

## References

- [RFC 2328: OSPF Version 2](https://datatracker.ietf.org/doc/html/rfc2328)
- [Cisco OSPF Configuration Guide, IOS XE](https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/iproute_ospf/configuration/xe-16/iro-xe-16-book/iro-cfg.html)

## Related topics

- [Part 12: IP Routing Fundamentals](./part-12-ip-routing-fundamentals)
- [Part 13: Static Routing](./part-13-static-routing)
- [Part 15: EIGRP](./part-15-eigrp)
