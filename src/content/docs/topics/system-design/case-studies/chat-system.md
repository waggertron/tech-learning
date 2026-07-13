---
title: "Case Study: Chat System"
description: "Full system design walkthrough for a WhatsApp-style chat system: message ordering guarantees, WebSocket connection management at scale, exactly-once delivery, and the architectural difference between 1:1 and group chat."
parent: case-studies
tags: [system-design, case-studies, interviews, chat, messaging]
status: draft
created: 2026-05-06
updated: 2026-05-06
---

A chat system is deceptively complex. The apparent requirements -- send and receive messages -- hide several hard distributed systems problems: how do you guarantee exactly-once delivery over an unreliable network? How do you maintain message ordering across distributed servers? How do you serve 1 billion concurrent WebSocket connections? Great answers surface these problems unprompted and explain the specific mechanisms that solve each one.

## Clarifying questions

- **Scope**: 1:1 messaging only, or group chats? (Group chat is a separate fan-out problem.)
- **Group size limit**: up to 100 members or up to 100,000? (Changes the fan-out strategy.)
- **Media**: text only, or images, video, and files?
- **Message history**: how long retained? Are messages stored server-side or only on-device (end-to-end encrypted)?
- **Online presence**: should users see who is online?
- **Delivery receipts**: sent, delivered, and read indicators?
- **Scale**: how many DAU? Messages per user per day?

What the answers reveal:
- End-to-end encryption (E2EE) means the server stores ciphertext only -- server-side search and content moderation become impossible
- Group chat with 100K members requires pub/sub fan-out, not direct delivery
- Long retention requires durable storage, not just a delivery buffer

For this walkthrough: 2B users, 1B DAU, 1:1 and group chat (max 256 members), text and media, 30-day message retention, read receipts, online presence.

## Estimation

```
Messages:
  1B DAU * 40 messages/day = 40B messages/day
  40B / 86,400 = 463,000 message writes/sec
  Peak (2x): ~926,000 writes/sec

Media (50% of messages, avg 500 KB):
  20B media/day * 500 KB = 10 PB/day media

Message storage (30-day retention):
  40B/day * 100 bytes * 30 days = 120 TB text
  20B/day * 500 KB * 30 days = 300 PB media

Delivery:
  Each message delivered to avg 1.5 recipients
  463,000 * 1.5 = 694,500 deliveries/sec

Connections:
  1B DAU * avg 2 devices = 2B concurrent WebSocket connections
  At 1M connections per server: 2,000 chat servers needed
```

**Capacity driver**: 926K writes/sec is far beyond a single relational DB node. Cassandra (write-optimized, horizontally scalable) is the standard choice. 2B WebSocket connections requires a large fleet of stateful connection servers -- the most unusual infrastructure requirement.

## High-level design

```
[Client A] <--> [Chat Gateway A] <--> [Message Service]
                                            |
                                   [Message Store (Cassandra)]
                                            |
                                   [Delivery Service]
                                            |
                      .--------------------'---------------------.
                      |                                           |
              [Chat Gateway B]                         [Push Notification Service]
                      |                                    |
              [Client B (online)]              [FCM / APNs (offline)]
```

APIs (internal -- exposed via WebSocket and HTTP):

```
WebSocket events:
  send_message:    { conversation_id, content, media_id?, client_msg_id }
  message_ack:     { message_id, status: "delivered" | "read" }
  typing:          { conversation_id }

HTTP endpoints:
  GET /conversations/{id}/messages?before={cursor}&limit=20
  POST /media/upload-url
  GET /users/{id}/presence
```

## Deep dive: message ordering

In a distributed system, two messages sent from different devices at the same millisecond may arrive at different servers in different orders. The receiving client must display them in a consistent, logical order.

**Approach: per-conversation sequence numbers**

Every conversation has a monotonically increasing sequence number. Each message in the conversation gets the next sequence number. The client sorts by sequence number, not timestamp.

```python
# Cassandra schema (simplified)
# Partition key: conversation_id
# Clustering key: sequence_number (DESC for efficient "get latest")

CREATE TABLE messages (
    conversation_id UUID,
    sequence_number BIGINT,
    message_id      UUID,
    sender_id       BIGINT,
    content         TEXT,
    sent_at         TIMESTAMP,
    PRIMARY KEY (conversation_id, sequence_number)
) WITH CLUSTERING ORDER BY (sequence_number DESC);
```

The sequence number is generated atomically per conversation. For a 1:1 conversation with two active writers, a Redis counter (INCR is atomic) or a per-conversation lock ensures no two messages get the same sequence number.

```python
import redis

r = redis.Redis()

def next_sequence_number(conversation_id: str) -> int:
    return r.incr(f"seq:{conversation_id}")
```

At 463K messages/sec across billions of conversations, per-conversation Redis counters are fine -- each conversation's key is accessed only when that conversation has activity.

## Deep dive: WebSocket connection management

WebSocket connections are stateful. A client connects to a specific chat gateway server and maintains that connection. When you send a message to User B, you need to find which gateway server User B is connected to, then forward the message there.

**Connection routing table** (stored in Redis):

```python
# On client connect:
r.set(f"conn:{user_id}", gateway_server_id, ex=300)  # TTL = heartbeat interval * 2

# On message delivery:
def deliver_to_user(user_id: int, message: dict):
    gateway_id = r.get(f"conn:{user_id}")
    if gateway_id:
        # Forward to their gateway via internal pub/sub
        r.publish(f"gateway:{gateway_id}", json.dumps({
            "user_id": user_id,
            "message": message
        }))
    else:
        # User is offline -- send push notification
        push_notification_service.send(user_id, message)
```

Each gateway server subscribes to its own Redis pub/sub channel. When it receives a forwarded message, it pushes it over the relevant WebSocket connection.

**Heartbeat for connection health**: clients send a ping every 30 seconds. If the gateway server does not receive a ping within 60 seconds, it marks the connection dead and removes the routing table entry. This handles ungraceful disconnects (phone dies, airplane mode).

## Deep dive: exactly-once delivery

The network is unreliable. A message can be:
1. Sent by the client but never received by the server (client should retry)
2. Received by the server but the ACK is lost (client retries, server receives duplicate)
3. Delivered to the recipient but the receipt is lost (server re-delivers, recipient sees duplicate)

**Solution: idempotency keys + client-side deduplication**

Every message carries a `client_msg_id` generated by the sender (UUID). The server stores this in the message record with a unique constraint:

```sql
-- Unique constraint prevents duplicate inserts
ALTER TABLE messages ADD CONSTRAINT unique_client_msg_id
    UNIQUE (conversation_id, sender_id, client_msg_id);
```

On insert, if the `client_msg_id` already exists, the INSERT fails silently (ON CONFLICT DO NOTHING). The server returns the existing message's `sequence_number` to the client as the ACK. The client knows the message was delivered.

The recipient also deduplicates by `message_id` before displaying: if a message with the same `message_id` has already been rendered, ignore the re-delivery.

## Deep dive: offline delivery

When User B is offline, messages must be queued and delivered when they reconnect.

**Approach: hybrid store + push notification**

1. All messages are written to Cassandra regardless of online status -- this is the source of truth.
2. If the recipient is online, deliver in real time via WebSocket.
3. If offline, send a push notification (FCM/APNs) containing a notification (not the full message -- for E2EE systems) to wake the app.
4. On reconnect, the client fetches unread messages from Cassandra: `GET /conversations/{id}/messages?after={last_seen_sequence_number}`.

Push notifications are best-effort (FCM has no guaranteed delivery). The pull-on-reconnect from Cassandra is the authoritative delivery mechanism -- it catches anything missed.

## Deep dive: group chat

For groups up to 256 members, fan out server-side: when a message arrives, deliver it to every member's gateway server individually.

```python
def deliver_group_message(group_id: int, message: dict):
    members = db.get_group_members(group_id)  # at most 256
    for member_id in members:
        deliver_to_user(member_id, message)
```

At 256 members and 463K group messages/sec (assume 20% of messages are in groups), that is 463K * 0.2 * 256 = 23.7M Redis pub/sub publishes/sec. This is within Redis Cluster capacity (Redis can handle ~10M ops/sec per node; 3 nodes handles this).

For groups larger than 256 (Discord-style), fan-out does not scale. Use a pub/sub model: each channel/group is a Kafka topic, and members subscribe. This decouples delivery from the group size.

## Failure modes

**Chat gateway crash**: all WebSocket connections to that server are dropped. Clients detect the disconnect and reconnect to any available gateway server. The connection routing table entry expires (TTL-based) within 60 seconds. Messages queued for that gateway's Redis channel are lost -- but since all messages are in Cassandra, clients pull missed messages on reconnect.

**Cassandra node failure**: replication factor 3 (RF=3) means data is on 3 nodes. With consistency level QUORUM (2 of 3 must respond), one node failure is transparent to users.

**Redis connection routing table failure**: gateway servers cannot find where users are connected. Delivery falls back to push notification for all messages. Users are effectively treated as offline until Redis recovers. Messages are not lost -- they are in Cassandra and will sync on reconnect.

**Sequence number counter failure**: if the Redis counter for a conversation is lost, the next sequence number starts from 0, creating conflicts with existing messages. Mitigate by periodically persisting the max sequence number per conversation to Cassandra. On Redis miss, read from Cassandra and restore the counter.

## Key takeaways

**The WebSocket connection routing table is the architectural linchpin.** The Redis mapping of `user_id -> gateway_server_id` is what makes real-time delivery possible across a fleet of stateful servers. Without it, you cannot route a message to the right gateway. Every candidate who designs a chat system must address this.

**Never rely on push notifications for delivery.** FCM and APNs are best-effort. The reliable delivery mechanism is: write to Cassandra first (durable), notify via push (unreliable), confirm on reconnect via pull. This two-path design appears in every production messaging system.

**Sequence numbers, not timestamps, for message ordering.** Timestamps from different clients are unreliable (clock skew, different time zones). A per-conversation atomic sequence number is the correct primitive for ordering. State this explicitly -- it is a non-obvious insight that interviewers notice.

**Cassandra's write optimization is the reason it is chosen here.** At 926K writes/sec, you need an LSM-tree-based store. Cassandra's write path (memtable + WAL, async flush to SSTable) handles this without write contention. A B-tree-based store (PostgreSQL) would saturate on writes at a fraction of this load.

**End-to-end encryption changes everything.** If the interviewer asks about E2EE (WhatsApp, Signal), the server stores ciphertext only. You cannot search messages server-side, cannot do content moderation, cannot recover lost keys. This is a design constraint that eliminates many "obvious" features. Mention this trade-off when E2EE is raised.

## References

- [WhatsApp engineering at scale](https://blog.whatsapp.com/1-million-is-so-2011)
- [Signal Protocol specification](https://signal.org/docs/)
- [Designing Data-Intensive Applications, Kleppmann, Chapter 11](https://dataintensive.net/)
- [Apache Cassandra data modeling for messaging](https://cassandra.apache.org/doc/latest/cassandra/data_modeling/index.html)

## Related topics

- [Interview Framework](../../interview-framework/), the 4-step approach used in this walkthrough
- [Message Queues](../../message-queues/), Kafka for large group fan-out
- [Databases at Scale](../../databases/), Cassandra's write-optimized LSM-tree storage
- [CAP Theorem](../../cap-theorem/), why messaging systems choose AP over CP
- [Notification System](../notification-system/), the push notification path for offline delivery
