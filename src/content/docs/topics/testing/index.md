---
title: Testing
description: "Seven ways to gain confidence that code does what you think, TDD as a discipline, then the test types that back it up: unit, component, integration, smoke, fuzz, and E2E. Where each one lives, what it catches, what it misses."
---

## Topics

- [Test-Driven Development (TDD)](./tdd/), writing the test first, red → green → refactor, and why the discipline matters more than the mechanics
- [Unit tests](./unit-tests/), small, fast, hundreds of them; what "unit" actually means and how to avoid the over-mocking trap
- [Component tests](./component-tests/), the middle tier; what's in, what's out, and why React / Vue / web-component tests earn their own category
- [Integration tests](./integration-tests/), real dependencies, real wiring, slower and fewer; where your system-under-test gets interesting
- [Smoke tests](./smoke-tests/), the minimum viable "is it still alive?" checks for deploys and incidents
- [Fuzz tests](./fuzz-tests/), automatic input generation to find edge cases and vulnerabilities your hand-written tests missed
- [End-to-end tests (E2E)](./e2e-tests/), the whole system, a real browser, a real user flow; slow, expensive, uniquely valuable

## The testing pyramid (and why it's still roughly right)

```
                 ┌──────────────┐
                 │     E2E      │    few (5–20)
                 └──────────────┘
               ┌──────────────────┐
               │   Integration    │    some (50–200)
               └──────────────────┘
             ┌──────────────────────┐
             │     Component        │    many (200–1000)
             └──────────────────────┘
           ┌──────────────────────────┐
           │         Unit             │    very many (1000s)
           └──────────────────────────┘
```

Mike Cohn's 2009 pyramid has been refined, debated, and occasionally denounced, but the underlying shape holds: **fast and cheap at the base, slow and expensive at the top, and more tests lower than higher.** Modern variants (Honeycomb, Trophy) shift the middle tier's weight but preserve the scale ordering.

## How the types compose

Each layer catches a different kind of bug:

- **Unit**, "this function has a logic error"
- **Component**, "this UI component renders wrong when it gets empty state"
- **Integration**, "this service talks wrong to this other service"
- **E2E**, "the whole user journey is broken"
- **Smoke**, "is anything running at all?"
- **Fuzz**, "does this input crash the parser?"
- **TDD**, the *discipline* that produces the test suite in the first place

You need multiple types. A codebase with only unit tests ships integration bugs; a codebase with only E2E tests is slow to change; a codebase with no smoke tests can't tell if the deploy succeeded.

## Shared principles

Regardless of tier, good tests:

- **Fail on real bugs, pass on real correctness.** Not "fail because I changed the implementation."
- **Describe behavior, not mechanics.** `test_user_receives_welcome_email` reads better than `test_send_mail_called_once`.
- **Are independent.** Run in any order. Parallelize-safe. No shared mutable state.
- **Are fast for their tier.** A slow unit test is a component test in disguise.
- **Fail clearly.** On failure, you should know *what* broke without reading the test code.

Every subtopic applies those differently. That's most of what makes testing its own discipline.
