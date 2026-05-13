---
title: Saga Pattern
description: "Distributed transactions across microservices without two-phase commit: choreography vs orchestration, compensating transactions, the pivotal transaction concept, and how to handle partial failures without rolling back everything."
parent: system-design
tags: [system-design, saga-pattern, distributed-systems, microservices]
status: draft
created: 2026-05-06
updated: 2026-05-06
---

A saga is a sequence of local transactions across multiple services, each publishing events that trigger the next step. If any step fails, compensating transactions undo the work done by previous steps. Sagas replace distributed two-phase commit (2PC) as the mechanism for maintaining consistency across service boundaries.

## Why not two-phase commit?

In a traditional database, a transaction spanning multiple tables is atomic: either all changes commit or none do. Across microservices, each service owns its own database. A payment service and an inventory service cannot share a database transaction.

Two-phase commit (2PC) extends ACID transactions across distributed systems using a coordinator:
1. **Prepare phase**: coordinator asks all participants to prepare (lock resources, validate)
2. **Commit phase**: if all say yes, coordinator sends commit to all

**Problems with 2PC in microservices**:
- The coordinator is a single point of failure
- All participants must lock resources during the prepare phase -- high latency
- If the coordinator crashes after prepare but before commit, participants wait indefinitely (blocking)
- Forces all services to use a compatible transaction protocol (not practical across polyglot services)

Sagas avoid all of these problems by giving up the synchronous atomic guarantee in exchange for eventual consistency.

## What a saga is

A saga breaks a multi-step business process into a sequence of local transactions:

```
Book a flight + hotel + car rental (travel booking saga):

Step 1: Reserve flight  (Flight Service)
Step 2: Reserve hotel   (Hotel Service)
Step 3: Reserve car     (Car Service)
Step 4: Charge payment  (Payment Service)

If step 3 fails:
  Compensate step 2: cancel hotel reservation
  Compensate step 1: cancel flight reservation
  Return error to user
```

Each step is a local transaction within one service. If a step fails, **compensating transactions** undo the successfully completed steps in reverse order.

## Compensating transactions

A compensating transaction is the inverse of a forward transaction. For every step in a saga, you must define its compensating action:

| Forward action | Compensating action |
| --- | --- |
| Reserve flight | Cancel reservation |
| Charge customer | Issue refund |
| Deduct inventory | Add inventory back |
| Send email | Cannot unsend (impure, but acceptable) |
| Create user account | Deactivate account |

**Not everything can be perfectly compensated.** An email that was sent cannot be unsent. A refund is not the same as "as if the charge never happened" (it creates a transaction record). These are "impure" compensations -- they undo the business effect as best they can, even if not perfectly.

## Choreography: event-driven coordination

In a choreography-based saga, each service reacts to events published by the previous service. There is no central coordinator.

```
Order Service       Payment Service      Inventory Service     Shipping Service
      |                    |                     |                     |
 OrderCreated              |                     |                     |
      +-----------------> [Kafka]                |                     |
                            |                    |                     |
                   PaymentInitiated              |                     |
                            +----------------> [Kafka]                |
                                                 |                    |
                                        InventoryReserved             |
                                                 +-----------------> [Kafka]
                                                                      |
                                                               ShipmentScheduled
```

Each service subscribes to relevant topics and publishes its result as an event.

```python
# Payment service subscribes to OrderCreated events
def handle_order_created(event: dict):
    order_id = event["order_id"]
    amount = event["amount"]

    try:
        payment = charge_payment(order_id, amount)
        kafka.publish("PaymentSucceeded", {
            "order_id": order_id,
            "payment_id": payment.id,
        })
    except PaymentFailed as e:
        kafka.publish("PaymentFailed", {
            "order_id": order_id,
            "reason": str(e),
        })
```

**Rollback via compensating events**:

```python
# Inventory service subscribes to PaymentFailed events
def handle_payment_failed(event: dict):
    order_id = event["order_id"]
    # Release the inventory reservation made for this order
    release_inventory_reservation(order_id)
    kafka.publish("InventoryReleased", {"order_id": order_id})
```

**Pros of choreography**:
- No central coordinator -- no single point of failure
- Services are loosely coupled (they only know about events, not each other)
- Natural fit for event-driven architectures

**Cons of choreography**:
- No single place to see the full saga state -- distributed across service logs
- Hard to add a step without changing multiple services' event subscriptions
- Cycles and complex compensations become difficult to reason about

## Orchestration: central coordinator

In an orchestration-based saga, a central **saga orchestrator** directs each service to perform its step and handles failures.

```python
class BookingOrchestrator:
    def execute(self, booking_request: dict) -> dict:
        saga_id = uuid.uuid4()
        completed_steps = []

        try:
            # Step 1: reserve flight
            flight = flight_service.reserve(booking_request["flight_id"])
            completed_steps.append(("flight", flight.reservation_id))

            # Step 2: reserve hotel
            hotel = hotel_service.reserve(booking_request["hotel_id"])
            completed_steps.append(("hotel", hotel.reservation_id))

            # Step 3: reserve car
            car = car_service.reserve(booking_request["car_id"])
            completed_steps.append(("car", car.reservation_id))

            # Step 4: charge payment
            payment = payment_service.charge(booking_request["total_amount"])
            completed_steps.append(("payment", payment.id))

            return {"status": "confirmed", "saga_id": saga_id}

        except Exception as e:
            # Compensate in reverse order
            self._compensate(completed_steps)
            raise BookingFailedError(str(e))

    def _compensate(self, completed_steps: list):
        for service_name, resource_id in reversed(completed_steps):
            try:
                if service_name == "flight":
                    flight_service.cancel(resource_id)
                elif service_name == "hotel":
                    hotel_service.cancel(resource_id)
                elif service_name == "car":
                    car_service.cancel(resource_id)
                elif service_name == "payment":
                    payment_service.refund(resource_id)
            except Exception as e:
                # Log and alert -- compensation itself can fail
                alert(f"Compensation failed for {service_name}:{resource_id}: {e}")
```

**Pros of orchestration**:
- Single place to see and debug the full saga flow
- Easier to add, remove, or reorder steps
- Explicit state machine is easier to reason about for complex flows

**Cons of orchestration**:
- Orchestrator is a central component (though not a SPOF if designed for HA)
- Risk of orchestrator becoming a "god service" that knows too much about other services

**Temporal.io**: a modern orchestration platform that handles durability (saga state survives crashes), retries, and timeouts natively. Widely used for complex, long-running business workflows.

## The pivotal transaction

In a saga, the **pivotal transaction** is the step after which compensation becomes impractical or impossible. Everything before the pivot can be cleanly rolled back. Everything after cannot.

In a payment saga, the payment charge is typically the pivot. Before charging, you can cancel reservations cleanly. After charging, you can refund but you cannot pretend the charge never happened.

**Design rule**: move the pivotal transaction as late in the saga as possible. This minimizes the number of "irreversible" steps and reduces the window during which the system is in an inconsistent state.

## Isolation problems in sagas

ACID transactions provide isolation: concurrent transactions cannot see each other's uncommitted changes. Sagas do not -- the intermediate state (flight reserved but payment not yet charged) is visible to other processes.

**Dirty reads**: another process reads the "reserved flight" and assumes the booking is complete, before the payment step confirms it.

**Lost updates**: two sagas both read "5 seats available" and both reserve a seat, but the actual count is only 5 -- one saga should have failed.

Mitigations:
- **Semantic locking**: mark records as "pending" or "in-flight" until the saga completes. Other processes see the pending state and can choose to wait or fail.
- **Commutative updates**: design data updates so order does not matter (e.g., decrement a counter atomically rather than read-modify-write).
- **Pivotal transaction ordering**: design the saga so that the most contention-prone resource is reserved early (fail fast) or checked at the pivotal transaction.

## Key takeaways

**Sagas give you eventual consistency, not ACID consistency.** Intermediate saga states are visible to other processes. Design your system to tolerate this: use "pending" states, idempotent compensations, and defensive read logic.

**Choreography is simpler for simple flows. Orchestration is better for complex ones.** Two or three steps with clear trigger events are fine with choreography. Five or more steps with conditional branches, timeouts, and complex compensations should use an orchestrator.

**Every forward step must have a defined compensation.** If you cannot define the compensation before implementing the step, you have not thought through the failure mode. Compensating transactions are first-class design artifacts, not afterthoughts.

**Compensations can fail.** A refund to a cancelled credit card fails. A hotel cancellation API is down. You must handle compensation failures: retry with backoff, escalate to a DLQ, alert a human. Never assume compensation succeeds.

**The pivotal transaction design principle is worth internalizing.** Putting irreversible steps last is a heuristic that applies broadly: in payments, in data migrations, in any workflow with mixed reversible and irreversible steps.

## References

- [Sagas, Hector Garcia-Molina and Kenneth Salem (1987 paper)](https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf)
- [Microservices Patterns, Chris Richardson, Chapter 4](https://microservices.io/patterns/data/saga.html)
- [Temporal.io: durable workflow orchestration](https://temporal.io/)
- [AWS Step Functions for saga orchestration](https://docs.aws.amazon.com/step-functions/latest/dg/concepts-saga.html)

## Related topics

- [Microservices vs Monolith](../microservices/), the context that makes sagas necessary
- [Event Sourcing and CQRS](../event-sourcing/), events as the coordination mechanism in choreography-based sagas
- [Message Queues](../message-queues/), Kafka as the event bus for choreography
- [Distributed Locking](../distributed-locking/), an alternative coordination mechanism for shorter critical sections
