---
title: "Part 5: Data Link Layer and Ethernet"
description: "How Ethernet frames are structured, how MAC addresses work, and how ARP resolves IP addresses to hardware addresses."
parent: networking
tags: [networking, ccna]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

The Data Link layer is where bits become frames and frames get delivered from one network node to the next. Every time a packet crosses a link, the receiving device strips the old Layer 2 header and the sending device builds a new one. Understanding this re-encapsulation is foundational to understanding how switches, VLANs, and ARP all fit together.

## Why it matters

Ethernet is the dominant Layer 2 technology in enterprise networks. Whether traffic rides a copper cable, fiber, or a wireless radio, the frame format and addressing scheme you learn here underpins every LAN segment you will ever troubleshoot. ARP failures alone account for a significant portion of "can ping the gateway but not the internet" tickets.

## The two sub-layers

IEEE 802 splits the Data Link layer into two sub-layers:

- **LLC (Logical Link Control, 802.2):** multiplexes network-layer protocols (IPv4, IPv6, etc.) over the same physical medium. Mostly invisible in modern networks because EtherType fields in the MAC header do the same job.
- **MAC (Media Access Control):** controls how devices share access to the physical medium, handles framing, and enforces MAC addressing.

In practice, "Layer 2" and "Ethernet" are used interchangeably in CCNA contexts.

## Ethernet frame format (IEEE 802.3)

```
+----------+-----+------------------+------------------+----------+----------+------------------+---------+
| Preamble | SFD |  Dest MAC        |  Source MAC      | 802.1Q   | EtherType|  Data / Payload  |   FCS   |
|  7 bytes | 1 B |  6 bytes         |  6 bytes         | (4 bytes,|  2 bytes |  46 - 1500 bytes | 4 bytes |
|          |     |                  |                  | optional)|          |                  |  (CRC)  |
+----------+-----+------------------+------------------+----------+----------+------------------+---------+
```

Field breakdown:

| Field | Size | Purpose |
|---|---|---|
| Preamble | 7 bytes | Alternating 1s and 0s; lets receivers synchronize their clocks |
| SFD (Start Frame Delimiter) | 1 byte | `10101011`; signals that the next byte is the destination MAC |
| Destination MAC | 6 bytes | Where this frame is going |
| Source MAC | 6 bytes | Where this frame came from |
| 802.1Q VLAN tag | 4 bytes (optional) | TPID (0x8100) + PCP + DEI + 12-bit VLAN ID |
| EtherType / Length | 2 bytes | Values >= 0x0600 indicate protocol (0x0800 = IPv4, 0x86DD = IPv6); values < 0x0600 indicate payload length |
| Data / Payload | 46-1500 bytes | The encapsulated Layer 3 packet (plus padding if < 46 bytes) |
| FCS (Frame Check Sequence) | 4 bytes | CRC-32 over the frame; receiver recalculates and discards on mismatch |

The maximum transmission unit (MTU) of standard Ethernet is 1500 bytes (payload only). The full frame including header is up to 1518 bytes untagged, 1522 bytes with an 802.1Q tag. Jumbo frames push this to 9000+ bytes but require explicit support end-to-end.

## MAC addresses

A MAC address is a 48-bit (6-byte) identifier burned into the NIC at manufacture. It is written in two common notations:

- `AA:BB:CC:DD:EE:FF` (colon-separated, Linux/Unix style)
- `AABB.CCDD.EEFF` (dotted quad, Cisco IOS style)

The first 3 bytes (24 bits) are the **OUI (Organizationally Unique Identifier)**, assigned to vendors by the IEEE. The remaining 3 bytes are the device ID chosen by the manufacturer.

```
+----------------------------+----------------------------+
|   OUI (3 bytes / 24 bits)  | Device ID (3 bytes)        |
|   Assigned to the vendor   | Assigned by the vendor     |
|   AA:BB:CC                 | DD:EE:FF                   |
+----------------------------+----------------------------+
         |
         Bit 0 of byte 0 (LSB of first octet):
           0 = Unicast
           1 = Multicast
         Bit 1 of byte 0:
           0 = Globally administered (OUI assigned)
           1 = Locally administered (e.g., spoofed or virtual)
```

Three address types:

- **Unicast:** bit 0 of the first byte is 0. Targets one specific NIC. Example: `00:1A:2B:3C:4D:5E`
- **Multicast:** bit 0 of the first byte is 1. Targets a group of devices. Example: `01:00:5E:xx:xx:xx` (IPv4 multicast range)
- **Broadcast:** all bits set: `FF:FF:FF:FF:FF:FF`. Every device on the segment processes the frame.

## CSMA/CD (legacy half-duplex)

Carrier Sense Multiple Access with Collision Detection is the access method used by early Ethernet on shared coaxial cable and with hubs:

1. **Carrier Sense:** listen before transmitting. If the wire is busy, wait.
2. **Multiple Access:** any device can transmit when the wire is idle.
3. **Collision Detection:** if two devices transmit simultaneously, both detect the collision, stop, send a jam signal, and wait a random backoff time before retrying.

A shared coaxial segment is one large collision domain. Every device competes for the same wire. Performance degrades quickly as utilization rises above 30-40%.

CSMA/CD is tested on CCNA but irrelevant to modern switched networks, which operate in full duplex.

## Full-duplex Ethernet

Switches replaced hubs. Each switch port gets a dedicated point-to-point link to the end device. Because devices can send and receive simultaneously on separate wire pairs:

- There are no collisions.
- CSMA/CD is disabled.
- Each switch port is its own collision domain.
- Throughput is the full rated speed in each direction simultaneously.

Full duplex is the default on modern Gigabit and 10G interfaces when autonegotiation succeeds.

## Ethernet evolution

| Generation | Speed | Standard | Medium |
|---|---|---|---|
| Ethernet | 10 Mbps | 802.3 | Coax (10BASE-5, 10BASE-2), UTP (10BASE-T) |
| Fast Ethernet | 100 Mbps | 802.3u | UTP Cat5 (100BASE-TX), fiber (100BASE-FX) |
| Gigabit Ethernet | 1 Gbps | 802.3ab / 802.3z | UTP Cat5e/Cat6 (1000BASE-T), fiber |
| 10 Gigabit Ethernet | 10 Gbps | 802.3ae | Fiber (10GBASE-SR/LR), UTP Cat6A (10GBASE-T) |
| 40G / 100G | 40/100 Gbps | 802.3ba | Fiber (QSFP+), used in data center spine/leaf |

The physical medium changes across generations, but the frame format stays the same. That backward compatibility is intentional.

## ARP: Address Resolution Protocol

IP operates at Layer 3. Ethernet operates at Layer 2. Before a device can send a frame to another IP address, it needs the destination MAC address. ARP handles this translation.

### How ARP works

Assume Host A (192.168.1.10) wants to send a packet to Host B (192.168.1.20) and A does not have B's MAC in its cache:

```
1. Host A sends an ARP Request:
   Ethernet: Src=A_MAC, Dst=FF:FF:FF:FF:FF:FF (broadcast)
   ARP:      "Who has 192.168.1.20? Tell 192.168.1.10"

2. Every device on the segment receives the broadcast.
   Only Host B (192.168.1.20) responds.

3. Host B sends an ARP Reply:
   Ethernet: Src=B_MAC, Dst=A_MAC (unicast)
   ARP:      "192.168.1.20 is at B_MAC"

4. Host A stores B_MAC in its ARP cache and sends the original packet.
```

The ARP reply is unicast. The request is broadcast. This is a key distinction for exam questions.

### ARP table on Cisco IOS

```text
R1# show arp
Protocol  Address          Age (min)  Hardware Addr   Type   Interface
Internet  192.168.1.1             -   0012.3456.7890  ARPA   GigabitEthernet0/0
Internet  192.168.1.10           12   00aa.bbcc.ddee  ARPA   GigabitEthernet0/0
Internet  192.168.1.20            3   00ff.1122.3344  ARPA   GigabitEthernet0/0
```

Age of `-` means the entry is the router's own interface. ARP entries time out (default 4 hours on Cisco IOS, varies by OS).

On a Windows or Linux host, `arp -a` shows the same table.

## Gotchas and traps

**MAC addresses can be spoofed.** The burned-in MAC is just a default. Any OS can set an arbitrary MAC on a NIC. MAC-based authentication (port security, 802.1X bypass via MAC auth) is weaker than it appears.

**ARP has no authentication.** Any device can send a gratuitous ARP reply claiming any IP address. This is the basis of ARP spoofing (also called ARP poisoning): an attacker sends unsolicited ARP replies mapping the default gateway IP to the attacker's MAC. All traffic on the segment flows through the attacker (man-in-the-middle). Mitigations include Dynamic ARP Inspection (DAI) on switches and static ARP entries on critical hosts.

**Gratuitous ARP:** a host sends an ARP request for its own IP address on startup. Used to update neighbor caches and detect IP conflicts. Normal behavior, but exploited in ARP poisoning.

**ARP is IPv4-only.** IPv6 uses Neighbor Discovery Protocol (NDP) instead, which runs over ICMPv6 and uses multicast rather than broadcast.

## References

- [IEEE 802.3 Ethernet Standard Overview](https://standards.ieee.org/ieee/802.3/7071/)
- [Cisco IOS ARP Configuration Guide](https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/ipaddr_arp/configuration/xe-16/arp-xe-16-book.html)
- [RFC 826 - An Ethernet Address Resolution Protocol](https://www.rfc-editor.org/rfc/rfc826.html)

## Related topics

- [Part 10: IPv4 Addressing and Subnetting](../part-10-ipv4-addressing-and-subnetting/)
- [Part 6: Switching Fundamentals](../part-06-switching-fundamentals/)
- [Part 9: Spanning Tree Protocol](../part-09-spanning-tree-protocol/)
