---
title: Circuit Breaker and Resilience Patterns
description: "The circuit breaker state machine, bulkhead isolation, retry with exponential backoff, timeout strategies, and how these patterns compose to make distributed systems resilient to partial failure."
parent: system-design
tags: [system-design, circuit-breaker, resilience, distributed-systems]
status: draft
created: 2026-05-06
updated: 2026-05-06
---

In a distributed system, any service call can fail. The network can drop packets, a downstream service can crash, a database can slow down. A system that does not handle these failures gracefully will fail entirely when any dependency has a problem. Resilience patterns -- circuit breakers, bulkheads, timeouts, retries -- are the building blocks that let a system degrade gracefully instead of failing completely.

## The failure cascade problem

Consider a checkout service that calls a payment service, which calls a fraud detection service. The fraud detection service becomes slow (a query is running long). The payment service calls start timing out. The checkout service starts queuing up requests waiting for payment service responses. Threads pile up. Memory fills. The checkout service crashes.

This is a **failure cascade**: one slow dependency takes down services that are otherwise healthy.

```
[Checkout] --> [Payment Service (healthy)] --> [Fraud Detection (slow)]
                    |
                    v
          Thread pool exhausted waiting for slow responses
                    |
                    v
          [Checkout] crashes too
```

The circuit breaker, bulkhead, and timeout patterns each address a different part of this failure mode.

## Timeouts

The simplest resilience pattern: every outbound call has a deadline. If the call does not complete within the deadline, fail fast and return an error.

```python
import requests

def call_payment_service(order_id: str) -> dict:
    try:
        response = requests.post(
            "http://payment-service/charge",
            json={"order_id": order_id},
            timeout=(2.0, 5.0)  # (connect timeout, read timeout) in seconds
        )
        response.raise_for_status()
        return response.json()
    except requests.Timeout:
        raise ServiceUnavailableError("payment service timeout")
    except requests.ConnectionError:
        raise ServiceUnavailableError("payment service unreachable")
```

**Two-part timeout**: set a connection timeout (how long to wait to establish the connection) and a read timeout (how long to wait for the response after connecting) separately. A tight connect timeout (1-2 seconds) catches network issues quickly. A longer read timeout (5-30 seconds) allows slow but valid operations to complete.

**Choosing timeout values**: the timeout should be slightly longer than the p99 latency of the downstream service under normal load. If the payment service normally responds in <2 seconds at p99, a 5-second timeout gives headroom for occasional slowness without waiting indefinitely.

## Retry with exponential backoff and jitter

Transient failures (network blip, momentary overload) often resolve on retry. But naive retry (retry immediately, infinite times) can amplify load on an already-struggling service.

**Exponential backoff**: wait longer between each retry.
**Jitter**: add randomness to the wait time to spread out retries from multiple clients.

```python
import time
import random

def call_with_retry(fn, max_retries: int = 3, base_delay: float = 0.5):
    last_error = None
    for attempt in range(max_retries + 1):
        try:
            return fn()
        except TransientError as e:
            last_error = e
            if attempt == max_retries:
                break
            # Exponential backoff with full jitter
            delay = base_delay * (2 ** attempt)
            jitter = random.uniform(0, delay)
            time.sleep(jitter)
    raise last_error

# Retry policy:
# Attempt 0: immediate
# Attempt 1: wait 0-0.5 seconds
# Attempt 2: wait 0-1.0 seconds
# Attempt 3: wait 0-2.0 seconds
# Give up
```

**What to retry**: only retry idempotent operations (GET, PUT, DELETE). Never blindly retry POST without an idempotency key -- you may create duplicate resources or charges.

**Retry budget**: cap the total time spent retrying. If your SLO is a 2-second response time, spending 10 seconds retrying fails the SLO regardless of whether the retry eventually succeeds.

## Circuit breaker

The circuit breaker prevents a failing service from being called repeatedly when it is clearly down or degraded. It has three states:

```
CLOSED (normal operation)
  |
  | Failure rate exceeds threshold (e.g., 50% failures in last 60 seconds)
  v
OPEN (stop calling the downstream service)
  |
  | After a timeout period (e.g., 30 seconds)
  v
HALF-OPEN (allow a small number of test requests)
  |
  +-- Success: return to CLOSED
  +-- Failure: return to OPEN
```

**CLOSED state**: normal operation. Monitor failure rate. If failures exceed the threshold, trip to OPEN.

**OPEN state**: fail fast. Do not call the downstream service at all. Return an error or a fallback immediately. This prevents threads from piling up waiting for a service that is down.

**HALF-OPEN state**: allow a limited number of requests through to test if the downstream service has recovered. On success, return to CLOSED. On failure, return to OPEN.

```python
import time
from enum import Enum

class State(Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"

class CircuitBreaker:
    def __init__(self, failure_threshold=5, recovery_timeout=30, half_open_max=3):
        self.state = State.CLOSED
        self.failure_count = 0
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self.half_open_max = half_open_max
        self.half_open_count = 0
        self.last_failure_time = None

    def call(self, fn):
        if self.state == State.OPEN:
            if time.time() - self.last_failure_time > self.recovery_timeout:
                self.state = State.HALF_OPEN
                self.half_open_count = 0
            else:
                raise CircuitOpenError("circuit is open -- not calling downstream")

        if self.state == State.HALF_OPEN and self.half_open_count >= self.half_open_max:
            raise CircuitOpenError("half-open probe limit reached")

        try:
            result = fn()
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise e

    def _on_success(self):
        if self.state == State.HALF_OPEN:
            self.state = State.CLOSED
            self.failure_count = 0
        self.failure_count = 0

    def _on_failure(self):
        self.failure_count += 1
        self.last_failure_time = time.time()
        if self.state == State.HALF_OPEN or self.failure_count >= self.failure_threshold:
            self.state = State.OPEN
```

**Fallback strategies** when the circuit is open:
- Return a cached response (stale but better than an error)
- Return a default/empty response (feed with no personalization, cart without promo codes)
- Return an error and let the client retry later
- Queue the request for async processing when the service recovers

## Bulkhead

The bulkhead pattern isolates resources so that a failure in one component cannot exhaust the resources of another.

Named after the watertight compartments in a ship's hull: if one compartment floods, the others remain sealed, and the ship stays afloat.

**Thread pool bulkhead**: each downstream service gets its own thread pool. A slow payment service exhausts the payment thread pool but cannot exhaust the fraud-detection thread pool.

```python
from concurrent.futures import ThreadPoolExecutor

# Separate thread pools per downstream service
payment_pool = ThreadPoolExecutor(max_workers=10, thread_name_prefix="payment")
fraud_pool = ThreadPoolExecutor(max_workers=5, thread_name_prefix="fraud")
inventory_pool = ThreadPoolExecutor(max_workers=20, thread_name_prefix="inventory")

def checkout(order):
    # These pools cannot starve each other
    payment_future = payment_pool.submit(call_payment_service, order)
    fraud_future = fraud_pool.submit(call_fraud_service, order)
    inventory_future = inventory_pool.submit(call_inventory_service, order)

    payment_result = payment_future.result(timeout=5)
    fraud_result = fraud_future.result(timeout=5)
    inventory_result = inventory_future.result(timeout=5)
    return process_results(payment_result, fraud_result, inventory_result)
```

**Semaphore bulkhead**: instead of separate thread pools, use semaphores to limit concurrent calls to each service. Simpler to implement and does not require managing threads.

**[Kubernetes](../../ops/kubernetes/) resource limits**: at the container level, CPU and memory limits per service are a bulkhead -- one service cannot consume all node resources.

## How these patterns compose

In production, these patterns layer on top of each other:

```
Outbound call
  |
  +-- [Timeout: 5 seconds]
        |
        +-- [Retry: up to 3 times with backoff]
              |
              +-- [Circuit Breaker: fail fast if too many errors]
                    |
                    +-- [Bulkhead: limited thread pool per dependency]
                          |
                          +-- Actual downstream service call
```

The ordering matters:
1. Check circuit breaker first (fail fast if open)
2. Acquire bulkhead semaphore/thread (bound concurrency)
3. Start timeout timer
4. Make the call
5. On success, report to circuit breaker
6. On failure, report to circuit breaker, retry if appropriate

Resilience4j (Java) and pybreaker (Python) implement this composition.

## Key takeaways

**Timeouts are mandatory, not optional.** Every external call without a timeout is a potential thread leak. Set timeouts at every layer (HTTP client, DB connection, cache client) based on the p99 latency of the downstream service.

**The circuit breaker protects you from the failure cascade.** Without it, a slow downstream service exhausts your thread pool through accumulated timeouts. The circuit breaker converts a slow failure into a fast failure, preserving the capacity of the calling service.

**Bulkheads convert total failure into partial degradation.** With bulkheads, a dead payment service degrades checkout -- but does not take down order history, product search, or user profiles. This is the difference between "payment is down" and "everything is down."

**Fallbacks are a product decision.** When a circuit is open, what should the user see? A cached price? An error message? The answer comes from product requirements, not engineering. Clarify this in a real [system design](../) conversation.

**Exponential backoff with jitter is not optional at scale.** Without jitter, all clients retry at the same time after the same backoff interval, creating synchronized retry spikes (thundering herd). Jitter spreads them out.

## References

- [Netflix Hystrix (now retired, concepts still relevant)](https://github.com/Netflix/Hystrix/wiki/How-it-Works)
- [Resilience4j documentation](https://resilience4j.readme.io/)
- [Release It!, Michael Nygard -- the book that popularized circuit breakers](https://pragprog.com/titles/mnee2/release-it-second-edition/)
- [AWS: Implementing the Circuit Breaker pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/circuit-breaker.html)

## Related topics

- [Microservices vs Monolith](../microservices/), the context in which circuit breakers become necessary
- [Saga Pattern](../saga-pattern/), handling distributed transaction failures
- [Load Balancing](../load-balancing/), health checks remove failed servers before circuit breakers are needed
- [API Design](../api-design/), retry-safe API design with idempotency keys
