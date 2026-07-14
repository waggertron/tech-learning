---
title: Big Ball of Mud, how systems lose their shape and get it back
description: "Why software becomes tangled, how to recover without a big-bang rewrite, and which technical and organizational controls keep architectural drift visible and reversible."
date: 2026-07-13
tags: [architecture, technical-debt, legacy-systems, refactoring, software-design]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-13-big-ball-of-mud/
---

A Big Ball of Mud is a system whose structure is governed by accumulated expediency. Business concepts no longer have clear homes. Data crosses boundaries without contracts. A small change can force edits in unrelated areas, and nobody can predict the full effect with confidence.

Brian Foote and Joseph Yoder named the pattern in 1997. Their paper did not treat it as a story about careless programmers. It asked a harder question: if this architecture is so common, what forces make it useful?

That question still matters. Teams rarely choose a Big Ball of Mud. They choose a deadline, preserve a working behavior, copy an existing shortcut, or avoid touching code they cannot safely test. Each choice can be locally rational. The mud appears when those choices compound without a mechanism that restores structure.

## A monolith is not a Big Ball of Mud

A monolith is one deployment unit. It can still contain explicit modules, owned data, stable interfaces, fast tests, and one-way dependencies. A distributed system can be mud spread across a network if every service shares a database, releases require synchronized coordination, and one request crosses six teams.

The useful test is not "How many services do we have?" It is this:

> Can one team understand, test, change, and release one business capability without unpredictable changes elsewhere?

DORA's research describes loosely coupled architecture in similar operational terms. Teams can test and deploy independently, make substantial changes without outside permission, and complete work without fine-grained coordination. The runtime topology is secondary. A modular monolith can pass that test. A fleet of services can fail it.

## What the mud looks like

No single symptom proves the diagnosis. The pattern emerges when several of these reinforce each other:

- **Change amplification**: A small business rule requires edits across controllers, jobs, database code, UI state, and unrelated tests.
- **Shotgun coordination**: A routine release needs a meeting, a shared test environment, and synchronized work from several teams.
- **Promiscuous data**: Many modules read and write the same tables or global objects. Nobody owns the invariants.
- **Dependency cycles**: Packages call in both directions. Moving one concept pulls half the system with it.
- **Duplicated rules**: Pricing, permissions, validation, or state transitions have several implementations that disagree at the edges.
- **Fear-driven maintenance**: Engineers copy code instead of changing it because the existing path has unknown consumers.
- **Knowledge concentration**: Only one or two people know how a critical flow works, and their explanation starts with exceptions.
- **Slow feedback**: The build is unreliable, tests require a shared environment, and production is the first trustworthy integration test.
- **Declining delivery**: Lead time grows, failures become harder to recover from, and the proportion of work spent coordinating rises.

The most revealing measure is often the **blast radius of an ordinary change**. Count the modules, repositories, teams, database tables, and deployment steps touched by a representative feature. The trend matters more than a universal threshold.

## How a system gets there

### Throwaway code survives

A prototype is optimized for learning. That is sensible. The failure begins when the prototype proves the market and quietly becomes the production foundation. Its temporary assumptions now carry real traffic, but the schedule still treats structural work as optional.

Foote and Yoder called this **Throwaway Code**. The problem is not writing it. The problem is failing to decide whether to discard, harden, or contain it once its role changes.

### Piecemeal growth has no counterweight

Requirements change as users encounter the system. New cases are added where the old cases already live. A clean initial design can erode through hundreds of reasonable extensions.

Piecemeal growth is unavoidable. Uncontrolled dependency growth is not. Without tests or module rules that express the intended boundaries, the path of least resistance becomes the architecture.

### Keeping it working beats making it coherent

Production behavior has value, including behavior nobody intended. Replacing a strange path can break a customer workflow that was never documented. Engineers preserve it with another conditional, another flag, or another direct table update.

This is why old systems resist textbook refactoring. The real specification lives in running code, data, support procedures, and user habits. A rewrite team that reads only requirements will miss part of the product.

### The organization writes itself into the code

Melvin Conway observed that system designs reflect the communication structures of the organizations that create them. Shared ownership, component teams, and approval chains leave technical traces.

If one database team owns all persistence, data access tends to centralize. If six feature teams can change every module, boundaries become negotiation rather than ownership. If the frontend and backend are separate departments, business capabilities split across their handoff.

Architecture erosion is therefore a sociotechnical problem. A systematic mapping study of 73 architecture erosion studies found that nontechnical causes deserve the same attention as structural violations. Reorganizing packages while leaving incentives and ownership untouched produces a tidier version of the same failure.

### Pressure rewards visible output

Feature work has a customer, a date, and a revenue story. Reduced coupling often has none of those. The team absorbs its cost as longer estimates, more incidents, and extra coordination. Because the cost is distributed, no roadmap item owns it.

The result is a feedback loop:

```text
deadline pressure
      |
      v
local shortcut ---> hidden coupling ---> slower changes
      ^                                      |
      |                                      v
      +---------- more deadline pressure <---+
```

The team eventually appears slow, so management adds urgency. Urgency creates more shortcuts. The cause is treated as the cure.

### Architecture exists only in diagrams

A diagram can state that domain code does not depend on infrastructure. The compiler will still accept the import. A wiki can say that each module owns its data. A production query can still join every module's tables.

Rules that depend on memory decay under turnover and pressure. Architecture needs executable constraints where possible: dependency tests, contract tests, schema permissions, latency budgets, and deployment checks.

## Before recovery, choose the outcome

"Clean up the architecture" is not an outcome. It has no stopping condition and competes poorly with feature work.

Pick a business or delivery constraint that the current structure prevents:

- Cut the time to change pricing rules from three weeks to three days.
- Let the billing team deploy without coordinating with order management.
- Reduce incidents caused by shared customer state.
- Retire an unsupported runtime before its support deadline.
- Make the claims workflow testable without a shared staging environment.

Record a baseline. Useful measures include change lead time, failed deployment recovery time, change failure rate, number of teams required per change, files or modules touched per feature, dependency cycles, and production incidents tied to the target area. These are navigation instruments, not quotas.

## The escape procedure

Recovery works as a sequence of controlled changes. The system remains deployable throughout.

### 1. Map the system from evidence

Start with one painful business flow, not the entire repository.

Trace its entry points, calls, database reads and writes, events, background jobs, external dependencies, and owning teams. Compare the intended dependency graph with the actual one. Use version history to find files that repeatedly change together. High change frequency plus high coupling identifies better targets than aesthetics alone.

The output is a working map:

```text
Customer request
      |
      v
[ HTTP route ] ---> [ pricing rules ] ---> [ invoice write ]
      |                    |                       |
      v                    v                       v
[ auth lookup ]      [ shared config ]      [ shared database ]
                           |
                           v
                    [ nightly job ]
```

Do not spend a quarter documenting every path. Map enough to choose one boundary and make one change safely.

### 2. Build a safety net around behavior

Refactoring preserves observable behavior. In a legacy system, tests first have to reveal what that behavior is.

Add characterization tests at stable observation points: API responses, domain outputs, emitted events, database state, and important side effects. Capture representative production inputs after removing sensitive data. Add logs, traces, and metrics around the target flow. Establish a rollback path before changing routing or ownership.

The goal is not broad unit test coverage. It is confidence around the slice being moved. A hundred isolated tests can miss the contract that customers actually use.

### 3. Insert a boundary before replacing behavior

Find or create a seam where calls can be intercepted without changing the caller's observable result. A facade, repository interface, API gateway route, event router, or database adapter can serve this role.

This is **Branch by Abstraction** at system scale:

```text
Before

[ callers ] ----------------------> [ legacy implementation ]

Transition

[ callers ] ---> [ stable port ] ---> [ legacy adapter ]
                       |
                       +-------------> [ new implementation ]

After

[ callers ] ---> [ stable port ] ---> [ new implementation ]
```

The first release only inserts the port and legacy adapter. Behavior stays the same. Once that is proven in production, the new implementation can grow behind the port.

### 4. Move one vertical capability

Choose a slice that delivers a complete outcome: one product type, customer segment, workflow step, or read path. Avoid replacing a horizontal layer such as "all data access" unless the layer itself is the business constraint.

Route a small portion of traffic to the new path. Compare outputs when the operation can safely run in shadow mode. Use a feature flag or router configuration for fast rollback. Increase exposure only when production evidence agrees with the tests.

Martin Fowler's Strangler Fig description emphasizes this gradual replacement. The newer path grows around the old system while behavior moves in small releases. Patterns of Legacy Displacement adds the missing context: clarify outcomes, find a useful decomposition, deliver the parts, and change the organization so the work can continue.

### 5. Migrate data with explicit ownership

Code boundaries fail when data remains communal. Assign one owner for each business invariant and one authoritative write path.

Schema changes usually need a parallel-change sequence:

1. **Expand**: Add the new schema, event, or API without removing the old contract.
2. **Migrate**: Backfill existing data with checkpoints and reconciliation.
3. **Switch**: Move reads and writes behind the new owner in controlled segments.
4. **Verify**: Compare counts, invariants, and user-visible results.
5. **Contract**: Remove the old columns, writes, events, permissions, and compatibility code.

Dual writes are transitional risk, not a destination. Give every compatibility path an owner and deletion condition when it is introduced.

### 6. Align team ownership with the new boundary

A technical boundary without an owning team becomes shared mud again. Give one team authority over the capability, its data, its tests, and its production operation. Other teams consume a documented interface.

This does not require a service per team. It requires a boundary across which changes do not depend on informal knowledge or synchronized releases. DORA's practical criterion is independence, not a particular deployment topology.

### 7. Delete the old path

Migration is complete when the old code, data path, flag, adapter, and operational procedure are gone. Until then, the team maintains two systems and the transitional architecture becomes another source of mud.

Track deletion as part of the feature, not as later cleanup. Confirm that traffic is zero, remove the fallback, revoke old database access, delete dead tests, and update the system map.

### 8. Measure the result and repeat

Compare the target flow with its baseline. Did fewer teams coordinate? Did the blast radius shrink? Did lead time or recovery improve? Can the owning team test and release it independently?

If not, the extracted boundary may be wrong, the data may still be shared, or the approval process may remain coupled. Use the evidence to choose the next slice.

## Contain, modularize, extract, or reconstruct?

Recovery does not always mean creating a service.

| Situation | Best first move | Why |
| --- | --- | --- |
| Stable code with rare changes | Contain it behind an adapter | Rewriting dormant complexity has little return |
| One deployable, clear domain seams | Modularize in place | Process boundaries would add operational cost without solving ownership |
| One capability has distinct scaling or release needs | Extract that capability | Independent deployment has a concrete benefit |
| Shared database is the main coupling point | Establish data ownership first | HTTP boundaries do not fix communal state |
| Behavior is poorly understood but still valuable | Characterize, then replace incrementally | A rewrite would guess at the specification |
| Technology is unsupported and no safe seam exists | Reconstruct by vertical slice | Platform risk can justify replacement, but staged cutover still limits failure |
| Product behavior is no longer needed | Delete it | The cleanest component is the one the business does not require |

Total reconstruction is the last option. Foote and Yoder included it because some systems do reach that point. The burden of proof belongs to the rewrite: the team needs a bounded scope, a migration path, a way to learn unknown behavior, and a cutover that does not bet the business on one date.

## What fails during recovery

### The big-bang rewrite

The old system keeps changing while the replacement is built. Feature parity recedes, undocumented behavior appears late, and value remains trapped until cutover. A rewrite can produce cleaner code while repeating the same ownership and incentive structure.

### Microservices as a cleaning product

Splitting tangled modules into network processes preserves the coupling and adds latency, partial failure, versioning, and deployment coordination. A distributed Big Ball of Mud is harder to debug than a local one.

### A generic cleanup quarter

Repository-wide cleanup produces activity without proving that a business flow improved. Work by vertical slice, attach each structural change to an outcome, and release it.

### A permanent compatibility layer

Adapters and flags create options during migration. Left in place, they create more paths to understand. Every transitional component needs a removal trigger.

### An architecture review board as the primary control

Central review creates queues and moves knowledge away from the teams making daily decisions. Use specialists for consequential choices, but encode recurring rules in tools and give teams local authority within those constraints.

### Metrics as individual targets

Coupling counts and delivery measures reveal system behavior. Turning them into performance targets invites gaming. A team can improve deployment frequency by splitting deployments without improving flow. Read several signals together and inspect representative changes.

## Procedures that prevent a return to mud

No procedure prevents architectural drift entirely. Software changes because the business, team, and operating environment change. The achievable goal is to make harmful drift visible early, cheap to reverse, and owned by someone.

### Define boundaries in code

Organize modules around business capabilities. Give each module a public interface and hide its internals. Enforce allowed dependencies in CI. Reject cycles. Restrict database permissions so one module cannot quietly become another module's write path.

Tools such as ArchUnit can verify layer and module dependencies for JVM systems. Other ecosystems have equivalent dependency graph and import-linting tools. The tool matters less than turning an architectural sentence into a failing check.

### Give every capability an owner

Ownership includes code, data, runtime behavior, documentation, and deprecation. Consumers can request changes through an interface, but they do not bypass it with a direct query or import.

Ownership also needs a manageable cognitive load. A team nominally responsible for forty unrelated components will create shortcuts because it cannot understand the estate it owns.

### Make the desired qualities executable

Neal Ford, Rebecca Parsons, Patrick Kua, and Pramod Sadalage describe architecture fitness functions as objective checks on characteristics a system needs to preserve. Examples include:

| Architectural claim | Executable evidence |
| --- | --- |
| Billing does not depend on UI code | Dependency test in CI |
| Only Orders writes order state | Database role permissions plus an integration test |
| API clients remain compatible | Consumer-driven contract tests |
| Checkout stays within its latency budget | Production service-level indicator and alert |
| Modules can release independently | Deployment pipeline and release exercise |
| Sensitive data stays inside its boundary | Static checks, schema policy, and audit logs |

Not every quality can be automated. The discipline is to state how each important claim will be observed.

### Record consequential decisions

Use short Architecture Decision Records for choices that constrain future work. Capture the context, decision, alternatives, consequences, owner, and conditions that would trigger reconsideration. Keep them beside the code so the history changes with the system.

An ADR does not enforce anything. It prevents the rationale from disappearing and tells future engineers whether an awkward choice was deliberate, temporary, or obsolete.

### Keep changes small and releasable

Large branches hide integration problems and make architectural review harder. Google Engineering Practices recommends one self-contained change with its tests, kept small enough to review and roll back. Refactoring can precede a feature as a separate change that prepares the boundary.

Small changes only help when the build stays green and the path to production is routine. Continuous integration, automated tests, feature flags, observability, and rollback turn small commits into small operational risk.

### Improve the code where the work happens

Do not wait for a cleanup project to restore every shortcut. When a feature touches a boundary, leave that boundary at least as clear as it was. When an emergency forces a structural compromise, record it with an owner, consequence, and review date.

Google's code review standard frames this as continuous improvement in overall code health, balanced with forward progress. Perfection blocks delivery. Repeated small decreases create the mud.

### Review architecture with evidence

Run a lightweight review on a regular cadence and after major organizational changes. Inspect:

- The top change hotspots and files that change together.
- New dependency cycles and boundary violations.
- Capabilities that require several teams to release.
- Shared tables, queues, libraries, and test environments that act as bottlenecks.
- Incidents caused by unclear ownership or hidden coupling.
- Transitional adapters, flags, and schemas past their deletion conditions.
- Delivery trends for representative business flows.

The output is a short set of owned changes, not a new target diagram.

## A procedure for every significant change

The prevention system becomes practical when it fits normal delivery:

1. **Name the capability**: Identify the business behavior and the team that owns it.
2. **Trace the boundary**: List the interfaces, data, events, and downstream effects being changed.
3. **Protect the behavior**: Add or update tests at the most stable observation point.
4. **Check the direction**: Confirm that new dependencies follow the allowed module graph.
5. **Record the decision**: Add an ADR only when the choice has lasting architectural consequences.
6. **Release a small slice**: Use a flag, router, or compatible contract when rollout risk warrants it.
7. **Observe production**: Check both user outcomes and the architectural claim being protected.
8. **Remove the transition**: Delete old paths and flags once the new path is authoritative.

This procedure does not freeze the architecture. It lets the architecture evolve without losing the ability to explain or change it.

## The deeper lesson

The Big Ball of Mud persists because it is adaptive in the short term. It accepts uncertain requirements, scarce time, uneven skill, and existing behavior. Any alternative that ignores those forces will lose to it.

The answer is not more design ceremony. It is a system of counterweights:

- Small changes counter speculative design.
- Characterization tests counter unknown behavior.
- Explicit ownership counters shared responsibility.
- Enforced boundaries counter accidental coupling.
- Incremental replacement counters rewrite risk.
- Production measures counter architecture by opinion.
- Deletion counters permanent transition states.

Architecture stays healthy when the cheapest ordinary change also moves the system in an acceptable direction. When doing the right thing requires heroics, the process is already producing tomorrow's mud.

## References

- [Brian Foote and Joseph Yoder, *Big Ball of Mud*](https://www.laputan.org/mud/mud.html), the original pattern language for the forces, growth, containment, and reconstruction of muddled systems
- [Melvin Conway, *How Do Committees Invent?*](https://www.melconway.com/Home/Committees_Paper.html), the original account of how communication structures constrain system designs
- [DORA, Loosely coupled teams](https://dora.dev/capabilities/loosely-coupled-teams/), operational criteria and research connecting architecture, team independence, and delivery performance
- [Martin Fowler, Strangler Fig](https://martinfowler.com/bliki/StranglerFigApplication.html), gradual modernization instead of wholesale replacement
- [Ian Cartwright, Rob Horn, and James Lewis, Patterns of Legacy Displacement](https://martinfowler.com/articles/patterns-legacy-displacement/), decomposition, transitional architecture, parallel operation, and organizational change
- [Neal Ford, Rebecca Parsons, Patrick Kua, and Pramod Sadalage, *Building Evolutionary Architectures*](https://www.thoughtworks.com/en-us/insights/books/building-evolutionaryarchitectures-second-edition), guided incremental change and architectural fitness functions
- [Li et al., *Understanding Software Architecture Erosion: A Systematic Mapping Study*](https://arxiv.org/abs/2112.10934), a synthesis of 73 studies covering technical and nontechnical causes of erosion
- [Google Engineering Practices, Small CLs](https://google.github.io/eng-practices/review/developer/small-cls.html), why small, self-contained changes are easier to review, test, merge, and roll back
- [Google Engineering Practices, The Standard of Code Review](https://google.github.io/eng-practices/review/reviewer/standard.html), continuous improvement of code health without demanding perfection
- [ArchUnit User Guide](https://www.archunit.org/userguide/html/000_Index.html), executable checks for layers, modules, allowed dependencies, and cycles in JVM systems

## Related topics and posts

- [Microservices vs Monolith](../../topics/system-design/microservices/), deployment topology, bounded contexts, Conway's Law, and the modular monolith
- [Functional Core, Imperative Shell](../../topics/cs/functional-core-imperative-shell/), a concrete boundary between decisions and side effects
- [Team dynamics and technology laws](../../topics/cs/technology-laws/team-dynamics/), Conway's Law, Brooks's Law, and organizational constraints on software
- [Integration tests](../../topics/testing/integration-tests/), testing real boundaries without relying on production as the first integration environment
- [Composition over inheritance](../2026-04-24-composition-over-inheritance/), reducing coupling within object models and module designs
