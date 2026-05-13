---
title: "Systems thinking: Gall's Law, Leaky Abstractions, Chesterton's Fence, and Tesler's Law"
description: "Four principles for reasoning about complex systems: how they must be built, why they leak, why legacy code exists, and where complexity actually goes."
parent: technology-laws
tags: [software-engineering, systems-design, architecture, complexity]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

## Gall's Law

Origin: John Gall, "Systemantics: How Systems Really Work and How They Fail," 1975.

> A complex system that works is invariably found to have evolved from a simple system that worked. A complex system designed from scratch never works and cannot be patched up to make it work.

**In-depth example 1: Linux.** Linus Torvalds wrote a simple terminal emulator for his 386 PC in 1991. It was not designed to be an operating system. It became one incrementally as features were added to solve real problems that real users had. Linux was not designed from scratch as a complex operating system. It evolved from something that worked. By 2024, it runs the majority of the world's servers, all Android phones, and most cloud infrastructure.

**In-depth example 2: The microservices rewrite that never shipped.** A team at a mid-size company decided their monolith was unmaintainable. They designed a new microservices architecture from scratch: 15 services, each responsible for a domain. They worked on it for 9 months while the monolith continued to receive features. The new system handled the clean cases well but couldn't replicate the behavior of three years of production edge cases. It never shipped. The monolith, despite its imperfections, was a complex system that worked. The new system, designed from scratch to be complex, did not.

**In-depth example 3: The strangler fig pattern as Gall's Law applied.** The strangler fig pattern (Martin Fowler, 2004) is Gall's Law operationalized. Instead of replacing a legacy system with a new one, you route new functionality to new services while the old system keeps running. Gradually, the new system "strangles" the old one. The new system always works because it's built incrementally on top of a system that already works. Total complexity grows slowly, with each new component validated against production traffic.

**In-depth example 4: SpaceX vs traditional aerospace.** Traditional aerospace designs spacecraft top-down: extensive requirements, complete design, then build. SpaceX's approach with Falcon 9 and Starship is iterative: build simple versions, fail fast in testing, add complexity only as needed. The Starship program's public launch failures are Gall's Law working as intended. Each failure reveals something the complex design couldn't predict. The system is evolving toward one that works.

**What Gall's Law means for software projects.** Start small. Ship something simple that works. Add complexity only to solve real problems that real users have. Every time you are tempted to design a complete system from scratch, ask: what is the simplest thing that could possibly work? Build that first.

---

## The Law of Leaky Abstractions

Origin: Joel Spolsky, "The Law of Leaky Abstractions," Joel on Software, 2002.

> All non-trivial abstractions, to some degree, are leaky.

An abstraction is supposed to hide complexity. The abstraction presents a simpler interface and handles the messy details internally. The law says: it never fully works. The details always leak through eventually.

**In-depth example 1: TCP and packet loss.** TCP abstracts away the fact that the internet drops packets. You write to a socket, you read from a socket, it works. Until you're debugging a slow connection and you need to understand retransmission, window sizing, and Nagle's algorithm to explain the 200ms latency spike. The abstraction is excellent. It made the internet usable. But when it breaks down, you need to know everything it was hiding.

**In-depth example 2: ORM N+1 queries.** An ORM abstracts away SQL. You write `users = User.objects.filter(active=True)` and `for user in users: print(user.team.name)`. The abstraction makes this read like Python. What it executes is one query to fetch users and then one query per user to fetch their team: N+1 queries total. On 10,000 users, this is 10,001 database round trips. The abstraction hid the SQL so successfully that the performance disaster was invisible until production. Understanding `select_related()` and `prefetch_related()` requires understanding the SQL the ORM is generating, which is exactly what the abstraction was supposed to hide.

**In-depth example 3: Date and time libraries.** Time libraries abstract away timezones, DST transitions, leap seconds, and calendar irregularities. Until they don't. A "1 hour from now" calculation that crosses a DST boundary returns 2 hours. A "days between two dates" calculation that crosses a leap second is off by one second. A timezone that observes DST on a different schedule than expected breaks your scheduled job. Every date library leaks eventually. The programmer who understands UTC, POSIX timestamps, and IANA timezone databases is never surprised. The programmer who trusts the abstraction completely gets burned once per year.

**In-depth example 4: CSS layout abstractions.** CSS Grid and Flexbox abstract away manual positioning. They mostly work. They leak when browser implementations disagree subtly on edge cases, when content dimensions are dynamic, or when nested contexts interact in ways the spec didn't anticipate. Every CSS developer has spent hours on a layout that "should work" per the spec and doesn't in Safari. The abstraction is leaking.

**In-depth example 5: The gradient.** Abstractions don't all leak equally. TCP leaks rarely and predictably (performance debugging). ORMs leak regularly (N+1 is a common issue). CSS leaks constantly (cross-browser layout bugs). The leakiness of an abstraction determines how much you need to know about what it's hiding. For a rarely-leaking abstraction, knowing the surface is enough. For a frequently-leaking one, you need to understand the internals to use the abstraction effectively.

**What the law means for developers.** You cannot fully abstract away complexity. You can delay when you need to understand it. Learn what is beneath the abstractions you depend on most heavily. When something breaks and you cannot explain it from the surface, go one level down.

---

## Chesterton's Fence

Origin: G.K. Chesterton, "The Thing," 1929.

> Do not remove a fence until you understand why it was built.

In the original parable: a reformer encounters a fence across a road and wants to remove it because it seems pointless. Chesterton says: don't remove it until you understand why it was built. If you understand the reason and still want to remove it, go ahead. If you can't find the reason, leave it.

**In-depth example 1: The database index that seemed redundant.** A new engineer joins a team. They notice a composite index on `(user_id, created_at)` and a separate index on `user_id` alone. The single-column index seems redundant given the composite. They remove it in a cleanup PR. Two weeks later, a query that joins on `user_id` alone (no `created_at` filter) starts causing full-table scans. The index was there because that query was the hot path for a background job. Nobody documented this. The fence was there for a reason nobody remembered to put in a comment.

**In-depth example 2: The rate limiter that seemed unnecessary.** A service has a rate limiter capping requests to a downstream API at 100/second. The downstream API can handle 10,000/second. The rate limiter looks pointlessly conservative. A new developer removes it during a "simplification" pass. Under a traffic spike three months later, the downstream API gets 50,000 requests/second for 10 minutes. It falls over and takes 45 minutes to recover. The rate limiter was protecting against an edge case that happened once every 18 months. The fence was there for a reason that wasn't visible in normal conditions.

**In-depth example 3: The weird retry logic.** A service has an exponential backoff retry with a 5-minute cap and a jitter of 10-30 seconds on each retry. This seems over-engineered for a simple API call. A developer simplifies it to a fixed 5-second retry with 3 attempts. Six months later, a correlated failure causes all instances to retry at the same moment. The thundering herd amplifies the original failure. The original jitter was there specifically to prevent this. The fence had a very specific reason.

**In-depth example 4: `__init__.py` files.** Before Python 3.3, `__init__.py` files were required to mark directories as packages. In Python 3.3+, implicit namespace packages made them optional in many cases. Some projects removed them from subpackages during modernization. Some tools and test frameworks still expect them for discovery. Removing them without understanding which tools in the build chain depend on them is a Chesterton's Fence violation that produces subtle test runner failures.

**The rule in practice.** Before removing, disabling, or simplifying any piece of code, configuration, or infrastructure, ask one question: "Do I know why this was added?" If the answer is no, find out. Read the git blame. Read the linked ticket. Ask someone who was there. Remove things confidently only when you understand them.

---

## Tesler's Law (Conservation of Complexity)

Origin: Larry Tesler, Apple and Xerox PARC, formalized in the 1980s.

> Every application has an inherent amount of complexity that cannot be removed or hidden. It can only be moved.

Tesler was a pioneer in HCI. The law is also called the Conservation of Complexity, by analogy to energy conservation. Complexity is not destroyed. It is transferred. Making something simpler for the user makes something more complex for the developer.

**In-depth example 1: Gmail's "Undo Send."** Sending an email is irreversible. Users make mistakes. Gmail added an "Undo Send" button that appears for roughly 10 seconds after you click send. From the user's perspective: sending email got simpler and safer. From Google's perspective: Gmail now had to buffer all outgoing email for up to 10 seconds per user, manage the cancellation state, handle timeouts, and ensure this worked reliably across mobile clients that might close during the window. The user's complexity decreased. Google's servers absorbed it.

**In-depth example 2: Amazon One-Click Purchase.** One-click checkout removes the cart, the shipping address step, the payment method step, and the confirmation step. Users click once and a package ships. From the user's perspective: purchasing is trivially simple. Amazon had to build and maintain a stored address vault, a stored payment vault, fraud detection that works without a review step, order correction workflows for accidental clicks, and a returns system that could handle the higher accidental-purchase rate. The user's complexity went to zero. Amazon's backend complexity went up substantially.

**In-depth example 3: Declarative vs. imperative infrastructure.** Kubernetes lets you declare "I want 3 replicas of this service." You don't specify how to start them, where to place them, or what to do if one crashes. The complexity of orchestration is hidden. Kubernetes (and the engineers who maintain it) absorbed that complexity. The user writing a simple YAML file does not see: scheduler algorithms, bin packing, node resource accounting, rolling update logic, or failure recovery. Complexity is conserved, not eliminated.

**In-depth example 4: "Make it just work."** The most common product request. The user experience of something "just working" requires that all the error states, configuration options, and failure modes were handled somewhere. Either the user handles them explicitly, or the system handles them on the user's behalf. If the system handles them, the engineers who built the system handled them. The complexity moved from the user to the software. There is no "make it just work" without "somebody did a lot of work so it works."

**What Tesler's Law means for product decisions.** When a product manager requests "just simplify the UI," the engineering response "it's more complicated than it looks" is not an excuse. It's Tesler's Law. The complexity is real. It can move. The question is: who handles it, and at what cost?

---

## References

- Gall, J. (1975). *Systemantics: How Systems Really Work and How They Fail*. Quadrangle/New York Times Book Co.
- Spolsky, J. (2002). "The Law of Leaky Abstractions." Joel on Software. joelonsoftware.com.
- Chesterton, G.K. (1929). *The Thing*. Sheed and Ward.
- Tesler, L. & Englebart, D. (various). Complexity research at Xerox PARC, 1970s-1980s.
- Fowler, M. (2004). "Strangler Fig Application." martinfowler.com.

## Related topics

- [`../../../system-design/microservices/`](../../../system-design/microservices/) -- Gall's Law applied to service decomposition
- [`./team-dynamics/`](./team-dynamics/) -- Conway's Law and the organizational roots of system complexity
- [`./api-design/`](./api-design/) -- Leaky Abstractions and the contracts APIs create
- [`./metrics-and-estimation/`](./metrics-and-estimation/) -- Goodhart's Law and why measurement distorts behavior
