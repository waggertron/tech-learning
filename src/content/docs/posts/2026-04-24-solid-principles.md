---
title: SOLID and composition through a changing report feature
description: "Evolve a TypeScript report through channel selection and delivery auditing, test behavioral substitution, and see where composition reduces change without extra interfaces."
date: 2026-04-24
tags: [solid, design, oop, architecture]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-04-24-solid-principles/
series:
  slug: software-design-principles
  order: 1
---

A report starts as one function: select completed visits, format their IDs, and email the result. Then a customer wants an inbox delivery option. Later, support needs to know whether delivery succeeded. Those are two separate changes. They expose what SOLID and composition are useful for.

The goal is a design in which changing report content does not require editing a transport, and adding delivery auditing does not require a subclass for every transport.

## Start with the concrete feature

An initial implementation can be direct:

```typescript
async function emailCompletedVisits(
  visits: readonly { id: string; complete: boolean }[],
  sendEmail: (message: string) => Promise<{ receipt: string }>,
) {
  const ids = visits.filter((visit) => visit.complete).map((visit) => visit.id).sort();
  return sendEmail(`Completed visits: ${ids.join(", ") || "none"}`);
}
```

There is no reason to introduce five interfaces for this function. It has one known delivery path. Its report rule is deterministic, and its external effect is supplied by the caller.

The split becomes useful when the two reasons to change become real: the report's selection/formatting rules and the destination's delivery behavior.

## Change 1: let the caller choose delivery

Keep report construction pure. Give delivery one small behavioral contract:

```typescript
export type Visit = Readonly<{ id: string; complete: boolean }>;
export type Delivery = Readonly<{ receipt: string }>;
export type Sender = (message: string) => Promise<Delivery>;

export function buildReport(visits: readonly Visit[]): string {
  const ids = visits.filter((visit) => visit.complete).map((visit) => visit.id).sort();
  return `Completed visits: ${ids.join(", ") || "none"}`;
}

export async function notify(visits: readonly Visit[], send: Sender): Promise<Delivery> {
  return send(buildReport(visits));
}
```

`buildReport` owns the report rule. `notify` composes that rule with one effect. The caller supplies email, an inbox adapter, or a recording fake. The function does not need to know which one was selected.

```typescript
const received: string[] = [];
const inbox: Sender = async (message) => {
  received.push(message);
  return { receipt: "inbox-1" };
};

const delivery = await notify(
  [{ id: "v2", complete: true }, { id: "v1", complete: true }],
  inbox,
);

console.log(received[0]); // Completed visits: v1, v2
console.log(delivery.receipt); // inbox-1
```

A function type is enough. An `AbstractNotificationFactory`, registry, and dependency-injection container would add setup without answering another requirement.

This is dependency inversion at a small scale: the reporting workflow describes the capability it consumes. A provider adapter satisfies it. It is also interface segregation: the report needs `send`, not subscription management, account deletion, or every method in a provider SDK.

## Change 2: audit delivery without a subclass matrix

Suppose support now needs a delivery outcome. Inheritance can turn two independent dimensions into a tree:

```text
EmailReporter
InboxReporter
AuditedEmailReporter
AuditedInboxReporter
```

Adding retries later multiplies the combinations again. Composition keeps the dimensions separate: a sender delivers, and a wrapper records the result.

```typescript
export type AuditEvent =
  | Readonly<{ outcome: "sent"; receipt: string }>
  | Readonly<{ outcome: "failed" }>;

export function withAudit(send: Sender, record: (event: AuditEvent) => void): Sender {
  return async (message) => {
    let delivery: Delivery;
    try {
      delivery = await send(message);
    } catch (error) {
      record({ outcome: "failed" });
      throw error;
    }
    record({ outcome: "sent", receipt: delivery.receipt });
    return delivery;
  };
}
```

Use the wrapper with either destination:

```typescript
const audit: AuditEvent[] = [];
const auditedInbox = withAudit(inbox, (event) => audit.push(event));
await notify([{ id: "v1", complete: true }], auditedInbox);
console.log(audit); // [{ outcome: "sent", receipt: "inbox-1" }]
```

A delivery failure stays a failure. The wrapper does not turn it into a successful empty receipt. The event also excludes the report body.

The example uses an in-memory recording callback. It does not make provider delivery and a durable audit write atomic. If recording throws after delivery, the caller receives that failure even though delivery succeeded. A production workflow needs an explicit consistency policy, often an outbox and idempotent delivery. A decorator alone does not solve that problem.

## A matching shape can still violate substitution

TypeScript accepts this function as a `Sender`:

```typescript
const silentSender: Sender = async () => ({ receipt: "" });
```

Its shape matches, but it violates the behavioral promise: a fulfilled delivery has a nonempty receipt. A caller that records successful delivery cannot substitute it safely. That is a Liskov substitution problem even without class inheritance.

The contract can be exercised against any adapter:

```typescript
export async function assertSenderContract(send: Sender): Promise<void> {
  const delivery = await send("contract probe");
  if (typeof delivery.receipt !== "string" || delivery.receipt.trim() === "") {
    throw new Error("Successful delivery requires a nonempty receipt");
  }
}
```

A real adapter contract also defines what rejection means, whether a lost response can accompany a successful delivery, and how duplicate requests behave. A type annotation cannot establish those external guarantees.

## Run the specimen

The complete source and tests live in `companion/design-principles/`. From a repository checkout with Node 22.18 or newer:

```bash
node --test companion/design-principles/notifications.test.mjs
node_modules/.bin/tsc --strict --noEmit --types node --target ES2022 --module NodeNext --moduleResolution NodeNext companion/design-principles/notifications.ts
```

The five tests check report filtering/order, interchangeable destinations, preserved delivery receipts, failure propagation/auditing, and rejection of the empty-receipt substitute. These are local behavioral checks. No email provider or durable audit database participates.

## What each principle buys here

| Principle | Concrete pressure | Result |
| --- | --- | --- |
| Single responsibility | Content rules and delivery change independently | Pure report function separate from effect |
| Open/closed | Add inbox delivery without rewriting report selection | Supply another sender |
| Liskov substitution | A sender appears successful but provides no receipt | Test the behavioral contract |
| Interface segregation | A provider SDK has many unrelated operations | Consume only the `Sender` function |
| Dependency inversion | Report tests need no live provider | The workflow defines its consumed capability |

Open/closed is local to a chosen boundary. A new reporting requirement can still require changing `buildReport`. The principle does not promise that existing code never changes.

## Composition over inheritance

Composition combines objects or functions that have separate contracts. Here `notify` uses a sender and `withAudit` wraps one. That makes the combinations visible at construction rather than encoding them in a subclass hierarchy.

Inheritance remains useful when an existing framework deliberately exposes a base class as its extension contract, or when a subtype truly preserves the base behavior. A genuine subtype does not require callers to detect its concrete class, skip unsupported methods, or weaken their expectations.

The cost of composition is indirection and construction. A one-off formatter with no independent behavior to vary can remain a function. Do not replace every private call with a port, class, factory, and test double.

## Review a proposed abstraction

Name the requirement that varies. Name the contract a caller relies on. Show the test that would fail if a substitute broke that contract. Then compare the construction cost with the change it isolates.

If those answers are vague, keep the concrete implementation until another requirement exposes a real boundary. SOLID is useful vocabulary for that review, not a quota of interfaces.

## References

- [TypeScript handbook: More on Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html) describes callable contracts and function types.
- [TypeScript handbook: Type Compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html) explains structural compatibility, which does not prove behavioral substitution.
- [Barbara Liskov, Data Abstraction and Hierarchy](https://dl.acm.org/doi/10.1145/62139.62141) establishes the behavioral substitution concern.

## Related topics and posts

- [Software design collection](../series/software-design-principles/), choose a lesson by the failure you are trying to prevent.
- [Functional Core, Imperative Shell](../../topics/cs/functional-core-imperative-shell/), separate deterministic decisions from effects.
- [Strategy](../../topics/cs/design-patterns/strategy/), select behavior through a narrow collaborator.
- [TypeScript async mutex](../2026-05-15-typescript-async-mutex-pattern/), a separate lesson about coordinating asynchronous mutation.
