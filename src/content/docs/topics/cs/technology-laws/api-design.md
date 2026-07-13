---
title: "API design laws: Hyrum's Law, Postel's Law, and POLA"
description: "Three principles every platform and API author needs: all observable behavior becomes a contract, be strict in what you send, and don't surprise your users."
parent: technology-laws
tags: [api-design, software-engineering, backwards-compatibility, interfaces]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

Three principles that cut across every API, protocol, and platform interface. One describes what happens to your behavior at scale. One describes what to do with bad input. One describes the obligation to be predictable.

## Hyrum's Law

Origin: Hyrum Wright, Google, formalized around 2012, widely cited from hyrumslaw.com.

> With a sufficient number of users of an API, it does not matter what you promise in the contract: all observable behaviors of your system will be depended upon by somebody.

**Why this is not obvious**: API authors distinguish between the documented interface (the contract) and implementation details (the internals). The assumption is that users depend on the contract, not the internals. Hyrum's Law says that assumption fails at scale.

**Iteration order of a set**: A team at Google had an API that returned a set of strings. Sets are unordered. The documentation said the order was unspecified. In practice, the underlying hash table happened to iterate in a consistent order for common inputs. Over time, thousands of callers wrote code that processed the results in that order. When the team changed the hash implementation for performance reasons, callers started failing. No one violated the documented contract. Hyrum's Law operated on the observable behavior.

**JSON key ordering**: JSON objects are, per spec, unordered. Most JSON serializers return keys in insertion order or alphabetical order as an implementation detail. Callers who parse JSON by field position (not by key name) are depending on this undocumented behavior. Switch the serializer, and they break. Hyrum's Law operating on a well-known standard.

**Response time as an implicit contract**: An API that responds in under 5ms "accidentally" becomes load-bearing for a caller's timeout configuration. The caller sets a 10ms timeout because the API is "fast." The API team optimizes a different code path and one endpoint now takes 8ms. Callers start timing out. The performance characteristic was never in the contract. It was observable behavior, and someone depended on it.

**Proto3 field renaming**: Protocol Buffers use field numbers, not names, for binary serialization. You can rename a field without breaking binary compatibility. However, if callers use JSON serialization of proto3 (which uses field names), renaming breaks those callers. The proto spec says JSON serialization is optional. That didn't stop people from depending on it.

**What Hyrum's Law implies for API authors**:

- Every behavior your API exhibits, even accidental ones, is eventually a contract.
- The only way to change observable behavior without breaking callers is to version the API.
- Design APIs to expose as little surface area as possible. Fewer observable behaviors means fewer accidental contracts.
- Running [integration tests](../../../testing/integration-tests/) against your consumers is the only reliable way to know what behaviors they actually depend on.

**What Hyrum's Law implies for API consumers**:

- Only depend on documented behavior. Depending on implementation details means taking on breakage risk without any warning.
- Write tests specific enough to catch when the documented contract changes, but not so brittle that they break on irrelevant implementation changes.

---

## Postel's Law (The Robustness Principle)

Origin: Jon Postel, RFC 793 (TCP specification), 1981. Original phrasing in the TCP spec's implementation guidance section.

> Be conservative in what you do, be liberal in what you accept from others.

Postel wrote this as practical guidance for TCP implementers: send well-formed packets, but tolerate malformed input from peers rather than dropping connections.

**HTTP content negotiation**: An HTTP server that strictly rejects any request without a well-formed Accept header will break with many clients that send sloppy headers. A server that accepts malformed headers, interprets them reasonably, and responds with something useful is more interoperable. Postel's Law is why browsers and web servers have decades of quirks-mode compatibility layers.

**The argument against liberal acceptance**: In 2015, Martin Thomson wrote an influential post arguing Postel's Law causes long-term harm. The reasoning: if senders know receivers tolerate sloppiness, they never fix their implementations. The ecosystem accumulates broken senders. Receivers must maintain increasingly complex tolerance logic. The web's quirks mode and HTML5's error recovery are examples. A strict receiver would have forced senders to fix their output early. Over time, strict beats lenient for ecosystem health.

This is the active debate around Postel's Law. The original principle optimizes for resilience in a heterogeneous network. The critique optimizes for long-term ecosystem correctness. Neither is obviously right.

**JSON APIs accepting both camelCase and snake_case**: A REST API that accepts both `user_id` and `userId` in request bodies is being liberal in what it accepts. Clients can use either convention. Over time, some clients use one, some use the other. Documentation becomes inconsistent. The API team must maintain both code paths forever. A strict API that accepts only one form forces consistency. The short-term friction produces long-term clarity.

**gRPC vs REST tolerance**: gRPC generated clients are strict. If the schema changes, the generated client breaks loudly. REST+JSON clients are often liberal: they ignore unknown fields, tolerate extra keys, parse what they recognize. gRPC's strictness catches breaking changes at compile time. REST's liberalism allows gradual migration. Both are valid tradeoffs, and Postel's Law is part of what made REST+JSON's ecosystem so interoperable.

**The practical takeaway**: Use liberal input acceptance at the edges of a system (public APIs, external integrations) where you don't control all clients. Use strict validation internally (service-to-service) where you do control all clients and want to catch bugs early.

---

## The Principle of Least Astonishment (POLA)

Origin: HCI research tradition, 1970s-1980s. Sometimes attributed to early Unix design. Popularized in software engineering by Larry Wall and others.

> A system component should behave in the way its users most expect.

Or in its negative form: don't surprise people.

**`rm -rf` and the surprise of no confirmation**: Unix `rm -rf` deletes files recursively without prompting. For expert users who know the command, this is expected. For anyone who makes a typo in the path (`rm -rf ~/documents/project /` with an accidental space), it's a catastrophic surprise. The POLA violation is that the command's behavior when given ambiguous input is maximally destructive with no warning. Modern systems add `--no-preserve-root` as an extra explicit flag for this reason.

**`git checkout` does three things**: `git checkout` switches branches, creates new branches, and restores files -- three entirely different operations under one command. A user who types `git checkout myfile.txt` intending to switch to a branch by that name will instead restore the file from HEAD and lose their changes silently. Git split this into `git switch` and `git restore` specifically to resolve the POLA violation. Each new command does one thing, and the expected behavior is unambiguous.

**Python's `list.sort()` vs `sorted()`**: `list.sort()` sorts in-place and returns `None`. `sorted()` returns a new list. New Python developers write `my_list = my_list.sort()` and get `None` back. The surprise: sorting a list with an assignment that looks correct produces silent data loss. This is a POLA violation in the standard library that trips up beginners consistently.

**API pagination with shifting total counts**: A REST API returns paginated results. Page 1 returns `{"total": 100, "results": [...]}`. A record is deleted between page 1 and page 2. Page 2 returns `{"total": 99, "results": [...]}`. The total changed mid-pagination. Callers who built a progress bar using the initial total will show incorrect progress. The least astonishing behavior is a stable cursor that reflects the state at query time, not live counts.

**POLA in [API design](../../../system-design/api-design/)**:

- **Consistent naming**: if one endpoint is `/users/{id}`, don't make the next one `/widget-list`.
- **Consistent behavior**: if GET is idempotent on all other resources, it should be idempotent on this one too.
- **Consistent error shapes**: all errors should have the same JSON structure.
- **No surprise side effects**: a GET request should not modify state.

---

## How the three principles interact

Hyrum's Law says users will depend on whatever behavior they observe. Postel's Law says what inputs to accept and how to handle variance. POLA says the observed behavior should match what users expect.

The tension: being liberal in what you accept (Postel) can violate POLA, and the liberal behavior becomes a surprise contract per Hyrum. The synthesis: be predictable above all. Document exactly what you accept and what you do with edge cases. Predictability is what makes Hyrum's Law less dangerous. If the observable behavior matches what you documented, its stabilization is intentional, not accidental.

---

## References

- Wright, H. "Hyrum's Law." hyrumslaw.com.
- Postel, J. (1981). RFC 793: Transmission Control Protocol. IETF.
- Thomson, M. (2015). "The Harmful Consequences of the Robustness Principle." IETF Draft.
- Raymond, E.S. (2003). *The Art of Unix Programming*. Addison-Wesley. (POLA discussion in the design principles chapter.)

## Related topics

- [UI quantitative laws](../ui-quantitative/): Fitts's Law and Hick's Law (POLA's behavioral counterpart in UI)
- [Team dynamics](../team-dynamics/): Conway's Law, org structure shapes API shapes
