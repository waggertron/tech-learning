---
title: From app idea to user problem
description: "Turn Field Notes from a feature idea into a specific user, situation, problem statement, smallest release, and measurable outcome."
date: 2026-07-19
tags: [ios, product-design, discovery, user-research, field-notes]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-app-idea-user-problem/
series:
  slug: zero-to-ios-hero
  order: 24
---

"A notes app with maps and photos" names a solution. It does not say who needs it, what goes wrong today, or why a new product deserves space on a person's device.

Product work begins by narrowing the situation. Field Notes serves people who need to capture an observation while moving, then find it later by place or meaning. That statement can be researched. A feature inventory cannot.

## Start with a behavior, not a framework

SwiftUI, UIKit, SwiftData, CloudKit, and MapKit are implementation choices. They cannot tell us whether the problem matters. Begin with observable behavior:

- A person notices something worth remembering away from a desk.
- Capture competes with weather, movement, gloves, glare, weak connectivity, and limited attention.
- The person later tries to recover the observation by text, time, or place.
- Existing work is split between camera photos, generic notes, and memory.

This frame produces better questions. How often does the event occur? What information gets lost? Which recovery cue works? What makes capture too slow?

## Name the first user narrowly

"Everyone who takes notes" hides conflicting needs. The first Field Notes user is:

> A frequent walker, naturalist, property inspector, or field researcher who captures short observations outdoors and needs to retrieve them later without maintaining a complex database.

That is still a hypothesis. Interviews and observation may split it into several groups. A narrow starting point makes contradictions visible.

## Write a problem statement

A useful problem statement includes a person, context, obstacle, and consequence:

> When moving through a location, the user needs to record a short observation with enough context to find it later. Camera and notes workflows separate the evidence from its meaning, so retrieval depends on memory and observations are lost.

The sentence does not prescribe tabs, a map, sync, or a database. Several solutions can still compete.

## Build an evidence map

Separate known facts from assumptions:

| Claim | Current evidence | Risk if false | Next check |
| --- | --- | --- | --- |
| capture happens while moving | interview reports and observation | editor may be too dense | observe five real capture sessions |
| location helps retrieval | repeated examples of forgotten place names | map work adds no value | ask users to recover old observations |
| offline capture matters | routes include weak coverage | release fails outside cities | test airplane-mode journey |
| photos are supporting evidence | users pair camera and notes today | media dominates product | compare text-only and photo-assisted tasks |

Strong evidence is direct behavior, not agreement with a pitch. Watch what people do. Ask for the last real example. Request artifacts such as screenshots, notebooks, or photo albums.

## Use interview questions that recover facts

Avoid "Would you use an app that...?" It invites politeness and imagination. Ask:

1. Tell me about the last observation you wanted to remember outdoors.
2. What did you record, and where?
3. What made capture difficult?
4. When did you try to find it again?
5. Show me the tools or artifacts you used.
6. What did you lose or have to reconstruct?
7. Which part happens often enough to change?

Follow the concrete story. A surprising workaround is more useful than a requested feature because it exposes the underlying job.

## Define the smallest valuable release

The first release must complete one useful loop:

```text
notice -> capture -> close app -> reopen -> retrieve -> recognize
```

For Field Notes, that means:

- create a note with title and body
- attach current location only after permission is understood and granted
- persist locally without network access
- list notes in recent order
- search visible text
- edit and delete with recovery

Accounts, cloud sync, collaboration, automatic classification, rich folders, and social sharing stay outside the first release. They may matter later, but they do not prove the core loop.

## Choose an outcome, not an output

"Ship six screens" measures production. A release outcome measures whether the product helps:

> In a moderated field trial, at least 8 of 10 target users can capture one observation in under 30 seconds and retrieve it the next day without facilitator help.

Supporting measures can reveal failure:

- median time from launch to saved note
- percentage of saves completed offline
- retrieval success by title, text, and location cue
- abandoned drafts
- permission denial completion rate
- destructive actions recovered through undo

Metrics do not replace observation. A fast save can still produce unusable notes. Pair numbers with session notes and artifacts.

## Write the one-page brief

The Field Notes brief is compact enough to review before each design decision:

| Field | Decision |
| --- | --- |
| user | frequent outdoor observer managing short records |
| situation | moving, distracted, sometimes offline |
| problem | evidence and meaning split across tools |
| promise | capture quickly and recover by recognizable cues |
| first loop | create, persist, list, search, edit, delete, undo |
| non-goals | accounts, social features, automatic taxonomy |
| outcome | 8 of 10 complete capture and next-day retrieval |
| largest risks | capture speed, permission trust, retrieval usefulness |

If a proposed feature does not improve the loop or test a named risk, it waits.

## Respect the platform without starting there

Apple's design guidance values clear hierarchy, familiar controls, direct manipulation, accessibility, and adaptation. Those principles shape the solution after the problem is understood. They do not decide which problem is worth solving.

Platform conventions reduce learning cost. Product evidence decides what the interface needs to support.

## Check your understanding

You should now be able to explain:

- Why an app idea is not yet a user problem.
- What makes a problem statement testable.
- Why recent behavior beats hypothetical intent.
- Which complete loop belongs in the first release.
- How an outcome differs from a shipped screen count.

The next post expands that release loop into journeys, states, denials, offline behavior, destructive actions, and recovery.

## Series navigation

- Previous: [Part 23: Modules, packages, access control, interoperability, and API design](../2026-07-19-swift-modules-packages-access-control-interoperability-api-design/)
- Next: [Part 25: User journeys, tasks, states, and edge cases](../2026-07-19-ios-user-journeys-tasks-states-edge-cases/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- **Apple design principles**: [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) provides the platform design foundation used after product framing.
- **Research with real behavior**: [Design Kit, The Field Guide to Human-Centered Design](https://www.designkit.org/resources/1) covers interviewing, observation, synthesis, and prototyping practices.
- **Accessible product choices**: [Accessibility](https://developer.apple.com/accessibility/) frames accessibility as part of product and interface design.

## Related topics

- [Modules, packages, access control, interoperability, and API design](../2026-07-19-swift-modules-packages-access-control-interoperability-api-design/), keeping the product rule independent of framework choices.
- [Learning by building and debugging](../2026-07-16-learning-by-building-debugging/), turning assumptions into small falsifiable experiments.
- [User journeys, tasks, states, and edge cases](../2026-07-19-ios-user-journeys-tasks-states-edge-cases/), expanding the first-release loop into complete behavior.
