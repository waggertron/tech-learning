# Field Notes Acceptance Specification

**Version:** 1.0
**Date:** 2026-07-16
**Applies to:** SwiftUI and UIKit core-path applications
**Deployment floor:** iOS and iPadOS 17.0

## Purpose

Field Notes is the shared product spine for Zero to iOS Hero. The SwiftUI and UIKit implementations must solve the same user problems and preserve the same data. They do not need identical view hierarchies, framework patterns, or pixels.

This specification is the product-level acceptance boundary. Framework-specific tests may add lifecycle, identity, navigation, restoration, reuse, focus, and memory checks without changing the shared behavior.

## Initial Product Slice

The first complete UI slice supports:

- Viewing notes ordered by most recent update.
- Searching title, body, and tags.
- Creating and editing a text note.
- Adding and removing tags.
- Marking a note as a favorite.
- Deleting a note with a recoverable confirmation path.
- Preserving committed notes across termination and relaunch.
- Explaining empty, loading, validation, persistence, and unexpected failure states.

Photos, location, maps, accounts, and sync join in later checkpoints. Their absence from the first slice is deliberate, not an implied success state.

## Layout Contract

### Compact width

```text
┌─────────────────────────────┐
│ Field Notes             [+] │
├─────────────────────────────┤
│ [Search notes...]           │
├─────────────────────────────┤
│ Redwood trail           >   │
│ forest, favorite            │
├─────────────────────────────┤
│ Tide pools              >   │
│ coast, yesterday            │
├─────────────────────────────┤
│ Notes     Map     Settings  │
└─────────────────────────────┘
```

### Regular width

```text
┌──────────────────┬──────────────────────────┐
│ Field Notes  [+] │ Redwood trail            │
├──────────────────┼──────────────────────────┤
│ [Search...]      │ Notes from the north     │
│                  │ trail...                 │
│ Redwood trail  > │                          │
│ Tide pools     > │ Tags: forest, morning    │
│ City garden    > │                          │
│                  │ [Favorite] [Edit]        │
└──────────────────┴──────────────────────────┘
```

Compact width uses list-to-detail navigation. Regular width keeps the collection and current detail visible when space permits. Tests select destinations by accessible identity and content, not by assuming a specific view hierarchy.

### Editor states

```text
┌─────────────────────────────┐
│ Cancel      New Note   Save │
├─────────────────────────────┤
│ Title                       │
│ [                         ] │
│ Title is required.          │
│                             │
│ Note                        │
│ [                         ] │
│ [                         ] │
│                             │
│ Tags                        │
│ [forest] [morning]      [+] │
└─────────────────────────────┘
```

Validation appears next to the affected field and is announced when it becomes visible. The same meaning cannot rely on red color alone.

## Shared Data Contract

A committed note has:

- A stable, opaque identifier.
- A title containing at least one non-whitespace character.
- Optional body text.
- Zero or more normalized tags, compared case-insensitively for uniqueness.
- A favorite flag.
- Creation and update timestamps supplied through an injected clock.

The application core owns validation and ordering. UI adapters may offer framework-native controls, but they cannot invent weaker validation, different search semantics, or different persistence behavior.

Fixture IDs, clocks, notes, failures, and repository state are deterministic. Invalid fixtures are named explicitly and bypass normal construction only inside negative test support. Production code never silently clamps or repairs invalid state unless the product contract names that repair.

## Shared Behavior Criteria

| ID | Behavior | Acceptance criteria |
| --- | --- | --- |
| FN-B01 | Launch | The app shows loading feedback while the first repository read is pending, then reaches content, empty, or error state exactly once for that load. |
| FN-B02 | Empty library | A person with no notes sees a clear empty explanation and a reachable create action. The list is not represented as a failure. |
| FN-B03 | Content order | Notes appear by descending update time. Equal timestamps use stable identifier order so fixtures and UI tests remain deterministic. |
| FN-B04 | Search | Search matches title, body, and tags case-insensitively. Trimming an empty query restores the full ordered collection. No match produces a search-specific empty state. |
| FN-B05 | Create | Saving a valid draft creates one note, assigns its ID and timestamps through injected dependencies, returns to the collection, and reveals the created note. |
| FN-B06 | Validate title | A blank or whitespace-only title does not save. The editor retains the draft, shows an inline explanation, moves accessibility focus to the problem, and offers a direct correction path. |
| FN-B07 | Edit | Editing begins from a copy of committed data. Saving replaces the committed note and advances its update timestamp. Cancelling leaves the committed note unchanged. |
| FN-B08 | Tags | Leading and trailing whitespace is removed. Empty tags are ignored. Tags differing only by case do not create duplicates. Display order remains deterministic. |
| FN-B09 | Favorite | Toggling favorite updates the visible control state and persists the change. Favorite is conveyed by label or value as well as appearance. |
| FN-B10 | Delete | Delete requires an explicit destructive confirmation from detail or an equally discoverable collection action. Cancelling preserves the note. Confirming removes it and returns to a valid collection state. |
| FN-B11 | Save failure | A failed save preserves the editable draft, explains that the note was not saved, and offers retry and cancel without creating a duplicate. |
| FN-B12 | Delete failure | A failed delete keeps the note visible, explains the failure, and permits retry. The UI does not present the note as gone before persistence confirms deletion. |
| FN-B13 | Reload | A manual or lifecycle-triggered reload does not duplicate notes, lose the current committed selection, or replace visible content with a blank screen while refresh is pending. |
| FN-B14 | Relaunch | After a successful save, terminating and relaunching the app restores the committed note from the production persistence adapter. Unsaved drafts are restored only after a later checkpoint explicitly adds draft restoration. |

## Accessibility Criteria

Both applications must satisfy the following on the compact and regular-width paths:

| ID | Requirement | Evidence |
| --- | --- | --- |
| FN-A01 | Every interactive element has a concise accessible name, role, value where needed, and an action that matches the visible control. | Automated accessibility assertions plus VoiceOver review. |
| FN-A02 | Reading and focus order follows the task order for navigation, title, metadata, body, tags, and actions. | VoiceOver manual pass on list, detail, editor, confirmation, and error states. |
| FN-A03 | Layout remains usable at the largest supported accessibility text sizes without clipped text, hidden actions, or mandatory horizontal scrolling. | Simulator screenshots and interaction pass with accessibility text sizes. |
| FN-A04 | Color is not the only signal for favorite, validation, destructive actions, selection, loading, or failure. | Contrast and meaning review in light, dark, and increased-contrast appearances. |
| FN-A05 | Reduce Motion preserves state and meaning when transitions or animations are present. | Manual Reduce Motion pass after motion enters the checkpoint. |
| FN-A06 | Hardware keyboard, Switch Control, and Voice Control users can reach create, search, select, edit, save, cancel, favorite, and delete. | Keyboard and alternative-input journey review. |
| FN-A07 | Right-to-left layout preserves logical order, alignment, navigation, and destructive confirmations. | Pseudolanguage or right-to-left locale simulator pass. |
| FN-A08 | Tests identify controls through stable accessibility identifiers only when a user-facing name is not sufficiently stable. Identifiers never replace useful labels. | UI-test source review and focused journeys. |

## Error-State Criteria

Errors are modeled as recoverable product states, not only alerts or logged strings.

```text
┌─────────────────────────────┐
│ Field Notes                 │
├─────────────────────────────┤
│ Notes could not be loaded.  │
│ Your saved data was not     │
│ changed.                    │
│                             │
│ [Try Again]                 │
└─────────────────────────────┘
```

- A loading failure distinguishes unavailable data from an empty library.
- A save failure retains the draft and does not create duplicate work on retry.
- A delete failure retains the note until storage confirms removal.
- A stale selection returns to a valid collection state with an explanation when needed.
- Error text says what failed, what happened to the person's data, and what action is available.
- Technical diagnostics may be logged through an injected boundary, but raw file paths, payloads, tokens, or internal error descriptions are not shown as product copy.
- Repeated lifecycle callbacks, task cancellation, and view reconstruction cannot produce duplicate requests or duplicate commits.

## Persistence Criteria

Persistence adapters pass one shared contract suite:

1. Saving a valid new note makes it available to a new repository instance over the same store.
2. Saving an existing ID replaces that note instead of appending a duplicate.
3. Deleting an existing ID removes it; deleting a missing ID has one documented idempotent result.
4. A failed transaction leaves the prior committed collection readable.
5. Ordering, tag normalization, Unicode text, favorite state, and timestamps survive a round trip.
6. Corrupt or unsupported stored data produces a typed failure and does not overwrite the source before recovery succeeds.
7. Tests use temporary stores and remove their files after completion.
8. In-memory adapters obey the same observable contract as the production adapter without pretending to prove disk migration or file-protection behavior.

Migration fixtures are added before the first schema change. A migration checkpoint preserves at least the immediately prior released schema and records both forward success and failure recovery.

## Framework-Specific Evidence

SwiftUI evidence additionally covers value-view identity, source-of-truth ownership, task cancellation, navigation restoration, environment dependencies, and Observation invalidation.

UIKit evidence additionally covers view-controller lifecycle repetition, containment, diffable updates, cell reuse, Auto Layout at trait changes, responder and focus behavior, state restoration, and deallocation after dismissal.

Framework-specific implementations may differ in composition. Product acceptance passes only when both adapters meet FN-B01 through FN-B14 and FN-A01 through FN-A08 at the applicable checkpoint.

## Evidence Rules

- Package tests prove domain, use-case, adapter-contract, and fixture behavior only.
- Simulator tests prove the named runtime and destination only.
- Previews and static screenshots do not prove interaction, persistence, accessibility, performance, or lifecycle behavior.
- Physical-device evidence is required for real camera, photo-library, sensor, haptic, background, thermal, energy, push, biometric, Bluetooth, and accessory behavior.
- A missing tool, runtime, device, account, or entitlement is recorded as **Not verified**. It is never converted into a passing criterion.
- SwiftUI and UIKit results are recorded separately even when they execute the same acceptance journey.

## Change Control

A post may extend this contract when it introduces a real product requirement. It cannot quietly weaken an existing criterion for one framework. Contract changes update the deterministic fixtures, shared tests, validation matrix, and both adapter backlogs in the same batch.
