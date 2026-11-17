---
title: "Case Study: Hyper Low Latency Patient Info Lookup for Telecom Data Enrichment"
description: "Size an AWS patient lookup service for ten million daily reads, fivefold capacity, and a 100 ms p99 target, then define the tests needed to validate it."
parent: case-studies
tags: [system-design, case-studies, interviews, aws, dynamodb, capacity-planning, latency]
status: draft
created: 2026-11-16
updated: 2026-11-16
---

A clinic employee enters a phone number and needs the matching patient's authorized details. The service handles ten million lookups per day during a sixteen-hour business window. It needs five times the average business-hours capacity and a client-observed p99 latency at or below 100 ms.

That sounds like a database-selection question. The first decisions are about what a lookup means, who may see the result, and which traffic and failure conditions the target covers. Those answers determine the access pattern, capacity, and validation plan.

This case study develops a starting design: an Application Load Balancer, a Go service on ECS Fargate, and two DynamoDB tables. The capacity calculations are estimates. The per-task throughput and latency allocations are hypotheses to test, not measured results.

## 1. Define the lookup and its targets

An authenticated caller can search within an authorized tenant. A phone number identifies a possible association with a patient, not the patient's permanent identity. Numbers can change, be reassigned, or belong to several people.

| Requirement | Working assumption | Design consequence |
| --- | --- | --- |
| Caller permissions | Staff can access only permitted tenants and patient records | Authorize every request and result on the server |
| Search | Exact phone lookup with known country context | Normalize before looking up the association |
| Daily traffic | Ten million reads during 5 a.m. to 9 p.m. Pacific | Divide by sixteen hours, not twenty-four |
| Capacity | Five times the business-hours average | Derive a peak design rate from that average |
| Latency | p99 at or below 100 ms for successful lookups | Measure from the client through full response receipt |
| Availability | Proposed objective: 99.9% successful eligible requests | Count errors and timeouts separately from successful latency |
| Response payload | 10 KB on average | Budget transfer time and bandwidth |
| Freshness | A changed association must not silently return the wrong patient | Validate the association across directory and patient reads |

Define eligible requests and the measurement window with the interviewer or product owner. Expected no-match and ambiguous-match outcomes need explicit semantics. They should not disappear from monitoring or become misleading server failures.

The caller's location remains an input. A nearby service client and a browser across the country have different network costs. A 100 ms target is conditional on the agreed caller geography, load, and connection behavior.

Five times the daily active-window average also differs from five times the busiest measured minute. Obtain historical peaks or agree on a burst shape. No finite fleet guarantees 100 ms for every request through arbitrary network failures.

## 2. Translate traffic into requests per second

```text
Active seconds/day = 16 x 60 x 60 = 57,600
Average lookups/sec = 10,000,000 / 57,600 = 173.61
Required capacity = 173.61 x 5 = 868.06 lookups/sec
Rounded design target = 1,000 lookups/sec
```

| Traffic level | Lookups/second | Lookups/minute |
| --- | ---: | ---: |
| Business-hours average | 174 | 10,417 |
| Required fivefold capacity | 868 | 52,083 |
| Rounded design target | 1,000 | 60,000 |

Round upward for sizing while keeping the original requirement visible. Designing for 1,000 lookups/second adds about 15% over the exact fivefold requirement. It does not establish that an opening-time burst will fit.

A lookup will perform two sequential database reads. At the rounded target, that is 2,000 read operations/second before misses, retries, disambiguation, or extra authorization reads. Database operations and consumed capacity units are different quantities.

## 3. Separate bandwidth from stored data

Use decimal units for payload and network estimates: 1 KB is 1,000 bytes, 1 MB is one million bytes, and 1 GB is one billion bytes.

```text
Daily response payload = 10,000,000 x 10 KB = 100 GB/day

At exact fivefold capacity:
868.06/sec x 10 KB = 8.68 MB/sec = 69.4 megabits/sec

At rounded design capacity:
1,000/sec x 10 KB = 10 MB/sec = 80 megabits/sec
10 MB/sec x 3,600 seconds = 36 GB/hour
```

Add protocol overhead, incoming requests, and other traffic. A hundred gigabytes of daily response payload does not imply a hundred gigabytes of new stored records. The same patient can be read repeatedly.

```text
Patient storage = distinct patients x average stored record size

1 million patients x 10 KB = 10 GB
10 million patients x 10 KB = 100 GB
```

The distinct-patient count is a separate assumption. Add directory entries, metadata, backups, and any other stored attributes. Writes and retention need their own workload model. Do not multiply DynamoDB storage by an application-managed three-copy factor merely because the service replicates data internally.

## 4. Start with the access pattern

The smallest useful model has a stable patient ID and a phone association scoped to a tenant. Normalization requires country context, such as converting `(415) 555-0123` to `+14155550123`. A normalized phone number remains a search attribute, not proof of identity.

A dedicated directory makes that search an exact primary-key read:

| Table | Primary key components | Relevant attributes |
| --- | --- | --- |
| PhoneDirectory | Partition key: tenant ID; sort key: normalized phone | Patient ID, association version |
| Patients | Partition key: tenant ID; sort key: patient ID | Current phone, association version, patient fields |

This simple schema supports one active match per tenant and phone. The workload calculation assumes that case. If shared numbers are allowed, model bounded candidates or separate association items and require disambiguation before exposing patient details. The extra reads change capacity and latency estimates.

A tenant partition key is convenient for scoping, but concentrates a large tenant's traffic under one logical key. If measurements show tenant skew is a bottleneck, consider distributing exact lookups using a composite partition key such as tenant plus phone for the directory and tenant plus patient ID for records. That changes the available query patterns. Key encoding also needs an unambiguous format.

### Keep an existing database when it fits

If the application already stores patients in PostgreSQL, first test an index on `(tenant_id, normalized_phone)` and a query scoped by authorization. Around 1,000 lookups/second does not by itself justify a database migration. An existing relational model can also simplify constraints and transactions.

DynamoDB is a candidate for a new service with predictable exact-key reads. It trades flexible joins and queries for explicit access-pattern design and managed capacity. Start without a cache so the database path can be tested directly. Add caching when measured latency or cost justifies invalidation and freshness complexity.

### Strong reads do not create a shared snapshot

DynamoDB supports strongly consistent reads on tables. Global secondary indexes support eventual consistency, so a phone GSI does not provide the same freshness behavior. See [AWS read consistency](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html).

Two sequential strong reads can still observe different moments:

```text
Lookup                           Association update
------                           ------------------
Read directory: phone -> A, v7
                                 Change association to B, v8
Read patient A: current state
```

Validate the tenant, phone association, and version before returning a record. Writers need a coordinated update protocol, for example transactional directory and patient updates with conditional version checks. Version validation alone does not repair independently updated items.

On a mismatch, use a bounded reread within the request deadline or return a defined retryable outcome. Do not return a known mismatched record to protect a latency metric. Reads that overlap a change need an agreed freshness contract: validation does not promise the association stays unchanged after the response.

If the product requires an atomic multi-item read, assess transactional reads and redesign the request sequence as needed. The patient key depends on the directory result, and transactional read capacity differs from the nontransactional calculation below. Do not silently reuse the four-unit estimate.

## 5. Calculate database capacity

DynamoDB read accounting uses 4 KiB increments, where 1 KiB is 1,024 bytes. Keep this distinct from decimal response payload units.

Assume the complete directory item fits within 4 KiB and the complete patient item is approximately 10 KiB. Both reads are strongly consistent, nontransactional `GetItem` operations.

```text
Directory read = ceil(item bytes / 4,096) = 1 read unit
Patient read = ceil(10,240 / 4,096) = 3 read units
Successful lookup = 1 + 3 = 4 read units

At 1,000 lookups/sec:
Directory = 1,000 RCU
Patients = 3,000 RCU
```

Read capacity units (RCU) express the provisioned per-second capacity for these operations. AWS documents the [read-capacity calculation](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/read-write-operations.html), including rounding and consistency differences.

Add 25% above the rounded target as an initial capacity margin:

| Table | Required at 1,000 lookups/sec | Proposed provisioned capacity |
| --- | ---: | ---: |
| PhoneDirectory | 1,000 RCU | 1,250 RCU |
| Patients | 3,000 RCU | 3,750 RCU |
| Total | 4,000 RCU | 5,000 RCU |

Capacity belongs to each table. Spare directory units cannot cover patient-table throttling. Include attribute names and metadata when measuring item size. A patient item larger than 12 KiB crosses into four read units. Verify consumption with `ReturnConsumedCapacity` and include retries and candidate reads in the workload.

Table totals also hide skew. AWS documents a physical-partition ceiling of 3,000 read units/second. A hot key or concentrated tenant can throttle before total provisioned capacity is exhausted. Test realistic key distributions rather than assuming adaptive capacity removes every bottleneck. See [AWS partition-key guidance](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html).

On-demand mode is a valid alternative. Check the table's warm throughput, configured maximums, and quotas before testing a sudden peak. Provisioned mode is used here to make the arithmetic and per-table limits explicit, not because this workload requires it.

## 6. Size the application tier for a failure

Choose one Region based on caller proximity. Use an HTTPS Application Load Balancer and keep the Go tasks in private subnets across three Availability Zones. A DynamoDB gateway endpoint provides database access without sending that traffic through NAT. Other outbound dependencies need their own connectivity.

| Component | Starting configuration |
| --- | --- |
| Application tasks | Six ECS Fargate tasks, intended placement of two per AZ |
| Task resources | 1 vCPU, 2 GiB RAM as a benchmark starting point |
| Database | Directory: 1,250 RCU; patients: 3,750 RCU |
| Instrumentation | Client latency, application traces, CloudWatch metrics |

AWS supports the proposed [Fargate CPU and memory combination](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-cpu-memory-error.html). Configure and verify [ECS Availability Zone balancing](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-rebalancing.html). Six desired tasks alone do not prove the intended placement or immediate recovery behavior.

Suppose a representative test establishes a usable capacity of 300 lookups/second per task while meeting the latency objective:

```text
Normal application capacity = 6 x 300 = 1,800 lookups/sec
After losing two tasks in one AZ = 4 x 300 = 1,200 lookups/sec
Required rounded target = 1,000 lookups/sec
```

The 300/task value is hypothetical until benchmarked. Test the fleet with shared dependencies, authorization work, and representative record sizes. Adding tasks cannot fix a saturated database or an excessive network round trip.

Enough surviving capacity does not prove a disruption meets the target. Requests can fail during health detection and redistribution. Test that transition separately from steady operation with four survivors. Removing application tasks in one AZ also does not simulate every dependency affected by a real AZ outage.

Reuse HTTP and SDK connections, bound concurrency and queueing, and fit dependency deadlines within the overall request deadline. Verify tokens locally when the authorization model permits it. Avoid a remote identity-provider call per request unless its latency and failure behavior are included in the design.

Keep tasks healthy before business hours begin. If scheduling overnight reductions, restore capacity early and verify readiness before 5 a.m. Use the `America/Los_Angeles` time zone rather than a fixed UTC offset when the schedule follows Pacific local time. Reactive scaling adds capacity after observing demand, so retain headroom for its response delay.

Authorize tenant and patient access before returning fields. Exclude phone numbers and patient records from ordinary request logs. These controls prevent direct data exposure but do not, by themselves, establish healthcare regulatory compliance.

## 7. Allocate the latency budget

An illustrative client-visible budget is:

| Part of request | Allocation |
| --- | ---: |
| Client network and complete response transfer | 25 ms |
| Load balancer and routing | 5 ms |
| Authentication and authorization | 10 ms |
| Directory read | 10 ms |
| Patient-record read | 15 ms |
| Application processing and serialization | 5 ms |
| Queueing | 5 ms |
| Contingency | 25 ms |
| Total | 100 ms |

These allocations guide engineering decisions. They are not measured AWS latencies or service guarantees. Adding component p99 values does not establish end-to-end p99 because the components' distributions and correlations matter.

The directory and patient reads are sequential because the first supplies the second's key. Independent work can run in parallel, but the response still waits for the slowest required branch. Moving work into a background queue shortens the response only when the product allows delayed completion.

If caller-network time exceeds 25 ms, database capacity will not recover that budget. Measure the intended geography and connection mix, including DNS and TLS when the objective includes new connections.

### Queueing explains the saturation cliff

A request can spend 10 ms executing and 150 ms waiting for a worker or connection. Near a bottleneck's capacity, queueing can dominate response time. Bounded queues, deadlines, headroom, and overload rejection prevent unlimited waiting. Count rejected traffic against the agreed success objective.

Little's Law connects average throughput, mean latency, and average work in flight for a stable system measured over the same boundary:

```text
Average in-flight requests = throughput x mean response time

1,000/sec x 0.040 sec = 40 requests in flight
1,000/sec x 0.100 sec = 100 requests in flight
```

Use the mean, not p99. These figures help reason about concurrency limits and connection pools. They do not imply forty or a hundred operating-system threads, and a database connection pool has a different boundary from a full client request.

## 8. Prove the target with representative load

Use synthetic patient data with representative record sizes, tenants, hot keys, no-match results, ambiguous numbers, and concurrent updates. Test the same authorization behavior as the proposed service.

| Test | Offered load | Question it answers |
| --- | --- | --- |
| Baseline | 174/sec | What does ordinary traffic cost? |
| Fivefold requirement | 870/sec | Does the required capacity meet the objectives? |
| Rounded target | 1,000/sec for at least 30 minutes | Is the capacity margin sustainable? |
| Opening burst | Agreed burst shape | Are tasks ready and queues bounded? |
| Application AZ disruption | 1,000/sec while removing one AZ's tasks | What happens during redistribution and afterward? |
| Soak | Representative sixteen-hour profile | Do resources or latency degrade over time? |
| Stress | Increase beyond 1,000/sec | Which resource saturates first? |

Use an open workload model such as k6's [constant-arrival-rate executor](https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/constant-arrival-rate/). A closed test with fixed users can reduce offered traffic when responses slow, concealing overload. Check [dropped iterations](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/dropped-iterations/), generator capacity, and actual request starts. One iteration equals one lookup only if the test script defines it that way.

The built-in k6 `http_req_duration` includes sending, waiting, and receiving, but excludes initial DNS and connection setup. When the objective includes that work, use a timer spanning the complete client operation and test new connections explicitly. See [k6 metric boundaries](https://grafana.com/docs/k6/latest/using-k6/metrics/reference/).

A passing run needs all of these conditions:

- Achieved request starts match the offered rate without hidden generator drops.
- Client-observed p99 is at or below 100 ms through full response receipt.
- The agreed request success rate is met, including timeouts and overload behavior.
- Returned records and no-match or ambiguous outcomes are correct and authorized.
- Queue depths and resource usage remain stable, with no sustained database throttling.

Record disruption intervals separately so a long steady run cannot hide a short failure. Report distributions for successful reads and relevant outcome classes alongside the aggregate success rate.

DynamoDB's `SuccessfulRequestLatency` excludes network and client work. ALB's `TargetResponseTime` stops when the target begins sending response headers. Neither proves that the caller received a complete 10 KB response within 100 ms. Use [DynamoDB latency metrics](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TroubleshootingLatency.html) and [ALB metrics](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-cloudwatch-metrics.html) to locate delay, then validate the full request from the client.

| Evidence | Next investigation |
| --- | --- |
| Database throttling | Per-table capacity, item sizes, hot keys, retry amplification |
| Rising application queue time | Task capacity, concurrency limits, connection waits |
| High client latency with low backend latency | Geography, DNS/TLS, transfer time |
| High application CPU | Token validation, serialization, application work |
| Delay concentrated after failures | Health detection, redistribution, retry behavior |

## 9. Transfer the estimation method

The same sequence applies to a messaging service. Suppose one million daily active users each perform twenty reads and two writes per day, with a fivefold peak multiplier:

```text
Average reads = 1,000,000 x 20 / 86,400 = 231.5/sec
Average writes = 1,000,000 x 2 / 86,400 = 23.15/sec
Rounded peak reads = 1,200/sec
Rounded peak writes = 120/sec

At three database queries per read:
1,200 x 3 = 3,600 database queries/sec

At 1 KB stored per write:
2,000,000 writes/day x 1 KB = 2 GB/day
One year = 730 GB of logical message data
Three application-managed copies = 2.19 TB before other overhead

At 10 KB per read response:
1,200/sec x 10 KB = 12 MB/sec = 96 megabits/sec
```

If testing establishes 400 usable reads/second per application instance, three cover normal peak reads and four cover the same load with one unavailable. Evaluate writes and shared dependencies separately. The instance figure must come from a representative test under the stated latency objective.

For a 200 ms client-visible target, one possible allocation is 40 ms network, 10 ms routing, 20 ms application processing, 60 ms database work, 20 ms serialization and other work, and 50 ms contingency. At 1,200 requests/second and a measured mean of 100 ms, Little's Law gives 120 average requests in flight.

The transferable sequence is: define the operation and objective, estimate peak reads and writes, calculate storage and bandwidth, expand dependency traffic, size for measured usable capacity and failures, allocate latency, and test the full request.

## Final design and interview answer

```text
Tenant 1 ---- N Patients
Tenant 1 ---- N PhoneDirectory entries
PhoneDirectory entry ---- 1 Patient (single-match assumption)

Caller
  |
  | HTTPS: authenticated tenant-scoped lookup
  v
Application Load Balancer
  |
  +----------+----------+
  v          v          v
AZ A       AZ B       AZ C
2 Go       2 Go       2 Go
Fargate    Fargate    Fargate tasks
  |          |          |
  +----------+----------+
             |
             | DynamoDB gateway endpoint
             v
  PhoneDirectory: (tenant ID, normalized phone)
             |
             | patient ID + association version
             v
  Patients: (tenant ID, patient ID)
             |
             | validate association and authorization
             v
  Authorized fields -> complete client response
```

> Ten million reads over sixteen hours is about 174 lookups per second. Five times that is 868, so the design target is 1,000. A small directory item and a 10 KiB patient item require four read units per successful lookup using two nontransactional strong reads. Start with 1,250 directory RCU and 3,750 patient RCU. Benchmark six Go tasks across three AZs so four survivors can handle the target. Validate association changes as well as capacity, then test client-observed p99 at 1,000 lookups per second with realistic data and an application AZ disruption.

The design remains a calculated starting configuration. No AWS deployment or load test is claimed here, and neither 300 lookups/second per task nor the 100 ms p99 has been measured.

## References

[AWS DynamoDB documentation](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html) covers the consistency, read accounting, and partition constraints used in the sizing. The focused links beside each decision identify the relevant rules.

Google SRE's [Service Level Objectives](https://sre.google/sre-book/service-level-objectives/) explains measurement boundaries and objectives. [Addressing Cascading Failures](https://sre.google/sre-book/addressing-cascading-failures/) connects overload and queueing to failure propagation.

[AWS DynamoDB gateway endpoints](https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-ddb.html) and [scheduled scaling](https://docs.aws.amazon.com/autoscaling/application/userguide/scheduled-scaling-policy-overview.html) document the network path and business-hours capacity options.

## Related topics

- [Back-of-Envelope Estimation](../../estimation/): Translate product activity into traffic, storage, and bandwidth.
- [Interview Framework](../../interview-framework/): Order requirements, estimates, design, and deep dives.
- [Databases at Scale](../../databases/): Compare access patterns and storage tradeoffs.
- [Load Balancing](../../load-balancing/): Understand redistribution and health checks.
- [Circuit Breaker and Resilience](../../circuit-breaker/): Bound waiting, retries, and dependency failures.
