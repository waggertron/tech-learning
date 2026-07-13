---
title: "Part 23: First Hop Redundancy Protocols"
description: "How HSRP, VRRP, and GLBP present a shared virtual IP and MAC to hosts so that gateway failure does not cut off network access."
parent: networking
tags: [networking, ccna]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

A host sends every off-subnet packet to its default gateway. That gateway is a single IP address configured statically (or via DHCP). If that router fails, the host has no fallback -- it does not know another router exists. First Hop Redundancy Protocols (FHRPs) solve this by presenting a virtual IP and virtual MAC address shared between two or more routers. Hosts send traffic to the virtual IP. Whichever router is currently active accepts it.

## Why it matters

Dual-router setups are common. You pay for redundancy in hardware and ISP links, but without an FHRP, host traffic still hits a single physical router. One reboot or interface flap and every host on the subnet loses its default gateway until someone reconfigures them. FHRPs make the failover invisible to end hosts and automatic.

## The problem in concrete terms

```text
              Internet
                 |
        +--------+--------+
        |                 |
      R1 (active)       R2 (standby)
   192.168.1.2        192.168.1.3
        |                 |
        +--------+--------+
                 |
         Switch (VLAN 10)
                 |
     Hosts configured with default-gateway 192.168.1.1
```

Without an FHRP, hosts have `192.168.1.1` configured as their gateway. That IP belongs to R1 -- a physical address on a physical interface. R2 exists but hosts do not know about it.

With an FHRP, `192.168.1.1` is a virtual IP owned by neither router alone. R1 is currently active and responds to ARP for `192.168.1.1` with a virtual MAC. If R1 fails, R2 takes over, sends a gratuitous ARP advertising the same virtual MAC from its port, and hosts continue forwarding without any reconfiguration.

## The three protocols

| Feature             | HSRP v2                    | VRRP                        | GLBP                          |
|---------------------|----------------------------|-----------------------------|-------------------------------|
| Standard            | Cisco proprietary          | IEEE 802.112 (open)         | Cisco proprietary             |
| Active routers      | 1 active, 1 standby        | 1 master, 1+ backup         | 1 AVG + multiple AVFs         |
| [Load balancing](../../system-design/load-balancing/)      | No                         | No                          | Yes                           |
| Virtual MAC (v2)    | 0000.0C9F.Fxxx             | 0000.5E00.01xx              | 0007.B400.xxyy (per AVF)      |
| Virtual MAC (v1)    | 0000.0C07.ACxx             | N/A                         | N/A                           |
| Max groups          | 4096 (v2)                  | 255                         | 1024                          |

### HSRP (Hot Standby Router Protocol)

Cisco proprietary. One router is Active, one is Standby. The active router forwards traffic and responds to ARP for the virtual IP. The standby router monitors hello messages. If the active goes silent, the standby promotes itself.

HSRP v1 supports group numbers 0-255 and uses a virtual MAC of `0000.0C07.ACxx` (where xx is the group number in hex). HSRP v2 supports groups 0-4095, uses `0000.0C9F.Fxxx`, and adds millisecond timers and IPv6 support. v1 and v2 are not compatible. Both routers in a group must run the same version.

**HSRP states (in order):**

```text
Initial --> Learn --> Listen --> Speak --> Standby --> Active
```

- Initial: interface just came up
- Learn: waiting to hear the virtual IP from the active router
- Listen: knows the virtual IP; not active or standby
- Speak: sending hellos; participating in election
- Standby: backup; monitoring active
- Active: forwarding traffic for the virtual IP

**Election:** highest priority wins (default 100, range 1-255). Tie goes to highest interface IP. Preemption is off by default, meaning a recovered router does not automatically reclaim the active role even if it has higher priority.

### VRRP (Virtual Router Redundancy Protocol)

Open standard (IEEE 802.112). Terminology differs: the forwarding router is called Master, others are Backup. The router whose physical IP matches the virtual IP is automatically the master with priority 255 and cannot be changed. VRRP preemption is enabled by default, which is the opposite of HSRP.

### GLBP (Gateway Load Balancing Protocol)

Cisco proprietary. One router is elected Active Virtual Gateway (AVG). The AVG assigns virtual MACs to each Active Virtual Forwarder (AVF) in the group. When hosts ARP for the virtual IP, the AVG responds with different virtual MACs in round-robin (or other methods). Each host therefore sends its traffic to a different physical router, spreading load. HSRP and VRRP only use one active router at a time -- idle standby routers do not forward any traffic.

## HSRP configuration

```text
R1(config)# interface GigabitEthernet0/0
R1(config-if)# standby version 2
R1(config-if)# standby 1 ip 192.168.1.1
R1(config-if)# standby 1 priority 110
R1(config-if)# standby 1 preempt
R1(config-if)# standby 1 track GigabitEthernet0/1 20
```

- `standby version 2`: set to v2 (must match on both routers)
- `standby 1 ip 192.168.1.1`: group 1, virtual IP
- `standby 1 priority 110`: higher than default 100, so R1 wins election
- `standby 1 preempt`: R1 reclaims active role if it recovers after a failure
- `standby 1 track GigabitEthernet0/1 20`: if Gi0/1 (the WAN interface) goes down, decrement priority by 20; this drops R1 to 90, below R2's default 100, triggering failover even if R1 itself is still up

R2 configuration (standby router, lower priority):

```text
R2(config)# interface GigabitEthernet0/0
R2(config-if)# standby version 2
R2(config-if)# standby 1 ip 192.168.1.1
R2(config-if)# standby 1 priority 100
R2(config-if)# standby 1 preempt
```

## VRRP configuration

```text
R1(config)# interface GigabitEthernet0/0
R1(config-if)# vrrp 1 ip 192.168.1.1
R1(config-if)# vrrp 1 priority 110
R1(config-if)# vrrp 1 preempt
```

VRRP group numbers map directly to the virtual MAC (`0000.5E00.01xx` where xx is the group number in hex). VRRP preemption is on by default. The `no vrrp 1 preempt` command disables it if needed.

## Failover scenario

```text
Normal operation:
  Hosts --> virtual MAC (owned by R1) --> R1 --> Internet

R1 interface Gi0/0 fails:
  R1 stops sending HSRP hellos
  R2 waits hold-down timer (default 10s in v1, configurable in v2)
  R2 promotes itself to Active
  R2 sends gratuitous ARP: "192.168.1.1 is at 0000.0C9F.F001" (from R2's port)
  Switch updates its MAC table
  Hosts' ARP caches still have 192.168.1.1 -> virtual MAC (unchanged)
  Traffic flows normally through R2

R1 recovers (with preempt enabled):
  R1 sends hellos with priority 110
  R2 sees higher-priority peer
  R1 becomes Active again
  R2 returns to Standby
```

## Verification commands

```text
R1# show standby
R1# show standby brief
R1# show vrrp
R1# show vrrp brief
R1# show glbp
R1# show glbp brief
```

`show standby brief` output:

```text
                     P indicates configured to preempt.
                     |
Interface   Grp  Pri P State    Active          Standby         Virtual IP
Gi0/0         1  110 P Active   local           192.168.1.3     192.168.1.1
```

## Gotchas

**Preemption is off by default in HSRP.** If R1 fails, R2 becomes active. When R1 comes back, it does not reclaim the active role without `standby 1 preempt`. You might think the higher-priority router is always active, but that is only true with preemption enabled.

**HSRP v1 and v2 are not compatible.** Mismatched versions on the same group means neither side wins a proper election. Both routers end up active (split-brain) or one side never transitions out of Listen. Verify with `show standby` and check the version field on both routers.

**Object tracking for WAN uplinks is often more important than interface tracking.** If R1's Gi0/0 LAN interface stays up but its WAN connection drops, HSRP does not detect a problem without a tracked object (IP SLA or interface track). Hosts keep sending to R1, which has no path out.

**GLBP AVG election follows the same priority/IP rules as HSRP active election.** Each AVF gets its own virtual MAC. The AVG responds to ARP with different virtual MACs per host, so hosts ARP cache entries point to different routers. Asymmetric load distribution is possible if hosts ARP at different rates.

**VRRP preemption is on by default** -- opposite of HSRP. A recovered higher-priority VRRP router will immediately take the master role without any extra configuration.

## References

- [Cisco HSRP Configuration Guide (IOS XE)](https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/ipapp_fhrp/configuration/xe-16/fhp-xe-16-book/fhp-hsrp-xe.html)
- [RFC 5798 - Virtual Router Redundancy Protocol (VRRPv3)](https://datatracker.ietf.org/doc/html/rfc5798)
- [Cisco GLBP Configuration Guide](https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/ipapp_fhrp/configuration/xe-16/fhp-xe-16-book/fhp-glbp.html)

## Related topics

- [Part 8: Inter-VLAN Routing](../part-08-inter-vlan-routing/) -- routers-on-a-stick and SVIs; FHRP sits at the same Layer 3 boundary
- [Part 12: Routing Fundamentals](../part-12-routing-fundamentals/) -- how routers decide where to forward packets
- [Part 13: Static Routing](../part-13-static-routing/) -- the simpler routing baseline FHRP builds on top of
