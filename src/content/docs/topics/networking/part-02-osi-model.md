---
title: "Part 2: The OSI Model"
description: "The seven-layer OSI reference model: what each layer does, its PDU, and how encapsulation ties them together."
parent: networking
tags: [networking, ccna]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

The OSI model does not run on any real device. No packet has ever been transmitted by "the OSI stack." What the model does is give every engineer a shared vocabulary for describing where in the communication process something goes wrong, or where a new protocol fits. That shared vocabulary is worth understanding precisely.

## Why the OSI model exists

In the 1970s, vendors shipped proprietary networking stacks: IBM's SNA, DEC's DECnet, and others. Equipment from different vendors could not interoperate. The ISO developed the Open Systems Interconnection model in 1984 as a vendor-neutral reference framework for designing and describing network protocols.

The OSI model is not an implementation. It is a conceptual guide. When a Cisco engineer says "that's a Layer 3 problem," they are using OSI vocabulary to narrow down the fault domain, not invoking a Cisco-specific implementation detail.

## The seven layers

Mnemonic (bottom to top, layers 1-7): **Please Do Not Throw Sausage Pizza Away**

| Layer | Name | PDU | Example protocols and hardware |
|-------|------|-----|-------------------------------|
| 7 | Application | Data | HTTP, FTP, DNS, SMTP, SNMP, Telnet |
| 6 | Presentation | Data | TLS/SSL, JPEG, MPEG, ASCII, Unicode |
| 5 | Session | Data | NetBIOS, PPTP, RPC, SIP (session setup) |
| 4 | Transport | Segment (TCP) / Datagram (UDP) | TCP, UDP, port numbers |
| 3 | Network | Packet | IP, ICMP, OSPF, BGP, routers |
| 2 | Data Link | Frame | Ethernet, Wi-Fi (802.11), MAC addresses, switches |
| 1 | Physical | Bit | Cables, hubs, repeaters, NICs, fiber, radio |

### Layer 7: Application

The application layer is where network-aware software lives. It is not "the application" (your browser is not Layer 7), but rather the protocols that applications use to request services: HTTP for web pages, SMTP for email, DNS for name resolution, FTP for file transfer. This layer defines the format and sequence of messages between software processes.

### Layer 6: Presentation

Presentation handles translation, encryption, and compression. If two systems use different character encodings (ASCII vs EBCDIC), Layer 6 translates. TLS/SSL encryption is often described as a Layer 6 function because it transforms data before handing it to the transport layer. JPEG and MPEG compression also live here conceptually.

In practice, the TCP/IP stack collapses Layers 5, 6, and 7 into a single Application layer. The OSI distinction is useful for troubleshooting (is it an encoding issue or a transport issue?) but is not a hard boundary in real implementations.

### Layer 5: Session

The session layer establishes, manages, and terminates sessions between applications. A session is a persistent logical connection that allows request-response exchanges to be coordinated. NetBIOS session services, PPTP tunnel establishment, and the session negotiation phase of SIP (VoIP signaling) are examples.

Again, in TCP/IP implementations this is absorbed into the Application layer. Its value in the OSI model is as a troubleshooting category: if two applications can connect but cannot maintain a conversation, the fault may be at the session level (authentication, timeout, token management).

### Layer 4: Transport

Transport moves data reliably (or unreliably) between processes on different hosts. The two protocols are TCP and UDP.

**TCP (Transmission Control Protocol):** connection-oriented. Establishes a session with a three-way handshake before data flows, numbers each segment for ordering and retransmission, and uses flow control and congestion control. Guarantees delivery and order. Higher overhead.

**UDP (User Datagram Protocol):** connectionless. Sends datagrams without establishing a session, does not acknowledge receipt, and does not reorder. Lower overhead, lower latency. Used where speed matters more than guaranteed delivery: VoIP, DNS queries, video streaming, gaming.

Port numbers live at Layer 4. They identify which process on a host should receive the data (port 80 for HTTP, port 443 for HTTPS, port 22 for SSH). More on ports in Part 3.

### Layer 3: Network

The network layer is responsible for logical addressing and path selection. IP addresses are Layer 3 addresses. Routers operate at Layer 3: they receive packets, consult their routing tables, and forward packets toward the destination across potentially many hops.

Key Layer 3 protocols:
- **IP (IPv4 and IPv6):** logical addressing and packet delivery.
- **ICMP:** control messages and diagnostics (ping and traceroute use ICMP).
- **OSPF, EIGRP, BGP:** routing protocols that build and maintain routing tables.

### Layer 2: Data Link

The data link layer handles node-to-node delivery within a single network segment. It uses hardware (MAC) addresses instead of logical (IP) addresses. Switches operate at Layer 2: they learn MAC addresses and forward frames only to the correct port.

**Two sub-layers (IEEE 802 architecture):**

- **LLC (Logical Link Control, 802.2):** provides an interface between the upper layers and the MAC sub-layer. Handles flow control and error notification at the frame level.
- **MAC (Media Access Control):** controls how devices share access to the physical medium (CSMA/CD for Ethernet). Contains source and destination MAC addresses in the frame header.

Ethernet frames, Wi-Fi frames (802.11), and PPP frames are all Layer 2 PDUs.

### Layer 1: Physical

The physical layer converts bits into signals and signals back into bits. It defines the electrical, optical, or radio characteristics of the medium: voltage levels, timing, connector pinouts, cable specifications, and modulation schemes.

Hardware at Layer 1: cables (UTP, fiber, coaxial), hubs, repeaters, NICs, transceivers (SFP modules). A hub is a Layer 1 device because it just amplifies and repeats signals: it has no awareness of addresses or frames.

## Encapsulation and de-encapsulation

When an application sends data, each layer adds its own header (and sometimes trailer) before passing the data down to the next layer. This is encapsulation. At the receiving end, each layer strips its header as the data moves up. This is de-encapsulation.

```
Sending side (top to bottom)          Receiving side (bottom to top)

Layer 7: [  DATA  ]                   Layer 7: [  DATA  ]
                                                    ^
Layer 4: [ TCP HDR |  DATA  ]         Layer 4: [ TCP HDR |  DATA  ]
                                                    ^
Layer 3: [ IP HDR | TCP HDR |  DATA  ] Layer 3: [ IP HDR | TCP HDR |  DATA  ]
                                                    ^
Layer 2: [ ETH HDR | IP HDR | TCP HDR |  DATA  | ETH TRAILER ]
                                                    ^
Layer 1: 0101001010110101... (bits on wire)
```

Each header contains information relevant only to that layer's peer at the remote end. The IP header is read and stripped by the remote Layer 3 (router or host). The TCP header is read and stripped by the remote Layer 4. The application receives only the original data.

Intermediary devices only process headers at the layers they operate on:
- A switch reads only the Layer 2 Ethernet header (source and destination MAC), then forwards the frame. It does not look at IP addresses.
- A router reads the Layer 2 header to receive the frame, strips it, reads the Layer 3 IP header to make a forwarding decision, then re-encapsulates with a new Layer 2 header for the next hop.

## Troubleshooting with OSI

The OSI model gives you a structured troubleshooting ladder. Start at Layer 1 and work up:

1. **Layer 1:** Is the cable plugged in? Is the link light on? Is the interface showing up/up in `show interfaces`?
2. **Layer 2:** Is the switch learning the MAC address? Is there a duplex mismatch? Is the VLAN correct?
3. **Layer 3:** Does the host have the right IP address and default gateway? Can you ping the gateway? Is there a route to the destination?
4. **Layer 4:** Is the correct port open? Is a firewall blocking TCP/UDP traffic? Is the service actually listening?
5. **Layers 5-7:** Is the application configured correctly? Is TLS negotiating successfully? Is DNS resolving to the right address?

This layered approach narrows fault domains quickly. "Ping works but the web app doesn't" tells you the problem is Layer 4 or above. "Ping doesn't work but the interface is up" points to Layer 3.

## Gotchas

- **OSI is a reference model, not an implementation.** Real stacks (TCP/IP) blend layers. Layers 5-7 in OSI collapse into one Application layer in TCP/IP. Do not expect a 1:1 mapping.
- **LLC vs MAC confusion:** the Data Link layer has two sub-layers. LLC (802.2) handles flow control and multiplexing between upper-layer protocols. MAC handles physical addressing and medium access. The CCNA expects you to know both exist.
- **ARP placement:** Address Resolution Protocol (ARP) maps IP addresses to MAC addresses. It is technically a Layer 2 protocol (it works within a LAN segment) but uses Layer 3 IP addresses as input. Cisco places it at Layer 2; some textbooks say 2.5. Know that it bridges Layers 2 and 3.
- **Switches vs routers at Layer 3:** Layer 3 switches can route between VLANs using routing logic at hardware speed. The term "Layer 3 switch" means a switch with routing capability, not a router.

## References

- [ISO/IEC 7498-1: The OSI Reference Model (ISO)](https://www.iso.org/standard/20269.html)
- [Cisco: OSI Model Reference - Cisco Learning Network](https://learningnetwork.cisco.com/s/article/osi-model-reference-chart)
- [RFC 1122: Requirements for Internet Hosts (IETF)](https://www.rfc-editor.org/rfc/rfc1122.html)

## Related topics

- [Part 1: Introduction to Networking](../part-01-intro-to-networking/)
- [Part 3: The TCP/IP Model](../part-03-tcpip-model/)
- [Part 5: Data Link Layer and Ethernet](../part-05-data-link-and-ethernet/)
