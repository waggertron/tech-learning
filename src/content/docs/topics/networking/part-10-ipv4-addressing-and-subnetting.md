---
title: "Part 10: IPv4 Addressing and Subnetting"
description: "How 32-bit IPv4 addresses work, what the address classes mean, and how to subnet a network using CIDR and VLSM."
parent: networking
tags: [networking, ccna]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

Every packet on an IP network carries a source and destination address. Understanding how those addresses are structured, which portion identifies the network and which identifies the host, and how to divide address space into smaller subnets is the foundation of everything that follows: routing, ACLs, NAT, OSPF area design, and DHCP scopes.

## Why it matters

Subnetting is not optional knowledge for a network engineer. It shows up in every job interview, every firewall rule, every OSPF summary route, and every IP address plan you will ever write. CCNA expects you to subnet in your head under time pressure.

## IPv4 address format

An IPv4 address is 32 bits, written as four decimal octets separated by dots:

```
192   .  168  .   1   .  100
11000000.10101000.00000001.01100100
```

Each octet is 8 bits and represents a value from 0 to 255.

### Binary to decimal conversion

Powers of 2 for one octet, left to right:

```
Bit position:  128  64  32  16   8   4   2   1
               ---  --  --  --   -   -   -   -
192:             1   1   0   0   0   0   0   0  = 128 + 64 = 192
168:             1   0   1   0   1   0   0   0  = 128 + 32 + 8 = 168
1:               0   0   0   0   0   0   0   1  = 1
100:             0   1   1   0   0   1   0   0  = 64 + 32 + 4 = 100
```

To convert decimal to binary: repeatedly divide by 2, remainders read bottom-up. Or: subtract the largest power of 2 that fits and note a 1 bit, repeat for the remainder.

## Address classes (legacy, still tested)

Classful addressing was replaced by CIDR in 1993, but the CCNA exam still covers the original classes.

| Class | First Octet Range | Default Mask | Network Bits | Hosts per Network |
|-------|-------------------|--------------|-------------|-------------------|
| A     | 1 - 126           | /8 (255.0.0.0) | 8          | 16,777,214        |
| B     | 128 - 191         | /16 (255.255.0.0) | 16       | 65,534            |
| C     | 192 - 223         | /24 (255.255.255.0) | 24     | 254               |
| D     | 224 - 239         | N/A (multicast) | N/A       | N/A               |
| E     | 240 - 255         | N/A (experimental) | N/A    | N/A               |

Special ranges:
- **127.x.x.x**: loopback (127.0.0.1 is "this host"). Packets never leave the interface.
- **0.0.0.0**: "this network" or "any address" depending on context.

## Private address space (RFC 1918)

These ranges are not routed on the public internet. Routers at the internet edge drop packets with RFC 1918 source or destination addresses (by convention). NAT translates between private and public.

| Range              | Prefix | Size            |
|--------------------|--------|-----------------|
| 10.0.0.0           | /8     | 16 million+     |
| 172.16.0.0-172.31.255.255 | /12 | 1 million+  |
| 192.168.0.0        | /16    | 65,536          |

If you see a packet with source 10.x.x.x arrive on an internet-facing interface, the router should drop it (RFC 2827 ingress filtering).

## Subnet masks and CIDR

A subnet mask separates the network portion from the host portion. The mask is 32 bits: all 1s on the network side, all 0s on the host side.

```
/24 mask:  11111111.11111111.11111111.00000000 = 255.255.255.0
/26 mask:  11111111.11111111.11111111.11000000 = 255.255.255.192
/20 mask:  11111111.11111111.11110000.00000000 = 255.255.240.0
```

CIDR (Classless Inter-Domain Routing) notation writes the mask as a prefix length after a slash. `192.168.1.0/24` means the first 24 bits are the network portion. Any prefix from /0 to /32 is valid.

## Subnetting: borrowing host bits

To create subnets, you borrow bits from the host portion and add them to the network portion. Each borrowed bit doubles the number of subnets and halves the size of each subnet.

Key formulas:
- Number of subnets: 2^n (n = bits borrowed)
- Usable hosts per subnet: 2^h - 2 (h = remaining host bits; subtract network and broadcast)

### Worked example: divide 192.168.1.0/24 into 4 subnets

You need 4 subnets. 2^n >= 4, so n = 2 borrowed bits.

New prefix length: /24 + 2 = /26

New mask: 255.255.255.192

Host bits remaining: 32 - 26 = 6. Usable hosts: 2^6 - 2 = 62.

Block size: 256 - 192 = 64. Subnets increment by 64 in the last octet.

| Subnet | Network Address  | First Host       | Last Host        | Broadcast        |
|--------|-----------------|-----------------|-----------------|-----------------|
| 1      | 192.168.1.0/26  | 192.168.1.1     | 192.168.1.62    | 192.168.1.63    |
| 2      | 192.168.1.64/26 | 192.168.1.65    | 192.168.1.126   | 192.168.1.127   |
| 3      | 192.168.1.128/26| 192.168.1.129   | 192.168.1.190   | 192.168.1.191   |
| 4      | 192.168.1.192/26| 192.168.1.193   | 192.168.1.254   | 192.168.1.255   |

The network address (all host bits = 0) and the broadcast address (all host bits = 1) are reserved and cannot be assigned to hosts.

### Quick subnetting method (block size shortcut)

1. Identify which octet the subnet boundary falls in.
2. Find the "interesting octet" value in the mask (the one that is not 0 or 255).
3. Block size = 256 - interesting octet value.
4. List subnets by incrementing the interesting octet by the block size.

For /26: interesting octet = 192. Block size = 256 - 192 = 64. Subnets: .0, .64, .128, .192.

For /20: interesting octet is in the third octet (255.255.240.0). Block size = 256 - 240 = 16. Third octet increments: 0, 16, 32, 48... So subnets are 10.0.0.0/20, 10.0.16.0/20, 10.0.32.0/20...

## VLSM (Variable Length Subnet Masking)

VLSM lets you use different prefix lengths for different subnets within the same address space. This prevents wasting addresses.

Example: you have 192.168.1.0/24 and need:
- One subnet for 100 hosts
- One subnet for 50 hosts
- Two point-to-point WAN links (2 hosts each)

Without VLSM, you would use /25 for everything and waste 126 addresses on each WAN link.

With VLSM:
- 192.168.1.0/25: 126 usable hosts (for the 100-host LAN)
- 192.168.1.128/26: 62 usable hosts (for the 50-host LAN)
- 192.168.1.192/30: 2 usable hosts (WAN link 1)
- 192.168.1.196/30: 2 usable hosts (WAN link 2)
- 192.168.1.200/24 remainder: reserved for future use

Always allocate largest subnets first.

## Wildcard masks

Wildcard masks are the inverse of subnet masks. A 0 bit means "must match," a 1 bit means "ignore." Used in ACLs and OSPF network statements.

```
Subnet mask:   255.255.255.0
Wildcard mask:   0.  0.  0.255
```

For /26 (255.255.255.192):
```
Wildcard mask:   0.  0.  0. 63
```

To match a single host (192.168.1.100): wildcard = 0.0.0.0
To match an entire /24 (192.168.1.0): wildcard = 0.0.0.255
To match all addresses: wildcard = 255.255.255.255

A shortcut: wildcard mask = 255.255.255.255 minus the subnet mask.

## Special addresses

| Address | Purpose |
|---------|---------|
| 255.255.255.255 | Limited broadcast (this subnet, not routed) |
| x.x.x.255 (for /24) | Directed broadcast (specific subnet, routers may drop) |
| 0.0.0.0 | "Any" address: used in default routes and DHCP discovery |
| 127.0.0.1 | Loopback (software only, never leaves host) |

## Configuration

Assign an IP address to a router interface:

```text
R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
```

Verify interface addresses:

```text
R1# show ip interface brief
Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0     192.168.1.1     YES manual up                    up
GigabitEthernet0/1     10.0.0.1        YES manual up                    up
Loopback0              1.1.1.1         YES manual up                    up
```

Check detailed address information including mask:

```text
R1# show ip interface GigabitEthernet0/0
```

## Address plan diagram

```
192.168.1.0/24 -- original block
|
+-- 192.168.1.0/26   (62 hosts: Accounting VLAN)
|   .1 = gateway, .2-.62 = hosts, .63 = broadcast
|
+-- 192.168.1.64/26  (62 hosts: Engineering VLAN)
|   .65 = gateway, .66-.126 = hosts, .127 = broadcast
|
+-- 192.168.1.128/26 (62 hosts: Sales VLAN)
|   .129 = gateway, .130-.190 = hosts, .191 = broadcast
|
+-- 192.168.1.192/26 (62 hosts: reserved for future)
    .193-.254 available
```

## Tradeoffs and gotchas

- **/31 masks**: RFC 3021 allows /31 for point-to-point links. Both addresses are usable (no network or broadcast). Cisco IOS supports this with `ip address x.x.x.x 255.255.255.254`. Saves one address per WAN link compared to /30.
- **/32 masks**: a host route, used in loopback interfaces and static routes to a single host. The `show ip interface brief` will show a /32 loopback as its own connected route.
- **Subnet zero**: RFC 1878 allows using the all-zeros subnet (the first subnet after borrowing bits). Modern IOS enables this by default (`ip subnet-zero`). On old exams, you may see questions that exclude it.
- **Supernetting vs. subnetting**: subnetting makes a block smaller (longer prefix); supernetting aggregates multiple blocks into a shorter prefix. Route summarization uses supernetting.
- **Classful vs. classless routing**: RIPv1 does not send subnet mask information in updates, so all interfaces in the same major class network must share the same mask. RIPv2, OSPF, EIGRP, and BGP are classless.

## References

- [RFC 1918 - Address Allocation for Private Internets](https://datatracker.ietf.org/doc/html/rfc1918)
- [RFC 4632 - Classless Inter-domain Routing (CIDR)](https://datatracker.ietf.org/doc/html/rfc4632)
- [RFC 3021 - Using 31-Bit Prefixes on IPv4 Point-to-Point Links](https://datatracker.ietf.org/doc/html/rfc3021)

## Related topics

- [Part 9: Spanning Tree Protocol](../part-09-spanning-tree-protocol/)
- [Part 11: IPv6 Addressing](../part-11-ipv6-addressing/)
- [Part 12: Routing Fundamentals](../part-12-routing-fundamentals/)
- [Part 16: NAT and PAT](../part-16-nat-and-pat/)
