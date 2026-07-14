---
title: "Part 16: NAT and PAT"
description: "How Network Address Translation and Port Address Translation let private RFC 1918 hosts reach the internet using one or more public IP addresses."
parent: networking
tags: [networking, ccna]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

NAT exists because the internet ran out of IPv4 addresses before IPv6 was ready. RFC 1918 reserved three address blocks for private use: 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16. Routers on the public internet do not route these addresses. NAT sits at the edge and translates between private and public, making tens of thousands of hosts reachable through a single public IP.

## Why it matters

Without NAT, every host that needs internet access requires a unique public IPv4 address. The global pool of public addresses is exhausted. NAT lets an entire enterprise share a handful of public addresses, or even just one. PAT (Port Address Translation) extends this further: a single public IP can support thousands of simultaneous outbound sessions by differentiating them by port number. Understanding NAT is essential for any network engineer because it sits at the edge of nearly every enterprise and home network on the internet today.

## NAT terminology

Cisco uses four terms that trip up most people the first time. The inside/outside axis refers to your network boundary. The local/global axis refers to which side of the NAT translation table the address appears on.

| Term | Meaning |
|---|---|
| Inside local | Private IP of an internal host, as seen inside the network |
| Inside global | Public IP representing that internal host, as seen from the internet |
| Outside local | IP of an external host as seen from inside the network (usually same as outside global) |
| Outside global | Actual public IP of the external host, as seen from the internet |

The terms that actually matter for most configurations are inside local and inside global. The outside addresses are usually identical unless you are doing destination NAT or NAT with address rewriting on the outside.

Example:

```
Inside network                     Internet
192.168.1.10 ----[NAT Router]---- 203.0.113.1 (public) ----> 8.8.8.8

Inside local:   192.168.1.10
Inside global:  203.0.113.1
Outside local:  8.8.8.8
Outside global: 8.8.8.8
```

The NAT translation table on the router maps (192.168.1.10) to (203.0.113.1) so that return traffic from 8.8.8.8 is translated back before it reaches the internal host.

## Three types of NAT

### 1. Static NAT

One-to-one permanent mapping between a private IP and a public IP. The mapping exists regardless of whether traffic is flowing. Use this for servers that must accept inbound connections: web servers, mail servers, SSH jump hosts. The public IP must be dedicated to that one host.

### 2. Dynamic NAT

Maps inside local addresses to a pool of inside global addresses, one-to-one. When an internal host initiates a connection, the router assigns it the next available address from the pool. When the session ends, the address returns to the pool. If the pool is exhausted, new connections are dropped. Dynamic NAT still requires one public IP per simultaneous session.

### 3. PAT (Port Address Translation) / NAT Overload

Many-to-one. Multiple internal hosts share a single public IP address. The router tracks sessions by adding port numbers to the translation table. Each session gets a unique (inside global IP, source port) combination. Return traffic is matched against this table and forwarded to the correct internal host.

PAT is what virtually every home router and small-office router uses. One public IP supports hundreds of simultaneous sessions because ports range from 1 to 65535.

```
Inside network                  NAT Table                    Internet
192.168.1.10:1024  ---+---> 203.0.113.5:10001 ----> Server
192.168.1.11:1024  ---+---> 203.0.113.5:10002 ----> Server
192.168.1.12:2048  ---+---> 203.0.113.5:10003 ----> Server
                      |
                 NAT Router
                 (203.0.113.5)
```

## Static NAT configuration

Assign a permanent mapping and mark the inside and outside interfaces:

```text
R1(config)# ip nat inside source static 192.168.1.10 203.0.113.10
R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip nat inside
R1(config-if)# exit
R1(config)# interface GigabitEthernet0/1
R1(config-if)# ip nat outside
R1(config-if)# exit
```

Every packet sourced from 192.168.1.10 leaving Gi0/1 has its source IP rewritten to 203.0.113.10. Every packet arriving on Gi0/1 destined for 203.0.113.10 has its destination IP rewritten to 192.168.1.10.

You must mark every interface as either `ip nat inside` or `ip nat outside`. NAT does not apply to interfaces with no marking. This is the most common configuration mistake: forgetting to tag the interfaces.

## Dynamic NAT configuration

Define the pool of public addresses and an ACL identifying which inside hosts are eligible for translation:

```text
R1(config)# ip nat pool MYPOOL 203.0.113.1 203.0.113.10 netmask 255.255.255.240
R1(config)# access-list 1 permit 192.168.1.0 0.0.0.255
R1(config)# ip nat inside source list 1 pool MYPOOL
R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip nat inside
R1(config-if)# exit
R1(config)# interface GigabitEthernet0/1
R1(config-if)# ip nat outside
```

The pool defines a range of public addresses (203.0.113.1 through 203.0.113.10, 10 addresses). ACL 1 matches any source in 192.168.1.0/24. When a matching packet arrives, the router assigns the next available pool address. The `netmask` keyword uses a regular subnet mask, not a wildcard.

## PAT configuration

PAT overloads a single interface IP. Replace the pool reference with the outside interface and add `overload`:

```text
R1(config)# access-list 1 permit 192.168.0.0 0.0.255.255
R1(config)# ip nat inside source list 1 interface GigabitEthernet0/1 overload
R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip nat inside
R1(config-if)# exit
R1(config)# interface GigabitEthernet0/1
R1(config-if)# ip nat outside
```

ACL 1 matches the entire 192.168.0.0/16 space. Every matching inside host shares GigabitEthernet0/1's public IP. The `overload` keyword is what enables PAT. Without it, dynamic NAT would attempt a one-to-one pool mapping.

You can also PAT to a specific public IP address instead of an interface:

```text
R1(config)# ip nat inside source list 1 pool PUBPOOL overload
```

## Full topology diagram

```
+-------------------+        +------------------+        +----------+
|  Inside Network   |        |   NAT Router R1  |        | Internet |
|                   |        |                  |        |          |
| 192.168.1.10 -----+--Gi0/0-+--[NAT Table]--Gi0/1------+-- 8.8.8.8|
| 192.168.1.11 -----+        |                  |        |          |
| 192.168.1.12 -----+        | Inside | Outside  |        +----------+
|                   |        | local  | global   |
+-------------------+        +--------+----------+
                             | .1.10  | .113.5:1 |
                             | .1.11  | .113.5:2 |
                             | .1.12  | .113.5:3 |
                             +--------+----------+

ip nat inside: GigabitEthernet0/0
ip nat outside: GigabitEthernet0/1
```

## Verifying NAT

Show the active translation table:

```text
R1# show ip nat translations
Pro  Inside global       Inside local        Outside local       Outside global
tcp  203.0.113.5:10001   192.168.1.10:1024   8.8.8.8:443         8.8.8.8:443
tcp  203.0.113.5:10002   192.168.1.11:1024   8.8.8.8:443         8.8.8.8:443
---  203.0.113.10        192.168.1.10        ---                 ---
```

Static NAT entries appear without port numbers and persist permanently. Dynamic and PAT entries appear with port numbers and time out after the session ends.

Show translation statistics and hit counts:

```text
R1# show ip nat statistics
Total active translations: 3 (1 static, 2 dynamic; 2 extended)
Outside interfaces: GigabitEthernet0/1
Inside interfaces: GigabitEthernet0/0
Hits: 1452  Misses: 3
Expired translations: 48
```

Live debug (use with caution in production; generates high volume output):

```text
R1# debug ip nat
R1# debug ip nat detailed
```

Clear all dynamic translations (static entries are not cleared):

```text
R1# clear ip nat translation *
```

## NAT and IPv6

IPv6 was designed to eliminate the need for NAT by providing enough address space for every device on earth to have a public address. NAT is not standard in IPv6 deployments. However, during the transition period, NAT64 translates between IPv6-only clients and IPv4-only servers. An IPv6 host sends a packet to a special prefix (typically 64:ff9b::/96), the NAT64 gateway strips the IPv6 header and substitutes an IPv4 header, and the packet reaches the IPv4 server. The reverse translation brings the response back.

NAT64 is common at ISPs and in dual-stack transition environments, but it is not a CCNA configuration topic. Know that it exists and what problem it solves.

## Tradeoffs and gotchas

**Gotcha: NAT breaks IPsec**

IPsec (especially in tunnel mode) encrypts and authenticates the original IP header. NAT modifies that header. The integrity check on the receiving end fails and the packet is dropped. The fix is NAT Traversal (NAT-T, RFC 3948), which encapsulates IPsec packets inside UDP port 4500, allowing NAT to modify the UDP/IP headers while leaving the encrypted IPsec payload intact. Most modern VPN implementations enable NAT-T automatically.

**Gotcha: application-layer protocols that embed IP addresses**

Some older protocols embed IP addresses inside the application payload, not just in the IP header. NAT rewrites the IP header but does not touch the payload. The receiving end gets a public IP in the header but a private IP in the payload, and the session breaks.

FTP in active mode is the classic example: the client sends a PORT command with its private IP address embedded as ASCII text. The FTP server tries to connect back to that private IP and fails. The fix is an Application Layer Gateway (ALG) on the NAT router that inspects and rewrites the FTP payload. SIP (VoIP signaling) has the same problem.

**Gotcha: NAT requires symmetric routing**

NAT is stateful. The router that translates the outbound packet must also receive the inbound reply, because only that router has the translation table entry. If return traffic takes a different path and arrives at a different router, there is no matching entry and the packet is dropped. This matters in redundant topologies with multiple edge routers.

**Gotcha: NAT hides the source**

From a security logging and forensics perspective, NAT collapses many internal hosts behind one public IP. If you need to trace a connection back to a specific internal host, you must correlate the NAT translation logs (timestamp, inside global port, inside local IP) with the connection attempt. Without those logs, attribution is impossible.

**Gotcha: missing interface NAT tags**

If you configure the NAT rule but forget to apply `ip nat inside` or `ip nat outside` to the interfaces, NAT will not trigger. The symptom is that traffic passes through the router without translation. Verify with `show ip nat statistics`: if Hits stays at 0 while traffic is flowing, the interface tags are missing.

## References

- [RFC 3022: Traditional IP Network Address Translator (Traditional NAT)](https://datatracker.ietf.org/doc/html/rfc3022)

## Related topics

- [Part 10: IPv4 Addressing and Subnetting](../part-10-ipv4-addressing-and-subnetting/)
- [Part 15: EIGRP](../part-15-eigrp/)
- [Part 18: Access Control Lists](../part-18-access-control-lists/)
