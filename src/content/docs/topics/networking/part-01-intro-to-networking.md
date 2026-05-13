---
title: "Part 1: Introduction to Networking"
description: "What networks are, how they are classified by size and topology, and the components and protocols that make them work."
parent: networking
tags: [networking, ccna]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

Networks exist because isolated devices are useless at scale. The moment two devices need to share a file, a printer, or an internet connection, you have a network. Everything in the CCNA curriculum flows from that basic premise outward: how do we move data between devices reliably, securely, and at speed?

## Why it matters

Every organization runs on data. Email, video calls, cloud storage, point-of-sale systems, industrial sensors: all of it depends on a network that someone designed and someone maintains. Understanding the vocabulary, the component types, and the design patterns is the foundation for every configuration, troubleshooting step, and design decision that follows in this series.

## What a network is

A network is two or more devices connected so they can communicate and share resources. Resources include files, printers, internet access, applications, and storage. At its core, networking is about moving bits from one place to another in a way both sides understand.

## Network types by geographic scope

Networks are classified primarily by size and ownership:

| Type | Full name | Scope | Typical example |
|------|-----------|-------|-----------------|
| PAN | Personal Area Network | ~1-10 meters | Bluetooth headset to phone |
| LAN | Local Area Network | Building/campus | Office floor, school lab |
| WLAN | Wireless LAN | Same as LAN | Wi-Fi access in same building |
| MAN | Metropolitan Area Network | City-wide | ISP connecting city districts |
| WAN | Wide Area Network | Country/global | The internet, MPLS links |
| SAN | Storage Area Network | Data center | Block-level storage fabric |

**Gotcha:** WLAN is not a separate network type from a LAN in terms of reach or ownership. A WLAN is wireless access to a LAN. The same IP subnet, the same switches, the same firewall: just air instead of copper for the last hop. The two terms are often conflated because Wi-Fi is so ubiquitous, but on the CCNA they are distinct.

## Network topologies

Topology describes the physical or logical arrangement of devices and the paths between them.

### Bus

All devices share a single cable segment. A signal travels the length of the bus; every device sees every frame. Collisions are common. Largely obsolete.

```
 [A]---[B]---[C]---[D]
 |________________________|
           bus
```

### Ring

Each device connects to exactly two neighbors, forming a loop. Token Ring (IEEE 802.5) used this layout. A break in the ring can take down the whole segment without redundancy.

```
    [A]
   /   \
 [D]   [B]
   \   /
    [C]
```

### Star

All devices connect to a central device (switch or hub). This is the dominant topology in modern LANs. A cable failure only affects the one device on that link.

```
       [A]
        |
[D]---[SW]---[B]
        |
       [C]
```

### Mesh

Every device connects to every other device (full mesh) or to multiple (but not all) neighbors (partial mesh). Provides redundancy at the cost of more cabling and interfaces. Common in WAN designs and between core switches.

Full mesh with 4 nodes:

```
[A]---[B]
 | \ / |
 | / \ |
[D]---[C]
```

### Hybrid

Real networks mix topologies. A star-of-stars is the most common: access switches form stars, uplink to distribution switches, which uplink to core switches. Hybrid topologies trade simplicity for the specific redundancy or scale properties you need.

```
         [Core]
        /      \
  [Dist-1]  [Dist-2]
   /    \    /    \
[A-1] [A-2][A-3] [A-4]
```

## Key network components

### End devices (hosts)

End devices originate or consume data: PCs, laptops, phones, servers, IP cameras, printers, IoT sensors. Each has a network interface card (NIC) with a MAC address burned in at the factory.

### Intermediary devices

Intermediary devices move data between end devices and between networks:

- **Switch:** operates at Layer 2. Forwards frames based on MAC addresses within a LAN. Modern managed switches support VLANs, QoS, and STP.
- **Router:** operates at Layer 3. Routes packets between different IP networks using routing tables. The boundary between your LAN and the internet is a router.
- **Firewall:** inspects and filters traffic based on rules. May operate at Layer 3-7 depending on capability. Can be hardware or software.
- **Access Point (AP):** bridges wireless clients onto a wired LAN. The AP itself is an intermediary device; the wireless link is the medium.
- **Modem:** modulates/demodulates signals for transmission over telephone lines or cable infrastructure. Converts between the ISP's medium and Ethernet.

### Network media

Media is the physical path that carries the signal:

- Copper wire (UTP, coaxial)
- Fiber optic cable (light pulses)
- Wireless (radio frequency)

Each medium has different distance limits, bandwidth ceilings, and susceptibility to interference. Part 4 covers cabling in detail.

## Client/server vs peer-to-peer

**Client/server:** dedicated servers provide services (file storage, email, web, DNS). Clients request those services. Centralizes management, backups, and security policy. Most enterprise networks use this model.

**Peer-to-peer (P2P):** every device can act as both client and server. Simple to set up, no dedicated hardware needed. Does not scale: each peer manages its own security, and finding resources across many peers becomes complex. BitTorrent and small home file shares are examples.

## Converged networks

Traditional networks ran separate physical infrastructures for voice (phone lines), video (CCTV cabling), and data (Ethernet). Cisco uses the term "converged network" to describe a single IP-based infrastructure carrying all three traffic types. VoIP phones, IP cameras, and laptops all run over the same switches and routers.

Benefits: lower cost (one infrastructure), unified management, easier expansion.
Tradeoffs: voice and video need Quality of Service (QoS) to prevent data traffic from causing jitter and packet loss. Convergence moves complexity from cabling to configuration.

## Protocols and standards bodies

A protocol is a set of rules that define how devices communicate: message format, timing, sequencing, and error handling. Protocols only work when both sides agree on the same rules, which is why standards bodies matter.

Key organizations:

- **IEEE (Institute of Electrical and Electronics Engineers):** defines LAN and wireless standards. 802.3 is Ethernet; 802.11 is Wi-Fi.
- **IETF (Internet Engineering Task Force):** publishes RFCs that define TCP/IP protocols. TCP, IP, HTTP, DNS, and OSPF are all IETF standards.
- **ISO (International Organization for Standardization):** defines the OSI reference model (covered in Part 2).
- **IANA (Internet Assigned Numbers Authority):** manages IP address allocation and port number assignments.
- **TIA/EIA:** defines cabling standards (T568A, T568B wiring schemes covered in Part 4).

Open standards let devices from different vendors interoperate. A Cisco switch and an HP switch can both speak 802.3 Ethernet because the standard is public and vendor-neutral.

## Tradeoffs and gotchas

- **Topology vs cost:** full mesh gives maximum redundancy but the number of links grows as n(n-1)/2. Four nodes need 6 links; eight nodes need 28. Most designs use partial mesh at the core and star at the edges.
- **P2P scale ceiling:** peer-to-peer works fine for two or three machines sharing a printer. At 20 machines it becomes unmanageable. The crossover point is low.
- **Converged network risk:** putting voice on the same network as data requires disciplined QoS configuration. A poorly configured converged network is worse than separate infrastructure because voice calls degrade visibly under load.
- **WLAN vs LAN conflation:** on the CCNA exam, WLAN specifically means the wireless portion. A device connected via Wi-Fi is still on the LAN; WLAN describes the wireless access method.

## References

- [Cisco Networking Basics - Cisco Learning Network](https://learningnetwork.cisco.com/s/article/networking-basics)
- [IEEE 802 LAN/MAN Standards Committee](https://www.ieee802.org/)
- [IETF Overview and Datatracker](https://www.ietf.org/)

## Related topics

- [Part 2: The OSI Model](./part-02-osi-model)
- [Part 3: The TCP/IP Model](./part-03-tcpip-model)
- [Part 5: Ethernet and the Data Link Layer](./part-05-ethernet-and-data-link-layer)
