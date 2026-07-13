---
title: "Part 19: Network Security Fundamentals"
description: "Core security concepts, common threats, and Cisco IOS features for protecting network infrastructure."
parent: networking
tags: [networking, ccna]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

A network that moves data but cannot protect it is a liability. Security is not a feature you bolt on after the network is built. It is a set of decisions made at every layer of the design. This part covers the threat landscape, the conceptual frameworks that organize defensive thinking, and the specific Cisco IOS features you configure to harden a network.

## Why it matters

Security incidents cost organizations money, reputation, and in regulated industries, legal exposure. The CCNA tests both conceptual knowledge (CIA triad, AAA, defense in depth) and hands-on skills (port security, DHCP snooping, SSH configuration). More importantly, these topics appear in every real network role from day one.

## The CIA triad

The three pillars of information security:

- **Confidentiality**: data is accessible only to authorized parties. Encryption, access controls, and VPNs protect confidentiality.
- **Integrity**: data is not altered in transit or at rest without detection. Hashing (SHA-256, MD5) and digital signatures protect integrity.
- **Availability**: systems and data are accessible when legitimate users need them. Redundancy, DDoS mitigation, and proper capacity planning protect availability.

Every security control maps to one or more of these pillars. When evaluating a control, ask which pillar it protects.

## Common threats

### Malware categories

| Type | Behavior |
|---|---|
| Virus | Attaches to a legitimate file; requires user action to spread |
| Worm | Self-propagates across networks without user action |
| Ransomware | Encrypts files and demands payment for the key |
| Spyware | Collects information covertly (keystrokes, credentials, browsing) |
| Trojan | Disguised as legitimate software; creates a backdoor |

### Social engineering

Attackers exploit human psychology rather than technical vulnerabilities:

- **Phishing**: mass email pretending to be a trusted entity; goal is credentials or malware installation.
- **Spear phishing**: targeted phishing against a specific individual or organization; more convincing because it uses personal details.
- **Vishing**: voice phishing; phone calls impersonating IT support, banks, or government.
- **Tailgating**: physically following an authorized person through a secured door.

### Network attacks

| Attack | Description |
|---|---|
| DoS/DDoS | Flood a target with traffic to exhaust resources and deny service to legitimate users |
| MITM | Attacker positions between two hosts, intercepting and optionally modifying traffic |
| MAC flooding | Overwhelm a switch's MAC table so it broadcasts all frames; turns switch into a hub |
| VLAN hopping | Attacker accesses VLANs they should not reach via switch spoofing or double tagging |
| DHCP starvation | Exhaust DHCP pool with spoofed Discovers; then run rogue DHCP server |
| ARP spoofing | Send gratuitous ARP replies mapping attacker MAC to victim IP; enables MITM on local segment |

### Password attacks

- **Brute force**: try every possible combination; slow but guaranteed to eventually succeed.
- **Dictionary attack**: try words from a wordlist; faster than brute force against weak passwords.
- **Rainbow tables**: precomputed hash-to-password mappings; defeated by salting hashes.

## Defense in depth

No single security control is sufficient. Defense in depth layers multiple controls so that if one fails, others remain. A typical layered model:

```text
+--------------------------+
|        Data layer        |  Encryption at rest, DLP, classification
+--------------------------+
|     Application layer    |  Input validation, WAF, patching
+--------------------------+
|        Host layer        |  Antivirus, host firewall, OS hardening
+--------------------------+
|      Network layer       |  Firewalls, ACLs, IDS/IPS, segmentation
+--------------------------+
|     Perimeter layer      |  Edge firewall, DMZ, NAT
+--------------------------+
|      Physical layer      |  Locks, cameras, badge access
+--------------------------+
```

An attacker who bypasses the perimeter firewall still faces network ACLs, host firewalls, and application-level controls.

## AAA framework

AAA organizes how network devices control administrative access:

- **Authentication**: who are you? (username/password, certificate, token)
- **Authorization**: what are you allowed to do? (privilege levels, command sets)
- **Accounting**: what did you do? (logging commands, session duration, bytes transferred)

### RADIUS vs TACACS+

| Feature | RADIUS | TACACS+ |
|---|---|---|
| Transport | UDP 1812 (auth), 1813 (acct) | TCP 49 |
| Encryption | Password only | Entire payload |
| AAA separation | Combined auth/authz | Fully separated |
| Primary use case | Network access (802.1X, VPN) | Device management |
| Vendor | Open standard (RFC 2865) | Cisco proprietary |

For managing Cisco devices (SSH login, privilege escalation), TACACS+ is preferred because it encrypts all traffic and separates authentication from authorization. RADIUS is standard for authenticating end users to the network (Wi-Fi, VPN).

## Port security

Port security limits which MAC addresses can communicate on a switch port. It protects against MAC flooding and unauthorized device connection.

```text
SW1(config)# interface GigabitEthernet0/1
SW1(config-if)# switchport mode access
SW1(config-if)# switchport port-security
SW1(config-if)# switchport port-security maximum 2
SW1(config-if)# switchport port-security mac-address sticky
SW1(config-if)# switchport port-security violation restrict
```

- `maximum 2`: allow at most 2 MAC addresses on this port.
- `mac-address sticky`: dynamically learn the first MAC(s) seen and write them to the running config as if statically configured.
- `violation restrict`: when a violation occurs, drop frames from the unknown MAC and increment a violation counter. The port stays up.

### Violation modes

| Mode | Port state | Drops frames | Logs/increments counter |
|---|---|---|---|
| protect | Up | Yes | No |
| restrict | Up | Yes | Yes |
| shutdown | err-disabled | Yes | Yes (syslog) |

`shutdown` is the default and most secure: the port goes err-disabled until an administrator intervenes. Verify with `show port-security interface Gi0/1` and `show port-security`.

## DHCP snooping

DHCP snooping prevents rogue DHCP servers. The switch classifies each port as trusted or untrusted:

- **Trusted ports**: connected to legitimate DHCP servers or uplinks; all DHCP message types allowed.
- **Untrusted ports**: connected to end hosts; only DHCP client messages (Discover, Request, Release, Decline) are allowed. Server messages (Offer, Acknowledge) are dropped.

```text
SW1(config)# ip dhcp snooping
SW1(config)# ip dhcp snooping vlan 10
SW1(config)# interface GigabitEthernet0/24
SW1(config-if)# ip dhcp snooping trust
```

The uplink to the router (or the port facing the DHCP server) is trusted. All access ports remain untrusted by default. DHCP snooping also builds a binding table (IP, MAC, port, VLAN, lease time) that DAI uses.

## Dynamic ARP Inspection (DAI)

ARP has no authentication. Any host can send a gratuitous ARP claiming any IP belongs to its MAC. DAI validates ARP packets against the DHCP snooping binding table:

- If the ARP sender IP/MAC pair matches a binding table entry, the ARP is forwarded.
- If it does not match, the ARP is dropped.

DAI must be enabled after DHCP snooping (it relies on the binding table):

```text
SW1(config)# ip arp inspection vlan 10
SW1(config)# interface GigabitEthernet0/24
SW1(config-if)# ip arp inspection trust
```

Trusted ports (uplinks, known servers) bypass DAI. Access ports are untrusted by default.

## 802.1X port-based NAC

802.1X prevents any traffic from flowing on a port until the connected device authenticates. Three roles:

```text
+-----------+      EAPOL      +-----------+    RADIUS   +------------+
| Supplicant|<--------------->|Authenticat|<----------->|Auth Server |
| (laptop)  |                 |or (switch)|             | (RADIUS)   |
+-----------+                 +-----------+             +------------+
```

- **Supplicant**: the end device seeking network access; runs 802.1X client software.
- **Authenticator**: the switch; enforces access based on authentication result.
- **Authentication server**: a RADIUS server (Cisco ISE, FreeRADIUS) that validates credentials.

Until authentication succeeds, the port is in an unauthorized state and only passes EAPOL frames. After success, the port opens and optionally assigns a VLAN based on the user's group.

## VPNs

### IPsec site-to-site VPN

Connects two fixed sites over an untrusted network (the internet). Traffic is encrypted and authenticated between two routers or firewalls.

IPsec negotiation happens in two phases:

```text
Phase 1 (IKE / ISAKMP SA):
  Establishes a secure management tunnel
  Negotiates: encryption algorithm, hash, DH group, lifetime, authentication method
  Result: IKE SA (bidirectional)

Phase 2 (IPsec SA):
  Runs inside the Phase 1 tunnel
  Negotiates: encryption algorithm, hash, lifetime, selectors (what traffic to protect)
  Result: two unidirectional IPsec SAs (one per direction)
```

**AH (Authentication Header)**: provides authentication and integrity; does not encrypt. Incompatible with NAT (modifies IP header, breaking AH hash).

**ESP (Encapsulating Security Payload)**: provides authentication, integrity, and encryption. NAT-compatible in NAT-T mode. ESP is standard in modern deployments. AH is rarely used.

### Remote access VPN

Individual users connect from arbitrary locations. Common implementations:

- **SSL/TLS VPN**: uses HTTPS (port 443); works through most firewalls; no special client often needed.
- **IPsec IKEv2**: strong security; requires client software; preferred by modern enterprise deployments.

### DMVPN (Dynamic Multipoint VPN)

Cisco's scalable VPN solution for hub-and-spoke or full-mesh topologies. Spokes register with the hub using NHRP (Next Hop Resolution Protocol). In Phase 3, spokes can build direct tunnels to each other without routing all traffic through the hub.

## Secure device management

Default Cisco IOS configuration allows Telnet (cleartext) access. This is unacceptable on any production device.

```text
R1(config)# crypto key generate rsa modulus 2048
R1(config)# ip ssh version 2
R1(config)# line vty 0 4
R1(config-line)# transport input ssh
R1(config-line)# login local
R1(config)# username admin privilege 15 secret YOUR_STRONG_PASSWORD_HERE
```

Additional hardening:

| Bad practice | Secure alternative |
|---|---|
| Telnet (TCP 23, cleartext) | SSH v2 (TCP 22, encrypted) |
| HTTP management | HTTPS with self-signed or CA certificate |
| SNMPv1/v2c (community string only) | SNMPv3 (authentication + encryption) |
| Privilege 15 for all users | Privilege levels or TACACS+ command authorization |
| No login timeout | `exec-timeout 5 0` on VTY and console lines |

## VLAN hopping attacks

### Switch spoofing

If a switch port is configured with `switchport mode dynamic auto` or `dynamic desirable`, an attacker can send DTP frames and negotiate a trunk. Once trunking, the attacker has access to all VLANs.

Fix: explicitly set all access ports to access mode and disable DTP:

```text
SW1(config-if)# switchport mode access
SW1(config-if)# switchport nonegotiate
```

### Double tagging

An attacker connected to the native VLAN sends a frame with two 802.1Q tags. The first tag matches the native VLAN and is stripped by the first switch. The second tag (a different VLAN) is then forwarded into that VLAN.

Fix: never put user traffic on the native VLAN. Change the native VLAN to an unused VLAN ID on all trunks:

```text
SW1(config-if)# switchport trunk native vlan 999
```

## Gotchas

**DHCP snooping must be enabled before DAI**: DAI relies on the DHCP snooping binding table. Enabling DAI without DHCP snooping drops all ARP traffic (no binding entries to validate against).

**Err-disabled recovery**: when a port-security violation triggers `shutdown` mode, the port goes err-disabled. It requires manual intervention:

```text
SW1(config-if)# shutdown
SW1(config-if)# no shutdown
```

Or configure automatic recovery:

```text
SW1(config)# errdisable recovery cause psecure-violation
SW1(config)# errdisable recovery interval 300
```

**TACACS+ is Cisco proprietary**: in multi-vendor environments, RADIUS is the standard. TACACS+ only works with Cisco equipment acting as the authenticator.

**AH breaks NAT**: if your site-to-site VPN traverses a NAT device (common with home routers), use ESP, not AH. AH authenticates the IP header, which NAT modifies.

---

## References

- [Cisco IOS Security Configuration Guide](https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/sec_usr_aaa/configuration/xe-16/sec-usr-aaa-xe-16-book.html)
- [RFC 2865: Remote Authentication Dial In User Service (RADIUS)](https://datatracker.ietf.org/doc/html/rfc2865)
- [RFC 4301: Security Architecture for the Internet Protocol (IPsec)](https://datatracker.ietf.org/doc/html/rfc4301)
- [Cisco DHCP Snooping and DAI Guide](https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst4500/12-2/25ew/configuration/guide/conf/dynarp.html)

## Related topics

- [Part 7: VLANs](../part-07-vlans/)
- [Part 17: DHCP and DNS](../part-17-dhcp-and-dns/)
- [Part 18: Access Control Lists](../part-18-access-control-lists/)
