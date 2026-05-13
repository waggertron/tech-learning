---
title: "Part 6: Switching Fundamentals"
description: "How switches learn MAC addresses, make forwarding decisions, and how switching methods and duplex settings affect performance."
parent: networking
tags: [networking, ccna]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

A switch is the workhorse of a modern LAN. It replaces the hub's dumb broadcast behavior with intelligent, per-port forwarding based on MAC addresses. Every packet that passes through a switch teaches it something, and within seconds of startup a switch has built a complete map of who lives where on the network.

## Why it matters

Switches define LAN performance. A misconfigured duplex setting can cut a link's effective throughput by 90%. A forgotten trunk port can black-hole an entire VLAN. Understanding how the MAC address table is built, consulted, and aged out is the foundation for troubleshooting everything from slow file transfers to campus-wide broadcast storms.

## What a switch does

A switch operates at Layer 2. It receives Ethernet frames on one port and forwards them out one or more other ports based on destination MAC address. Unlike a router, it does not modify the frame (except for 802.1Q tagging on trunk ports). Unlike a hub, it does not broadcast every frame out every port.

## MAC address table (CAM table)

The MAC address table (also called the Content Addressable Memory table, or CAM table) maps MAC addresses to switch ports. The switch builds it automatically by reading the source MAC of every incoming frame.

### Learning process

```
1. Frame arrives on Port 1 with Source MAC = AA:BB:CC:DD:EE:01
   Switch records: AA:BB:CC:DD:EE:01 -> Port 1

2. Frame arrives on Port 3 with Source MAC = AA:BB:CC:DD:EE:03
   Switch records: AA:BB:CC:DD:EE:03 -> Port 3

3. Later frame arrives with Dest MAC = AA:BB:CC:DD:EE:01
   Switch looks up table: found -> forward out Port 1 only
```

Entries age out after an inactivity timer (default 300 seconds on Cisco IOS). If a MAC moves to a different port, the next frame from that MAC updates the table.

### Viewing the MAC address table

```text
SW1# show mac address-table
          Mac Address Table
-------------------------------------------
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
   1    0012.3456.7890    DYNAMIC     Gi0/1
   1    00aa.bbcc.ddee    DYNAMIC     Gi0/3
  10    00ff.1122.3344    DYNAMIC     Gi0/2
  10    0011.2233.4455    STATIC      Gi0/4
```

Type `DYNAMIC` means learned from traffic. Type `STATIC` means manually configured or set by port security.

```text
SW1# show mac address-table count
Mac Entries for Vlan 1:
   Dynamic Address Count  : 2
   Static  Address Count  : 0
   Total Mac Addresses    : 2

Total Mac Addresses In Use     : 3
Total Mac Addresses Available  : 8192
```

## How switches forward frames

Once the table is built, the switch makes one of four forwarding decisions per frame:

| Frame type | Action |
|---|---|
| Known unicast | Forward out the single port associated with the destination MAC |
| Unknown unicast | Flood: forward out all ports except the ingress port |
| Broadcast (FF:FF:FF:FF:FF:FF) | Flood: forward out all ports except ingress |
| Multicast | Flood by default; controlled forwarding with IGMP snooping |

Flooding unknown unicasts is why a freshly rebooted switch is temporarily chatty. After a few seconds of traffic, the MAC table fills in and flooding becomes rare.

## Switching methods

Different switch architectures make different latency vs. reliability tradeoffs:

### Store-and-forward

The switch receives the entire frame before making a forwarding decision. It runs a CRC check against the FCS field. Corrupted frames are discarded rather than forwarded.

- Latency: higher (must receive full frame first)
- Reliability: highest (catches errors before forwarding)
- Used by: most enterprise switches today

### Cut-through

The switch begins forwarding as soon as it reads the destination MAC address (after the first 6 bytes of the frame header). It does not wait for the FCS.

- Latency: lowest
- Reliability: lower (corrupted frames are propagated)
- Useful when: latency-sensitive applications, low-error links

### Fragment-free

A compromise. The switch reads the first 64 bytes of the frame before forwarding. This catches collision fragments (which are always shorter than 64 bytes) without waiting for the full frame.

- Latency: moderate
- Reliability: moderate
- Rationale: most errors in Ethernet are collision fragments

## Collision domains vs broadcast domains

This distinction is heavily tested on CCNA:

```
Hub (legacy):
+------+------+------+
| PC1  | PC2  | PC3  |
+------+------+------+
     One collision domain
     One broadcast domain

Switch:
+------+   +------+   +------+
| PC1  |   | PC2  |   | PC3  |
+--+---+   +--+---+   +--+---+
   |           |           |
+--+-----------+-----------+--+
|         SW1                  |
+------------------------------+
Three collision domains (one per port)
One broadcast domain (all ports, same VLAN)
```

Each switch port is an independent collision domain because the link between the port and the end device is a dedicated point-to-point full-duplex connection. Collisions cannot propagate between ports.

All ports on a switch share one broadcast domain by default (assuming one VLAN). VLANs are how you divide broadcast domains at Layer 2 without needing a router per segment.

## Duplex and speed settings

Mismatched duplex is one of the most common causes of poor LAN performance. Symptoms: the link is up, pings succeed, but throughput is terrible and interface error counters climb.

```text
SW1# show interfaces GigabitEthernet0/1
GigabitEthernet0/1 is up, line protocol is up
  Hardware is Gigabit Ethernet, address is 0012.3456.7890
  MTU 1500 bytes, BW 1000000 Kbit/sec, DLY 10 usec,
     reliability 255/255, txload 1/255, rxload 1/255
  Encapsulation ARPA, loopback not set
  Full-duplex, 1000Mb/s, media type is 10/100/1000BaseTX
  ...
  Input errors: 0, CRC: 0, frame: 0, overrun: 0, ignored: 0
  Output errors: 0, collisions: 0, interface resets: 0
```

Rising collision and late collision counts on a Gigabit interface almost always mean duplex mismatch.

### Setting duplex and speed manually

```text
SW1(config)# interface GigabitEthernet0/1
SW1(config-if)# duplex full
SW1(config-if)# speed 1000
SW1(config-if)# no shutdown
```

Best practice: let autonegotiation handle Gigabit and faster links. Hard-code duplex and speed only when connecting to legacy devices that autonegotiate poorly, or when best practice for that vendor requires it (some server NICs).

If you hard-code one side, hard-code both. A port with `duplex full` hard-coded talking to a port with autonegotiation enabled will result in the autoneg port falling back to half-duplex (the 802.3 default when it cannot detect the partner's duplex setting).

## Basic switch configuration

A new switch out of the box needs a management IP, a hostname, and a default gateway to be reachable remotely.

```text
Switch> enable
Switch# configure terminal
Switch(config)# hostname SW1
SW1(config)# enable secret MySecretPass

SW1(config)# interface vlan 1
SW1(config-if)# ip address 192.168.1.2 255.255.255.0
SW1(config-if)# no shutdown
SW1(config-if)# exit

SW1(config)# ip default-gateway 192.168.1.1

SW1(config)# line vty 0 15
SW1(config-line)# password TelnetPass
SW1(config-line)# login
SW1(config-line)# transport input ssh
SW1(config-line)# exit

SW1(config)# crypto key generate rsa modulus 2048
SW1(config)# ip ssh version 2

SW1(config)# end
SW1# write memory
```

The management IP is assigned to the VLAN 1 SVI (Switched Virtual Interface), not a physical port. Physical ports on a Layer 2 switch do not have IP addresses.

## Key show commands

```text
SW1# show interfaces status
Port      Name               Status       Vlan       Duplex  Speed Type
Gi0/1                        connected    1          a-full  a-1000 10/100/1000BaseTX
Gi0/2                        connected    10         a-full  a-1000 10/100/1000BaseTX
Gi0/3                        notconnect   1          auto    auto  10/100/1000BaseTX
Gi0/24                       connected    trunk      a-full  a-1000 10/100/1000BaseTX
```

`a-full` and `a-1000` indicate the values were set by autonegotiation. Hard-coded values appear without the `a-` prefix.

```text
SW1# show version
Cisco IOS Software, Version 15.2(7)E3
...
Switch uptime is 2 days, 4 hours, 32 minutes
...
Base ethernet MAC Address       : 00:12:34:56:78:90
Model number                    : WS-C2960X-24TS-L
System serial number            : FDO2101A0BC
```

`show version` gives you the IOS version, uptime, model, and base MAC address -- all relevant for TAC support calls and licensing checks.

## Gotchas and traps

**Duplex mismatch does not take the link down.** The interface shows as up/up. The only evidence is degraded throughput and rising collision counters. Operators sometimes chase routing or application issues for hours before checking duplex.

**The CAM table has finite capacity.** High-end chassis switches hold hundreds of thousands of entries. Lower-end access switches may hold only 8,000-16,000. A MAC flooding attack (sending frames with millions of random source MACs) can fill the table and force the switch into hub mode, forwarding all frames out all ports. Mitigating controls: port security (limit MACs per port), 802.1X authentication.

**Broadcast storms are possible without STP.** If you connect two switches with two cables and Spanning Tree Protocol is not running (or misconfigured), a loop forms. Broadcasts circulate forever, consuming all bandwidth. STP is covered in Part 10.

## References

- [Cisco Catalyst 2960-X Switch Getting Started Guide](https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst2960x/hardware/installation/guide/b_2960x_hig.html)
- [Understanding and Configuring Spanning Tree Protocol - Cisco](https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/5234-5.html)
- [IEEE 802.3 Ethernet Working Group](https://www.ieee802.org/3/)

## Related topics

- [Part 5: Data Link Layer and Ethernet](./part-05-data-link-and-ethernet)
- [Part 7: VLANs](./part-07-vlans)
- [Part 9: EtherChannel and Link Aggregation](./part-09-etherchannel-and-link-aggregation)
