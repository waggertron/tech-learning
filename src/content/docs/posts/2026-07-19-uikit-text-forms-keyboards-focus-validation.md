---
title: UIKit text, forms, keyboards, focus, and validation
description: "Build a draft-based UIKit editor with text fields, text views, input traits, focus traversal, keyboard layout, and validation recovery."
date: 2026-07-19
tags: [ios, swift, uikit, forms, keyboards]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-uikit-text-forms-keyboards-focus-validation/
series:
  slug: zero-to-ios-hero
  order: 52
---

UIKit form controls edit temporary input. The persisted note changes only after the draft passes validation and Save succeeds.

## Keep a draft beside the controls

```swift
struct NoteDraft: Equatable {
    var title: String
    var body: String

    var titleError: String? {
        title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
            ? "Enter a title."
            : nil
    }
}
```

Text-field and text-view delegates copy edits into this draft. Cancel compares it with the original. A save failure preserves it.

## Configure input as a hint

```swift
titleField.placeholder = "Title"
titleField.returnKeyType = .next
titleField.textContentType = nil
titleField.adjustsFontForContentSizeCategory = true
```

Keyboard type, capitalization, and content type help entry. They do not validate pasted text, dictation, hardware keyboards, or automation.

## Move focus intentionally

```swift
func textFieldShouldReturn(_ textField: UITextField) -> Bool {
    bodyView.becomeFirstResponder()
    return true
}
```

Validation failure can focus the first invalid control and expose a nearby error. VoiceOver announcements and reading order require separate testing.

## Follow the keyboard layout guide

Constrain the form or bottom action region against `keyboardLayoutGuide` when the deployment floor supports it. Do not translate the whole root view by notification height. Split keyboards, floating keyboards, rotation, hardware keyboards, and interactive dismissal break that assumption.

## Validate one action path

Toolbar Save, keyboard shortcut, and Return submission call the same method. The method updates attempted-save state, renders errors, builds a domain command, prevents duplicate work, and preserves the draft on failure.

## Validation boundary

Text entry, delegate order, focus, keyboard geometry, validation announcements, hardware input, and Dynamic Type remain Not verified.

## Series navigation

- Previous: [Part 51: UIKit responder chain, gestures, menus, and input](../2026-07-19-uikit-responder-chain-gestures-menus-drag-drop-input/)
- Next: [Part 53: UIKit table views, reuse, prefetching, and diffable data](../2026-07-19-uikit-table-views-reuse-prefetching-diffable-data/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [UITextField](https://developer.apple.com/documentation/uikit/uitextfield) provides single-line text input.
- [UITextView](https://developer.apple.com/documentation/uikit/uitextview) provides multiline editing.
- [UIKeyboardLayoutGuide](https://developer.apple.com/documentation/uikit/uikeyboardlayoutguide) represents keyboard-obscured layout.

## Related topics

- [SwiftUI controls, forms, validation, focus, and keyboards](../2026-07-19-swiftui-controls-forms-validation-focus-keyboard/)
- [Accessibility, localization, and inclusive product design](../2026-07-19-ios-accessibility-localization-inclusive-product-design/)
