---
title: Message Queues
description: "Async communication patterns, queue vs pub/sub, delivery guarantees, dead letter queues, Kafka vs RabbitMQ, and when to decouple services with a message broker."
parent: system-design
tags: [system-design, message-queues, kafka, rabbitmq, async]
status: draft
created: 2026-05-06
updated: 2026-05-06
---

A message queue is a buffer between services. The producer writes a message and moves on. The consumer reads and processes the message independently. The two services never talk to each other directly; they share only the queue.

## Why decouple with a queue

**Synchronous call: producer must wait**

```
User request
    |
    v
[ Order Service ] -----> [ Email Service ] (must respond before Order Service continues)
                          [ Inventory Service ]
                          [ Analytics Service ]
```

If any downstream service is slow, the user waits. If any downstream service is down, the order fails.

**Async via queue: producer fires and moves on**

```
User request
    |
    v
[ Order Service ] -----> [ Queue ]
    |                       |
    | (returns immediately) |---> [ Email Service ]    (processes when ready)
    v                       |---> [ Inventory Service ]
 200 OK                     |---> [ Analytics Service ]
```

The order service completes instantly. Downstream services process messages at their own pace. A slow email service does not delay orders. A crashed analytics service loses no data; messages accumulate in the queue until it recovers.

## Queue vs pub/sub

**Queue (point-to-point)**: one producer, one consumer per message. Used for task distribution. If there are 3 consumer instances, each message goes to exactly one of them. Useful for load-balancing work.

```
Producer -> [Queue] -> Consumer A
                    -> Consumer B (one of them, not both)
```

**Pub/sub (publish-subscribe)**: one producer, many consumers each get every message. Used for broadcasting events. All subscribers receive the same message independently.

```
Producer -> [Topic] -> Subscriber A (gets every message)
                    -> Subscriber B (gets every message)
                    -> Subscriber C (gets every message)
```

Most modern brokers (Kafka, AWS SNS/SQS, Google Pub/Sub) support both patterns.

## Delivery guarantees

### At-most-once

The message is sent once. If the consumer fails before processing, the message is lost. No retries.

Use when: losing occasional messages is acceptable (analytics events, metrics collection).

### At-least-once

The message is delivered until the consumer acknowledges it. If the consumer crashes before acknowledging, the broker resends the message. The consumer may process the message more than once.

Use when: losing messages is unacceptable, and the consumer operation is **idempotent** (processing the same message twice produces the same result as processing it once).

```python
# Idempotent consumer: safe to process twice
def handle_order_created(order_id):
    if db.exists("SELECT 1 FROM processed_orders WHERE id = %s", order_id):
        return  # already processed, skip
    db.execute("INSERT INTO processed_orders (id) VALUES (%s)", order_id)
    fulfill_order(order_id)
```

### Exactly-once

The message is processed exactly once even if delivered multiple times. This is the hardest guarantee. It requires coordination between the broker and the consumer's storage system (transactional consumers, idempotent producers).

Kafka supports exactly-once semantics (EOS) with the Kafka Streams API and transactional producers. It is complex and has performance overhead. Most systems use at-least-once with idempotent consumers instead.

## Dead letter queues

When a consumer fails to process a message repeatedly (after N retries), the broker moves the message to a **dead letter queue** (DLQ). The DLQ holds messages that need manual inspection or reprocessing.

```
[Main Queue] -> Consumer fails 3 times -> [Dead Letter Queue]
                                               |
                                               v
                                          Alert + manual review
```

Always set up a DLQ. Without one, a "poison pill" message (one that always causes the consumer to crash) will loop forever, blocking all subsequent messages.

## Backpressure

Backpressure is the mechanism by which a slow consumer signals a fast producer to slow down. Without backpressure, the queue grows unboundedly until memory is exhausted.

In queue-based systems, backpressure is implicit: if the queue is full, the producer blocks or receives an error. The producer must handle this gracefully (slow down, drop lower-priority messages, or return an error to the caller).

In reactive systems, backpressure is explicit: the consumer declares how many messages it is ready to receive, and the broker sends exactly that many.

## Kafka vs RabbitMQ

### Kafka

Kafka is a distributed, partitioned, replicated log. Messages (called records) are appended to a topic's partitions in order. Consumers read from a position (offset) in the log. Messages are retained on disk for a configurable period (default 7 days) and can be re-read.

```
Topic: orders
  Partition 0: [msg1][msg3][msg5][msg7]...
  Partition 1: [msg2][msg4][msg6][msg8]...

Consumer Group A reads at offset 5 on partition 0
Consumer Group B reads at offset 3 on partition 0
(both groups get all messages independently)
```

**Kafka strengths:**
- Very high throughput (millions of messages/second)
- Persistent log enables replay and event sourcing
- Multiple independent consumer groups each get the full stream
- Strong ordering within a partition

**Kafka weaknesses:**
- More complex to operate than RabbitMQ
- No per-message routing (pub/sub only; no content-based routing)
- Consumers poll; no push to consumers

### RabbitMQ

RabbitMQ is a traditional message broker implementing AMQP. Producers send to an **exchange**, which routes messages to **queues** based on routing rules (direct, fanout, topic, headers). Consumers receive messages pushed from a queue.

**RabbitMQ strengths:**
- Flexible routing (route by message type, header, pattern)
- Per-message acknowledgment and requeue
- Push-based delivery (lower consumer latency)
- Priority queues, delayed messages, time-to-live per message

**RabbitMQ weaknesses:**
- Messages are deleted after acknowledgment (no replay)
- Lower throughput than Kafka at scale
- Stateful: RabbitMQ memory usage grows with unprocessed messages

### When to use which

| Scenario | Recommendation |
| --- | --- |
| Event streaming, replay, audit log | Kafka |
| High-throughput telemetry, log aggregation | Kafka |
| Task queues, work distribution | RabbitMQ or SQS |
| Complex routing by message type | RabbitMQ |
| Microservice integration on AWS | SQS (queue) + SNS (pub/sub) |

## Code: producer/consumer pattern

```python
import queue
import threading
import time
import random

# Simple in-process queue (conceptual; production uses Redis, Kafka, etc.)
task_queue = queue.Queue(maxsize=100)
dlq = queue.Queue()

def producer():
    for i in range(20):
        task = {"id": i, "payload": f"order_{i}"}
        task_queue.put(task)
        print(f"Produced: {task['id']}")
        time.sleep(0.1)

def consumer(worker_id, max_retries=3):
    while True:
        try:
            task = task_queue.get(timeout=3)
        except queue.Empty:
            print(f"Worker {worker_id}: queue drained, stopping")
            break

        retries = 0
        while retries < max_retries:
            try:
                # Simulate occasional failure
                if random.random() < 0.1:
                    raise ValueError("Transient error")
                print(f"Worker {worker_id} processed task {task['id']}")
                task_queue.task_done()
                break
            except ValueError:
                retries += 1
                time.sleep(0.2 * retries)
        else:
            print(f"Worker {worker_id}: task {task['id']} sent to DLQ")
            dlq.put(task)
            task_queue.task_done()

# Run producer and 3 concurrent consumers
threads = [threading.Thread(target=producer)]
threads += [threading.Thread(target=consumer, args=(i,)) for i in range(3)]
for t in threads:
    t.start()
for t in threads:
    t.join()

print(f"DLQ size: {dlq.qsize()}")
```

## Subtopics

- [Kafka](./kafka/), log segments, sequential writes, page cache, zero-copy, ISR replication, consumer groups, and KRaft

## References

- [Designing Data-Intensive Applications, Kleppmann, Chapter 11](https://dataintensive.net/)
- [Kafka documentation](https://kafka.apache.org/documentation/)
- [RabbitMQ tutorials](https://www.rabbitmq.com/tutorials)
- [AWS SQS vs SNS vs EventBridge](https://docs.aws.amazon.com/whitepapers/latest/aws-messaging-overview/aws-messaging-services.html)

## Related topics

- [Scalability](../scalability/), queues absorb write spikes and decouple services for independent scaling
- [Databases at Scale](../databases/), queues buffer high-volume writes before they hit the database
- [API Design](../api-design/), async APIs (202 Accepted + polling) communicate work submitted to a queue
- [Rate Limiting](../rate-limiting/), queues can implement rate limiting by controlling consumer throughput
