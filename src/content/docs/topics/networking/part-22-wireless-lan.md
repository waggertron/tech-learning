---
title: "Part 22: Wireless LAN"
description: "802.11 standards, RF fundamentals, AP deployment modes, CAPWAP, and wireless security from WEP to WPA3."
parent: networking
tags: [networking, ccna]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

Wired networking assumes a cable between two endpoints. Wireless LANs replace that cable with radio frequency signals, which introduces a shared medium, interference, variable signal quality, and a new set of security concerns. Understanding how 802.11 works, how access points are managed, and how security is layered is essential for any network that serves clients without cables.

## 802.11 standards

The IEEE 802.11 family defines the PHY and MAC layers for wireless networking. Each amendment improved speed, frequency use, or both.

| Standard  | Wi-Fi Name | Frequency    | Max Speed      | Key Feature          |
|-----------|------------|--------------|----------------|----------------------|
| 802.11a   |            | 5 GHz        | 54 Mbps        | First 5 GHz standard |
| 802.11b   |            | 2.4 GHz      | 11 Mbps        | First widely adopted |
| 802.11g   |            | 2.4 GHz      | 54 Mbps        | Backward compat b    |
| 802.11n   | Wi-Fi 4    | 2.4 / 5 GHz  | 600 Mbps       | MIMO, dual-band      |
| 802.11ac  | Wi-Fi 5    | 5 GHz        | 3.5 Gbps       | MU-MIMO, wider channels |
| 802.11ax  | Wi-Fi 6    | 2.4 / 5 GHz  | 9.6 Gbps       | OFDMA, BSS coloring  |
| 802.11ax  | Wi-Fi 6E   | 6 GHz        | 9.6 Gbps       | Adds 6 GHz band      |

MIMO (Multiple Input Multiple Output) uses multiple antennas to transmit and receive several data streams simultaneously. MU-MIMO extends this to serve multiple clients at once rather than sequentially.

## RF fundamentals

Wireless signals travel as radio waves. Two properties matter most: frequency and range.

### 2.4 GHz

Three non-overlapping channels: 1, 6, and 11. Every other channel number overlaps with a neighbor, causing co-channel interference. Longer range than 5 GHz. Better penetration through walls. Shared with microwave ovens, Bluetooth devices, baby monitors, and neighboring Wi-Fi networks. The result is a crowded, interference-prone band.

```text
Channel overlap in 2.4 GHz (22 MHz wide channels):

Ch 1   |----22MHz----|
Ch 2      |----22MHz----|
Ch 3         |----22MHz----|
...
Ch 6                  |----22MHz----|
Ch 11                               |----22MHz----|

Only channels 1, 6, and 11 do not overlap each other.
```

### 5 GHz

More non-overlapping channels (up to 25 in the US, depending on regulatory domain). Shorter range and less wall penetration than 2.4 GHz. Far less interference from consumer devices. Preferred for throughput-sensitive applications.

### 6 GHz (Wi-Fi 6E)

Available only on Wi-Fi 6E hardware. Even more non-overlapping channels. No legacy devices competing for the band. Shortest range of the three; best suited for dense environments where APs are close together.

## WLAN components

```text
Internet
    |
[Router/Firewall]
    |
[Distribution Switch]
    |          |
[WLC]       [Core/Access Switches]
    |
 CAPWAP tunnel
    |          |
 [LAP 1]   [LAP 2]
  )))  (((  )))  (((
[Client A] [Client B] [Client C]
```

**Wireless client (STA, station):** Any end device with a wireless NIC. Smartphones, laptops, IoT devices.

**Access Point (AP):** Bridges wireless clients to the wired LAN. Transmits beacons advertising the SSID. Manages 802.11 association and authentication.

**Wireless LAN Controller (WLC):** Centralized device that manages multiple APs. Handles configuration distribution, firmware upgrades, RF management, client roaming, and security policy.

**Distribution System (DS):** The wired backbone that APs connect to. Typically an Ethernet switch infrastructure linking APs back to the WLC and the rest of the network.

## AP deployment modes

### Autonomous AP

Self-contained. Configured individually via CLI or web GUI. No WLC required. Each AP maintains its own configuration: SSID, security, VLANs, radio settings. Suitable for small sites with a handful of APs. Does not scale well: changing a setting means touching every AP individually.

### Lightweight AP (LAP)

Requires a WLC. Splits the 802.11 MAC into two parts: the local MAC function (real-time operations: beaconing, probe responses, encryption/decryption, ACKs) runs on the AP itself. The split-MAC function (association, authentication, roaming decisions, configuration) is handled by the WLC over a CAPWAP tunnel.

The AP boots, discovers a WLC, downloads its configuration, and begins serving clients. No local configuration is stored on the LAP. Replacing a failed AP is plug-and-play.

### FlexConnect (previously HREAP)

A LAP mode designed for branch offices with unreliable WAN links to the WLC. In connected mode, the AP tunnels traffic to the WLC normally. In standalone mode (WLC unreachable), the AP locally switches client traffic to the local LAN and maintains existing client associations. New associations may be limited depending on configuration.

## CAPWAP

CAPWAP (Control and Provisioning of Wireless Access Points) is the tunneling protocol between a LAP and its WLC. Defined in RFC 5415.

Two UDP tunnels:

| Tunnel  | Port     | Purpose                                      |
|---------|----------|----------------------------------------------|
| Control | UDP 5246 | Configuration, management, AP state          |
| Data    | UDP 5247 | Client data frames forwarded to WLC          |

The control tunnel is DTLS-encrypted by default. The data tunnel is optionally DTLS-encrypted; encryption is disabled by default on many platforms for performance reasons.

### AP discovery sequence

An AP finds its WLC through one or more of these methods, tried in order:

1. Local subnet broadcast (Layer 2 discovery)
2. DHCP option 43 (WLC IP address list embedded in DHCP response)
3. DNS lookup of `cisco-capwap-controller.<local-domain>`
4. Previously learned WLC address (stored in AP flash after first join)

Once the AP reaches a WLC, it completes a DTLS handshake, downloads firmware and config, and enters the Run state.

## SSID, BSS, and ESS

**SSID (Service Set Identifier):** The human-readable network name broadcast in beacon frames.

**BSS (Basic Service Set):** A single AP and all the clients associated to it. Identified by the BSSID, which is the AP's radio MAC address. One AP can advertise multiple SSIDs, creating multiple BSSes.

**ESS (Extended Service Set):** Multiple APs sharing the same SSID across a wired distribution system. Clients associate with a BSSID (specific AP radio), not the SSID directly. When a client moves between APs in the same ESS, it roams: reassociating with a new AP while maintaining layer 3 connectivity.

```text
           ESS: "CorpWiFi"
          /                \
   [AP 1]                  [AP 2]
   BSSID: aa:bb:cc:11      BSSID: aa:bb:cc:22
   Channel 1               Channel 6
   )))  (((                )))  (((
  [Client]  ------roam-----> [Client]
```

## Wireless security

### WEP (Wired Equivalent Privacy)

Do not use. RC4-based encryption with a static shared key and a broken IV scheme. Cracked in minutes with freely available tools. Completely deprecated.

### WPA (Wi-Fi Protected Access)

Interim standard introduced before 802.11i was finalized. Uses TKIP (Temporal Key Integrity Protocol), which patches WEP's RC4 weakness with per-packet key mixing. Still deprecated; TKIP was itself broken.

### WPA2 (802.11i)

Current minimum acceptable standard. Uses AES-CCMP for encryption: a block cipher mode that provides both confidentiality and integrity. Two variants:

**WPA2-Personal (WPA2-PSK):** A pre-shared key is configured on the AP and all clients. The 4-way handshake derives per-session keys from the PSK. Simple to deploy; problematic at scale because all clients share the same secret.

**WPA2-Enterprise:** Clients authenticate with individual credentials via 802.1X and a RADIUS server. The AP acts as an authenticator, relaying EAP messages between the client (supplicant) and the RADIUS server (authentication server). Each client gets unique session keys. Compromise of one client credential does not expose others.

### WPA3

Current best practice. Two modes:

**WPA3-Personal:** Replaces PSK with SAE (Simultaneous Authentication of Equals), a password-authenticated key exchange based on Dragonfly. SAE is resistant to offline dictionary attacks and provides forward secrecy: captured traffic cannot be decrypted even if the password is later discovered.

**WPA3-Enterprise:** Adds 192-bit mode (CNSA suite) for environments requiring higher security assurance.

### Security comparison

| Standard    | Encryption | Auth       | Status      |
|-------------|------------|------------|-------------|
| WEP         | RC4 (broken) | Shared key | Deprecated |
| WPA         | TKIP       | PSK or 802.1X | Deprecated |
| WPA2        | AES-CCMP   | PSK or 802.1X | Acceptable |
| WPA3        | AES-GCMP   | SAE or 802.1X | Recommended |

## 802.11 frame types

Three categories of 802.11 frames:

**Management frames:** Establish and maintain connections. Subtypes include beacon (AP advertises its presence), probe request/response (client searches for APs), authentication, association request/response, and deauthentication.

**Control frames:** Assist in delivering data frames. Subtypes include RTS (Request to Send), CTS (Clear to Send), and ACK. RTS/CTS helps manage the hidden node problem in environments where two clients can reach the AP but not each other.

**Data frames:** Carry actual user traffic. Encapsulated inside the 802.11 frame and forwarded to the DS.

## Wireless threats

**Rogue AP:** An unauthorized AP connected to the wired network. A rogue on a trusted VLAN bypasses perimeter controls. WLC rogue AP detection scans for APs advertising on known SSIDs or connected to trusted infrastructure.

**Evil twin AP:** An attacker runs an AP with the same SSID as a legitimate network. Clients may auto-associate. Traffic is intercepted. Mitigated by 802.1X (clients validate server certificates) and WIPS (Wireless Intrusion Prevention System) alerting.

**Deauthentication attack:** 802.11 management frames are unauthenticated by default. An attacker spoofs deauth frames to disconnect clients, forcing reconnection attempts (useful for capturing the WPA2 4-way handshake). WPA3 with Management Frame Protection (MFP) addresses this.

**WIPS (Wireless Intrusion Prevention System):** Monitors RF spectrum for rogue APs, evil twins, and anomalous frame patterns. Can operate as dedicated sensors or as a feature of the WLC using AP radios in monitor mode.

## Gotchas

**2.4 GHz congestion.** In dense environments, every neighboring network on the same channel adds interference. Assign APs to channels 1, 6, and 11 only. If neighbor APs bleed onto the same channels, client throughput degrades even when signal strength is strong.

**WPA2-Personal key rotation.** A shared PSK means any device with the password can decrypt another device's traffic captured before the 4-way handshake (under WPA2; WPA3-SAE prevents this). If a device is lost or a contractor leaves, rotating the PSK requires reconfiguring every client. For more than a handful of devices, WPA2-Enterprise or WPA3 is the right answer.

**CAPWAP data tunnel and local switching.** In standard LAP mode, client data is tunneled through CAPWAP to the WLC and then forwarded to the LAN. This means client traffic traverses the WAN link twice if the WLC is centralized and the client is at a branch. FlexConnect with local switching bypasses the tunnel for data frames, but the CAPWAP control tunnel (and its DTLS encryption) still applies to management traffic.

**Channel width tradeoffs.** Wider channels (40, 80, 160 MHz) increase throughput for a single client but reduce the number of non-overlapping channels available, increasing co-channel interference in dense deployments. 20 MHz channels are often the right choice in high-density environments.

## References

- [Cisco Wireless LAN Controller Configuration Guide](https://www.cisco.com/c/en/us/support/wireless/wireless-lan-controller-software/products-installation-and-configuration-guides-list.html)
- [RFC 5415: CAPWAP Protocol Specification](https://datatracker.ietf.org/doc/html/rfc5415)
- [Wi-Fi Alliance: WPA3 Specification](https://www.wi-fi.org/discover-wi-fi/security)

## Related topics

- [Part 4: Physical Layer and Cabling](./part-04-physical-layer-and-cabling)
- [Part 19: Network Security Fundamentals](./part-19-network-security-fundamentals)
- [Part 23: Network Automation and Programmability](./part-23-network-automation-and-programmability)
