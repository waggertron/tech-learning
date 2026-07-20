---
title: UIKit sheets, popovers, alerts, activities, and pickers
description: "Choose push, modal, popover, alert, activity, and system-picker presentations from task scope and container ownership."
date: 2026-07-19
tags: [ios, swift, uikit, presentation, system-ui]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-uikit-sheets-popovers-alerts-activities-system-pickers/
series:
  slug: zero-to-ios-hero
  order: 50
---

Presentation style communicates the relationship between the current task and the next one. Push for deeper hierarchy. Present a sheet for focused work. Use a popover for contextual choices. Reserve alerts for decisions that need immediate attention.

## Present from an owning controller

```swift
@MainActor
func presentEditor(for noteID: NoteID?) {
    let editor = NoteEditorViewController(noteID: noteID, library: library)
    let navigation = UINavigationController(rootViewController: editor)
    navigation.modalPresentationStyle = .pageSheet
    present(navigation, animated: true)
}
```

The presenting controller belongs to the active hierarchy. A detached controller cannot reliably present system UI. The editor owns Save and Cancel behavior, including unsaved-change policy.

## Adapt popovers explicitly

```swift
let controller = TagActionsViewController(tag: tag)
controller.modalPresentationStyle = .popover
controller.popoverPresentationController?.sourceView = tagButton
controller.popoverPresentationController?.sourceRect = tagButton.bounds
present(controller, animated: true)
```

Popover source information is required on presentations that use a popover. Compact environments may adapt it to a sheet. Test both forms.

## Use system controllers for system jobs

Photo selection, document selection, sharing, mail, and browser presentation come with platform behavior, privacy handling, and accessibility. Wrap their delegate or callback result at the adapter boundary rather than rebuilding them.

```swift
let activity = UIActivityViewController(
    activityItems: [exportURL],
    applicationActivities: nil
)
present(activity, animated: true)
```

An activity item must not expose private content the user did not select. iPad presentation and completion outcomes need explicit handling.

## Keep alerts precise

An alert names the exact consequence and actions. “Delete Creek crossing?” is better than “Are you sure?” Destructive confirmation is not a substitute for Undo when recovery is feasible.

## Validation boundary

The snippets were not compiled or presented. Adaptive sheets, popovers, system pickers, privacy prompts, activity completion, and accessibility remain Not verified.

## Series navigation

- Previous: [Part 49: UIKit navigation, tabs, split views, and coordinators](../2026-07-19-uikit-navigation-tabs-split-views-coordinators/)
- Next: [Part 51: UIKit responder chain, gestures, menus, and input](../2026-07-19-uikit-responder-chain-gestures-menus-drag-drop-input/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Showing and hiding view controllers](https://developer.apple.com/documentation/uikit/showing-and-hiding-view-controllers) covers container and modal presentation.
- [UIActivityViewController](https://developer.apple.com/documentation/uikit/uiactivityviewcontroller) presents system sharing services.
- [PHPickerViewController](https://developer.apple.com/documentation/photokit/phpickerviewcontroller) provides system photo selection.

## Related topics

- [Interaction design and feedback](../2026-07-19-ios-interaction-design-feedback/)
- [UIKit navigation, tabs, split views, and coordinators](../2026-07-19-uikit-navigation-tabs-split-views-coordinators/)
