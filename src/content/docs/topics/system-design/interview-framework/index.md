---
title: System Design Interview Framework
description: "A repeatable 4-step approach to any system design interview: requirements, estimation, high-level design, and deep dive, with time allocations, clarifying question templates, and what interviewers actually score."
parent: system-design
tags: [system-design, interviews, framework]
status: draft
created: 2026-05-06
updated: 2026-05-06
---

System design interviews are open-ended by design. There is no single correct answer. What interviewers score is the quality of your reasoning process: how you structure ambiguity, what questions you ask, how you justify trade-offs, and how deep you can go when pushed.

This framework gives you a repeatable structure so you spend your mental energy on the actual design instead of figuring out what to do next.

## The 4-step framework

```
Step 1: Requirements (3-10 min)
  Clarify scope, scale, and constraints before drawing anything.

Step 2: Estimation (3-5 min)
  Back-of-envelope math to size the system and identify bottlenecks.

Step 3: High-level design (10-15 min)
  Sketch the major components and data flow. Get agreement before going deep.

Step 4: Deep dives (10-25 min)
  Go deep on 2-3 specific components. Let the interviewer guide you here.
```

The time ranges are guidelines. A senior-level interview spends more time on deep dives; a mid-level interview may spend more time on the high-level design. Read the room.

## Step 1: Requirements

Never start designing until you understand what you are building. The most common mistake in system design interviews is drawing a database schema before knowing the scale.

### Functional requirements

What does the system do? List the core user-facing features. Ask the interviewer which to prioritize.

Example for a URL shortener:
- Users can submit a long URL and receive a short URL
- Anyone with the short URL can be redirected to the original URL
- (Optional) Users can see click analytics

Push back if the scope is too broad: "There are a lot of possible features here. For this session, should I focus on the core create-and-redirect flow, or should I also include analytics and custom aliases?"

### Non-functional requirements

These constrain the design far more than functional requirements. Ask about:

- **Scale**: how many daily active users? How many reads and writes per second?
- **Availability**: 99.9% (8.7 hours downtime/year) or 99.99% (52 minutes/year)?
- **Latency**: what is the p99 response time target? (100ms? 500ms?)
- **Consistency**: can users tolerate briefly stale data, or must every read return the latest write?
- **Durability**: what is the data loss tolerance? (Zero for financial data; some for analytics.)

### Questions that impress interviewers

- "Is this a read-heavy or write-heavy system? That determines where I focus the caching strategy."
- "What is the expected peak-to-average ratio? Systems that spike 10x during events need different architecture than steady traffic."
- "Is geographic distribution required, or single-region for now?"
- "What does success look like for this system? What's the most important metric to optimize?"

### What to write on the whiteboard

After the requirements conversation, write two lists:

```
Functional requirements:         Non-functional requirements:
- Create short URL                - 100M URLs created/day
- Redirect short URL              - 10:1 read/write ratio
- (out of scope: analytics)       - 99.99% availability
                                  - <50ms redirect latency
                                  - URLs never deleted
```

Having this visible shows you listen, keeps you from scope-creeping, and gives you something to reference when justifying decisions later.

## Step 2: Estimation

Back-of-envelope calculation sizes the system before you design it. It tells you whether you need one server or a thousand, one database or ten shards, a simple cache or a CDN.

You do not need to get the numbers exactly right. Interviewers want to see the process: identifying the key metrics, making reasonable assumptions, and deriving implications.

### Key numbers to know cold

| Metric | Value |
| --- | --- |
| L1 cache | 1 ns |
| L2 cache | 4 ns |
| RAM | 100 ns |
| SSD random read | 150 us |
| HDD seek | 10 ms |
| Same-datacenter round trip | 500 us |
| Cross-datacenter round trip | 150 ms |
| Gigabit NIC throughput | 100 MB/s |
| SSD throughput | 500 MB/s |

| Unit | Size |
| --- | --- |
| 1 KB | 10^3 bytes |
| 1 MB | 10^6 bytes |
| 1 GB | 10^9 bytes |
| 1 TB | 10^12 bytes |
| 1 PB | 10^15 bytes |

| Availability | Downtime/year |
| --- | --- |
| 99% | 3.65 days |
| 99.9% | 8.7 hours |
| 99.99% | 52 minutes |
| 99.999% | 5 minutes |

### The estimation formula

```
peak_qps = (daily_requests / 86400) * peak_multiplier

storage_per_year = daily_writes * avg_size_bytes * 365

bandwidth = peak_qps * avg_response_size
```

Seconds per day: `86400` (memorize this).

### Worked example: URL shortener

```
Assumptions:
  100M URLs created/day
  10:1 read/write ratio
  5-year retention
  Average URL = 100 bytes, metadata = 500 bytes

Write QPS:
  100M / 86400 = ~1200 write QPS
  Peak (3x): ~3600 write QPS

Read QPS:
  1200 * 10 = 12000 read QPS
  Peak: 36000 read QPS

Storage:
  100M/day * 365 * 5 = 182.5B URLs
  182.5B * 500 bytes = ~91 TB over 5 years

Bandwidth:
  Read: 36000 QPS * 100 bytes response = 3.6 MB/s (trivial)
  Write: 3600 QPS * 500 bytes = 1.8 MB/s (trivial)
```

Conclusion: storage (91 TB) is the constraint, not bandwidth or CPU. This drives the decision to shard the database.

### What to say during estimation

Narrate your assumptions: "I'm assuming 100M URLs created per day -- is that in the right ballpark?" Interviewers will correct you if it's wrong. A corrected estimate is fine; an unspoken assumption that leads to a wrong design is not.

## Step 3: High-level design

Now draw the system. The goal is to sketch the major components and the data flowing between them. Get buy-in from the interviewer before going deep on any one component.

### What to draw

A standard web system has these layers:

```
Client (web / mobile)
  |
DNS -> CDN (static assets, optional)
  |
Load Balancer (L7)
  |
API Servers (stateless, horizontally scaled)
  |              |
Cache (Redis)  Message Queue (Kafka)
  |              |
Database      Worker Fleet
(primary + replicas)
  |
Object Storage (S3) -- for files, images, video
```

Not every system needs every layer. A URL shortener does not need a message queue. A video streaming system does not need complex workers but needs a CDN.

### APIs first

Before drawing components, define the API endpoints. This forces clarity on the interface and makes the rest of the design concrete.

```
POST /urls
  body: { long_url: string, custom_alias?: string }
  response: { short_url: string, created_at: timestamp }

GET /{short_code}
  response: 302 redirect to long_url
```

### Data model

Sketch the primary database schema:

```
urls
  id          BIGINT PRIMARY KEY
  short_code  VARCHAR(8) UNIQUE INDEX
  long_url    TEXT
  user_id     BIGINT
  created_at  TIMESTAMP
  expires_at  TIMESTAMP
```

Showing the schema demonstrates that you think about data before components. Most candidates skip this; doing it stands out.

## Step 4: Deep dives

The interviewer will signal where to go deep: "How does the ID generation work?" or "Walk me through what happens when the cache is down." Listen for these cues. If they do not give one, ask: "Which component would you like to explore further?"

### How to structure a deep dive

1. State the problem clearly: "The challenge here is generating unique IDs at 3600 QPS without a bottleneck."
2. List 2-3 approaches: "There are three main options: auto-increment, UUID, and a hash-based approach."
3. Evaluate trade-offs: "Auto-increment is simple but creates a DB hotspot. UUID is distributed but 128 bits wastes storage and exposes no ordering. A hash of the long URL is deterministic but collisions require extra logic."
4. Make a decision: "For this scale I would use a dedicated ID generation service (Snowflake-style) that pre-allocates ranges to each app server, giving distributed generation with ordering."

Never say "I would just use X." Always explain why X is better than the alternatives for this specific system.

### Topics interviewers commonly deep-dive on

- ID generation: how do you avoid duplicates at high QPS?
- Caching: what is the eviction policy? What happens on a cache miss storm?
- Database sharding: what is the shard key? How do you handle hotspots?
- Failure handling: what happens if the cache is down? If a worker crashes mid-job?
- Consistency: what is the user experience when data is briefly stale?
- Scaling bottlenecks: where does the system break first at 10x current load?

## What interviewers score

| Dimension | What "good" looks like |
| --- | --- |
| Problem exploration | Asks clarifying questions before drawing; identifies the right constraints |
| Estimation | Does back-of-envelope math; draws correct conclusions from the numbers |
| High-level design | Correct components, clear data flow, reasonable technology choices |
| Trade-offs | Names alternatives and explains why the chosen approach fits this use case |
| Deep dive | Can explain the internals of each component; handles failure cases |
| Communication | Thinks out loud; checks in with the interviewer; concise answers |

## Common mistakes

**Starting to draw before clarifying requirements.** The most common mistake. Spend 5 minutes on requirements every time.

**Jumping to a specific technology.** "I'll use Kafka" before establishing that you need async processing. Technology choices should follow from requirements, not precede them.

**Designing for maximum scale from the start.** You do not need a globally distributed, multi-region active-active setup for a system handling 1000 QPS. Design for the stated scale; mention what would change at 10x.

**Not going deep.** Staying at the box-drawing level for 45 minutes. Deep dives are where senior performance is demonstrated.

**Ignoring failure modes.** What happens if the cache is cold? If the DB primary fails? If the message queue falls behind? Great candidates bring these up without prompting.

**Not asking for feedback.** Treat the interviewer as a collaborative partner. "Does this direction make sense before I continue?" is a sign of seniority, not uncertainty.

## Handling unknowns

Every engineer hits a topic they do not know deeply. The recovery sequence:

1. Name the property you need: "I need a store that can handle high write throughput with low latency."
2. Reason from first principles: "That points toward something with an LSM-tree storage engine."
3. Name what you know: "Cassandra and DynamoDB fit this profile."
4. Acknowledge the limit: "I haven't worked with Cassandra in production so I'd want to verify the specific configuration choices."

This is far better than silence or guessing. Interviewers know you cannot know everything.

## References

- [System Design Interview, Alex Xu, Vol. 1](https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF)
- [ByteByteGo: Framework chapter](https://bytebytego.com/)
- [Grokking the System Design Interview, Educative](https://www.educative.io/courses/grokking-the-system-design-interview)
- [HelloInterview system design guide](https://www.hellointerview.com/learn/system-design/in-a-hurry/introduction)

## Related topics

- [Back-of-Envelope Estimation](../estimation/), the numbers and formulas for step 2 of the framework
- [Scalability](../scalability/), the concepts behind the scaling decisions you will justify in step 4
- [CAP Theorem](../cap-theorem/), the consistency/availability trade-off that drives many deep-dive conversations
- [Case Studies](../case-studies/), full walkthroughs applying this framework to real systems
