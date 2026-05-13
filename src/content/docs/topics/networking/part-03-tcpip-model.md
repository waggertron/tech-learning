---
title: "Part 3: The TCP/IP Model"
description: "The four-layer TCP/IP model, how it maps to OSI, TCP vs UDP behavior, port numbers, and why this model runs the internet."
parent: networking
tags: [networking, ccna]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

The TCP/IP model is not a reference model for protocol designers. It is the protocol suite that actually runs the internet. Every device connected to the internet runs TCP/IP. Every router forwarding packets uses IP. Understanding this model at the layer-by-layer level, and knowing how TCP and UDP behave differently, is foundational for everything that follows in the CCNA curriculum.

## Why TCP/IP exists

The US Department of Defense funded ARPANET in the late 1960s to build a network that could survive partial failures and still route traffic. The result was a packet-switched network and a protocol suite designed around the idea that the network itself is unreliable: endpoints (hosts) are responsible for reliability, not the network core.

TCP/IP predates the OSI model. It was not designed to fit OSI layers; OSI was designed after TCP/IP existed, as a vendor-neutral generalization. The practical result is a mismatch between the two models that engineers have argued about ever since.

## The four layers

```
TCP/IP Model          OSI Equivalent
+-----------------+   +---------------------+
| Application     |   | 7 Application       |
|                 |   | 6 Presentation      |
|                 |   | 5 Session           |
+-----------------+   +---------------------+
| Transport       |   | 4 Transport         |
+-----------------+   +---------------------+
| Internet        |   | 3 Network           |
+-----------------+   +---------------------+
| Network Access  |   | 2 Data Link         |
|                 |   | 1 Physical          |
+-----------------+   +---------------------+
```

### Application layer (OSI 5-7)

Everything that user-facing software uses to communicate lives here. The TCP/IP Application layer collapses OSI's Session, Presentation, and Application layers into one. Protocols at this layer define message formats, encoding, and session management.

Key application-layer protocols:

| Protocol | Purpose |
|----------|---------|
| HTTP/HTTPS | Web browsing |
| FTP | File transfer (control + data) |
| SSH | Encrypted remote shell |
| Telnet | Unencrypted remote shell (legacy) |
| SMTP | Sending email |
| DNS | Domain name to IP resolution |
| DHCP | Dynamic IP address assignment |
| SNMP | Network device management |
| NTP | Clock synchronization |

### Transport layer (OSI 4)

Transport moves data between processes on different hosts. Port numbers identify which process on the destination host should receive the data. Two protocols operate here: TCP and UDP.

### Internet layer (OSI 3)

The Internet layer handles logical addressing and routing. IP assigns addresses and defines packet format. Routers operate at this layer.

Key Internet-layer protocols:

- **IPv4 / IPv6:** addressing and packet delivery.
- **ICMP:** diagnostic and control messages. Ping sends ICMP Echo Request and receives ICMP Echo Reply. Traceroute uses ICMP Time Exceeded messages.
- **ARP:** resolves an IP address to a MAC address within a local segment. Technically sits between the Internet and Network Access layers (more on this below).

### Network Access layer (OSI 1-2)

The Network Access layer (sometimes called Link layer) handles everything needed to move a packet across a single physical link: framing, MAC addressing, and signal transmission. This includes Ethernet (802.3), Wi-Fi (802.11), and PPP.

## TCP vs UDP

The choice between TCP and UDP shapes application behavior at a fundamental level.

### TCP: Transmission Control Protocol

TCP is connection-oriented and reliable. Before any data flows, TCP establishes a session using the three-way handshake:

```
Client                         Server
  |                               |
  |------- SYN ------------------>|   Client says: I want to connect
  |                               |
  |<------ SYN-ACK ---------------|   Server says: OK, I'm ready
  |                               |
  |------- ACK ------------------>|   Client says: Got it, let's go
  |                               |
  |====== data flows both ways ===|
  |                               |
  |------- FIN ------------------>|   (teardown: four-way FIN exchange)
```

TCP features:
- **Sequencing:** every byte is numbered. The receiver reorders out-of-sequence segments.
- **Acknowledgment:** the receiver sends ACKs. If the sender does not receive an ACK within a timeout, it retransmits.
- **Flow control:** the receiver advertises a window size (how many bytes it can accept before being overwhelmed). The sender does not exceed this.
- **Congestion control:** TCP backs off when it detects network congestion (lost packets, increased RTT).

Use TCP when data correctness matters: web pages (HTTP/HTTPS), file transfers (FTP, SFTP), email (SMTP), SSH sessions.

### UDP: User Datagram Protocol

UDP is connectionless and unreliable. It sends datagrams and does not track whether they arrive, arrive in order, or arrive at all. There is no handshake. There is no retransmission.

```
Client                         Server
  |                               |
  |------- datagram ------------->|   No handshake. Just send.
  |------- datagram ------------->|
  |------- datagram ------------->|
```

UDP features:
- Lower overhead (8-byte header vs 20-byte TCP header minimum).
- Lower latency (no handshake delay, no retransmission wait).
- Application controls reliability if needed (QUIC builds reliability on top of UDP).

Use UDP when speed matters more than guaranteed delivery: DNS queries (small, fast, retryable by the application), DHCP, VoIP, video streaming, online gaming.

### Comparison table

| Property | TCP | UDP |
|----------|-----|-----|
| Connection | Connection-oriented | Connectionless |
| Reliability | Guaranteed delivery | Best-effort |
| Ordering | Segments reordered | No reordering |
| Error recovery | Retransmission | None (application handles) |
| Flow control | Yes (window size) | No |
| Header size | 20 bytes minimum | 8 bytes |
| Latency | Higher (handshake + ACKs) | Lower |
| Use cases | HTTP, SSH, FTP, SMTP | DNS, VoIP, DHCP, streaming |

## Port numbers

Port numbers are 16-bit integers (0-65535) that identify processes at the transport layer. The destination port tells the receiving host which service should handle the packet.

**Three ranges:**

| Range | Name | Assigned by |
|-------|------|-------------|
| 0-1023 | Well-known ports | IANA; reserved for standard services |
| 1024-49151 | Registered ports | IANA; vendor and application registration |
| 49152-65535 | Dynamic / ephemeral | OS assigns to client-side connections |

**Common port reference:**

| Port | Protocol | Service |
|------|----------|---------|
| 20 | TCP | FTP data transfer |
| 21 | TCP | FTP control |
| 22 | TCP | SSH |
| 23 | TCP | Telnet |
| 25 | TCP | SMTP |
| 53 | TCP/UDP | DNS |
| 67 | UDP | DHCP server |
| 68 | UDP | DHCP client |
| 80 | TCP | HTTP |
| 110 | TCP | POP3 |
| 143 | TCP | IMAP |
| 161 | UDP | SNMP |
| 162 | UDP | SNMP trap |
| 443 | TCP | HTTPS |
| 514 | UDP | Syslog |
| 3389 | TCP | RDP |

A socket is a combination of IP address + protocol + port number. The socket uniquely identifies a communication endpoint: `192.168.1.10:443/TCP` is a distinct socket from `192.168.1.10:80/TCP`.

## IP addressing: a teaser

IP addresses are covered in depth in Part 10. The short version: IPv4 uses 32-bit addresses written in dotted-decimal notation (four octets, each 0-255). Example: `192.168.1.1`.

Every packet in the Internet layer contains a source IP address and a destination IP address. Routers use the destination IP to make forwarding decisions. The source IP tells the destination where to send replies.

## OSI vs TCP/IP comparison table

| TCP/IP Layer | TCP/IP Protocols | OSI Layers | OSI PDU |
|--------------|-----------------|------------|---------|
| Application | HTTP, DNS, SMTP, SSH, DHCP | 7, 6, 5 | Data |
| Transport | TCP, UDP | 4 | Segment / Datagram |
| Internet | IP, ICMP, ARP | 3 | Packet |
| Network Access | Ethernet, Wi-Fi, PPP | 2, 1 | Frame / Bit |

## Gotchas

- **ARP placement:** ARP resolves IP addresses (Layer 3) to MAC addresses (Layer 2). It is technically a Layer 2 protocol because it only works within a single broadcast domain. But it takes IP addresses as input. Cisco places ARP in the Internet layer of TCP/IP and at Layer 2 in OSI. On the CCNA, know that ARP bridges Layers 2 and 3 and do not be surprised if a question places it at either.
- **ICMP is not TCP or UDP:** ICMP is an Internet-layer protocol. It does not use port numbers. Ping and traceroute use ICMP directly, not TCP or UDP. Firewalls that block ICMP will break ping without affecting TCP/UDP traffic.
- **TCP handshake overhead:** the three-way handshake adds at least one round-trip time (RTT) of latency before data flows. For short-lived connections (like a single DNS query), this overhead is significant. HTTP/2 and QUIC address this with connection reuse and 0-RTT handshakes respectively.
- **Ephemeral port reuse:** client-side ports (49152-65535) are assigned by the OS and reused after connections close. Stateful firewalls and NAT devices track these to match return traffic to the correct internal host.
- **HTTPS is HTTP over TLS:** port 443 is for HTTPS. TLS provides encryption and authentication. HTTP provides the application protocol. The two are separate layers even though HTTPS is what most people mean when they say "the web."

## References

- [RFC 793: Transmission Control Protocol (IETF)](https://www.rfc-editor.org/rfc/rfc793)
- [RFC 768: User Datagram Protocol (IETF)](https://www.rfc-editor.org/rfc/rfc768)
- [IANA Service Name and Transport Protocol Port Number Registry](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml)

## Related topics

- [Part 1: Introduction to Networking](./part-01-intro-to-networking)
- [Part 2: The OSI Model](./part-02-osi-model)
- [Part 10: IPv4 Addressing and Subnetting](./part-10-ipv4-addressing-and-subnetting)
