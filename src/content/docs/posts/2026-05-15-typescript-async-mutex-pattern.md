---
title: TypeScript async mutex, serializing concurrent writes without a library
description: "How a promise-chain mutex eliminates TOCTOU races in async TypeScript, shown through a bidding engine that handles concurrent placeBid calls correctly."
date: 2026-05-15
tags: [typescript, concurrency, async, patterns]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-05-15-typescript-async-mutex-pattern/
---

## The problem

JavaScript is single-threaded, so synchronous code never races. The moment you add `await`, the current function suspends and another call can run. A check-then-write that looks atomic is not:

```typescript
async placeBid(auctionId: string, userId: string, amount: number): Promise<boolean> {
  const bids = this.auctions[auctionId]
  const highest = bids[bids.length - 1].amount  // check

  if (amount > highest) {
    bids.push({ userId, amount })                // write
    return true
  }
  return false
}
```

If `placeBid` hits an `await` between the check and the write (a database read, a validation call, anything), two callers at the same amount both pass the check before either pushes. Both get `true`. Now you have two winners.

This class of bug is called TOCTOU: time-of-check, time-of-use.

## The mutex pattern

A mutex (mutual exclusion lock) lets only one caller into a critical section at a time. In TypeScript, you can build one per key using a promise chain.

```typescript
private locks: Map<string, Promise<void>> = new Map()

async placeBid(auctionId: string, userId: string, amount: number): Promise<boolean> {
  const prev = this.locks.get(auctionId) ?? Promise.resolve()
  let release!: () => void
  const current = new Promise<void>(r => (release = r))
  this.locks.set(auctionId, current)

  await prev  // wait for the previous holder to finish

  try {
    // critical section: check-then-write is now atomic per auction
    const bids = this.auctions[auctionId]
    if (!bids) {
      this.auctions[auctionId] = [{ userId, amount }]
      return true
    }
    if (amount > bids[bids.length - 1].amount) {
      bids.push({ userId, amount })
      return true
    }
    return false
  } finally {
    release()
    if (this.locks.get(auctionId) === current) {
      this.locks.delete(auctionId)  // no one queued behind us, safe to clean up
    }
  }
}
```

How it works:

1. Read the current lock promise for this auction (or a resolved no-op if none exists).
2. Synchronously create a new unresolved promise (`current`) and put it in the map, capturing `release`.
3. `await prev` blocks until the previous holder calls `release()`.
4. Do the work inside `try`.
5. `finally` calls `release()` to unblock the next waiter, then checks whether the map still holds `current`. If it does, no other caller has queued behind us and the entry is safe to delete. If another caller replaced `current` with their own promise, the reference check fails and we leave the map alone.

Because step 2 happens synchronously (before `await prev`), the new promise is in the map before this call suspends. The next caller reads it and queues behind you.

## The full, corrected engine

```typescript
type Bid = {
  userId: string
  amount: number
}

interface IBiddingEngine {
  placeBid(auctionId: string, userId: string, amount: number): Promise<boolean>
  getHighestBid(auctionId: string): Bid | null
  getBidHistory(auctionId: string): Bid[]
}

class BiddingEngine implements IBiddingEngine {
  private auctions: { [key: string]: Bid[] } = {}
  private locks: Map<string, Promise<void>> = new Map()

  async placeBid(auctionId: string, userId: string, amount: number): Promise<boolean> {
    const prev = this.locks.get(auctionId) ?? Promise.resolve()
    let release!: () => void
    const current = new Promise<void>(r => (release = r))
    this.locks.set(auctionId, current)

    await prev

    try {
      const bids = this.auctions[auctionId]
      if (!bids) {
        this.auctions[auctionId] = [{ userId, amount }]
        return true
      }
      if (amount > bids[bids.length - 1].amount) {
        bids.push({ userId, amount })
        return true
      }
      return false
    } finally {
      release()
      if (this.locks.get(auctionId) === current) {
        this.locks.delete(auctionId)
      }
    }
  }

  getHighestBid(auctionId: string): Bid | null {
    const bids = this.auctions[auctionId]
    if (!bids) return null
    return { ...bids[bids.length - 1] }
  }

  getBidHistory(auctionId: string): Bid[] {
    return [...(this.auctions[auctionId] ?? [])]
  }
}
```

Four other fixes applied alongside the mutex:

- **`private auctions`**: callers have no business mutating internal state directly.
- **`getHighestBid` returns a copy**: spread `{ ...bid }` so external mutation does not affect the stored record.
- **`getBidHistory` returns a copy**: spread `[...bids]` and default to `[]` instead of `undefined` when the auction does not exist.
- **`>` not `>=`**: in an auction, a tie does not beat the current leader. The first bidder at a price holds it.

## Usage

```typescript
const engine = new BiddingEngine()

console.log(await engine.placeBid('a1', 'u1', 100)) // true
console.log(await engine.placeBid('a1', 'u2', 90))  // false
console.log(await engine.placeBid('a1', 'u3', 100)) // false (tie does not win)
console.log(await engine.placeBid('a1', 'u4', 101)) // true

console.log(engine.getHighestBid('a1'))   // { userId: 'u4', amount: 101 }
console.log(engine.getBidHistory('a1'))   // [ { u1, 100 }, { u4, 101 } ]
```

## What this does not cover

**Multiple processes.** The mutex lives in memory. Two Node.js processes running the same engine can still race. For that, you need a distributed lock: Redis `SET NX PX`, a database advisory lock, or a queue.

**Fairness.** The chain guarantees sequential execution but not fairness across auctions. Bids on `a1` and `b1` run independently in parallel, which is correct; they do not block each other.

## When to reach for this pattern

Use a per-key promise mutex when:

- You have in-process, in-memory shared state.
- Your operations are async (any `await` inside the critical section).
- Two concurrent callers on the same key would produce incorrect results if interleaved.

Skip it when operations are synchronous. Synchronous TypeScript never interleaves, so a mutex adds overhead with no benefit.

Skip it when state lives in an external system. Put the lock there instead, as close to the data as possible.

## References

- [MDN: Using Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [Node.js Event Loop explainer](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick)
- [async-mutex on npm](https://github.com/DirtyHairy/async-mutex) — a well-tested library implementation of this same pattern

## Related topics

- [Throttling and rate limiting](./2026-04-24-throttling-and-rate-limiting/)
- [SOLID principles](./2026-04-24-solid-principles/)
