---
title: "Performance math: Amdahl's Law and Little's Law"
description: "Two quantitative laws every engineer should internalize: the ceiling on parallel speedup, and the relationship between throughput, latency, and concurrency."
parent: technology-laws
tags: [performance, distributed-systems, concurrency, math]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

Two laws that turn vague performance intuitions into hard numbers. One tells you how much faster parallelism can make a computation. The other tells you how many concurrent workers you need to sustain a given throughput at a given latency.

Both are underused. Most engineers reason about performance qualitatively when these laws make it quantitative.

## Amdahl's Law

Origin: Gene Amdahl, 1967, presented at the AFIPS Spring Joint Computer Conference.

> The speedup from parallelizing a program is bounded by its sequential fraction.

**The formula**: S(n) = 1 / (1 - p + p/n)

Where:
- p = the fraction of the program that can be parallelized (0 to 1)
- n = number of processors
- S(n) = speedup factor

### Walking through the math

If 75% of a program can be parallelized (p = 0.75):

| Processors (n) | Speedup S(n) |
| --- | --- |
| 1 | 1.0x (baseline) |
| 2 | 1/(0.25 + 0.375) = 1.6x |
| 4 | 1/(0.25 + 0.1875) = 2.29x |
| 8 | 1/(0.25 + 0.09375) = 2.91x |
| 16 | 1/(0.25 + 0.047) = 3.37x |
| infinite | 1/0.25 = **4x ceiling** |

Adding processors past a certain point gives diminishing returns. With infinite processors, you still cap at 4x. The sequential 25% is the bottleneck.

### In-depth examples

**The data pipeline**: You have a nightly ETL job. 10% parsing (serial, single file), 80% transformation (parallelizable across records), 10% writing to a database (serial, single connection). The parallelizable fraction is 80%. Maximum theoretical speedup: 1/0.2 = 5x. You buy a 32-core machine. You get at most 5x. In practice, coordination overhead means you'll get 3-4x at best. Buying a 128-core machine gives you nothing more.

**GPU training**: Deep learning training has a serial data loading and preprocessing step. If that step takes 20% of wall-clock time, your GPU utilization ceiling is 1/0.2 = 5x regardless of GPU count. This is why data pipeline optimization (DataLoader workers, prefetching, caching preprocessed tensors) often matters more than adding more GPUs.

**The database write bottleneck**: A web application parallelizes reads across read replicas but all writes go to one primary. If writes are 30% of the workload, max read-parallelism speedup is 1/0.3 = 3.3x. Adding more read replicas past that point doesn't help.

### What Amdahl's Law forces you to do

Before buying more hardware or adding more threads, measure the serial fraction. The serial fraction is the ceiling. Optimizing the parallelizable part gives you diminishing returns much faster than optimizing the serial bottleneck.

### Gustafson's Law (the counterpoint)

Amdahl assumes the problem size is fixed. Gustafson observed that in practice, more processors let you tackle bigger problems in the same time. Scaled speedup = n - p*(n-1). This explains why HPC clusters are useful even past Amdahl's theoretical ceiling: they're solving problems that would be impossible on a single machine, not solving the same fixed problem faster.

---

## Little's Law

Origin: John D.C. Little, 1961, "A Proof for the Queuing Formula: L = λW." Operations Research.

> In any stable system, the average number of items in the system equals the arrival rate multiplied by the average time each item spends in the system.

**The formula**: L = λW

Where:
- L = average number of items in the system (concurrency)
- λ (lambda) = average arrival rate (throughput, requests per second)
- W = average time an item spends in the system (latency)

The useful thing about this law: it holds for any stable queuing system, regardless of arrival distribution, service time distribution, or number of servers. It is not an approximation. It is a proof.

### In-depth examples

**Sizing a thread pool**: Your API server handles 200 requests per second (λ = 200 rps). Average request latency is 50ms (W = 0.05 seconds). Little's Law: L = 200 * 0.05 = 10 concurrent requests in flight at any moment. Set your thread pool or connection pool to at least 10. If you set it to 5, you'll queue or drop requests under normal load.

**The latency spike death spiral**: Same server: 200 rps, 50ms latency, 10 concurrent requests. Now a downstream service slows down. Latency climbs to 500ms. L = 200 * 0.5 = 100 concurrent requests. Your 50-thread pool is overwhelmed. Requests start queuing. The queue adds latency. More latency means more concurrent requests. The spiral continues until the system falls over.

This is the mechanism behind cascading failures. Little's Law makes it quantitative: a 10x latency increase requires 10x the concurrency to handle the same throughput. Systems that don't autoscale their concurrency in proportion to latency will collapse.

**Setting Kafka consumer lag targets**: Messages arrive at a Kafka topic at 1,000 messages/second (λ = 1,000). Your team wants to process each message within 100ms on average (W = 0.1s). L = 1,000 * 0.1 = 100 messages in flight at any moment. That means your consumer group needs at least 100 concurrent processing slots. Under-provisioning by 2x means 200ms latency on average.

**Back-of-envelope capacity planning**: A new feature will add 50 rps to your service. Current capacity is 200 rps at 40ms latency. With the new load: λ = 250 rps, W = 40ms, L = 10 concurrent requests. Within the current concurrency budget. But if the new feature has slower queries and pushes latency to 200ms: L = 250 * 0.2 = 50 concurrent. Suddenly you're at 5x the concurrency. Little's Law catches this before you ship.

### Rearranging the formula

Little's Law rearranges in all three directions, all equally valid:

- **Throughput**: λ = L / W (if you know concurrency and latency, derive max throughput)
- **Latency**: W = L / λ (if you know concurrency and throughput, derive expected latency)
- **Concurrency**: L = λW (if you know throughput and latency, derive needed concurrency)

Whichever of the three you can't directly measure, derive it from the other two.

---

## How the two laws interact

Amdahl's Law sets the ceiling for how much faster you can make a computation by adding hardware. Little's Law tells you how many concurrent requests or workers you need to sustain a given throughput at a given latency.

Together they scope the two fundamental [system design](../../system-design/) questions: how much will more machines help, and how many concurrent workers do I need?

---

## References

- Amdahl, G.M. (1967). "Validity of the Single-Processor Approach to Achieving Large Scale Computing Capabilities." AFIPS Conference Proceedings.
- Little, J.D.C. (1961). "A Proof for the Queuing Formula: L = λW." *Operations Research*, 9(3).
- Gustafson, J.L. (1988). "Reevaluating Amdahl's Law." *Communications of the ACM*, 31(5).
- Gregg, B. (2013). *Systems Performance: Enterprise and the Cloud*. Prentice Hall.

## Related topics

- [Scalability](../../../system-design/scalability/), horizontal vs vertical scaling, the scale cube
- [Estimation](../../../system-design/estimation/), back-of-envelope with latency numbers
- [Databases](../../../system-design/databases/), database bottlenecks and the serial write fraction
- [Hardware and Software](./hardware-software/), Moore's Law and why hardware stopped saving you
