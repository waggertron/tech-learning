---
title: Networking
description: "20-part series on computer networking based on the Cisco CCNA curriculum, covering the OSI model, IP addressing, routing protocols, switching, security, and automation."
category: networking
tags: [networking, ccna]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

Computer networks are the substrate everything else runs on. This series works through the fundamentals from the ground up: how bits move across wire and air, how addresses get assigned and resolved, how routers decide where packets go, and how security controls enforce who can reach what. The curriculum maps to the Cisco CCNA exam domains, which makes it useful both as a structured study path for the certification and as a standalone reference for anyone who wants a rigorous mental model of how networks actually work.

The target reader is a developer, DevOps engineer, or IT professional who has used networks without really understanding them. No prior networking knowledge assumed. Some comfort with binary and hexadecimal helps in the addressing sections.

## CCNA exam domains and series mapping

Cisco organizes the CCNA (200-301) into six exam topics:

- **Network Fundamentals** (20%): Parts 1-5 cover network types, the OSI and TCP/IP models, physical media, Ethernet, and MAC addressing.
- **Network Access** (20%): Parts 6-9 cover switching, VLANs, trunking, inter-VLAN routing, and Spanning Tree.
- **IP Connectivity** (25%): Parts 10-14 cover IPv4 and IPv6 addressing, subnetting, routing tables, static routes, and OSPF.
- **IP Services** (10%): Parts 15-17 cover EIGRP, NAT/PAT, DHCP, and DNS.
- **Security Fundamentals** (15%): Part 18-19 cover ACLs and network security controls.
- **Automation and Programmability** (10%): Part 20 covers WAN technologies and network automation with Python and Ansible.

## Parts

- [Part 1: Introduction to Networking](./part-01-intro-to-networking), network types, topologies, and devices
- [Part 2: The OSI Model](./part-02-osi-model), seven layers, encapsulation, and troubleshooting
- [Part 3: The TCP/IP Model](./part-03-tcpip-model), four-layer stack, TCP vs UDP, and common ports
- [Part 4: Physical Layer and Cabling](./part-04-physical-layer-and-cabling), copper, fiber, and wireless media
- [Part 5: Data Link Layer and Ethernet](./part-05-data-link-and-ethernet), frames, MAC addresses, and ARP
- [Part 6: Switching Fundamentals](./part-06-switching-fundamentals), MAC tables, switching methods, and VLANs intro
- [Part 7: VLANs](./part-07-vlans), virtual LANs, 802.1Q trunking, and VTP
- [Part 8: Inter-VLAN Routing](./part-08-inter-vlan-routing), router-on-a-stick, SVIs, and Layer 3 switching
- [Part 9: Spanning Tree Protocol](./part-09-spanning-tree-protocol), STP, RSTP, PortFast, and BPDU Guard
- [Part 10: IPv4 Addressing and Subnetting](./part-10-ipv4-addressing-and-subnetting), binary, CIDR, VLSM, and subnetting math
- [Part 11: IPv6 Addressing](./part-11-ipv6-addressing), address types, SLAAC, DHCPv6, and NDP
- [Part 12: Routing Fundamentals](./part-12-routing-fundamentals), routing tables, AD, metrics, and longest-prefix match
- [Part 13: Static Routing](./part-13-static-routing), static routes, default routes, and floating static routes
- [Part 14: OSPF](./part-14-ospf), link-state routing, areas, DR/BDR, and SPF algorithm
- [Part 15: EIGRP](./part-15-eigrp), DUAL algorithm, feasible successors, and fast convergence
- [Part 16: NAT and PAT](./part-16-nat-and-pat), static NAT, dynamic NAT, PAT overload, and NAT64
- [Part 17: DHCP and DNS](./part-17-dhcp-and-dns), DORA process, relay agents, DNS hierarchy, and record types
- [Part 18: Access Control Lists](./part-18-access-control-lists), standard vs extended ACLs, wildcard masks, and placement rules
- [Part 19: Network Security Fundamentals](./part-19-network-security-fundamentals), port security, DHCP snooping, 802.1X, and VPNs
- [Part 20: WAN Technologies and Network Automation](./part-20-wan-technologies-and-network-automation), MPLS, SD-WAN, NETCONF, Python, and Ansible

## Related topics

- [System Design](../system-design/)
- [Operations](../ops/)
