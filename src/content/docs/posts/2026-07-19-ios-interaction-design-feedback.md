---
title: Interaction design and feedback
description: "Specify Field Notes controls, focus, save progress, autosave, destructive deletion, undo, errors, and gesture alternatives as observable state transitions."
date: 2026-07-19
tags: [ios, product-design, interaction-design, feedback, undo, accessibility]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-interaction-design-feedback/
series:
  slug: zero-to-ios-hero
  order: 27
---

An interaction connects intent to outcome. A control communicates what can happen. Feedback communicates what did happen. Recovery gives the person a path when the outcome was wrong or incomplete.

Field Notes needs explicit contracts for saving, deletion, undo, focus, and progress before those behaviors are divided between SwiftUI modifiers or UIKit delegates.

## Write interactions as state transitions

An editor is not merely "open" or "closed":

```text
pristine
   |
   | edit
   v
changed ----save----> saving ----success----> saved
   ^                    |
   |                    +----failure----> save failed
   |                                         |
   +---------------retry or edit-------------+
```

Each transition names a trigger and visible result. The model answers questions that a static mockup cannot: Is Save enabled? Can the editor dismiss while saving? Does a failure preserve the draft?

## Controls need visible meaning

Use platform controls and familiar labels for common actions. A pencil icon may suggest editing, but a custom symbol with no label forces recognition work onto the user.

Every essential gesture needs a discoverable alternative:

| Gesture | Visible alternative |
| --- | --- |
| swipe to delete | Delete in context menu or detail actions |
| pull to refresh | automatic refresh plus explicit retry on failure |
| drag to reorder | Edit mode with named reorder affordance |
| pinch map | zoom controls and accessible map actions where appropriate |

Gestures can make frequent work faster. They cannot be the only way to complete a required task.

## Focus follows the task

When creating a note, initial focus can enter the title if immediate typing is the dominant task. When opening an existing note for reading, automatic keyboard presentation is disruptive.

After a transition:

- creation focuses the first required field
- validation failure moves focus to the first actionable error
- deletion returns focus near the removed item's prior position
- modal dismissal returns focus to the control that presented it
- a loading replacement announces the new state without resetting focus arbitrarily

Visual focus and accessibility focus are related but distinct. Test both with hardware keyboard and VoiceOver.

## Save feedback matches duration and risk

Fast local saves do not need a blocking progress view. Use a brief state change, updated timestamp, or status label. Longer work needs visible progress and cancellation when cancellation is safe.

Never report success before the authoritative local save succeeds. If remote sync follows local save, expose those outcomes separately:

```text
Saved locally
Sync pending
Sync failed, retry available
Synced
```

One "Saved" label must not conceal lost local data or imply completed cloud work.

## Autosave is a policy

Autosave needs answers:

- What change schedules a save?
- Is input debounced?
- What flushes pending work?
- Can two saves overlap?
- Which revision wins?
- How does failure remain visible?
- What survives termination?

A reasonable editor policy saves a draft locally after a short idle interval and when the scene becomes inactive. It serializes writes by revision. Dismissal waits for or explicitly preserves pending local work.

Autosave does not remove the need for a visible saved or failed state.

## Destructive actions need proportionate friction

Single-note deletion is recoverable, so immediate deletion plus Undo can preserve flow:

```text
visible note
    |
  delete
    v
removed, undo available
    |                 |
 undo             timeout
    |                 |
restored        permanently removed
```

The Undo action restores identity, content, ordering inputs, and attachments, not a partial copy. If deletion cannot be reversed, confirmation must state the specific consequence.

Destructive styling is a signal, not a substitute for a precise label.

## Error messages support the next action

"Something went wrong" does not help. A useful failure state says:

1. What did not complete.
2. Whether the person's data is safe.
3. What action is available.

Examples:

- "Couldn’t save this note. Your draft is still here. Try again."
- "Location isn’t available. Save without location or open Settings."
- "Sync paused while offline. Changes are saved on this device."

Do not expose internal error codes as the primary message. Preserve them in diagnostics where they help support and debugging.

## Progress never traps the user

For bounded operations, determinate progress communicates how much remains. For unknown duration, an activity indicator communicates ongoing work without inventing a percentage.

Cancellation needs a predictable result. If import cancellation keeps completed notes, say so. If it rolls back the whole operation, say that instead. Disable only controls whose actions would violate the current transition.

## Feedback uses more than color

Status needs text, shape, iconography, position, or spoken output in addition to color. Success, warning, and failure colors can reinforce meaning but cannot carry it alone.

Haptics can confirm a meaningful event on supported hardware. They are supplemental. Reduced Motion preferences and silent environments mean visual and spoken feedback still carry the contract.

## Interaction acceptance criteria

```text
Given a changed note and an available local store
When the user saves
Then editing remains available until saving begins
And a saving state is exposed accessibly
And success returns to saved with the same note identity
```

```text
Given a note was deleted and Undo is visible
When the user activates Undo before expiration
Then the note returns with the same identity and content
And focus moves to the restored note
```

These criteria can drive both SwiftUI and UIKit implementations.

## Check your understanding

You should now be able to explain:

- Why an interaction contract is a transition rather than a tap description.
- What autosave policy must define.
- Why local save and remote sync need separate feedback.
- When Undo is preferable to confirmation.
- Why color and gestures cannot be the only signal or control.

The next post turns these interaction states into a semantic visual system that adapts across type sizes, contrast, appearance, motion, and platform materials.

## Series navigation

- Previous: [Part 26: Information architecture and navigation](../2026-07-19-ios-information-architecture-navigation/)
- Next: [Part 28: Visual systems, HIG, typography, color, symbols, and materials](../2026-07-19-ios-visual-systems-hig-typography-color-symbols-materials/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- **Interaction patterns**: [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) covers controls, feedback, gestures, modality, progress, and destructive actions.
- **Accessible interaction**: [Accessibility](https://developer.apple.com/accessibility/) provides guidance and tools for VoiceOver, input, motion, and accessible feedback.
- **Undo contract**: [NSUndoManager](https://developer.apple.com/documentation/foundation/nsundomanager) documents Foundation's undo and redo registration model.

## Related topics

- [Information architecture and navigation](../2026-07-19-ios-information-architecture-navigation/), the destinations where these interactions occur.
- [User journeys, tasks, states, and edge cases](../2026-07-19-ios-user-journeys-tasks-states-edge-cases/), failure and recovery paths that drive feedback.
- [Errors, Result, throwing APIs, and recovery](../2026-07-17-swift-errors-result-throwing-recovery/), keeping enough failure detail to choose a next action.
