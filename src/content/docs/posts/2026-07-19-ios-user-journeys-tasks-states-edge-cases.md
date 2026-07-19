---
title: User journeys, tasks, states, and edge cases
description: "Model capture, retrieval, editing, deletion, permission denial, offline work, failures, and recovery as complete Field Notes journeys."
date: 2026-07-19
tags: [ios, product-design, user-journeys, state-modeling, field-notes]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-user-journeys-tasks-states-edge-cases/
series:
  slug: zero-to-ios-hero
  order: 25
---

A screen mockup shows one moment. A journey shows what the person is trying to accomplish, the states encountered, what can fail, and how the product helps them recover.

Field Notes succeeds only if capture and retrieval work across launches, weak connectivity, permission choices, interruptions, and mistakes.

## Separate the goal from the interface

The user's goal is not "open the editor screen." The goal is "record this observation before I lose it." One goal can involve several tasks:

1. Start a new note.
2. Enter a recognizable title or body.
3. Decide whether location adds value.
4. Save locally.
5. Confirm the observation is recoverable.

Naming the goal prevents navigation and controls from becoming the journey definition.

## Map the capture journey

```text
launch
  |
  +-> empty library -> create
  |
  +-> populated library -> create
                           |
                           v
                       draft editor
                           |
             +-------------+-------------+
             |             |             |
             v             v             v
          save local   request place   abandon
             |             |             |
             v        granted/denied     v
       visible in list     |         keep/discard
             |             v
             +------> save with or without place
```

The permission denial path still completes the core task. Location is supporting context, not a gate in front of saving text.

## Inventory states before drawing screens

For each destination, write the states a person can reach:

| Area | States |
| --- | --- |
| library | loading, empty, populated, filtered empty, load failed |
| editor | pristine, changed, saving, saved, save failed, conflicted |
| location | not requested, requesting, granted, denied, restricted, unavailable |
| connectivity | online, offline, reconnecting |
| deletion | confirming, deleted with undo, undo expired, delete failed |

Several states can coexist. An editor can be changed, offline, and location-denied. Avoid one giant enum for unrelated dimensions. Use separate state dimensions, then define invalid combinations deliberately.

## Make empty states useful

An empty library is not a broken populated screen. It needs:

- a plain explanation of what will appear
- one clear create action
- no fake sample data that looks like the user's content
- accessibility focus on the explanation and action

A filtered-empty state is different. Existing notes are safe, but none match the query. Keep the query visible and provide a way to clear it.

## Offline is a normal state

The first release promises local capture. Offline work should follow the same create and edit path:

```text
edit -> local validation -> local save -> visible result
                                  |
                                  +-> future sync pending
```

Do not block local work behind a spinner for a remote system. If sync arrives later, the interface can show pending, synced, or conflicted state without rewriting the local capture contract.

Test airplane mode from cold launch, not only after data was already loaded into memory.

## Permission denial keeps a path forward

Ask for location when the person chooses a location-dependent action and can understand the benefit. Before the system prompt:

- explain which context will be attached
- explain that the note can save without it
- request only the level of access required

After denial, keep Save available. Offer a clear route to Settings only when enabling location is relevant. Repeated prompts do not repair lost trust.

## Design interruption and restoration

Phone calls, app switching, process termination, and scene changes can interrupt editing. Decide:

- when draft text persists
- whether the user sees a restored draft
- how stale drafts are identified
- what happens if the underlying note changed
- when temporary attachments are cleaned up

"Autosave" is not a complete answer. Name what is saved, where, how failure appears, and when the saved state becomes authoritative.

## Specify destructive recovery

Deletion needs consequences proportional to risk. For a single recoverable note:

1. Delete from a visible action.
2. Remove it from the list immediately.
3. Present a time-bounded Undo action.
4. Restore the same note identity and content if Undo wins.
5. Report failure without pretending deletion succeeded.

Confirmation can be appropriate for irreversible or high-impact deletion. Requiring confirmation for every reversible action adds friction without improving recovery.

## Write acceptance scenarios

Acceptance criteria turn the journey into testable behavior:

```text
Given the device is offline
And the library contains two notes
When the user creates a valid third note
Then the note appears in recent order
And it remains after relaunch
And sync is shown as pending without blocking editing
```

```text
Given location permission is denied
When the user saves a text note
Then the note persists without location
And the interface does not request permission again during that save
```

Cover success, boundary, invalid, cancellation, denial, and recovery paths. Avoid criteria tied to implementation details such as a specific database call.

## Use a journey review checklist

For every primary task, ask:

- What starts the journey?
- What state is visible before action?
- What confirms progress and success?
- What can fail locally or remotely?
- Can the person cancel?
- Can the person recover from a mistake?
- What survives interruption and relaunch?
- Can VoiceOver, keyboard, switch control, and large text complete it?

The checklist exposes missing product behavior before framework code hides it.

## Check your understanding

You should now be able to explain:

- Why a journey begins with a goal rather than a screen.
- How empty and filtered-empty states differ.
- Why permission denial cannot block the core note task.
- What an offline-first save promises.
- When undo is stronger than confirmation.

The next post organizes notes, maps, details, editing, and settings into a route graph based on objects and tasks rather than database tables.

## Series navigation

- Previous: [Part 24: From app idea to user problem](../2026-07-19-ios-app-idea-user-problem/)
- Next: [Part 26: Information architecture and navigation](../2026-07-19-ios-information-architecture-navigation/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- **State-aware interface guidance**: [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) covers navigation, feedback, loading, settings, and platform interaction patterns.
- **Permission experience**: [Requesting access to protected resources](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources) describes purpose strings and system authorization.
- **Accessible journeys**: [Accessibility](https://developer.apple.com/accessibility/) provides Apple platform accessibility resources and testing guidance.

## Related topics

- [From app idea to user problem](../2026-07-19-ios-app-idea-user-problem/), the release loop these journeys expand.
- [Enumerations, associated values, and pattern matching](../2026-07-16-swift-enumerations-associated-values-pattern-matching/), encoding mutually exclusive loading states.
- [Errors, Result, throwing APIs, and recovery](../2026-07-17-swift-errors-result-throwing-recovery/), preserving failure information for product recovery.
