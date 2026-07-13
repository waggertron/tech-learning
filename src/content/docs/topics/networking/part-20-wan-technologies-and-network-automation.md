---
title: "Part 20: WAN Technologies and Network Automation"
description: "WAN connection types and how modern network automation tools replace manual CLI configuration at scale."
parent: networking
tags: [networking, ccna]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

Enterprise networks do not stop at the building edge. Sites connect across cities, countries, and continents over links leased from service providers. At the same time, the scale of modern networks has outgrown manual CLI management: a network engineer who configures devices one at a time cannot keep pace with the rate of change. This part covers both WAN technologies and the automation tooling that has become standard practice.

## Why it matters

WAN design choices affect cost, performance, and reliability for every user at every remote site. Automation is no longer optional in large environments: the CCNA now tests programmability concepts alongside traditional routing and switching. Understanding both prepares you for the infrastructure-as-code workflows that dominate enterprise and cloud networking.

---

## Part A: WAN Technologies

### WAN vs LAN

A LAN (Local Area Network) is owned and operated by the organization. A WAN (Wide Area Network) connects geographically separated sites, typically over infrastructure leased from a service provider. The organization pays for bandwidth and availability guarantees (SLAs) rather than owning the physical medium.

```text
Site A (New York)         Service Provider Network         Site B (London)
+----------+             +---------------------+             +----------+
| Router A |---[link]----| MPLS/Metro/Internet |----[link]---| Router B |
+----------+             +---------------------+             +----------+
```

### WAN connection types

| Technology | Description | Typical use case |
|---|---|---|
| Leased line (T1/E1, T3/E3) | Dedicated point-to-point circuit; fixed bandwidth; high cost | Small branches needing guaranteed bandwidth |
| MPLS | Provider network using label switching; supports QoS and VPNs | Enterprise multi-site connectivity |
| Metro Ethernet | Carrier Ethernet at WAN scale; site connects via standard Ethernet | Campus-to-campus in metro areas |
| DSL / Cable | Asymmetric broadband; shared medium; variable performance | Small offices, home workers |
| 4G / 5G cellular | Wireless WAN; improving speeds and latency with 5G | Branch backup or primary link where wired is unavailable |
| SD-WAN | Software-defined overlay on any transport; centralized policy | Modern enterprise replacing MPLS with internet + 4G |

#### Leased lines

T1 carries 24 DS0 channels at 1.544 Mbps. T3 aggregates 28 T1s at 44.736 Mbps. E1/E3 are the European equivalents. Leased lines are expensive but predictable: bandwidth is dedicated and latency is fixed. They use serial interfaces on Cisco routers and WAN encapsulation protocols like HDLC (Cisco default) or PPP.

#### MPLS

MPLS (Multiprotocol Label Switching) replaces IP routing inside the provider network with label switching. The provider edge (PE) router assigns a label to each incoming packet. Core routers switch packets using the label without examining the IP header, making forwarding fast and predictable.

From the customer perspective, MPLS looks like a private network: all sites appear directly connected. MPLS supports QoS marking that the provider honors end-to-end, making it suitable for voice and video traffic.

#### SD-WAN

SD-WAN builds a software-defined overlay on top of any underlying transport (MPLS, broadband internet, 4G/5G). A centralized controller pushes policy to edge devices. SD-WAN adds:

- Application-aware routing: route voice over MPLS, bulk data over cheap internet.
- Zero-touch provisioning: devices call home and receive their configuration automatically.
- Centralized visibility: single pane of glass for all sites.

Cisco Viptela (now Catalyst SD-WAN) and Meraki are common enterprise implementations.

### PPP (Point-to-Point Protocol)

PPP is the WAN data-link protocol used on serial links. It replaced the older HDLC because it supports:

- **Authentication**: CHAP (Challenge Handshake Authentication Protocol, uses MD5) or PAP (Password Authentication Protocol, sends password in cleartext).
- **Multilink PPP**: bond multiple serial links for increased bandwidth.
- **Compression**: reduce bandwidth consumption on slow links.

CHAP is preferred over PAP. PAP is only used when the remote device cannot support CHAP.

### VPN types on WAN

| VPN type | Use case |
|---|---|
| Site-to-site IPsec | Fixed sites connected over internet; replaces leased lines |
| Remote access (SSL/TLS, IPsec IKEv2) | Mobile users connecting from home or hotels |
| DMVPN | Scalable Cisco VPN: hub-and-spoke with optional spoke-to-spoke direct tunnels |

DMVPN Phase 3 allows spokes to communicate directly after initial traffic goes through the hub. NHRP (Next Hop Resolution Protocol) lets spokes discover each other's tunnel endpoints dynamically.

---

## Part B: Network Automation and Programmability

### Why automation

Manual CLI configuration does not scale. Consider:

- A rule change affecting 200 access switches requires 200 SSH sessions and 200 manual edits.
- A single typo on one device creates an inconsistency that is hard to detect.
- Human error is the leading cause of network outages.

Automation makes configuration consistent, repeatable, and auditable. Changes go through version control and review before touching production.

### Automation approaches

```text
+-------------------+          +----------------------+
|  Automation Tool  |          |   Network Device     |
| (Ansible, Python, |--[SSH]-->| CLI (IOS/IOS-XE)     |
|  NETCONF, etc.)   |--[NETCONF/RESTCONF]-->| YANG model |
+-------------------+          +----------------------+
```

| Method | Transport | Data format | Notes |
|---|---|---|---|
| CLI scripting (netmiko) | SSH | Unstructured text | Easiest entry point; fragile parsing |
| NETCONF | SSH | XML (YANG models) | RFC 6241; structured; reliable |
| RESTCONF | HTTPS | JSON or XML (YANG) | RFC 8040; REST principles; human-readable |
| gRPC/gNMI | gRPC (HTTP/2) | Protobuf | Streaming telemetry; modern platforms |

### YANG data models

YANG (Yet Another Next Generation) is a data modeling language that defines the schema for network configuration and state. NETCONF and RESTCONF both use YANG models as their data schema. Cisco publishes YANG models for IOS-XE at `https://github.com/YangModels/yang`.

A YANG model defines what leaves (fields) exist, their types, and constraints. When you configure a device via NETCONF, you send XML that conforms to the YANG schema.

### Python with netmiko

Netmiko is the simplest entry point for Python-based network automation. It handles SSH connection management and device-specific quirks:

```python
from netmiko import ConnectHandler

device = {
    "device_type": "cisco_ios",
    "host": "192.168.1.1",
    "username": "admin",
    "password": "YOUR_PASSWORD_HERE",
}

with ConnectHandler(**device) as conn:
    output = conn.send_command("show ip interface brief")
    print(output)
```

For configuration changes:

```python
from netmiko import ConnectHandler

device = {
    "device_type": "cisco_ios",
    "host": "192.168.1.1",
    "username": "admin",
    "password": "YOUR_PASSWORD_HERE",
}

commands = [
    "interface Loopback0",
    "ip address 1.1.1.1 255.255.255.255",
    "no shutdown",
]

with ConnectHandler(**device) as conn:
    conn.send_config_set(commands)
    output = conn.send_command("show ip interface brief")
    print(output)
```

Netmiko parses prompts and handles enable mode automatically. The limitation is that output comes back as unstructured text. You must parse it with string methods or libraries like TextFSM.

### Ansible for network automation

Ansible is agentless (no software installed on network devices) and uses SSH or NETCONF to push configuration. Playbooks are YAML files that describe the desired state:

```yaml
- name: Configure hostname and NTP
  hosts: routers
  gather_facts: false
  tasks:
    - name: Set hostname
      cisco.ios.ios_config:
        lines:
          - hostname R1

    - name: Configure NTP server
      cisco.ios.ios_config:
        lines:
          - ntp server 216.239.35.0
```

The `cisco.ios` collection is part of Ansible's network content. Key modules:

| Module | Purpose |
|---|---|
| `cisco.ios.ios_config` | Push IOS configuration lines |
| `cisco.ios.ios_command` | Run show commands and capture output |
| `cisco.ios.ios_facts` | Gather structured device facts |
| `cisco.ios.ios_vlans` | Manage VLANs declaratively |

Ansible uses an inventory file to define which devices to target and their connection parameters. Credentials go in Ansible Vault (encrypted), not plaintext files.

### REST APIs in networking

Modern network controllers expose REST APIs. The pattern matches standard HTTP:

```text
GET    /api/v1/network/device          List all devices
GET    /api/v1/network/device/{id}     Get one device
POST   /api/v1/template/deploy         Push a config template
PUT    /api/v1/network/device/{id}     Update device settings
DELETE /api/v1/network/device/{id}     Remove a device
```

Cisco DNA Center, Meraki Dashboard, and Cisco vManage (SD-WAN controller) all follow this pattern. Responses are JSON. You can interact with them from Python using the `requests` library or from curl.

### Intent-based networking (IBN)

IBN shifts the paradigm from "how" to "what." Instead of configuring each device with specific CLI commands, the operator declares the desired network behavior (intent) and the controller figures out the implementation.

```text
Operator: "All voice traffic gets priority QoS treatment"
         (intent, expressed in a GUI or API call)

Controller: translates intent into QoS policy
            pushes policy to all relevant switches and routers
            verifies that the policy is active
```

Cisco DNA Center is the primary IBN implementation in the Cisco portfolio. It adds:

- Network assurance: continuously compares actual state to intended state.
- Path trace: shows exactly what path a flow takes and where it might be blocked.
- Closed-loop automation: detects anomalies and can automatically remediate.

### Version control for network configs

Network configuration is code. Treating it that way means:

- Store configs in Git. Every change is a commit with an author and a message.
- Use branches and pull requests for change review before pushing to production.
- Diff config changes in code review, not in a change management spreadsheet.
- Tag releases: know exactly what config version was running on what date.

A simple workflow:

```text
git checkout -b add-acl-vlan30
# edit the Ansible playbook or config template
git add .
git commit -m "Add ACL blocking HTTP/HTTPS from VLAN 30"
# open pull request, get peer review
# merge to main
# CI pipeline runs Ansible against production
```

### Automation controller architecture

```text
+-------------------+
|  Version Control  |  (Git: config templates, playbooks)
+-------------------+
          |
          v
+-------------------+
| CI/CD Pipeline    |  (validates, tests in lab, deploys to prod)
+-------------------+
          |
          v
+-------------------+
| Automation Engine |  (Ansible Tower/AWX, Cisco DNA Center)
+-------------------+
     |         |
     v         v
+--------+  +--------+
|Router 1|  |Switch 1|  ... (hundreds of devices)
+--------+  +--------+
  NETCONF    NETCONF
  /RESTCONF  /RESTCONF
```

The pipeline enforces that no changes reach production without passing validation (linting, syntax checks) and a peer review step.

## Gotchas

**Automation amplifies errors**: a bad template pushed to 1000 devices breaks 1000 devices simultaneously. Always test on a staging device or lab topology first. Use `--check` mode in Ansible (dry run) before applying.

**NETCONF requires explicit enablement**: on IOS-XE, NETCONF is not active by default:

```text
R1(config)# netconf-yang
```

Without this, attempts to connect via NETCONF will fail silently or with a cryptic SSH error.

**Screen scraping is fragile**: CLI output changes between IOS versions. A show command that returns columns in a certain order on 15.x may differ on IOS-XE 17.x. Prefer NETCONF/RESTCONF with YANG models for structured data you can rely on.

**Credentials in automation**: never hardcode passwords in scripts or playbooks. Use environment variables, Ansible Vault, or a secrets manager (HashiCorp Vault). Repositories that accidentally commit credentials can be compromised even after the credential is removed from history.

**SD-WAN underlay still matters**: SD-WAN abstracts the transport, but the underlying links still have latency, jitter, and packet loss. SD-WAN can route around a bad link, but it cannot improve a link that is consistently congested.

---

## References

- [Cisco NETCONF/YANG Developer Guide](https://developer.cisco.com/docs/ios-xe/#!programmability-series/netconf-yang)
- [RFC 6241: Network Configuration Protocol (NETCONF)](https://datatracker.ietf.org/doc/html/rfc6241)
- [RFC 8040: RESTCONF Protocol](https://datatracker.ietf.org/doc/html/rfc8040)
- [Netmiko Documentation](https://ktbyers.github.io/netmiko/)
- [Ansible Network Automation Guide](https://docs.ansible.com/ansible/latest/network/index.html)
- [Cisco DNA Center REST API Guide](https://developer.cisco.com/docs/dna-center/)

## Related topics

- [Part 14: OSPF](../part-14-ospf/)
- [Part 12: Routing Fundamentals](../part-12-routing-fundamentals/)
- [Part 19: Network Security Fundamentals](../part-19-network-security-fundamentals/)
