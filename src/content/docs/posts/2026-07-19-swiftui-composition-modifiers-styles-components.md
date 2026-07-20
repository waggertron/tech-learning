---
title: SwiftUI composition, modifiers, styles, and components
description: "Build reusable SwiftUI rows, tag chips, and button styles while keeping data flow and product rules visible."
date: 2026-07-19
tags: [ios, swift, swiftui, composition, design-systems]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-swiftui-composition-modifiers-styles-components/
series:
  slug: zero-to-ios-hero
  order: 32
---

SwiftUI composition works best when an extracted type has a clear interface responsibility. A component is not valuable merely because it shortens a file.

## Start from the repeated meaning

Field Notes shows a title, summary, tags, and favorite state in several collections. That is a useful `NoteRow` boundary:

```swift
struct NoteRow: View {
    let note: FieldNote

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text(note.title).font(.headline)
                Spacer()
                if note.isFavorite {
                    Image(systemName: "star.fill")
                        .foregroundStyle(.yellow)
                        .accessibilityLabel("Favorite")
                }
            }

            Text(note.body)
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .lineLimit(2)

            TagStrip(tags: note.tags)
        }
        .padding(.vertical, 4)
    }
}
```

The row receives immutable input. It does not fetch, save, navigate, or decide whether the user may edit.

## Extract small components with a contract

```swift
struct TagChip: View {
    let name: String

    var body: some View {
        Text(name)
            .font(.caption)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(.tint.opacity(0.12), in: Capsule())
            .accessibilityLabel("Tag, \(name)")
    }
}

struct TagStrip: View {
    let tags: [String]

    var body: some View {
        HStack {
            ForEach(tags, id: \.self) { tag in
                TagChip(name: tag)
            }
        }
    }
}
```

String identity is acceptable only if tag names are unique within this collection. A tag domain type with a stable ID is safer when names can repeat or change.

Do not extract every `HStack`. Extract when the result names a concept, owns a coherent interaction, repeats with the same contract, or isolates meaningful visual policy.

## Modifiers transform descriptions

Modifier order is part of the result:

```swift
Text("Saved")
    .padding(8)
    .background(.green, in: Capsule())
```

This pads the text before drawing the background. Reversing those calls draws a tight background, then adds transparent outer space.

A custom modifier is useful for a repeated visual transformation:

```swift
struct ValidationMessage: ViewModifier {
    let isVisible: Bool

    func body(content: Content) -> some View {
        content
            .foregroundStyle(isVisible ? .red : .secondary)
            .accessibilityHidden(!isVisible)
    }
}
```

Keep hidden business behavior out of modifiers. A modifier named `noteCard()` should not save a note or start network work.

## Styles preserve the control role

Use a style when several controls share presentation while retaining native button behavior:

```swift
struct PrimaryActionStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.headline)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .foregroundStyle(.white)
            .background(
                configuration.isPressed ? Color.accentColor.opacity(0.75) : .accentColor,
                in: RoundedRectangle(cornerRadius: 12)
            )
    }
}

Button("Save", action: save)
    .buttonStyle(PrimaryActionStyle())
```

This stays a `Button`, so activation, focus, disabled state, keyboard behavior, and accessibility semantics begin from the system control instead of a custom tap gesture.

## Design component APIs around intent

Prefer a narrow input:

```swift
NoteRow(note: note)
TagChip(name: tag.name)
```

Avoid an option bag with many unrelated Boolean switches. If two variants have different meaning or interaction, two focused types can be clearer than one universal component.

Composition also applies to content slots:

```swift
struct EmptyState<Action: View>: View {
    let title: String
    @ViewBuilder let action: () -> Action

    var body: some View {
        ContentUnavailableView(title, systemImage: "note.text") {
            action()
        }
    }
}
```

The generic content preserves type information. It does not require `AnyView` to erase every caller.

## Review the boundary

A useful component answers yes to at least one question:

- Does the name communicate a product or design-system concept?
- Does it hide visual mechanics while keeping behavior explicit?
- Does it preserve native semantics?
- Can it be previewed in meaningful states?
- Does extraction reduce repeated policy rather than only repeated syntax?

## Validation boundary

These SwiftUI snippets were reviewed against the series component rules but were not compiled. Xcode, Apple SDK, preview, Simulator, and accessibility behavior remain Not verified.

## Series navigation

- Previous: [Part 31: SwiftUI's value-view mental model](../2026-07-19-swiftui-value-view-mental-model/)
- Next: [Part 33: SwiftUI layout, safe areas, stacks, grids, and custom layout](../2026-07-19-swiftui-layout-safe-areas-stacks-grids-custom-layout/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Configuring views](https://developer.apple.com/documentation/swiftui/configuring-views) covers modifiers and environment-driven configuration.
- [ButtonStyle](https://developer.apple.com/documentation/swiftui/buttonstyle) defines reusable button presentation without replacing the button role.
- [ViewBuilder](https://developer.apple.com/documentation/swiftui/viewbuilder) supplies typed declarative child content.
