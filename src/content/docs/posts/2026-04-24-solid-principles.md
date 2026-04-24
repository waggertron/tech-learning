---
title: SOLID principles — what each one is actually trying to prevent
description: Five design principles from Robert Martin's 2000 paper, still quoted, still misquoted. What each one was reacting to, what it actually says, and the misreadings that make SOLID feel like ceremony when it should feel like force multiplication.
date: 2026-04-24
tags: [solid, design, oop, architecture]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-04-24-solid-principles/
---

## The acronym and its heritage

SOLID was coined by Michael Feathers in 2000 as a mnemonic for five principles Robert Martin had been writing about since the late 1990s:

- **S** — Single Responsibility Principle
- **O** — Open/Closed Principle
- **L** — Liskov Substitution Principle
- **I** — Interface Segregation Principle
- **D** — Dependency Inversion Principle

They're OO principles, designed to fight specific 1990s-era pains: giant classes, fragile inheritance, rigid abstractions, unnecessary coupling. In 2026 they're often taught badly — as rules to memorize rather than tensions to manage.

## S — Single Responsibility Principle

**A class should have one, and only one, reason to change.**

The usual bad paraphrase: "a class should do one thing." That's not quite it. A `UserService` that validates emails, hashes passwords, and saves users to a database *does* one thing — it manages users — but it has three reasons to change (email rules, crypto library, database schema).

The real unit is *axis of change*. Code that changes together belongs together; code that changes for different reasons belongs apart.

**What it prevents:** A change to the email validation rule forcing a re-test of the password hashing code. Two stakeholders modifying the same class for unrelated reasons, producing merge conflicts.

**Misreading:** "Every class should have one public method." You end up with 200 `*Service` classes that are each a single function.

## O — Open/Closed Principle

**Software entities should be open for extension but closed for modification.**

Adding a new feature shouldn't require modifying existing code. You add new code — a new class, a new plugin — and the old code keeps working unchanged.

Classic OCP violation: a `shape.area()` function with an `if shape.type == 'circle' / rect / triangle` chain. Every new shape means editing the chain. OCP suggests polymorphism — each shape implements `area()`, and the chain disappears.

**What it prevents:** Changes that ripple through the codebase. Fear of adding features because the blast radius is unknown.

**Misreading:** "Every class needs an interface and a factory so it can be replaced." Most code will never be replaced; premature extensibility is a tax on reading.

## L — Liskov Substitution Principle

**Subtypes must be substitutable for their base types.** (Barbara Liskov, 1987)

If `Square extends Rectangle`, any code using a `Rectangle` should work identically when given a `Square`. That's rarely true — set a `Square`'s width and its height must change too, violating `Rectangle`'s contract.

**What it prevents:** Inheritance trees where downcasting and `isinstance` checks leak back into the calling code.

**The modern take:** most language communities have moved toward composition over inheritance. LSP violations rarely show up in code written after ~2015 because the inheritance relationships that used to produce them aren't built anymore.

## I — Interface Segregation Principle

**Clients shouldn't depend on methods they don't use.**

A fat interface with 15 methods forces implementers to stub or empty the ones they don't need. Splitting into narrower interfaces means each implementer depends only on what it uses.

Example: instead of a single `Device` interface with `read`, `write`, `lock`, `unlock`, `format`, split into `Readable`, `Writable`, `Lockable`. A read-only device implements only `Readable`.

**What it prevents:** Ripple changes when a method on a broad interface changes — every unrelated implementer has to update.

**Misreading:** "Every method needs its own interface." Interfaces with one method are usually better modeled as function types.

## D — Dependency Inversion Principle

Two statements:

1. High-level modules shouldn't depend on low-level modules. Both should depend on abstractions.
2. Abstractions shouldn't depend on details. Details should depend on abstractions.

Instead of `OrderService` directly using `MySQLOrderRepo`, both depend on an `OrderRepo` interface. `OrderService` can then run with `MySQLOrderRepo`, `PostgresOrderRepo`, or `InMemoryOrderRepo` (useful for testing).

**What it prevents:** Business logic that can't be tested without a real database. Upgrade paths that require rewriting the domain code.

**Misreading:** "DI framework everywhere." DIP is about direction of dependency, not about a specific injection mechanism. Constructor injection works; a DI container is overkill for most things.

## The tensions SOLID balances

SOLID principles pull against each other:

- **SRP + OCP** — splitting classes can make extension harder because there's more code to navigate.
- **ISP + SRP** — narrow interfaces can imply narrow classes, sometimes *too* narrow.
- **DIP + YAGNI** — every abstraction has a cost; reach for it when you need substitutability, not on principle.

Applying SOLID means picking which force to lean on for this code. A 200-line data transformation utility doesn't need all five; a 20,000-line domain model probably does.

## What SOLID doesn't cover

- **Concurrency.** Nothing in SOLID is about thread-safety or async design.
- **Performance.** SOLID doesn't care about cache locality or hot-path allocation.
- **Distributed systems.** Microservices and network boundaries need different principles (bulkheads, circuit breakers, idempotency).
- **Functional programming.** SOLID is implicitly OO. For FP, consult separate principles (purity, referential transparency, immutability).

SOLID is a set of *design* principles for *object-oriented* code. Expecting it to be a complete engineering philosophy is asking too much of a mnemonic.

## A practical reading

If you read one book's worth of SOLID once:

- **S** is about cohesion. Code that changes together belongs together.
- **O** is about decoupling. New behavior without rewriting old code.
- **L** is about subtyping. If you inherit, inherit behavior-preservingly.
- **I** is about interface design. Don't make clients carry dead weight.
- **D** is about direction. Depend on abstractions, not concretes.

Four of five are really about one thing: minimizing ripple effects. That's the whole game.

## References

- [Robert Martin — *Agile Software Development, Principles, Patterns, and Practices*](https://www.oreilly.com/library/view/agile-software-development/0135974445/) — the original book-length treatment
- [Uncle Bob's article series](https://web.archive.org/web/20150906155800/http://www.objectmentor.com/resources/articles/srp.pdf) (SRP PDF — 2005)
- [Barbara Liskov — *Data Abstraction and Hierarchy* (1987)](https://dl.acm.org/doi/10.1145/62139.62141) — LSP in its original context
- [Sandi Metz — *Practical Object-Oriented Design in Ruby (POODR)*](https://www.poodr.com/) — SOLID without the dogma
- [Dan North — *CUPID — the back story*](https://dannorth.net/cupid-the-back-story/) — the critical response that proposes an alternative

## Related topics and posts

- [Composition over inheritance](./2026-04-24-composition-over-inheritance/) — how to do what inheritance promised without its pathologies
- [Functional Core, Imperative Shell](../topics/cs/functional-core-imperative-shell/) — an architectural pattern that subsumes much of DIP
