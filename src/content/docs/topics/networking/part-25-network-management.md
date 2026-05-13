---
title: "Part 25: Network Management"
description: "NTP, SNMP, Syslog, CDP, and LLDP: the protocols that give you visibility into device state, time synchronization, and log analysis."
parent: networking
tags: [networking, ccna]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

You cannot fix what you cannot see. A network that has no time synchronization produces logs that cannot be correlated. A network with no monitoring produces no alerts until users start calling. A network that leaks topology information to anyone who connects a laptop is an unnecessary security risk. This part covers the management protocols that give you visibility and control: NTP, SNMP, Syslog, CDP, and LLDP.

## Why it matters

Management protocols are tested directly on the CCNA. More practically, every troubleshooting session in production depends on them: accurate timestamps tell you which event happened first, SNMP alerts tell you a link went down before users notice, and Syslog messages tell you why. Getting these configured correctly is foundational work.

---

## NTP (Network Time Protocol)

### Why accurate time matters

Three things break when clocks drift:

1. **Log correlation**: if Router A and Switch B disagree on the time by 90 seconds, you cannot reconstruct the sequence of events during an outage. Chasing a problem through logs with inconsistent timestamps adds hours to troubleshooting.
2. **Certificate validity**: TLS certificates carry valid-from and valid-to dates. A device with a clock that is off by days will reject valid certificates or accept expired ones.
3. **Kerberos authentication**: Kerberos (used in Windows domains and many enterprise SSO systems) has a hard 5-minute tolerance. Clocks that drift beyond 5 minutes cause authentication failures that are difficult to diagnose without knowing about the time dependency.

### NTP hierarchy (stratum)

NTP uses a stratum model to describe how far a device is from an authoritative time source.

```text
Stratum 0: atomic clock or GPS receiver (not directly on the network)
              |
Stratum 1: server directly connected to stratum-0 source
              |
Stratum 2: server syncing from a stratum-1 server
              |
Stratum 3: device syncing from a stratum-2 server
              ...
Stratum 15: maximum valid stratum
Stratum 16: device is unsynchronized
```

Each NTP hop adds 1 to the stratum. A Cisco router configured to sync from a stratum-2 public server becomes stratum 3. Accuracy degrades slightly with each hop. Stratum 16 means the device has lost synchronization and is not a reliable time source.

Public NTP pools (pool.ntp.org, Google's 216.239.35.0/4) are stratum 1 or 2. Enterprise networks typically run internal NTP servers that sync to those pools and serve internal devices, reducing external dependency.

### NTP modes

| Mode | Description | Typical use |
|---|---|---|
| Client/server | Router syncs to a designated NTP server | Most common; router is client |
| Peer (symmetric) | Two devices agree to sync with each other | Redundancy between NTP servers |
| Broadcast | Server sends time to the subnet; clients listen | Large flat networks; less accurate |

Client/server mode is what you configure on almost every network device. Peer mode is used between redundant NTP servers. Broadcast mode is rarely used due to lower accuracy.

### Cisco IOS NTP configuration

Configure the router to sync from two external NTP servers. The `prefer` keyword tells the router to use that server first when both are reachable:

```text
R1(config)# ntp server 216.239.35.0
R1(config)# ntp server 216.239.35.4 prefer
R1(config)# ntp source Loopback0
R1(config)# clock timezone EST -5
R1(config)# clock summer-time EDT recurring
```

`ntp source Loopback0` tells the router to use the Loopback0 address as the source IP in NTP packets. Loopback interfaces are always up, so the NTP server sees a stable source address regardless of which physical interface the packet exits.

`clock timezone EST -5` sets UTC offset to -5 hours. `clock summer-time EDT recurring` automatically handles daylight saving time transitions.

### NTP verification

```text
R1# show ntp status
Clock is synchronized, stratum 3, reference is 216.239.35.4
...

R1# show ntp associations
  address         ref clock       st   when     poll    reach  delay   offset  disp
*~216.239.35.4    .GOOG.           1     42       64      377   12.3    +0.52   0.9
+~216.239.35.0    .GOOG.           1     18       64      377   11.8    +0.18   0.9
```

Symbols in `show ntp associations`:
- `*` = currently syncing to this peer (selected)
- `+` = candidate peer (acceptable)
- `-` = peer is rejected
- `~` = statically configured peer

`show clock` shows the current time and whether it is authoritative:

```text
R1# show clock
14:23:11.456 EST Tue May 13 2026
```

### NTP authentication

Without authentication, any device can pose as an NTP server and shift your device clocks (an NTP spoofing attack). NTP authentication uses MD5:

```text
R1(config)# ntp authenticate
R1(config)# ntp authentication-key 1 md5 NTP_KEY_HERE
R1(config)# ntp trusted-key 1
R1(config)# ntp server 216.239.35.4 key 1
```

The router will only accept time updates from servers that present a matching key. This matters most on management networks where an attacker could connect a rogue device.

---

## SNMP (Simple Network Management Protocol)

### Components

SNMP has three logical pieces:

```text
+-------------------+       GET / SET / TRAP       +-------------------+
| Managed Device    |<---------------------------->| NMS               |
| (router, switch)  |                              | (SolarWinds,      |
|                   |    [agent runs here]          |  PRTG, Zabbix)    |
+-------------------+                              +-------------------+
        |
  MIB (Management Information Base)
  OID tree of every measurable variable
  (interface counters, CPU, memory, BGP state...)
```

- **Managed device**: any network device running an SNMP agent. The agent exposes device variables via the MIB.
- **NMS (Network Management Station)**: the server that polls devices and receives traps. This is your monitoring platform.
- **MIB**: a hierarchical database of Object Identifiers (OIDs). Each OID maps to a specific variable (for example, `1.3.6.1.2.1.2.2.1.10` is `ifInOctets`, the byte counter for an interface).

### SNMP operations

| Operation | Direction | Description |
|---|---|---|
| GET | NMS to agent | Retrieve the value of a single OID |
| GETNEXT | NMS to agent | Retrieve the next OID in the MIB tree (walk) |
| GETBULK | NMS to agent | Retrieve multiple OIDs in one request (v2c/v3 only) |
| SET | NMS to agent | Write a value to a writable OID |
| TRAP | Agent to NMS | Unsolicited alert; fire and forget; no acknowledgment |
| INFORM | Agent to NMS | Acknowledged trap; agent retransmits until NMS confirms (v2c/v3 only) |

TRAPs are UDP and unreliable: if the NMS is down when the trap fires, the alert is lost. INFORMs solve this by requiring an acknowledgment.

### SNMP versions

| Version | Authentication | Encryption | Notes |
|---|---|---|---|
| SNMPv1 | Community string | None | Original standard; avoid |
| SNMPv2c | Community string | None | Adds GETBULK and INFORM; still no encryption |
| SNMPv3 | Username + auth (MD5/SHA) | AES/DES | The correct choice for production |

Community strings in v1/v2c are sent in plaintext. Anyone with a packet capture on the management network can read them. Read-only (RO) communities allow GET operations. Read-write (RW) communities allow SET operations. Exposing an RW community on an insecure network is a serious vulnerability.

### SNMPv3 security levels

| Level | Authentication | Encryption | Use case |
|---|---|---|---|
| noAuthNoPriv | None | None | Equivalent to v2c; avoid |
| authNoPriv | MD5 or SHA | None | Authenticated but visible |
| authPriv | MD5 or SHA | AES or DES | Full security; use this |

### Cisco IOS SNMP configuration

SNMPv2c (common but insecure; use only on isolated management networks):

```text
R1(config)# snmp-server community PUBLIC ro
R1(config)# snmp-server host 10.0.0.100 version 2c PUBLIC
R1(config)# snmp-server enable traps
```

`snmp-server community PUBLIC ro` defines the read-only community string. `snmp-server host` tells the device where to send traps. `snmp-server enable traps` enables all trap types; you can narrow this to specific events (for example, `snmp-server enable traps ospf`).

SNMPv3 (preferred):

```text
R1(config)# snmp-server group MYGROUP v3 priv
R1(config)# snmp-server user MYUSER MYGROUP v3 auth sha AUTH_PASS_HERE priv aes 128 PRIV_PASS_HERE
```

`snmp-server group` defines the security model and minimum security level (`priv` = authPriv). `snmp-server user` associates a user with the group and specifies authentication (SHA) and encryption (AES-128) credentials.

---

## Syslog

### Severity levels

Syslog defines eight severity levels, 0 (most severe) through 7 (least severe):

| Level | Keyword | Meaning |
|---|---|---|
| 0 | Emergency | System unusable |
| 1 | Alert | Immediate action required |
| 2 | Critical | Critical condition |
| 3 | Error | Error condition |
| 4 | Warning | Warning condition |
| 5 | Notice | Normal but significant |
| 6 | Informational | Informational messages |
| 7 | Debug | Debug-level output |

Mnemonic: **E**very **A**wful **C**isco **E**ngineer **W**ill **N**eed **D**aily **D**oses (Emergency, Alert, Critical, Error, Warning, Notice, Debug, Debug). Adjust the last letters however helps you remember the order.

When you configure a logging severity threshold, the device logs that level and everything more severe (lower number). Setting `logging trap informational` captures levels 0 through 6 and excludes debug.

### Syslog destinations

A Cisco device can send logs to multiple destinations simultaneously:

| Destination | Command | Notes |
|---|---|---|
| Console port | `logging console` | Visible on direct console connection; default on |
| VTY lines (SSH/Telnet) | `logging monitor` | Only active with `terminal monitor` in the session |
| Internal buffer | `logging buffered` | Stored in RAM; lost on reload |
| External syslog server | `logging host` | Persistent; centralizes logs across devices |

The internal buffer is useful for quick `show logging` checks, but it is lost on reload. An external syslog server (Graylog, Splunk, rsyslog) is necessary for persistent log retention and cross-device correlation.

### Cisco IOS logging configuration

```text
R1(config)# logging host 10.0.0.200
R1(config)# logging trap informational
R1(config)# logging buffered 16384 debugging
R1(config)# service timestamps log datetime msec
```

`logging host 10.0.0.200` sends syslog messages (UDP 514 by default) to the syslog server. `logging trap informational` sets the severity threshold for messages sent to the server (levels 0-6). `logging buffered 16384 debugging` allocates 16 KB of RAM for the local buffer and captures all levels including debug. `service timestamps log datetime msec` adds a timestamp with millisecond precision to every log message, which is essential for correlating events.

View the local buffer:

```text
R1# show logging
Syslog logging: enabled (11 messages dropped, 0 flushes, 0 overruns)
    Console logging: level debugging, 42 messages logged
    Monitor logging: level debugging, 0 messages logged
    Buffer logging: level debugging, 42 messages logged

Log Buffer (16384 bytes):
May 13 14:22:55.123: %OSPF-5-ADJCHG: Process 1, Nbr 10.0.0.2 on Gi0/0 from LOADING to FULL, Loading Done
```

---

## CDP and LLDP

### CDP (Cisco Discovery Protocol)

CDP is a Cisco proprietary Layer 2 protocol. Devices send CDP advertisements out all interfaces by default, every 60 seconds. The advertisements contain:

- Device ID (hostname)
- IP address(es)
- Platform (hardware model)
- Capabilities (router, switch, phone)
- Interface and port information
- IOS version

CDP operates at Layer 2, so it works even before IP addresses are configured. It does not cross routers (Layer 2 only, link-local).

```text
R1# show cdp neighbors
Capability Codes: R - Router, T - Trans Bridge, B - Source Route Bridge
                  S - Switch, H - Host, I - IGMP, r - Repeater

Device ID        Local Intrfce     Holdtme    Capability  Platform  Port ID
SW1              Gig 0/0           132           S I      WS-C2960  Gig 0/1
R2               Gig 0/1           158           R        ISR4321   Gig 0/0
```

`show cdp neighbors detail` adds IP addresses and IOS version to the output. This is the fastest way to discover what is directly connected to a device and how to reach it for management.

### LLDP (Link Layer Discovery Protocol)

LLDP is the IEEE 802.1AB open standard equivalent of CDP. It is vendor-neutral: an LLDP-capable Cisco switch will discover a Juniper router, an HP switch, or a VoIP phone from any vendor. LLDP is disabled by default on most Cisco devices and must be explicitly enabled.

```text
R1(config)# lldp run
```

Per-interface enable/disable:

```text
R1(config-if)# lldp transmit
R1(config-if)# lldp receive
```

Verification:

```text
R1# show lldp neighbors
Capability codes:
    (R) Router, (B) Bridge, (T) Telephone, (C) DOCSIS Cable Device
    (W) WLAN Access Point, (P) Repeater, (S) Station, (O) Other

Device ID           Local Intf     Hold-time  Capability      Port ID
SW1                 Gi0/0          120        B               Gi0/1
```

### CDP and LLDP security

Both protocols send device information in plaintext to anyone connected to that link segment. On internal links this is acceptable. On links facing external networks (ISP handoffs, DMZ ports, guest wireless uplinks), disable both:

```text
R1(config)# interface GigabitEthernet0/0
R1(config-if)# no cdp enable
R1(config-if)# no lldp transmit
R1(config-if)# no lldp receive
```

An attacker who connects to an access port and captures CDP frames learns your router model, IOS version, and management IP. That is free reconnaissance. Disable it where it is not needed.

---

## Gotchas

**SNMPv1/v2c community strings travel in plaintext.** Any packet capture on the management VLAN exposes them. If you use v2c, isolate the management network and treat community strings as secrets. Use SNMPv3 authPriv in any environment where that is feasible.

**Debug logging at scale kills routers.** Setting `logging trap debugging` on a busy router can saturate the CPU with log generation. Cisco IOS processes log messages in the main execution thread. Always revert to `informational` after finishing a debug session:

```text
R1(config)# logging trap informational
R1# no debug all
```

**NTP stratum increments per hop.** A device that syncs to a stratum-2 server becomes stratum 3. A device downstream of that becomes stratum 4. Keep your internal NTP hierarchy shallow (2-3 levels maximum) to preserve accuracy and keep stratums low.

**`logging buffered` is lost on reload.** The internal buffer is RAM only. If a device crashes, the logs that would explain the crash are gone. Always configure an external syslog server in production.

**CDP holdtime vs timer.** CDP sends advertisements every 60 seconds by default and the holdtime is 180 seconds (3x the timer). If you reduce the CDP timer without reducing the holdtime proportionally, neighbors will drop and reappear in the neighbor table, which can confuse monitoring tools.

---

## References

- [Cisco IOS NTP Configuration Guide](https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/bsm/configuration/xe-16/bsm-xe-16-book/bsm-time-calendar-set.html)
- [RFC 5905: Network Time Protocol Version 4](https://datatracker.ietf.org/doc/html/rfc5905)
- [RFC 3410: Introduction to SNMP](https://datatracker.ietf.org/doc/html/rfc3410)
- [Cisco SNMP Configuration Guide](https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/snmp/configuration/xe-16/snmp-xe-16-book.html)
- [RFC 5424: The Syslog Protocol](https://datatracker.ietf.org/doc/html/rfc5424)

## Related topics

- [Part 1: Introduction to Networking](./part-01-intro-to-networking)
- [Part 19: Network Security Fundamentals](./part-19-network-security-fundamentals)
- [Part 20: WAN Technologies and Network Automation](./part-20-wan-technologies-and-network-automation)
