---
title: "Part 11: IPv6 Addressing"
description: "How 128-bit IPv6 addresses are structured, abbreviated, auto-configured, and deployed alongside IPv4 in dual-stack networks."
parent: networking
tags: [networking, ccna]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

IPv4 has 4.3 billion addresses. The internet ran out. NAT bought time, but it breaks end-to-end connectivity and complicates protocols that embed IP addresses in their payloads. IPv6 has 340 undecillion addresses (3.4 x 10^38), enough to assign billions of addresses to every square meter of the Earth's surface. It also drops broadcast, simplifies the header, and builds autoconfiguration in from the start.

## Why it matters

The CCNA exam covers IPv6 addressing, configuration, and neighbor discovery. More importantly, IPv6 is already the majority of internet traffic in many countries. Modern networks run dual-stack, and understanding IPv6 is no longer optional for anyone configuring routers or writing firewall rules.

## IPv6 address format

IPv6 addresses are 128 bits, written as eight groups of four hexadecimal digits, separated by colons:

```
2001:0db8:0000:0000:0000:ff00:0042:8329
```

Each group (hextet) represents 16 bits. Total: 8 x 16 = 128 bits.

### Abbreviation rules

Two rules reduce notation length:

**Rule 1: Drop leading zeros** within each hextet.

```
2001:0db8:0000:0000:0000:ff00:0042:8329
becomes
2001:db8:0:0:0:ff00:42:8329
```

**Rule 2: Replace one contiguous run of all-zero hextets with ::**

```
2001:db8:0:0:0:ff00:42:8329
becomes
2001:db8::ff00:42:8329
```

The :: can only appear once per address. If you use it twice, the parser cannot determine how many zero groups each :: represents.

Examples:

| Full Address | Abbreviated |
|-------------|-------------|
| 2001:0db8:0000:0000:0000:0000:0000:0001 | 2001:db8::1 |
| fe80:0000:0000:0000:0219:d1ff:fe8a:0001 | fe80::219:d1ff:fe8a:1 |
| 0000:0000:0000:0000:0000:0000:0000:0001 | ::1 (loopback) |
| 0000:0000:0000:0000:0000:0000:0000:0000 | :: (unspecified) |

To expand an abbreviated address: restore leading zeros in each hextet, replace :: with enough :0000: groups to reach 8 total hextets.

## Address types

IPv6 replaces broadcast entirely. There are three categories:

### Unicast (one-to-one)

**Global Unicast Address (GUA):** prefix 2000::/3 (starts with binary 001, so any address starting with 2 or 3 in hex). Routable on the public internet. Equivalent to a public IPv4 address.

Structure of a typical GUA:

```
| Global Routing Prefix | Subnet ID | Interface ID |
|       48 bits         |  16 bits  |   64 bits    |
|   assigned by ISP     | site use  | host portion |
```

Example: 2001:db8:acad:1::/64 is a subnet. The first 48 bits (2001:db8:acad) are the ISP-assigned prefix. The next 16 bits (:1) identify a specific subnet. The last 64 bits are the interface ID.

**Link-Local Address (LLA):** prefix FE80::/10. Every IPv6-enabled interface automatically generates a link-local address, even without any configuration. LLAs are used for NDP (neighbor discovery), routing protocol hellos, and next-hop addresses. They are never routed beyond a single link.

```
FE80::/10 means the first 10 bits are 1111111010
In practice, all LLAs start with FE80
```

**Unique Local Address (ULA):** prefix FC00::/7 (FC00:: to FDFF::). The IPv6 equivalent of RFC 1918 private space. Not routed on the internet. FD00::/8 is the range you should actually use (FC is technically reserved for a global registration scheme that was never implemented).

**Loopback:** ::1/128. Equivalent to 127.0.0.1.

**Unspecified:** ::/128. Equivalent to 0.0.0.0. Used as a source address before a host has an address.

### Multicast (one-to-many)

Prefix FF00::/8. IPv6 multicast replaces both broadcast and IPv4 multicast. Key reserved addresses:

| Address | Purpose |
|---------|---------|
| FF02::1 | All nodes on the link |
| FF02::2 | All routers on the link |
| FF02::5 | All OSPF routers |
| FF02::6 | OSPF designated routers |
| FF02::A | EIGRP routers |

**Solicited-Node Multicast:** FF02::1:FF00:0/104. Each unicast address automatically joins a solicited-node multicast group based on the last 24 bits of its interface ID. NDP uses this to resolve addresses efficiently (instead of flooding like ARP).

### Anycast (one-to-nearest)

The same address assigned to multiple interfaces. The router sends the packet to whichever is topologically nearest. Used for DNS servers, CDN edge nodes, and mobile anycast routing. Anycast addresses look identical to unicast addresses. The distinction is purely administrative.

## EUI-64 interface ID generation

EUI-64 is a method for auto-generating the 64-bit interface ID portion of an IPv6 address from a 48-bit MAC address.

Steps:
1. Split the MAC address in half after the third byte.
2. Insert FF:FE in the middle.
3. Flip bit 7 (the Universal/Local bit) of the first byte.

Example:

```
MAC address:  00:1A:2B:3C:4D:5E

Split:        00:1A:2B  |  3C:4D:5E
Insert FFFE:  00:1A:2B:FF:FE:3C:4D:5E
As hex pairs: 001A:2BFF:FE3C:4D5E

Flip bit 7 of first byte:
00 = 00000000, bit 7 = 0, flip to 1 = 00000010 = 02

EUI-64 Interface ID: 021A:2BFF:FE3C:4D5E
```

If the LLA prefix is FE80::/64, the resulting LLA is:

```
FE80::021A:2BFF:FE3C:4D5E
or abbreviated:
FE80::21A:2BFF:FE3C:4D5E
```

Note: because EUI-64 embeds the MAC address, the interface ID reveals the hardware. Privacy extensions (RFC 4941) generate random interface IDs to avoid tracking. Linux and Windows use privacy extensions by default for outbound connections.

## Address configuration methods

### Static

Manual configuration. Deterministic, easy to document, but does not scale.

```text
R1(config)# interface GigabitEthernet0/0
R1(config-if)# ipv6 address 2001:db8:1:1::1/64
R1(config-if)# no shutdown
```

### SLAAC (Stateless Address Autoconfiguration)

The host generates its own address without a server. Process:

1. Host generates a link-local address (FE80:: + EUI-64 or random).
2. Host sends a Router Solicitation (RS) to FF02::2 (all routers).
3. Router replies with a Router Advertisement (RA) containing the network prefix.
4. Host combines the prefix with its interface ID to form a GUA.
5. Host performs Duplicate Address Detection (DAD) via NDP to confirm uniqueness.

The host configures itself. No DHCP server needed. DNS is provided via RA options (RDNSS, RFC 8106) in modern implementations.

### DHCPv6 stateful

A DHCPv6 server assigns the full address and all options (DNS, domain name, etc.). The RA sets the M flag (Managed) to tell hosts to use DHCPv6 for addresses.

### DHCPv6 stateless

Hosts use SLAAC for addresses but query a DHCPv6 server for options (DNS, NTP). The RA sets the O flag (Other) to tell hosts to get options from DHCPv6 but generate their own address via SLAAC.

Summary:

| Method | Address source | Options source | M flag | O flag |
|--------|---------------|----------------|--------|--------|
| SLAAC only | Self (SLAAC) | RA (RDNSS) | 0 | 0 |
| SLAAC + stateless DHCPv6 | Self (SLAAC) | DHCPv6 server | 0 | 1 |
| Stateful DHCPv6 | DHCPv6 server | DHCPv6 server | 1 | 1 |

## NDP (Neighbor Discovery Protocol)

NDP (RFC 4861) runs over ICMPv6 and replaces ARP, ICMP Router Discovery, and ICMP Redirect. Key message types:

| Message | ICMPv6 Type | Purpose |
|---------|-------------|---------|
| Router Solicitation (RS) | 133 | Host asks: "Are there any routers?" |
| Router Advertisement (RA) | 134 | Router announces prefix, M/O flags, lifetime |
| Neighbor Solicitation (NS) | 135 | "Who has this IPv6 address?" (like ARP request) |
| Neighbor Advertisement (NA) | 136 | "I have that address." (like ARP reply) |
| Redirect | 137 | Router tells host of a better next-hop |

NDP uses multicast for NS/NA instead of broadcast. This is more efficient on large segments: only the target host's solicited-node multicast group receives the NS, rather than all hosts on the segment.

### Neighbor table

IPv6 neighbors are stored in the neighbor table (equivalent of the ARP cache):

```text
R1# show ipv6 neighbors
IPv6 Address                            Age Link-layer Addr State Interface
FE80::219:d1ff:fe8a:1                     0 0019.d18a.0001  REACH Gi0/0
2001:db8:1:1::2                           1 0019.d18a.0001  REACH Gi0/0
```

States: REACH (reachable), STALE (may still be valid but unverified), DELAY, PROBE, INCOMPLETE.

## Cisco IOS configuration

Enable IPv6 routing (required on routers, not needed on hosts):

```text
R1(config)# ipv6 unicast-routing
```

Configure a GUA on an interface:

```text
R1(config)# interface GigabitEthernet0/0
R1(config-if)# ipv6 address 2001:db8:1:1::1/64
R1(config-if)# no shutdown
```

Configure using EUI-64 (IOS calculates the interface ID from the MAC):

```text
R1(config-if)# ipv6 address 2001:db8:1:1::/64 eui-64
```

Configure a static link-local address (useful for predictable next-hop addresses in routing):

```text
R1(config-if)# ipv6 address fe80::1 link-local
```

Verify:

```text
R1# show ipv6 interface brief
GigabitEthernet0/0     [up/up]
    FE80::1
    2001:DB8:1:1::1
GigabitEthernet0/1     [up/up]
    FE80::1
    2001:DB8:1:2::1
```

Note: the same link-local address (FE80::1) can be used on multiple interfaces because LLAs are link-scoped.

```text
R1# show ipv6 neighbors
R1# show ipv6 route
```

## Dual-stack

Dual-stack means running IPv4 and IPv6 simultaneously on the same interface and router. Both protocol stacks operate independently. The router maintains separate routing tables for each.

```
+------------------+
|   Application    |
+------------------+
|  IPv4  |  IPv6   |  <-- both stacks active
+------------------+
|     Ethernet     |
+------------------+
```

Dual-stack is the recommended migration strategy (RFC 4213). Devices prefer IPv6 when available (per RFC 6724 address selection rules). This allows gradual IPv6 adoption without flag-day cutover.

Tunneling (6in4, 6to4, Teredo) and translation (NAT64) are alternatives when dual-stack is not available, but both add complexity and are considered transition mechanisms rather than end states.

## Address space diagram

```
IPv6 address space (128 bits, shown as /3 regions)
|
+-- 2000::/3   Global Unicast (2000:: to 3FFF::)
|   |
|   +-- 2001:db8::/32  Documentation prefix (examples only)
|   +-- 2001::/32      Teredo tunneling
|
+-- FC00::/7   Unique Local (FC00:: to FDFF::)
|   +-- FD00::/8  Usable ULA range
|
+-- FE80::/10  Link-Local (FE80:: to FEBF::)
|
+-- FF00::/8   Multicast
|
+-- ::1/128    Loopback
+-- ::/128     Unspecified
```

## Tradeoffs and gotchas

- **LLA always exists**: every IPv6 interface gets a link-local address automatically when IPv6 is enabled. You cannot remove it. If you delete a manually configured LLA, IOS generates an EUI-64 based one.
- **ping6 to link-local requires interface specification**: LLAs are link-scoped, so the OS needs to know which interface to use. `ping fe80::1` will fail with "ambiguous" on a multi-interface device. Use `ping fe80::1%GigabitEthernet0/0` on IOS or `ping6 fe80::1%eth0` on Linux.
- **show ipv6 route shows both GUA and LLA next-hops**: OSPF for IPv6 (OSPFv3) uses LLAs as next-hops. This is correct behavior, not a misconfiguration.
- **Stateless DHCPv6 requires SLAAC**: if the M flag is 0 and O flag is 1, the host still generates its own address. The DHCPv6 server only provides DNS/NTP.
- **NDP cache poisoning**: NDP has no built-in authentication, making it vulnerable to attacks analogous to ARP poisoning. SEND (Secure Neighbor Discovery) and RA Guard mitigate this.
- **No NAT by default**: IPv6 was designed for end-to-end addressing. NAT66 exists but is discouraged. Firewalling is stateful packet inspection at the perimeter, not address translation.

## References

- [RFC 4291 - IP Version 6 Addressing Architecture](https://datatracker.ietf.org/doc/html/rfc4291)
- [RFC 4861 - Neighbor Discovery for IP version 6](https://datatracker.ietf.org/doc/html/rfc4861)
- [RFC 4862 - IPv6 Stateless Address Autoconfiguration](https://datatracker.ietf.org/doc/html/rfc4862)
- [Cisco IPv6 Addressing and Basic Connectivity Configuration Guide](https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/ipv6_basic/configuration/xe-16/ip6b-xe-16-book/ip6-add-basic-conn.html)

## Related topics

- [Part 10: IPv4 Addressing and Subnetting](../part-10-ipv4-addressing-and-subnetting/)
- [Part 12: Routing Fundamentals](../part-12-routing-fundamentals/)
- [Part 16: NAT and PAT](../part-16-nat-and-pat/)
