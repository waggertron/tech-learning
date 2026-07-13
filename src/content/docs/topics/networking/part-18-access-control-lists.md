---
title: "Part 18: Access Control Lists"
description: "How to filter network traffic on Cisco routers using standard and extended ACLs."
parent: networking
tags: [networking, ccna]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

A router forwards packets by default. Every packet that arrives on an interface and has a matching route gets sent toward its destination, regardless of source, destination, or protocol. Access Control Lists (ACLs) change that. An ACL is an ordered list of rules that the router evaluates against each packet and either permits or denies it.

## Why it matters

ACLs are the primary traffic-filtering mechanism on Cisco routers. They enforce security policy at the network layer, restrict which hosts can reach which services, and control who can manage the router itself. The CCNA exam tests placement rules, wildcard mask math, and the implicit deny at the end of every ACL.

## ACL types

Cisco IOS has two main ACL categories:

| Type | Number range | Matches on |
|---|---|---|
| Standard | 1-99, 1300-1999 | Source IP address only |
| Extended | 100-199, 2000-2699 | Source IP, destination IP, protocol, source/dest ports |

Named ACLs exist for both types and are the recommended modern approach. The name replaces the number, and named ACLs support editing individual entries without deleting the entire list.

## Wildcard masks

ACLs use wildcard masks, not subnet masks. The logic is inverted:

- **0 bit**: this bit must match exactly
- **1 bit**: ignore this bit (wildcard)

A wildcard mask is the bitwise inverse of a subnet mask:

```text
Subnet mask:   255.255.255.0   = 11111111.11111111.11111111.00000000
Wildcard mask:   0.0.0.255   = 00000000.00000000.00000000.11111111
```

Common wildcard shortcuts:

| Wildcard | Meaning | IOS keyword |
|---|---|---|
| 0.0.0.0 | Match this exact host | `host` |
| 0.0.0.255 | Match any host in the /24 | (none) |
| 255.255.255.255 | Match any address | `any` |

So `permit 192.168.1.0 0.0.0.255` is equivalent to `permit 192.168.1.0/24`, and `permit host 10.0.0.1` is equivalent to `permit 10.0.0.1 0.0.0.0`.

## ACL processing rules

1. The router evaluates entries **top to bottom**.
2. The **first match wins**; no further entries are checked.
3. Every ACL has an **implicit `deny any`** at the end, even if you never type it. If a packet matches nothing, it is dropped silently.

This means the order of entries matters significantly. A broad `permit any` placed before a specific `deny` makes the deny unreachable.

## Standard ACL configuration

Standard ACLs match only on source IP. Place them close to the destination to avoid blocking too much traffic too early.

```text
R1(config)# access-list 10 permit 192.168.1.0 0.0.0.255
R1(config)# access-list 10 deny any

R1(config)# interface GigabitEthernet0/1
R1(config-if)# ip access-group 10 out
```

The `deny any` line is technically redundant (implicit deny covers it) but is worth adding for clarity: it makes the intent visible in `show access-lists` output and shows a match counter, which is useful for troubleshooting.

## Extended ACL configuration

Extended ACLs match on source IP, destination IP, protocol, and port numbers. Place them close to the source to filter traffic early and save bandwidth on the path.

```text
R1(config)# ip access-list extended BLOCK_WEB
R1(config-ext-nacl)# deny tcp 192.168.2.0 0.0.0.255 any eq 80
R1(config-ext-nacl)# deny tcp 192.168.2.0 0.0.0.255 any eq 443
R1(config-ext-nacl)# permit ip any any

R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip access-group BLOCK_WEB in
```

The `permit ip any any` at the end is required here. Without it, the implicit deny drops everything that is not HTTP/HTTPS from the 192.168.2.0/24, including all other traffic from all other sources.

Port matching options:

| Keyword | Meaning |
|---|---|
| `eq 80` | equal to port 80 |
| `gt 1023` | greater than port 1023 |
| `lt 1024` | less than port 1024 |
| `range 8080 8090` | ports 8080 through 8090 |
| `neq 22` | any port except 22 |

Named protocols you can use directly: `tcp`, `udp`, `icmp`, `ip` (matches all).

## ACL placement rules

```text
       Source Host            Router R1              Destination Server
   192.168.2.10  ---[Gi0/0]--[router]--[Gi0/1]---  10.0.0.50

   Extended ACL: apply inbound on Gi0/0 (close to source)
   Standard ACL: apply outbound on Gi0/1 (close to destination)
```

**Standard ACLs close to the destination**: a standard ACL on source-side Gi0/0 with `deny 192.168.2.10 0.0.0.0` would block that host from reaching all destinations, not just the one you want to restrict.

**Extended ACLs close to the source**: filtering early means unwanted packets never consume bandwidth on the path between source and destination.

## In vs. out direction

Applied to an interface, an ACL has a direction:

- `in`: evaluated when packets **arrive** on the interface (before routing decision).
- `out`: evaluated when packets **leave** the interface (after routing decision).

Getting the direction wrong is one of the most common misconfigurations. A packet arriving on Gi0/0 is checked by the `in` ACL on Gi0/0, not the `out` ACL.

## Verification commands

```text
R1# show access-lists
Standard IP access list 10
    10 permit 192.168.1.0, wildcard bits 0.0.0.255 (47 matches)
    20 deny   any (3 matches)

Extended IP access list BLOCK_WEB
    10 deny tcp 192.168.2.0 0.0.0.255 any eq www (12 matches)
    20 deny tcp 192.168.2.0 0.0.0.255 any eq 443 (8 matches)
    30 permit ip any any (201 matches)

R1# show ip interface GigabitEthernet0/0
GigabitEthernet0/0 is up, line protocol is up
  Inbound  access list is BLOCK_WEB
  Outbound access list is not set
```

The match counters in `show access-lists` are invaluable: they confirm traffic is actually hitting entries. A counter stuck at zero on an entry you expect to be matching points to a placement or direction error.

## ACLs on VTY lines

ACLs can restrict who can Telnet or SSH into the router. The `access-class` command applies a standard ACL to VTY lines:

```text
R1(config)# access-list 10 permit 192.168.1.0 0.0.0.255
R1(config)# line vty 0 4
R1(config-line)# access-class 10 in
```

Now only hosts in 192.168.1.0/24 can open a management session. This is simpler than firewall rules for basic management-plane protection.

## IPv6 ACLs

IPv6 ACLs are named only (no numbered option) and use a different command to apply them:

```text
R1(config)# ipv6 access-list BLOCK_V6_WEB
R1(config-ipv6-acl)# deny tcp 2001:db8:1::/48 any eq 80
R1(config-ipv6-acl)# permit ipv6 any any

R1(config)# interface GigabitEthernet0/0
R1(config-if)# ipv6 traffic-filter BLOCK_V6_WEB in
```

Note: `ip access-group` is for IPv4; `ipv6 traffic-filter` is for IPv6. Mixing them up is a common exam trap.

## Gotchas

**Implicit deny at end**: forgetting the implicit deny is the most common ACL mistake. If you permit one subnet and forget `permit ip any any` at the end, everything else is silently blocked. This breaks things that seemed unrelated to the ACL.

**Wrong interface or wrong direction**: an ACL on the correct interface but the wrong direction (in vs. out) has no effect on the traffic you intended to filter. Always verify with `show ip interface`.

**Editing numbered ACLs**: numbered ACLs (like `access-list 10`) cannot have individual entries removed. To change one entry you must delete the entire ACL and recreate it. Named ACLs support removing specific entries by sequence number:

```text
R1(config)# ip access-list extended BLOCK_WEB
R1(config-ext-nacl)# no 10
```

This removes entry sequence 10 without touching the rest of the list.

**ACL on VTY applies to source IP, not interface**: `access-class` checks the remote host's IP, not which physical interface the packet arrived on.

---

## References

- [Cisco IOS ACL Configuration Guide](https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/sec_data_acl/configuration/xe-16/sec-data-acl-xe-16-book.html)
- [RFC 1918: Address Allocation for Private Internets](https://datatracker.ietf.org/doc/html/rfc1918)
- [Cisco CCNA ACL Exam Topics](https://learningnetwork.cisco.com/s/ccna-exam-topics)

## Related topics

- [Part 12: Routing Fundamentals](../part-12-routing-fundamentals/)
- [Part 17: DHCP and DNS](../part-17-dhcp-and-dns/)
- [Part 19: Network Security Fundamentals](../part-19-network-security-fundamentals/)
