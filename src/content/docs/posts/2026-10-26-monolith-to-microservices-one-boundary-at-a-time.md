---
title: "Monolith to microservices, one boundary at a time"
description: "A store migration explains service boundaries, transactional outboxes, safe retries, sagas, and eventual consistency through checkout, notifications, inventory, and search."
date: 2026-10-26
tags: [system-design, microservices, distributed-systems, architecture]
canonical: https://waggertron.github.io/tech-learning/posts/2026-10-26-monolith-to-microservices-one-boundary-at-a-time/
---

A store takes 20 seconds to finish checkout because it waits for a confirmation email. The team wants to split its application into microservices. Where should it start?

Notifications looks promising. Inventory also looks tempting because orders, payments, and stock are tightly connected. But those connections represent different requirements. Email can arrive after a purchase. Reserving the last ticket cannot wait until after we promise it to two customers.

That difference determines how difficult each extraction will be.

## Start with the problem the split will solve

A **monolith** is an application deployed as one unit. It can contain well-organized modules with clear interfaces. Having one deployment does not require tangled code.

**Microservices** put business capabilities in separately deployable services. Calls between them cross a network, and each service controls access to the data it owns. Separate ownership does not necessarily require a separate physical database server for every service.

Our store starts here:

```text
[ Orders | Payments | Inventory | Notifications ]
                       |
                 [ One database ]
```

Splitting it can let teams deploy independently or scale a busy capability separately. It also introduces network failures, retries, delayed updates, and more things to operate.

“Orders and Inventory are coupled” is an observation, not yet a reason to extract Inventory. Orders need available stock because of the business rules. Separate deployments do not remove that relationship.

Useful migration goals are concrete: shorten checkout latency, let the search team release independently, or scale inventory traffic without scaling the entire application. The proposed boundary needs to help achieve that goal.

## Extracting Notifications: remove email from the waiting path

In the original checkout flow, the customer waits for everything:

```text
Create order --> Reserve stock --> Complete payment --> Send email
                                                          |
                                                 Return confirmation
```

The exact ordering of stock and payment depends on the purchase workflow. The issue here is that email delivery delays the response after the purchase has already succeeded.

Checkout does not need an email provider's answer before confirming the purchase. It needs a durable way to request delivery later.

```text
Complete purchase --> Record notification work --> Return confirmation
                                |
                                v
                         Send email later
```

This is **asynchronous work**: the customer-facing request does not wait for the email to finish.

It can run in a background worker within the monolith. Asynchronous processing and service extraction are separate decisions. If latency is the only problem, a worker may be enough.

Suppose the team also needs to deploy and operate notification delivery independently. A separate Notifications service becomes useful:

```text
[ Checkout + Orders ] --> Queue --> [ Notifications ] --> Email provider
```

A **queue** holds work until a consumer can process it. If Notifications is unavailable for an hour, notification work accumulates while checkout continues, provided the queue and upstream storage have sufficient capacity and retention.

The backlog still needs attention. Recovery requires enough processing capacity to catch up, and failed deliveries need a retry or investigation path. The outage has stopped being a direct checkout dependency, but it has not disappeared.

## The missing-event problem

Putting a queue in the diagram leaves a dangerous gap:

```text
1. Save the completed order in the database.
2. Publish OrderPlaced to the queue.
```

What happens if the application crashes between those steps? The purchase exists, but Notifications never learns about it.

Publishing first creates the opposite risk: the notification can describe an order whose database transaction later fails.

We need to couple saving the order with saving the obligation to publish its event.

## The transactional outbox: keep the necessary coupling local

An **outbox** is a table of events awaiting publication. The order update and outbox entry commit in one database transaction:

```text
One local database transaction:
  Save completed order 456
  Save event evt-123: OrderPlaced(order_id=456)
  Commit both
```

Both records commit, or neither does. A separate **relay** reads committed outbox entries, publishes them, and records publication progress. This is the [transactional outbox pattern](https://microservices.io/patterns/data/transactional-outbox.html).

```text
Monolith database
+-----------------+
| Orders          |
| Outbox          | --> Relay --> Queue --> Notifications
+-----------------+
```

If the application crashes after committing, the event remains available for recovery. Checkout waits for its local database transaction rather than email delivery.

The outbox records an obligation. Eventual delivery still depends on a functioning relay, broker, and recovery process.

This is deliberate coupling: keep the order and its event atomic locally, then communicate across the service boundary asynchronously.

## Retries can deliver the same event twice

The relay can publish an event and crash before recording that publication. After restarting, it publishes the same event again.

```text
Publish evt-123 --> Succeeds
Record progress --> Crash
Restart         --> Publish evt-123 again
```

The customer could receive two emails.

**Idempotent processing** means repeating an operation has the same business effect as processing it once. For database effects, a consumer can atomically record an event ID alongside its changes, using a uniqueness constraint to reject concurrent duplicates. This is the [idempotent consumer pattern](https://microservices.io/patterns/communication-style/idempotent-consumer.html).

The ID stays stable across delivery attempts. A duplicate delivery of `evt-123` represents the same event, not another purchase.

### Email adds another transaction boundary

Sending email and recording completion locally are separate operations:

```text
Send email              --> Succeeds
Record email as sent    --> Crash
Retry                   --> Could send again
```

Recording completion before sending reverses the risk: a crash can suppress an email that was never sent.

A local “already handled” check alone cannot close this gap. If the provider supports idempotent sends, Notifications can reuse a stable key for the same intended email, within the provider's documented scope and retention window. For multiple recipients or message types, the key must distinguish those separate sends.

Without that support, the design needs an explicit choice about duplicate risk, loss risk, and reconciliation. A queue alone does not guarantee one email per purchase.

## Inventory is harder because checkout needs an authoritative answer

Suppose one concert ticket remains:

```text
Customer A checks availability --> 1 ticket
Customer B checks availability --> 1 ticket
Customer A pays
Customer B pays
```

Both availability checks can be accurate when made. Checking stock does not reserve it.

Inside the monolith, an appropriate database transaction can combine order creation with stock reservation. A conditional update or suitable locking prevents two buyers from claiming the same ticket. Merely wrapping an unsafe check-then-update sequence in a transaction is not enough at every isolation level.

After extraction, Inventory can still enforce that local rule in its own database. The additional difficulty is coordinating that result with Orders and Payments.

```text
[ Orders ] -- Reserve ticket --> [ Inventory ]
```

Notifications could wait until after checkout. Inventory needs to resolve the reservation before the purchase is confirmed.

## A timeout does not prove an operation failed

Orders asks Inventory to reserve a ticket. Inventory commits the reservation, but the response gets lost:

```text
Orders                              Inventory
   | -- Reserve ticket ----------------> |
   |                                     | Reservation commits
   | <---------- Success response -----X | Response is lost
   |
   | Times out
```

Orders knows it did not receive an answer. It does not know whether Inventory acted.

A fresh reservation request could reserve another unit. For the last-ticket case, it could return “sold out” even though this customer's original reservation already succeeded.

Give the reservation operation a stable identity:

```text
First attempt: Reserve(reservation_id=123, ticket=A, quantity=1)
Retry:         Reserve(reservation_id=123, ticket=A, quantity=1)
```

Inventory atomically stores the operation ID and result with the reservation. Repeated requests return that result. Concurrent attempts with the same ID need a uniqueness rule so they cannot both perform the action.

The request payload also matters. Reusing `123` for a different ticket or quantity is incompatible reuse and should fail clearly. Generating a fresh ID on every retry defeats deduplication.

The possible duplicate here is a **reservation**, not necessarily an order. Each business operation needs its own identity and retry behavior.

## When payment fails: compensate for the reservation

Now Inventory has reserved the ticket, but Payments declines the charge. The customer has not completed the purchase, so the ticket needs to become available again.

```text
Reserve ticket --> Succeeds
Charge payment --> Declined
Release ticket --> Makes the ticket available again
```

Releasing the reservation is a **compensating action**: a new business operation that counteracts an earlier committed operation. A [saga](https://microservices.io/patterns/data/saga.html) coordinates local transactions across services and the compensations needed when the business workflow cannot complete.

Compensation is not a database rollback. Other operations may have observed the reservation, and releasing it can itself fail or time out. The coordinator needs durable progress, safe retries, and a recovery path.

Reservation expiry can limit abandoned holds, but it also needs coordination with payment completion. A paid order cannot safely assume an expired reservation still holds its ticket.

This example uses an explicit payment decline. A payment timeout is an unknown result, just like the lost reservation response. Recovering its outcome comes before treating the payment as declined.

## Compensation follows the business outcome

Suppose payment succeeds, the ticket is allocated, and the confirmation email fails. Refunding the payment and releasing the ticket would undo a valid purchase because of a delivery problem.

Retry the email instead.

| Failure | Business outcome | Recovery |
| --- | --- | --- |
| Payment explicitly declined | Purchase cannot complete | Release the reservation |
| Reservation response lost | Reservation outcome unknown | Retry or query using the same operation ID |
| Email delivery failed | Purchase remains valid | Retry delivery |

Not every technical failure needs compensation. The recovery action depends on what has happened to the purchase.

## Search: another boundary where delay can be acceptable

Search gives us a different example. A **search index** is a copy of product data organized for finding relevant results quickly.

```text
Catalog and inventory changes --> Events --> Search index
                                                 |
Customer searches -------------------------------+
```

Updates take time to reach that copy. **Eventual consistency** means the copy catches up as updates are successfully processed, rather than changing at exactly the same instant as its source.

If the product requirements tolerate a short delay, Search can be a useful early extraction. It can scale and deploy independently while consuming updates from the systems that own product and stock data.

A search result might show “in stock” after the last item has been reserved. At checkout, Inventory's authoritative reservation decision determines whether the purchase can proceed. Search is a discovery view, not a promise that stock has been allocated.

Acceptable delay is specific to the operation. A stale search result can be tolerable while a stale decision about selling the last ticket is not. A requirement to hide restricted products immediately would make this search boundary more demanding.

## Migrate one capability at a time

These examples support incremental migration. Keep the existing application working while moving a capability behind a defined interface, as in the [Strangler Fig approach](https://martinfowler.com/bliki/StranglerFigApplication.html).

For Notifications, introduce durable event production, run the consumer without sending real emails to compare its decisions, then switch delivery ownership. Only one path should actively send each intended email. Retire the old path after the new one has demonstrated correct behavior.

An Inventory migration needs more preparation: existing reservations, in-flight purchases, and authoritative stock writes need a clear owner during cutover. Sending requests back to old code is not a complete rollback if only the new service has current data.

The migration does not have to end with every module becoming a service. A modular monolith can retain the capabilities that benefit from local transactions while Notifications or Search runs separately.

The useful question at each boundary is concrete: what does the caller need to know now, what may happen later, and how will the workflow recover if only part of it succeeds?

## References

- Chris Richardson's [transactional outbox](https://microservices.io/patterns/data/transactional-outbox.html), [idempotent consumer](https://microservices.io/patterns/communication-style/idempotent-consumer.html), and [saga](https://microservices.io/patterns/data/saga.html) patterns explain durable publication, repeated delivery, and coordination across local transactions.
- Martin Fowler's [Strangler Fig](https://martinfowler.com/bliki/StranglerFigApplication.html) describes replacing existing behavior gradually while the surrounding system continues to operate.

## Related topics

- [Microservices vs Monolith](../../topics/system-design/microservices/), deployment boundaries, domain ownership, and modular monoliths.
- [Message Queues](../../topics/system-design/message-queues/), buffering, delivery guarantees, and consumers.
- [Saga Pattern](../../topics/system-design/saga-pattern/), compensation and coordination across services.
- [API Design](../../topics/system-design/api-design/), operation contracts and idempotency.
