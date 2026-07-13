---
title: "Part 4: The Physical Layer and Cabling"
description: "Copper, fiber, and wireless media: specifications, connector types, signal issues, and how to choose the right cable for the job."
parent: networking
tags: [networking, ccna]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

The physical layer is where networking becomes tangible: wire, glass, and radio. Every bit that crosses a network starts as a signal, whether that is a voltage on a copper pair, a pulse of light in a fiber core, or a radio wave in the 5 GHz band. Understanding the physical layer means knowing the limits of each medium, when to use each type, and why the wrong cable choice creates problems that no amount of software can fix.

## What the physical layer does

The physical layer (OSI Layer 1) has one job: convert bits to signals and signals back to bits. It defines:

- The physical connector and pin assignments
- The encoding scheme (how a 1 or 0 is represented as a voltage, light pulse, or frequency)
- The transmission rate (bits per second)
- The maximum distance before signal degrades below usable levels (attenuation)
- Susceptibility to interference from other signals (noise, crosstalk, EMI)

Everything above Layer 1 assumes the bits arrive intact. The physical layer is where that assumption is either earned or broken.

## Copper cabling

Copper carries electrical signals. It is cheap, flexible, and the dominant medium for short-distance LAN connections (device to wall jack, wall jack to patch panel, patch panel to switch).

### UTP: Unshielded Twisted Pair

UTP is the standard for modern Ethernet. Four pairs of copper wire, each pair twisted at a different rate to reduce crosstalk (interference between adjacent pairs). No metallic shielding around the pairs.

```
  Pair 1: ====  (tightly twisted)
  Pair 2: ~~    (loosely twisted)
  Pair 3: ===   (medium twist)
  Pair 4: ~     (very loose)

  All four pairs inside a single outer jacket.
```

**UTP categories:**

| Category | Max speed | Max distance | Notes |
|----------|-----------|--------------|-------|
| Cat5e | 1 Gbps | 100 m | Minimum for new installs; supersedes Cat5 |
| Cat6 | 1 Gbps (100m) / 10 Gbps (55m) | 100 m at 1G | Thicker conductors, tighter tolerances |
| Cat6a | 10 Gbps | 100 m | Augmented Cat6; larger diameter, more shielding |
| Cat7 | 10 Gbps | 100 m | Shielded pairs (STP); proprietary connectors common |
| Cat8 | 25/40 Gbps | 30 m | Data center top-of-rack; very short runs |

For new installations, Cat6a is the practical sweet spot: full 10 Gbps at 100 m, backward compatible with older equipment, and widely stocked.

### Straight-through vs crossover cables

UTP cables come in two wiring configurations that matter when connecting devices.

**Straight-through:** pin 1 on one end connects to pin 1 on the other end, pin 2 to pin 2, and so on. Used for connecting unlike devices (host to switch, switch to router).

**Crossover:** the transmit pins on one end connect to the receive pins on the other. Used historically for connecting like devices (switch to switch, host to host directly).

```
Straight-through:          Crossover:
End A    End B             End A    End B
Pin 1 -> Pin 1            Pin 1 -> Pin 3
Pin 2 -> Pin 2            Pin 2 -> Pin 6
Pin 3 -> Pin 3            Pin 3 -> Pin 1
Pin 6 -> Pin 6            Pin 6 -> Pin 2
```

**Auto-MDIX:** modern Cisco switches and most current-generation network hardware support Auto-MDIX (Automatic Medium-Dependent Interface Crossover), which automatically detects the cable type and adjusts electronically. In practice, you can plug a straight-through cable into a switch-to-switch uplink and it will work.

**Gotcha:** crossover cables still appear on the CCNA exam. You need to know which device pairs require crossover and why, even though Auto-MDIX makes the distinction irrelevant in most real deployments.

### RJ-45 connectors and T568A/T568B

UTP cables terminate in RJ-45 8P8C connectors. Two wiring standards define pin color assignments:

```
T568B (more common in North America):
Pin: 1        2        3        4        5        6        7        8
     W/Org    Org      W/Grn    Blu      W/Blu    Grn      W/Brn    Brn

T568A:
Pin: 1        2        3        4        5        6        7        8
     W/Grn    Grn      W/Org    Blu      W/Blu    Org      W/Brn    Brn
```

Both standards work. Do not mix them on the same cable run. A crossover cable uses T568A on one end and T568B on the other.

### Coaxial cable

Coaxial cable has a center copper conductor, a dielectric insulator, a braided metal shield, and an outer jacket. The shield provides good protection against EMI.

Uses in networking today:
- Cable internet (DOCSIS standard, from ISP to home modem)
- Legacy 10BASE-2 and 10BASE-5 Ethernet (obsolete)
- Some surveillance camera installations

Coaxial is not used for modern LAN infrastructure. If you see it in a network closet, it is either a legacy run or a cable TV/DOCSIS feed.

## Fiber optic cabling

Fiber carries light pulses instead of electrical signals. Key advantages over copper:
- No electromagnetic interference (immune to EMI and radio frequency interference)
- No crosstalk between fibers
- Much longer distances before attenuation requires amplification
- Higher potential bandwidth

The tradeoff: fiber is more expensive per meter, connectors require more care, and splicing requires specialized equipment.

### Single-mode fiber (SMF)

```
         |<--  ~8-10 micron core  -->|
  ========[============================]=========
          |  cladding (~125 micron)   |
```

Single-mode fiber has a very narrow core (8-10 microns). This narrow core allows only one mode of light to propagate, which eliminates modal dispersion (the smearing of pulses that occurs when multiple light paths arrive at slightly different times). SMF uses laser light sources.

- Distance: up to 100 km and beyond with appropriate transceivers
- Use cases: carrier networks, long-haul WAN links, campus backbone runs exceeding 2 km
- Color convention: yellow jacket (common but not universal)

### Multi-mode fiber (MMF)

```
         |<------  50 or 62.5 micron core  ----->|
  ========[====================================]=========
          |       cladding (~125 micron)          |
```

Multi-mode fiber has a wider core (50 or 62.5 microns). Multiple light modes propagate simultaneously, which causes modal dispersion and limits distance. MMF uses LED or VCSEL light sources (cheaper than lasers).

- Distance: up to ~550 m at 10 Gbps (OM3/OM4); up to ~2 km at 1 Gbps
- Use cases: data center interconnects, intra-building runs, switch-to-switch uplinks within a campus
- Color convention: orange (OM1/OM2) or aqua (OM3/OM4) jacket

**OM fiber grades:**

| Grade | Core | Max distance at 10G |
|-------|------|---------------------|
| OM1 | 62.5 um | 33 m |
| OM2 | 50 um | 82 m |
| OM3 | 50 um | 300 m |
| OM4 | 50 um | 400 m |
| OM5 | 50 um | 400 m (also supports SWDM) |

### Fiber connector types

| Connector | Profile | Common use |
|-----------|---------|------------|
| LC (Lucent Connector) | Small form factor, 1.25mm ferrule | SFP modules, data center |
| SC (Subscriber Connector) | Square body, push-pull, 2.5mm ferrule | Older gear, telco |
| ST (Straight Tip) | Bayonet-style twist-lock, 2.5mm ferrule | Legacy, some campuses |
| MPO/MTP | Multi-fiber ribbon connector | 40G/100G parallel optics |

LC is now the dominant connector type for SFP and SFP+ transceivers in Cisco equipment.

## Wireless media

Wireless uses radio frequency (RF) instead of physical cable. The IEEE 802.11 standards define Wi-Fi.

### 802.11 standards

| Standard | Frequency | Max speed | Notes |
|----------|-----------|-----------|-------|
| 802.11b | 2.4 GHz | 11 Mbps | Legacy; crowded band |
| 802.11g | 2.4 GHz | 54 Mbps | Legacy |
| 802.11a | 5 GHz | 54 Mbps | Legacy; less interference |
| 802.11n (Wi-Fi 4) | 2.4/5 GHz | 600 Mbps | MIMO; dual-band |
| 802.11ac (Wi-Fi 5) | 5 GHz | ~3.5 Gbps | MU-MIMO; wide channels |
| 802.11ax (Wi-Fi 6/6E) | 2.4/5/6 GHz | ~9.6 Gbps | OFDMA; 6 GHz band added |

### Frequency band tradeoffs

**2.4 GHz:**
- Longer range (lower frequency propagates farther and penetrates walls better)
- Only 3 non-overlapping channels (1, 6, 11) in the 20 MHz channel width
- Heavily congested (microwaves, Bluetooth, neighbor Wi-Fi all share this band)

**5 GHz:**
- Shorter range (higher frequency attenuates faster)
- Many more non-overlapping channels (up to 25 in the US)
- Less congested, higher throughput

**6 GHz (Wi-Fi 6E):**
- Even shorter range
- Large amount of new spectrum (1200 MHz vs 500 MHz for 5 GHz)
- No legacy devices; cleaner radio environment

## Signal issues

Understanding why signals degrade is essential for troubleshooting physical layer problems.

**Attenuation:** signal strength decreases over distance. Every medium has a maximum distance before attenuation makes the signal unreadable. Cat6 UTP: 100 m. SMF with DWDM: hundreds of kilometers. Solutions: shorter runs, repeaters, amplifiers.

**Noise:** unwanted electrical or RF energy that gets added to the signal. Sources include fluorescent lights, electric motors, other cables, and radio transmitters. UTP twisting and shielding reduce noise susceptibility. Fiber is immune to electrical noise.

**Crosstalk:** interference between adjacent pairs within the same cable (NEXT: near-end crosstalk) or between cables (alien crosstalk). Twisting pairs at different rates reduces crosstalk. Cat6a includes internal separators to reduce alien crosstalk.

**Bandwidth vs throughput vs goodput:**

| Term | Definition | Example |
|------|-----------|---------|
| Bandwidth | Theoretical maximum capacity of the link | 1 Gbps Ethernet |
| Throughput | Actual data rate achieved under real conditions | 850 Mbps after overhead |
| Goodput | Application-layer useful data rate (excludes headers, retransmissions) | 820 Mbps of payload |

Goodput is always less than throughput, which is always less than or equal to bandwidth. When a user complains that their "gigabit connection" only delivers 400 Mbps to an application, the gap between bandwidth and goodput is the explanation.

## Ethernet standards

| Standard | Speed | Medium | Max distance |
|----------|-------|--------|--------------|
| 10BASE-T | 10 Mbps | Cat3 UTP | 100 m |
| 100BASE-TX | 100 Mbps | Cat5e UTP | 100 m |
| 1000BASE-T | 1 Gbps | Cat5e/Cat6 UTP | 100 m |
| 10GBASE-T | 10 Gbps | Cat6a/Cat7 UTP | 100 m |
| 1000BASE-SX | 1 Gbps | MMF | 550 m |
| 1000BASE-LX | 1 Gbps | SMF or MMF | 5 km (SMF) |
| 10GBASE-SR | 10 Gbps | MMF (OM3+) | 300 m |
| 10GBASE-LR | 10 Gbps | SMF | 10 km |

The naming convention: speed (10/100/1000/10G) + BASE (baseband) + medium/distance code (T for twisted pair, SX for short wavelength fiber, LX for long wavelength fiber, LR for long reach).

## Cisco SFP modules

SFP (Small Form-factor Pluggable) modules are hot-swappable transceivers that fit into SFP ports on Cisco switches and routers. They let you choose the physical medium per port rather than buying separate hardware for each speed/medium combination.

```
Switch with SFP ports:

  +------------------------------------------+
  | [SFP] [SFP] [SFP] [SFP]  ...  fixed RJ45 |
  |   |     |     |     |                      |
  |  LC    LC    RJ45  LC                      |
  +------------------------------------------+
     fiber  fiber copper fiber
```

Common SFP variants:
- **SFP (1G):** 1000BASE-T (copper RJ-45), 1000BASE-SX (MMF), 1000BASE-LX (SMF)
- **SFP+ (10G):** 10GBASE-SR (MMF), 10GBASE-LR (SMF), 10GBASE-T (copper)
- **SFP28 (25G):** data center server links
- **QSFP+ (40G):** high-density data center uplinks
- **QSFP28 (100G):** spine-leaf data center fabric

Cisco IOS CLI to check SFP module status:

```text
Switch# show interfaces GigabitEthernet0/1 transceiver
ITU Channel not available (Wavelength not available),
Transceiver is internally calibrated.
mA: milliamperes, dBm: decibels (milliwatts), NA or N/A: not applicable.
++: high alarm, +: high warning, -: low warning, --: low alarm.
```

## Gotchas

- **Auto-MDIX does not mean crossover cables are gone from the exam.** CCNA questions still ask which cable type is correct for which connection pair. Know the rules even though modern hardware usually autodetects.
- **Cat6 at 10 Gbps has a 55 m limit, not 100 m.** Full 100 m at 10 Gbps requires Cat6a. This is a common trap question.
- **SMF vs MMF is about distance, not speed.** Both can run at 10 Gbps. The difference is reach. Use MMF within a data center or building; use SMF between buildings or across a campus.
- **T568A vs T568B:** both work. The CCNA tests whether you know the difference and which pin uses which color. T568B is more common in North America. T568A is required for government installations.
- **Cisco proprietary SFPs:** Cisco switches sometimes reject third-party SFP modules with an "unsupported transceiver" error. The `service unsupported-transceiver` command disables this check, but Cisco does not support the third-party module under TAC.

## References

- [Cisco: Understanding and Configuring Cisco's Auto-MDIX Feature](https://www.cisco.com/c/en/us/support/docs/interfaces-modules/gigabit-ethernet/12321-24.html)
- [TIA-568 Cabling Standards Overview (BICSI)](https://www.bicsi.org/standards/available-standards-store/single-document/ansi-tia-568-2-d)
- [IEEE 802.3 Ethernet Working Group](https://www.ieee802.org/3/)

## Related topics

- [Part 1: Introduction to Networking](../part-01-intro-to-networking/)
- [Part 2: The OSI Model](../part-02-osi-model/)
- [Part 5: Data Link Layer and Ethernet](../part-05-data-link-and-ethernet/)
