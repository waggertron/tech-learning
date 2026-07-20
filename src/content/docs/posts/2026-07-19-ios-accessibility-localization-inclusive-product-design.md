---
title: Accessibility, localization, and inclusive product design
description: "Audit the Field Notes editor for VoiceOver, Dynamic Type, contrast, motion, keyboard input, right-to-left layout, and locale-aware content before implementation."
date: 2026-07-19
tags: [ios, accessibility, localization, inclusive-design, voiceover, dynamic-type]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-ios-accessibility-localization-inclusive-product-design/
series:
  slug: zero-to-ios-hero
  order: 30
---

Accessibility and localization change product behavior, layout, content, and testing. They are not labels and string files added after a screen is finished.

Field Notes succeeds when a person can capture and retrieve an observation through the input, display, language, and assistive technology that fits their situation.

## Begin with the task

The editor's essential task is:

```text
understand current note
        |
        v
enter or revise content
        |
        v
understand validation and save state
        |
        v
save, cancel, or recover
```

Every supported interaction path must preserve that loop. A VoiceOver user needs the same information and actions as a sighted touch user. A hardware-keyboard user needs more than a series of touch targets. A translated interface needs room for the meaning, not the English character count.

## Audit semantics before labels

Accessibility begins with correct control roles and relationships:

| Element | Semantic contract |
| --- | --- |
| title input | labeled editable text field, required state, validation relationship |
| body input | labeled multiline editor with predictable reading order |
| location | current value, permission or unavailable state, change action |
| favorite | toggle role with current on or off state |
| Save | button role, enabled state, progress and result |
| validation message | associated with its field and announced when it changes |
| Delete | destructive action with precise consequence and recovery |

A custom drawing with an accessibility label is not automatically equivalent to a native control. Role, value, state, actions, focus behavior, activation, and input support all matter.

## Design the VoiceOver order

Visual coordinates do not always produce the useful spoken order. The Field Notes editor should move through:

1. Navigation title and context.
2. Note title label, value, and required status.
3. Body label and value.
4. Tags and their remove actions.
5. Location value and change action.
6. Favorite state.
7. Save status and primary actions.

Group related content when it shortens navigation without hiding individual actions. Decorative symbols and separators stay out of the accessibility tree.

After validation fails, move focus only when that helps recovery. Announce the error and preserve the person's text.

## Dynamic Type changes composition

Large text changes more than font size:

- toolbar labels may no longer fit beside icons
- metadata rows may need to stack
- fixed-height editors can hide content
- buttons need more vertical space
- side-by-side fields may need one column
- sheets may need scrolling

Test the largest accessibility sizes with realistic long content. Do not shrink text, clip required labels, or force horizontal scrolling to preserve a screenshot.

The editor can move secondary actions into a labeled menu while keeping Save visible. That is adaptation, not a reduced feature set.

## Contrast and color need redundant meaning

Error, warning, pending, and success states need text or symbols in addition to color:

```text
Couldn’t save. Draft preserved. Try again.
Sync pending. Changes are saved on this device.
Saved locally.
```

Check standard and increased contrast plus Differentiate Without Color. Custom colors need measured contrast in every appearance. System colors and materials still require testing in the actual composition.

## Motion communicates without excluding

Animation can connect an inserted note to its new position or preserve context during navigation. Reduce Motion may replace a large transition with a fade or immediate state change.

Never make motion the only evidence that save completed or deletion occurred. Avoid automatic motion that competes with text entry or causes disorientation.

## Support several input methods

Touch, pointer, keyboard, Voice Control, Switch Control, and assistive touch can coexist. Essential actions remain visible and named.

Keyboard support includes:

- predictable Tab and arrow-key focus
- standard text-editing behavior
- shortcuts for New, Search, Save, and Close
- Escape or Cancel behavior that respects unsaved work
- no keyboard trap inside a custom control

Voice Control benefits from visible labels that match spoken action names. Icon-only controls need accessible names even when their symbols feel familiar.

## Localize meaning, not fragments

Avoid building sentences from translated pieces:

```swift
Text("\(count) " + translatedNoun + " " + translatedVerb)
```

Word order, plural categories, grammar, and inflection differ by locale. Give translators complete messages with context and use the platform's localized string and formatting systems in the UI implementation.

User-authored note text is data. It should not be interpreted as a localization key.

## Format for the locale

Dates, times, numbers, measurements, lists, and names need locale-aware formatting. Storage remains stable and machine-readable. Presentation derives from the current locale and calendar.

Do not persist a formatted date as the authoritative timestamp. Store the value, then format it for display.

Test:

- a locale with longer translated labels
- right-to-left layout
- non-Latin scripts
- 12-hour and 24-hour time
- calendars and numerals that differ from the development default
- plural values at zero, one, two, and larger counts

## Right-to-left layout mirrors relationships

Leading and trailing adapt. Left and right are physical directions. Use semantic alignment for interface hierarchy and reserve physical directions for content that is inherently directional.

Directional symbols need review. Back navigation and progression may mirror. Media playback, maps, clocks, and some domain arrows may not.

An RTL audit checks reading order, alignment, navigation, mixed-direction note text, cursor behavior, and clipped translations.

## Write the editor audit

| Area | Check | Passing evidence |
| --- | --- | --- |
| VoiceOver | order, labels, values, traits, actions | full create and save journey without sight |
| Dynamic Type | largest accessibility sizes | no clipped required content or blocked action |
| contrast | both appearances and increased contrast | state remains legible and distinguishable |
| motion | Reduce Motion enabled | meaning survives without large movement |
| keyboard | focus and shortcuts | create, edit, save, cancel, delete, undo |
| Voice Control | spoken labels | visible action names activate controls |
| localization | long and pluralized strings | no fragments or truncation |
| RTL | mirrored hierarchy and mixed text | full journey preserves order and meaning |

This table is a specification. It becomes evidence only after the interface runs through the matching environment and assistive technology.

## Include disabled and error states

An accessibility pass on the happy path misses the hardest moments. Audit:

- blank-title validation
- save in progress
- local save failure with draft preserved
- location permission denied
- offline sync pending
- deleted note with Undo
- missing deep-linked note
- restored draft after interruption

Focus, announcements, labels, and actions need coherent behavior in every state.

## Inclusive design can simplify the product

Requirements that help one access need often help everyone. Larger targets help people moving outdoors. Clear save status helps weak-network users. Keyboard commands help power users and users with motor impairments. Plain permission explanations help people deciding whether to trust the app.

Design around the complete range of conditions rather than an imagined average user.

## Validation boundary

This post defines the audit but does not execute it. The local environment lacks full Xcode and Simulator runtimes. VoiceOver order, Dynamic Type rendering, contrast, motion settings, input methods, localization, and RTL layout remain Not verified until the SwiftUI and UIKit interfaces exist on the supported Apple toolchain.

## Check your understanding

You should now be able to explain:

- Why an accessibility label alone does not make a custom control equivalent.
- How Dynamic Type changes composition.
- Why localization needs complete messages and stable stored values.
- When leading and trailing differ from left and right.
- Which evidence turns an audit specification into a verified result.

The product-design arc is complete. The next post begins SwiftUI with its value-view model, persistent state storage, identity, dependencies, and `body` evaluation.

## Series navigation

- Previous: [Part 29: Adaptive design for iPhone, iPad, and windows](../2026-07-19-ios-adaptive-design-iphone-ipad-windows/)
- Next: Part 31, SwiftUI's value-view mental model
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- **Apple accessibility guidance**: [Accessibility](https://developer.apple.com/accessibility/) collects platform guidance, assistive technologies, testing tools, and design resources.
- **SwiftUI semantics**: [Accessibility fundamentals](https://developer.apple.com/documentation/swiftui/accessibility-fundamentals) explains how SwiftUI exposes interface meaning.
- **Localization workflow**: [Localization](https://developer.apple.com/localization/) covers internationalization, String Catalogs, testing, and App Store localization.

## Related topics

- [Adaptive design for iPhone, iPad, and windows](../2026-07-19-ios-adaptive-design-iphone-ipad-windows/), the size, input, and scene matrix this audit extends.
- [Visual systems, HIG, typography, color, symbols, and materials](../2026-07-19-ios-visual-systems-hig-typography-color-symbols-materials/), semantic visual roles for type, contrast, and motion.
- [Interaction design and feedback](../2026-07-19-ios-interaction-design-feedback/), the focus, error, progress, and recovery contracts under audit.
