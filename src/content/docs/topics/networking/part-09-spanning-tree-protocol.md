---
title: "Part 9: Spanning Tree Protocol"
description: "How STP and RSTP eliminate Layer 2 broadcast storms by blocking redundant switch links to create a loop-free logical tree."
parent: networking
tags: [networking, ccna]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

Redundant switch links are good for availability but catastrophic without loop prevention. A single broadcast frame on a looped Layer 2 network duplicates endlessly, consuming all bandwidth within seconds. Spanning Tree Protocol (STP) solves this by selectively blocking ports so only one active path exists between any two switches at a time.

## Why it matters

Ethernet frames have no TTL field. A Layer 2 loop is permanent until a cable is unplugged or a port is shut down. In a broadcast storm, every switch floods every frame out every port, and those copies loop back and get flooded again. CPU utilization hits 100%, the network stops forwarding legitimate traffic, and the only fix is manual intervention. STP keeps redundant links available as standby without letting them create loops.

## The Layer 2 loop problem

Consider three switches forming a triangle:

```
          SW1
         /   \
        /     \
      SW2 --- SW3
```

When Host A (connected to SW2) sends a broadcast:
1. SW2 floods it to SW1 and SW3.
2. SW1 receives it and floods to SW3. SW3 receives it and floods to SW1.
3. Both copies arrive at the other switch and get flooded again.
4. The loop multiplies exponentially. The network is dead within seconds.

STP breaks the triangle by blocking one port:

```
          SW1
         /   \
        /     X  (blocked)
      SW2 --- SW3
```

Now there is only one path between any pair of switches.

## STP (802.1D) mechanics

### Root bridge election

Every switch starts by claiming to be the root bridge. Switches exchange Bridge Protocol Data Units (BPDUs) to determine which one actually wins. The switch with the lowest Bridge ID becomes the root.

```
Bridge ID = Priority (2 bytes) + MAC address (6 bytes)
```

Default priority is 32768. If priorities are equal, lower MAC address wins. Lower Bridge ID wins overall.

To make a specific switch the root, lower its priority:

```text
SW1(config)# spanning-tree vlan 10 priority 4096
```

Priority must be a multiple of 4096. Common values: 4096 (primary root), 8192 (secondary root).

### Port roles

Once the root is elected, every non-root switch selects port roles based on path cost to the root:

| Role | Description |
|------|-------------|
| Root Port (RP) | The single best path toward the root bridge. One per non-root switch. |
| Designated Port (DP) | Best port on each network segment. Forwards traffic toward end devices. |
| Non-Designated Port | Loses the designated port election. Placed in Blocking state. |

The root bridge has all Designated Ports (it is the top of the tree; nothing is "above" it).

Path cost is calculated per-link based on bandwidth:

| Link Speed | STP Cost |
|------------|----------|
| 10 Mbps    | 100      |
| 100 Mbps   | 19       |
| 1 Gbps     | 4        |
| 10 Gbps    | 2        |

### Port states (802.1D)

STP ports move through five states after a topology change:

```
Blocking --> Listening --> Learning --> Forwarding
  (drop)    (15 sec)     (15 sec)     (active)
```

- **Blocking**: receives BPDUs, does not forward data frames or learn MACs.
- **Listening**: sends/receives BPDUs to determine root and port roles. No data, no MAC learning. 15 seconds.
- **Learning**: still no data forwarding, but populates MAC table. 15 seconds.
- **Forwarding**: normal operation. Sends and receives data frames.
- **Disabled**: administratively shut down.

Total convergence time for 802.1D: up to 50 seconds (Listening + Learning). This is why RSTP was introduced.

### BPDUs

BPDUs carry the root Bridge ID, path cost to root, sender Bridge ID, and port ID. Switches forward BPDUs only from the root bridge. If a switch stops receiving BPDUs on a port (max age = 20 seconds), it assumes a topology change and starts the transition process.

## RSTP (802.1w): Rapid Spanning Tree

RSTP converges in seconds rather than 50 seconds. It is backward-compatible with 802.1D but uses a negotiation handshake between switches to transition ports quickly.

### Additional port roles in RSTP

| Role | Description |
|------|-------------|
| Alternate Port | Backup path to root (takes over immediately if Root Port fails). |
| Backup Port | Backup to a Designated Port on the same segment. |

### Port types in RSTP

- **Edge port**: connected to end devices, not other switches. Transitions to Forwarding immediately (equivalent to PortFast in PVST+).
- **Point-to-point**: full-duplex link between two switches. Uses RSTP negotiation for fast transitions.
- **Shared**: half-duplex link (hub). Falls back to 802.1D-style slow transitions.

RSTP reduces states to three: Discarding (combines Blocking/Listening/Disabled), Learning, Forwarding.

## PVST+ and Rapid PVST+

Cisco's default: **PVST+** (Per-VLAN Spanning Tree Plus). One STP instance per VLAN. This allows traffic engineering:

- Make SW1 the root for VLAN 10 (traffic flows left).
- Make SW2 the root for VLAN 20 (traffic flows right).
- Both redundant links carry traffic, just for different VLANs.

**Rapid PVST+** combines RSTP convergence speed with per-VLAN instances. This is the recommended mode.

```text
SW1(config)# spanning-tree mode rapid-pvst
```

## Configuration

Set the root bridge priority for a specific VLAN:

```text
SW1(config)# spanning-tree vlan 10 priority 4096
SW1(config)# spanning-tree vlan 20 priority 8192
```

Or use the macro (automatically sets the lowest available priority):

```text
SW1(config)# spanning-tree vlan 10 root primary
SW1(config)# spanning-tree vlan 20 root secondary
```

Enable PortFast and BPDU Guard on access ports:

```text
SW1(config)# interface GigabitEthernet0/1
SW1(config-if)# spanning-tree portfast
SW1(config-if)# spanning-tree bpduguard enable
```

Enable PortFast globally on all access ports (not trunk ports):

```text
SW1(config)# spanning-tree portfast default
SW1(config)# spanning-tree portfast bpduguard default
```

## Verifying STP

```text
SW1# show spanning-tree
```

Sample output for VLAN 10:

```text
VLAN0010
  Spanning tree enabled protocol rstp
  Root ID    Priority    4096
             Address     0019.aaaa.bbbb
             This bridge is the root
             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec

  Bridge ID  Priority    4096   (priority 4096 sys-id-ext 10)
             Address     0019.aaaa.bbbb
             Hello Time   2 sec  Max Age 20 sec  Forward Delay 15 sec
             Aging Time  300 sec

Interface           Role Sts Cost      Prio.Nbr Type
------------------- ---- --- --------- -------- ----
Gi0/1               Desg FWD 4         128.1    P2p
Gi0/2               Desg FWD 4         128.2    P2p
```

Key columns:
- **Role**: Root (RP), Desg (Designated), Altn (Alternate), Back (Backup)
- **Sts**: BLK, LIS, LRN, FWD, or LBK
- **Type**: P2p (point-to-point, fast transitions), Shr (shared, slow), Edge (PortFast)

Check a specific interface:

```text
SW1# show spanning-tree interface GigabitEthernet0/1 detail
```

## PortFast

PortFast skips the Listening and Learning states, putting a port directly into Forwarding. This is correct behavior for access ports connected to PCs, printers, and servers. Those devices never send BPDUs, so there is no loop risk.

```text
SW1(config-if)# spanning-tree portfast
```

Never enable PortFast on a port connected to another switch. During reconvergence, a trunk port with PortFast can briefly create a loop before STP catches it.

## BPDU Guard

BPDU Guard shuts down a port (err-disabled state) the moment it receives a BPDU. This protects against a rogue or unauthorized switch being plugged into an access port.

```text
SW1(config-if)# spanning-tree bpduguard enable
```

When a port goes err-disabled, you will see:

```text
%SPANTREE-2-BLOCK_BPDUGUARD: Received BPDU on port GigabitEthernet0/1 with BPDU Guard enabled. Disabling port.
%PM-4-ERR_DISABLE: bpduguard error detected on Gi0/1, putting Gi0/1 in err-disable state
```

To recover: fix the physical issue, then:

```text
SW1(config-if)# shutdown
SW1(config-if)# no shutdown
```

Or configure automatic recovery:

```text
SW1(config)# errdisable recovery cause bpduguard
SW1(config)# errdisable recovery interval 300
```

## Physical vs. logical topology

Physical (redundant links form a triangle):

```
        +------+
        |  SW1 |
        +--+---+
          /|\
         / | \
        /  |  \
       /   |   \
  +--+--+  |  +--+--+
  | SW2 +--+--+ SW3 |
  +-----+     +-----+
```

STP logical tree (SW1 is root, one port on SW2-SW3 link is blocked):

```
        +------+
        |  SW1 |   <-- Root Bridge
        +--+---+
          / \
         /   \
        /     \
  +--+--+     +--+--+
  | SW2 |     | SW3 |
  +-----+  X  +-----+
     (blocked port on SW3 toward SW2)
```

Traffic from SW2 to SW3 now flows: SW2 -> SW1 -> SW3. The direct link is standing by, ready to activate if the SW1-SW3 link fails.

## Tradeoffs and gotchas

- **PortFast on trunk ports**: a trunk port with PortFast can create a temporary loop during link flaps because it bypasses Listening/Learning. Only use PortFast on confirmed access ports.
- **BPDU Guard vs. BPDU Filter**: BPDU Filter silences outgoing BPDUs entirely, which can hide loops. BPDU Guard is the safer choice for access ports.
- **Topology change notification (TCN)**: when a port transitions, STP floods a TCN throughout the network, causing switches to shorten their MAC aging timers and re-learn addresses. In large networks, frequent TCNs cause unnecessary flooding.
- **Unidirectional link failure**: RSTP assumes full-duplex point-to-point links. A one-way fiber failure can cause RSTP to put a port in Forwarding on both ends, creating a loop. UDLD (Unidirectional Link Detection) mitigates this.
- **STP and VoIP**: PortFast is required on ports with IP phones. Without it, the phone loses power-on connectivity for 50 seconds while STP converges.

## References

- [IEEE 802.1D Spanning Tree Protocol - Cisco Documentation](https://www.cisco.com/c/en/us/tech/lan-switching/spanning-tree-protocol/index.html)
- [Understanding Rapid Spanning Tree Protocol (802.1w) - Cisco](https://www.cisco.com/c/en/us/support/docs/lan-switching/spanning-tree-protocol/24062-146.html)

## Related topics

- [Part 7: VLANs](../part-07-vlans/)
- [Part 6: Switching Fundamentals](../part-06-switching-fundamentals/)
- [Part 10: IPv4 Addressing and Subnetting](../part-10-ipv4-addressing-and-subnetting/)
