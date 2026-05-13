---
title: "Part 7: VLANs"
description: "How VLANs segment a physical LAN into logical broadcast domains, how 802.1Q tagging works, and how to configure access and trunk ports on Cisco IOS."
parent: networking
tags: [networking, ccna]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

A single switch with 48 ports is one broadcast domain. Every ARP request, every DHCP discover, every unknown unicast flood hits every port. VLANs let you carve that one physical switch into multiple logical switches, each with its own broadcast domain, without buying more hardware.

## Why it matters

VLANs are the primary tool for network segmentation in enterprise LANs. They appear on every CCNA exam, in every enterprise design, and in every troubleshooting scenario involving "host A can't reach host B even though they're on the same switch." That last symptom is almost always a VLAN mismatch.

## What a VLAN is

A VLAN (Virtual Local Area Network) is a logical grouping of switch ports. Ports in the same VLAN share one broadcast domain. Ports in different VLANs are isolated at Layer 2: broadcasts stay within the VLAN, and traffic between VLANs requires a Layer 3 device (router or Layer 3 switch).

```
Physical switch (one box, 24 ports):

  +------+------+------+------+------+------+
  | Gi0/1| Gi0/2| Gi0/3| Gi0/4| Gi0/5| Gi0/6|
  +--+---+--+---+--+---+--+---+--+---+--+---+
     |      |      |      |      |      |
  VLAN 10  VLAN 10  VLAN 10  VLAN 20  VLAN 20  VLAN 20
  (SALES)  (SALES)  (SALES)  (HR)     (HR)     (HR)

VLAN 10 is one broadcast domain.
VLAN 20 is a separate broadcast domain.
A broadcast sent by Gi0/1 reaches Gi0/2 and Gi0/3, but NOT Gi0/4-6.
```

## VLAN 1: the default VLAN

Every port on a new switch is assigned to VLAN 1 by default. VLAN 1 also carries management traffic, CDP (Cisco Discovery Protocol), VTP, and PAgP by default. You cannot delete VLAN 1.

Best practice: do not use VLAN 1 for user traffic. Move management to a dedicated VLAN and reassign all user-facing ports away from VLAN 1. This limits the blast radius of a misconfigurations and reduces exposure to VLAN hopping attacks.

## Access ports vs trunk ports

### Access port

An access port belongs to exactly one VLAN. Frames entering and leaving an access port are untagged. The end device (PC, printer, IP phone) has no idea VLANs exist.

```
PC ----[untagged frame]---- Access Port (VLAN 10) ---- Switch
```

### Trunk port

A trunk port carries frames for multiple VLANs simultaneously. To keep them separated, the switch inserts an 802.1Q VLAN tag into each frame as it leaves the trunk port and strips the tag as frames arrive.

```
Switch A ----[tagged frames: VLAN 10, 20, 30]---- Trunk Port ---- Switch B
```

Trunk ports are used between switches and between switches and routers (for inter-VLAN routing).

## 802.1Q VLAN tagging

IEEE 802.1Q defines the standard for VLAN tagging. A 4-byte tag is inserted into the Ethernet frame between the Source MAC and the EtherType field:

```
Original frame:
+----------+----------+----------+------------------+
| Dest MAC | Src MAC  | EtherType|     Payload      |
+----------+----------+----------+------------------+

802.1Q tagged frame:
+----------+----------+--------+----------+------------------+
| Dest MAC | Src MAC  |  TAG   | EtherType|     Payload      |
+----------+----------+--------+----------+------------------+
                          |
                     4-byte 802.1Q tag:
                     +--------+---+---+------------+
                     |  TPID  |PCP|DEI|  VLAN ID   |
                     | 0x8100 | 3b| 1b|  12 bits   |
                     +--------+---+---+------------+
                     TPID: Tag Protocol ID (always 0x8100)
                     PCP:  Priority Code Point (QoS)
                     DEI:  Drop Eligible Indicator
                     VLAN ID: 12 bits = values 1-4094
```

The 12-bit VLAN ID field supports 4096 values (0 and 4095 are reserved), leaving 4094 usable VLAN IDs.

## Native VLAN

The native VLAN on a trunk port is special: frames belonging to the native VLAN are sent across the trunk **untagged**. When untagged frames arrive on a trunk port, the switch assigns them to the native VLAN.

Default native VLAN is VLAN 1. This creates a security risk: if an attacker on an access port is connected to a switch port with the same VLAN ID as the native VLAN on an adjacent trunk, they may be able to send double-tagged frames that traverse VLAN boundaries (VLAN hopping).

Best practice: change the native VLAN to an unused VLAN (e.g., VLAN 99) on all trunks. The native VLAN must match on both ends of a trunk or CDP will warn you.

## VLAN configuration on Cisco IOS

### Creating VLANs and assigning access ports

```text
SW1# configure terminal

SW1(config)# vlan 10
SW1(config-vlan)# name SALES
SW1(config-vlan)# exit

SW1(config)# vlan 20
SW1(config-vlan)# name HR
SW1(config-vlan)# exit

SW1(config)# interface GigabitEthernet0/1
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 10
SW1(config-if)# exit

SW1(config)# interface GigabitEthernet0/4
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 20
SW1(config-if)# exit
```

### Configuring a trunk port

```text
SW1(config)# interface GigabitEthernet0/24
SW1(config-if)# switchport mode trunk
SW1(config-if)# switchport trunk allowed vlan 10,20,30
SW1(config-if)# switchport trunk native vlan 99
SW1(config-if)# exit
```

`switchport trunk allowed vlan` restricts which VLANs are permitted on the trunk. Omitting this allows all VLANs (not best practice in production).

### Verification

```text
SW1# show vlan brief

VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Gi0/7, Gi0/8, Gi0/9, Gi0/10
10   SALES                            active    Gi0/1, Gi0/2, Gi0/3
20   HR                               active    Gi0/4, Gi0/5, Gi0/6
99   NATIVE                           active
1002 fddi-default                     act/unsup
1003 token-ring-default               act/unsup
1004 fddinet-default                  act/unsup
1005 trnet-default                    act/unsup
```

Note: trunk ports do not appear in `show vlan brief`. Use `show interfaces trunk` instead.

```text
SW1# show interfaces trunk

Port        Mode             Encapsulation  Status        Native vlan
Gi0/24      on               802.1q         trunking      99

Port        Vlans allowed on trunk
Gi0/24      10,20,30

Port        Vlans allowed and active in management domain
Gi0/24      10,20,30

Port        Vlans in spanning tree forwarding state and not pruned
Gi0/24      10,20,30
```

## VTP (VLAN Trunking Protocol)

VTP is a Cisco proprietary protocol that synchronizes the VLAN database across switches. One switch acts as VTP server; others are VTP clients that receive VLAN updates automatically.

VTP modes:

| Mode | Can create VLANs | Syncs from server | Forwards VTP ads |
|---|---|---|---|
| Server | Yes | Yes | Yes |
| Client | No | Yes | Yes |
| Transparent | Yes (local only) | No | Yes (passes through) |

VTP uses a revision number. When a VTP advertisement arrives with a higher revision number, the receiving switch overwrites its entire VLAN database.

This is dangerous. If you take a switch out of a lab, it may have a high VTP revision number. Plug it into a production network in client or server mode and it can wipe every VLAN on the domain in seconds. Set new switches to VTP transparent mode or use VTP version 3 (which requires explicit promotion) before connecting to production trunks.

Many organizations disable VTP entirely and manage VLANs manually or with automation.

## Voice VLAN

An IP phone connects to a switch access port. A PC connects to the IP phone's built-in switch port. Both need VLAN separation: voice traffic in a voice VLAN (for QoS), data traffic in the data VLAN.

```text
SW1(config)# interface GigabitEthernet0/5
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 10
SW1(config-if)# switchport voice vlan 150
```

The switch sends CDP to the IP phone, instructing it to tag its own voice traffic with VLAN 150. PC traffic remains untagged (VLAN 10). From the switch port's perspective this looks like a mini-trunk, but it is configured as an access port.

## Gotchas and traps

**VTP revision number wipe.** Covered above. Set new switches to transparent mode before connecting to a production network.

**Native VLAN mismatch.** If SW1's trunk port has native VLAN 1 and SW2's trunk port has native VLAN 99, frames will be misassigned. CDP reports this mismatch:

```text
%CDP-4-NATIVE_VLAN_MISMATCH: Native VLAN mismatch discovered on
GigabitEthernet0/24 (99), with SW2 GigabitEthernet0/24 (1).
```

**Forgetting to create the VLAN before assigning it.** If you run `switchport access vlan 10` before `vlan 10` exists, the switch creates the VLAN automatically in some IOS versions. In others, the port goes inactive. Always create the VLAN first.

**Allowed VLAN list drift.** In large networks with many trunk links, `switchport trunk allowed vlan add 30` is easy to forget on one switch. Use automation or a configuration management tool to keep trunk allowed lists consistent.

**VLAN pruning.** VTP can automatically prune VLANs from trunks where they have no active ports. Useful for bandwidth, but can cause unexpected behavior if a host is moved. Understand whether VTP pruning is enabled before troubleshooting "why isn't VLAN 30 passing on this trunk."

## References

- [Cisco IOS VLAN Configuration Guide](https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9300/software/release/17-9/configuration_guide/vlan/b_179_vlan_9300_cg.html)
- [IEEE 802.1Q-2018 Standard for Bridges and Bridged Networks](https://standards.ieee.org/ieee/802.1Q/10323/)
- [Cisco VTP FAQ](https://www.cisco.com/c/en/us/support/docs/lan-switching/vtp/98154-cause-of-vtp-wiping-vlan.html)

## Related topics

- [Part 6: Switching Fundamentals](./part-06-switching-fundamentals)
- [Part 8: Inter-VLAN Routing](./part-08-inter-vlan-routing)
- [Part 9: EtherChannel and Link Aggregation](./part-09-etherchannel-and-link-aggregation)
