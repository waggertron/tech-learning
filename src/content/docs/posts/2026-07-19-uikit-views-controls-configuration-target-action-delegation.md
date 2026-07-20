---
title: UIKit views, controls, target-action, and delegation
description: "Build configured note rows and controls with target-action and delegation while keeping domain decisions outside reusable views."
date: 2026-07-19
tags: [ios, swift, uikit, controls, delegation]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-uikit-views-controls-configuration-target-action-delegation/
series:
  slug: zero-to-ios-hero
  order: 46
---

UIKit controls are objects that hold configuration and send events. Reusable views present state and report intent. They do not decide whether a note can be saved or deleted.

## Configure standard controls first

```swift
final class NoteRowView: UIView {
    private let titleLabel = UILabel()
    private let detailLabel = UILabel()

    override init(frame: CGRect) {
        super.init(frame: frame)
        titleLabel.font = .preferredFont(forTextStyle: .headline)
        titleLabel.adjustsFontForContentSizeCategory = true
        detailLabel.font = .preferredFont(forTextStyle: .subheadline)
        detailLabel.textColor = .secondaryLabel
        detailLabel.numberOfLines = 2
        configureHierarchy()
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) is unavailable") }

    func apply(note: FieldNote) {
        titleLabel.text = note.title
        detailLabel.text = note.body
    }
}
```

`apply` is idempotent. Reuse can call it repeatedly without accumulating subviews, gestures, or constraints.

## Send intent with target-action

```swift
private lazy var saveButton = UIButton(
    configuration: .filled(),
    primaryAction: UIAction(title: "Save") { [weak self] _ in
        self?.didRequestSave()
    }
)

private func didRequestSave() {
    guard let command = editor.makeSaveCommand() else {
        showValidationErrors()
        return
    }
    onSave?(command)
}
```

The action gathers input and emits a command. The use case owns validation that must remain true outside this controller and performs persistence.

## Use delegation for an ongoing relationship

A text field delegate can control editing transitions and report events over time. Keep ownership explicit because delegate properties are commonly weak. Closures fit one or a few focused actions. Protocol delegates fit a reusable object with several related events.

Do not subclass a standard control only to set colors or fonts. Configuration, content configuration, and composition usually keep behavior clearer.

## Reset reusable state

Rows and cells must replace text, images, accessory state, accessibility values, and pending async work when reused. A stale image task can otherwise finish into the wrong note.

## Validation boundary

The UIKit snippets were not compiled. Control configuration, target-action dispatch, delegate callbacks, Dynamic Type, accessibility, and reuse remain Not verified.

## Series navigation

- Previous: [Part 45: UIKit's event-driven mental model and app lifecycle](../2026-07-19-uikit-event-driven-mental-model-app-lifecycle/)
- Next: [Part 47: UIKit Auto Layout, stack views, guides, and priorities](../2026-07-19-uikit-auto-layout-stacks-guides-priorities-debugging/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [UIControl](https://developer.apple.com/documentation/uikit/uicontrol) defines control event handling.
- [UIButton.Configuration](https://developer.apple.com/documentation/uikit/uibutton/configuration-swift.struct) configures modern buttons.
- [Using delegates to customize object behavior](https://developer.apple.com/documentation/swift/using-delegates-to-customize-object-behavior) explains delegation in Swift.

## Related topics

- [SwiftUI composition, modifiers, styles, and components](../2026-07-19-swiftui-composition-modifiers-styles-components/)
- [Interaction design and feedback](../2026-07-19-ios-interaction-design-feedback/)
