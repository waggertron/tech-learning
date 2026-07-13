---
title: "Part 21: EtherChannel"
description: "How to bundle multiple physical switch links into one logical port-channel for higher throughput and redundancy."
parent: networking
tags: [networking, ccna]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

Two switches connected by two cables sounds like redundancy. Spanning Tree Protocol disagrees: it will block one of those links to prevent a loop, and that port sits idle until a failure. EtherChannel fixes this by telling both the switches and STP that those two cables are a single logical link. You get the bandwidth of both and the redundancy of both, with no blocked ports.

## Why it matters

Without EtherChannel, a switch uplink is bottlenecked by the speed of a single physical interface. A 1 Gbps uplink shared across 48 access ports becomes the first choke point under load. Bundling two or four interfaces multiplies that capacity without replacing hardware. Because STP treats the resulting port-channel as one logical port, no link is wasted.

EtherChannel also provides sub-second failover. If one member link fails, traffic redistributes across the remaining links. No STP reconvergence needed.

## Protocols and modes

Three options exist for forming an EtherChannel. Two use negotiation protocols. One does not.

**LACP (Link Aggregation Control Protocol)**
IEEE 802.3ad standard. Works between Cisco and non-Cisco equipment.

| Mode    | Behavior                                      |
|---------|-----------------------------------------------|
| active  | Initiates LACP negotiation; forms with active or passive |
| passive | Waits for LACP negotiation; forms with active only       |

Two passive sides will not form a channel. Neither initiates.

**PAgP (Port Aggregation Protocol)**
Cisco proprietary. Only works between Cisco devices.

| Mode      | Behavior                                          |
|-----------|---------------------------------------------------|
| desirable | Initiates PAgP negotiation; forms with desirable or auto |
| auto      | Waits for PAgP negotiation; forms with desirable only    |

Two auto sides will not form a channel.

**Static (on)**
No negotiation protocol. Both sides must be set to `on`. Fast to configure, but no handshake means no detection of mismatches.

### Mode compatibility table

```text
Side A      | Side B      | Result
------------|-------------|----------------------------
active      | active      | Forms (LACP)
active      | passive     | Forms (LACP)
passive     | passive     | Does NOT form
desirable   | desirable   | Forms (PAgP)
desirable   | auto        | Forms (PAgP)
auto        | auto        | Does NOT form
on          | on          | Forms (static)
on          | active      | Does NOT form (suspended)
on          | desirable   | Does NOT form (suspended)
active      | desirable   | Does NOT form (protocol mismatch)
```

Never mix LACP and PAgP on the same channel group. Setting one side to `on` while the other uses a negotiation protocol suspends the channel.

## Requirements for member ports

All interfaces in a channel group must match on:

- Speed and duplex
- VLAN configuration (same access VLAN or same trunk allowed VLANs)
- Trunk or access mode
- Native VLAN (if trunking)

A mismatch causes the port to be suspended. The `show etherchannel summary` flags will tell you which ports are not bundled.

## Topology

```text
          SW1                         SW2
  +----------------+          +----------------+
  |  Po1 (logical) |          |  Po1 (logical) |
  |  +-----------+ |          | +-----------+  |
  |  | Gi0/1     |=============| Gi0/1     |  |
  |  | Gi0/2     |=============| Gi0/2     |  |
  |  +-----------+ |          | +-----------+  |
  +----------------+          +----------------+

  Two physical links bundled into one port-channel.
  STP sees a single logical link between SW1 and SW2.
```

## Configuration

### Layer 2 EtherChannel (trunk)

```text
SW1(config)# interface range GigabitEthernet0/1 - 2
SW1(config-if-range)# channel-group 1 mode active
SW1(config-if-range)# exit
SW1(config)# interface port-channel 1
SW1(config-if)# switchport mode trunk
SW1(config-if)# switchport trunk allowed vlan 10,20,30
```

Apply the same config on SW2 (using `active` or `passive`; both `active` works fine).

The physical interfaces inherit trunk settings from the port-channel interface. Configure VLANs and trunk mode on `port-channel 1`, not on `Gi0/1` and `Gi0/2` directly.

### Layer 3 EtherChannel (routed)

When connecting two Layer 3 switches or a switch to a router, remove the switchport and assign an IP directly to the port-channel interface.

```text
SW1(config)# interface range GigabitEthernet0/1 - 2
SW1(config-if-range)# no switchport
SW1(config-if-range)# channel-group 1 mode active
SW1(config-if-range)# exit
SW1(config)# interface port-channel 1
SW1(config-if)# no switchport
SW1(config-if)# ip address 10.0.0.1 255.255.255.252
```

Layer 3 EtherChannel is common between distribution and core switches where inter-VLAN routing happens at Layer 3.

## [Load balancing](../../system-design/load-balancing/)

Traffic across member links is distributed by a hash of header fields. The default varies by platform. Common options:

```text
SW1(config)# port-channel load-balance src-dst-ip
```

Available methods (platform-dependent):

| Method       | Use case                                      |
|--------------|-----------------------------------------------|
| src-mac      | Good when many source MACs, few destinations  |
| dst-mac      | Good when many destination MACs               |
| src-dst-mac  | Balanced for switched traffic                 |
| src-ip       | Good when many source IPs                     |
| dst-ip       | Good when many destination IPs                |
| src-dst-ip   | Best general-purpose choice for routed traffic|

A single flow always uses the same member link. EtherChannel does not per-packet load balance. It per-flow load balances. Two hosts talking to each other will never exceed the speed of one physical link.

Check the current method:

```text
SW1# show etherchannel load-balance
```

## Verification

```text
SW1# show etherchannel summary
```

Flags to know:

```text
Flag  Meaning
----  -------
S     Layer 2 (switchport)
U     In use (channel is up and bundled)
P     Bundled in port-channel
I     Stand-alone (not bundled; mismatch)
s     Suspended
H     Hot-standby (LACP only; more than max ports)
D     Down
```

A port showing `I` (stand-alone) or `s` (suspended) means it is not contributing to the channel. Check for config mismatches.

```text
SW1# show etherchannel port-channel
```

Shows the protocol, port list, load-balance method, and port states for each channel group.

```text
SW1# show interfaces port-channel 1
```

Shows the logical interface status, bandwidth, and input/output stats as if it were a single physical interface.

```text
SW1# show interfaces port-channel 1 trunk
```

Confirms trunking mode and allowed VLANs on the port-channel.

## EtherChannel and STP

STP treats `port-channel 1` as a single logical port. This is the whole point: STP does not block any member link because it sees only one link between the two switches. The port-channel participates in STP elections (cost, port priority) as a single entity.

If EtherChannel fails to form because of a misconfiguration, STP falls back to its normal behavior and may block one of the physical links. This is the most common failure mode: you configure EtherChannel expecting full bandwidth, but a mode mismatch causes the channel to not form, and STP blocks one port silently.

## Gotchas

**Mismatched port configuration.** Speed, duplex, VLAN config, trunk mode, and native VLAN must be identical across all member interfaces. A single mismatch suspends the problem port. Check `show etherchannel summary` for ports marked `I` or `s`.

**Mixing protocols.** Putting LACP on some ports and PAgP on others in the same channel group causes immediate failure. Pick one per channel group.

**Static `on` vs negotiation protocol.** Setting one side to `on` and the other to `active` or `desirable` suspends the channel. Both sides must be `on` for static mode, or both must use the same negotiation protocol.

**Configuring physical interfaces instead of the port-channel.** Set trunk and VLAN config on `interface port-channel 1`. Commands applied directly to member interfaces may conflict and cause the channel to drop.

**Max member ports.** LACP supports up to 16 ports per group: 8 are active and up to 8 are hot-standby. PAgP supports up to 8. Verify your platform limits.

## References

- [Cisco EtherChannel Configuration Guide (IOS XE)](https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/lanswitch/configuration/xe-17/lanswitch-xe-17-book/lsw-etherchannel.html)
- [IEEE 802.3ad Link Aggregation standard overview](https://standards.ieee.org/ieee/802.3ad/1051/)

## Related topics

- [Part 6: Switching Fundamentals](../part-06-switching-fundamentals/)
- [Part 7: VLANs](../part-07-vlans/)
- [Part 9: Spanning Tree Protocol](../part-09-spanning-tree-protocol/)
