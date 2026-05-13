---
title: "Part 24: Quality of Service"
description: "How QoS classifies, marks, queues, and shapes traffic so voice and video get priority over bulk data on congested links."
parent: networking
tags: [networking, ccna]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

A 100 Mbps link shared between a VoIP call and a 90 Mbps file transfer will drop voice packets. The link has enough theoretical capacity, but TCP fills it, buffers bloat, and the VoIP codec gets starved. Quality of Service (QoS) is the toolset that prevents this: classify traffic, mark it, give priority to what cannot wait, and constrain what can.

## Why it matters

Networks increasingly carry voice, video conferencing, real-time telemetry, and bulk data on the same physical links. These traffic types have fundamentally different tolerances:

- VoIP: needs low latency (under 150ms one-way), low jitter (under 30ms), near-zero loss
- Video streaming: tolerates some buffering but not sustained loss
- Bulk file transfer: tolerates high latency and variable throughput; TCP will retransmit

Without QoS, a large file transfer can consume all available bandwidth and buffer space, causing VoIP calls to sound robotic or drop entirely. QoS does not create bandwidth -- it manages the bandwidth that exists.

## Four QoS problems to manage

| Problem  | Definition                                | Sensitive traffic  |
|----------|-------------------------------------------|--------------------|
| Bandwidth | Total throughput available on a link     | Bulk data          |
| Delay    | Time for a packet to traverse the path    | VoIP, video        |
| Jitter   | Variation in delay between packets        | VoIP               |
| Loss     | Packets dropped in transit                | VoIP, video        |

QoS tools address each of these at different points in the forwarding path.

## QoS models

### Best-effort

No QoS. Every packet is treated identically. First in, first out. This is the default behavior on Cisco IOS interfaces without any QoS policy applied. Fine for data-only networks. Not appropriate when voice or video share the link.

### IntServ (Integrated Services)

Per-flow bandwidth reservation using the Resource Reservation Protocol (RSVP). Applications signal their bandwidth requirements before sending. The network reserves resources along the entire path. Guarantees work but the model does not scale -- routers must track state for every individual flow. Rarely deployed beyond specialized environments.

### DiffServ (Differentiated Services)

Packets are marked into traffic classes at the network edge. Interior routers make forwarding decisions based on the marking, without per-flow state. Scales to large networks. This is the model tested on CCNA and used in production enterprise networks.

## Classification and marking

Traffic must be classified before it can be treated differently. Classification looks at packet headers (or payload with deep packet inspection). Once classified, packets are marked so downstream devices can apply QoS without re-inspecting.

### Layer 2: 802.1Q CoS (Class of Service)

The 802.1Q VLAN tag contains a 3-bit Priority Code Point (PCP) field, also called CoS. Values range from 0 to 7. CoS markings are only present on trunk links carrying 802.1Q frames. They are stripped when a router de-encapsulates the frame at a Layer 3 boundary.

```text
802.1Q frame header (partial):
 +--------+--------+----+-----+--------+
 | TPID   | PCP(3) | DEI| VID |  ...   |
 | 0x8100 | CoS    |    |     |        |
 +--------+--------+----+-----+--------+
  CoS 0 = best effort
  CoS 5 = voice bearer (common convention)
  CoS 7 = network control
```

### Layer 3: DSCP (Differentiated Services Code Point)

DSCP occupies the first 6 bits of the IP header's ToS (Type of Service) byte. Values range from 0 to 63. DSCP survives Layer 3 hops because it lives in the IP header, making it the correct marking for end-to-end QoS.

**Per-hop behaviors (PHBs):**

- Default Forwarding (DF/BE): DSCP 0, best effort
- Class Selector (CS): DSCP values 8, 16, 24, 32, 40, 48, 56; backward compatible with IP Precedence
- Assured Forwarding (AF): four classes (AF1x-AF4x), three drop precedences each; higher x = higher drop probability under congestion
- Expedited Forwarding (EF): DSCP 46; lowest latency, lowest jitter, lowest loss; used for VoIP bearer

**Common DSCP markings:**

| Traffic type      | DSCP name | DSCP value |
|-------------------|-----------|------------|
| VoIP bearer       | EF        | 46         |
| VoIP signaling    | CS3       | 24         |
| Video conferencing| CS4       | 32         |
| Bulk data         | AF11      | 10         |
| Best effort       | DF        | 0          |
| Network control   | CS6       | 48         |

### Trust boundary

The trust boundary is the point in the network where DSCP or CoS markings are accepted as legitimate. Endpoints (PCs) can set any DSCP value. Accepting those markings at the campus edge would let any user claim VoIP priority for arbitrary traffic.

```text
IP Phone --> Access switch port (trust boundary here)
              |
              Validate: phone is trusted, PC connected through phone is not
              |
           Distribution --> Core --> WAN edge
              (markings preserved and acted on throughout)
```

Cisco IP phones mark their own voice traffic as EF (46) and their signaling as CS3 (24). The access switch is configured to trust DSCP from the phone's port. Traffic from a PC plugged into the phone's data port is re-marked or untrusted.

## Queuing

Queuing determines which packets are sent first when an interface is congested (output queue is full). This is where priority enforcement actually happens.

### FIFO (First In, First Out)

No priority. Packets leave in the order they arrived. Simple and fair, but a burst of large packets can delay small VoIP packets by tens of milliseconds.

### PQ (Priority Queuing)

Four static queues: High, Medium, Normal, Low. The scheduler always drains the high queue before touching medium, and so on. Guarantees low latency for high-priority traffic but can starve lower queues entirely if high-priority traffic is sustained.

### CBWFQ (Class-Based Weighted Fair Queuing)

Assigns guaranteed minimum bandwidth to each class. If a class is not using its allocation, other classes can borrow. No strict priority. Every class eventually gets service. Good for data classes, not ideal for voice because latency is not bounded.

### LLQ (Low Latency Queuing)

CBWFQ with an added strict priority queue for voice. The priority queue is serviced first on every scheduling round. Other classes get their CBWFQ-guaranteed bandwidth from remaining capacity. LLQ is the recommended model for networks carrying voice.

```text
LLQ scheduler (interface output):

  +------------------+
  | Priority Queue   |  <-- VoIP (EF) -- always served first
  +------------------+
  | CBWFQ Class 1   |  <-- Video (CS4)
  +------------------+
  | CBWFQ Class 2   |  <-- Business data (AF21)
  +------------------+
  | class-default    |  <-- Best effort (DF)
  +------------------+

  Each scheduling cycle:
    1. Drain priority queue (up to configured rate)
    2. Service CBWFQ classes proportionally
    3. Remainder goes to class-default
```

## Congestion avoidance: WRED

Tail-drop occurs when a queue fills completely and every subsequent packet is dropped. This causes TCP global synchronization: multiple flows simultaneously back off, then simultaneously ramp up, causing waves of congestion.

WRED (Weighted Random Early Detection) begins randomly dropping packets from lower-priority classes before the queue is full. Lower DSCP = higher drop probability. This signals TCP flows to slow down before tail-drop occurs, preventing synchronization. WRED is aware of DSCP markings -- EF traffic has a minimum drop threshold of 100% (never dropped early), while AF11 traffic starts seeing drops at a lower queue fill level.

## Policing vs shaping

Both tools enforce a rate limit, but they handle excess traffic differently.

| Feature          | Policing                       | Shaping                        |
|------------------|--------------------------------|--------------------------------|
| Excess action    | Drop or re-mark immediately    | Buffer and send later          |
| Latency added    | None                           | Yes (buffering delay)          |
| Typical location | Ingress (traffic coming in)    | Egress (traffic going out)     |
| Use case         | ISP rate enforcement           | Smoothing bursts before WAN    |
| Burst handling   | Token bucket; excess dropped   | Token bucket; excess queued    |

Policing is what ISPs do to your traffic at the demarcation point. Shaping is what you do before sending traffic to the ISP so you control the burst behavior rather than the ISP's policer dropping your packets randomly.

## MQC configuration (Modular QoS CLI)

Cisco IOS uses a three-part structure: class-map (match traffic), policy-map (define actions), service-policy (apply to interface).

```text
! Step 1: Define traffic classes
class-map match-any VOICE
 match dscp ef
!
class-map match-any VIDEO
 match dscp cs4
!
class-map match-any BULK
 match dscp af11
!
! Step 2: Define the policy
policy-map WAN-POLICY
 class VOICE
  priority 512
 class VIDEO
  bandwidth 2048
 class BULK
  bandwidth 1024
 class class-default
  fair-queue
!
! Step 3: Apply to interface (output direction)
interface GigabitEthernet0/1
 service-policy output WAN-POLICY
```

- `priority 512`: LLQ strict priority queue, 512 kbps; excess is policed (dropped), not buffered
- `bandwidth 2048`: CBWFQ guaranteed minimum 2048 kbps for video
- `bandwidth 1024`: CBWFQ guaranteed minimum 1024 kbps for bulk
- `fair-queue`: WFQ for all unclassified traffic in class-default

Verify with:

```text
R1# show policy-map interface GigabitEthernet0/1
R1# show class-map
R1# show policy-map
```

## Gotchas

**QoS only matters when a link is congested.** On an idle or lightly loaded link, all traffic gets through regardless of markings or queuing policy. You will not see priority behavior take effect in a lab unless you generate enough traffic to fill the queue. This leads to false confidence that QoS is working when it has not actually been tested.

**The priority queue in LLQ polices excess voice traffic.** If voice traffic exceeds the configured `priority` rate, it is dropped -- not queued. This is intentional: unbounded voice traffic would starve CBWFQ classes. Always size the priority queue at or slightly above your maximum expected voice bandwidth. A common formula: (number of concurrent calls) x (codec bandwidth per call + overhead).

**CoS markings do not cross Layer 3 boundaries.** A router strips the 802.1Q tag when it routes a packet. Any CoS value in that tag is lost. Use DSCP for end-to-end marking -- DSCP lives in the IP header and survives routing. Re-mark at trust boundaries rather than relying on CoS propagating across routed segments.

**`match-any` vs `match-all` in class-maps.** `match-any` is a logical OR (packet matches if it satisfies any one criterion). `match-all` is a logical AND (packet must match every criterion). For DSCP-based classification you almost always want `match-any` with a single match statement, but for more complex policies (match protocol AND DSCP), `match-all` is needed.

**Service-policy direction matters.** Input policies classify and police incoming traffic. Output policies apply queuing and shaping to outgoing traffic. Applying a queuing policy in the input direction does not do what you expect -- queuing only affects the output scheduler.

## References

- [Cisco QoS Configuration Guide (IOS XE)](https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/qos_mqc/configuration/xe-16/qos-mqc-xe-16-book.html)
- [RFC 2474 - Definition of the Differentiated Services Field in IPv4 and IPv6 Headers](https://datatracker.ietf.org/doc/html/rfc2474)
- [RFC 3246 - An Expedited Forwarding PHB](https://datatracker.ietf.org/doc/html/rfc3246)

## Related topics

- [Part 3: TCP/IP Model](./part-03-tcpip-model) -- the IP header fields (ToS/DSCP) that QoS marking lives in
- [Part 17: DHCP and DNS](./part-17-dhcp-and-dns) -- infrastructure services that share the same links QoS manages
- [Part 20: WAN Technologies and Network Automation](./part-20-wan-technologies-and-network-automation) -- WAN links are the most common congestion point where QoS policies are applied
