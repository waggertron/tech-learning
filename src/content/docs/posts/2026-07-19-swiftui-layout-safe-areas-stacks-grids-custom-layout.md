---
title: SwiftUI layout, safe areas, stacks, grids, and custom layout
description: "Follow SwiftUI's proposal and response layout process from stacks and grids to an adaptive tag layout."
date: 2026-07-19
tags: [ios, swift, swiftui, layout, adaptive-design]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-swiftui-layout-safe-areas-stacks-grids-custom-layout/
series:
  slug: zero-to-ios-hero
  order: 33
---

SwiftUI layout is a negotiation. A parent proposes a size, a child reports the size it wants within that proposal, then the parent places the child.

## Read a frame as a request

```swift
Text(note.title)
    .frame(maxWidth: .infinity, alignment: .leading)
```

The frame offers its child space and reports a framed size upward. It does not mutate the intrinsic size of `Text`. Fixed width and height values can be appropriate for icons or bounded artwork, but they are poor defaults for localized text and resizable windows.

## Use stacks for relationships

```swift
VStack(alignment: .leading, spacing: 8) {
    Text(note.title).font(.headline)

    HStack {
        Label(note.placeName, systemImage: "mappin")
        Spacer()
        Text(note.updatedAt, format: .dateTime.hour().minute())
    }
    .font(.caption)
    .foregroundStyle(.secondary)
}
```

Alignment and spacing express relationships. `Spacer` consumes flexible space. Layout priority helps resolve competition, but it does not repair a composition that has no workable compact form.

## Let grids adapt to available width

```swift
let columns = [
    GridItem(.adaptive(minimum: 140), spacing: 12)
]

LazyVGrid(columns: columns, spacing: 12) {
    ForEach(notes) { note in
        NoteCard(note: note)
    }
}
```

Adaptive columns respond to container space instead of device names. Lazy containers create children as they become needed, which matters for large collections. They do not remove the need for stable IDs or cheap row computation.

## Safe areas carry system meaning

Content normally respects bars, sensors, rounded corners, and system regions. Backgrounds may extend farther than interactive content:

```swift
ZStack {
    Color(.systemGroupedBackground)
        .ignoresSafeArea()

    NoteList()
        .safeAreaPadding(.horizontal)
}
```

Do not ignore the safe area for the entire screen merely to make a color reach the edge. Keep controls, text, and gestures in usable regions. Keyboard and container safe areas also need observation in the actual app.

## A custom tag flow layout

Stacks cannot wrap tags. The `Layout` protocol can measure and place them while preserving ordinary child views:

```swift
struct TagFlowLayout: Layout {
    var spacing: CGFloat = 8

    func sizeThatFits(
        proposal: ProposedViewSize,
        subviews: Subviews,
        cache: inout ()
    ) -> CGSize {
        let result = rows(proposal: proposal, subviews: subviews)
        return result.size
    }

    func placeSubviews(
        in bounds: CGRect,
        proposal: ProposedViewSize,
        subviews: Subviews,
        cache: inout ()
    ) {
        let result = rows(proposal: proposal, subviews: subviews)
        for item in result.items {
            subviews[item.index].place(
                at: CGPoint(x: bounds.minX + item.origin.x,
                            y: bounds.minY + item.origin.y),
                proposal: .unspecified
            )
        }
    }
}
```

The omitted `rows` helper performs one deterministic measurement pass: place a chip on the current row if it fits, otherwise start a new row. Production code should cache measurements when profiling shows repeated work and should account for spacing, empty input, narrow proposals, and right-to-left placement.

Use it like any container:

```swift
TagFlowLayout {
    ForEach(note.tags) { tag in
        TagChip(name: tag.name)
    }
}
```

## Test the layout as a matrix

One screenshot proves one proposal. Check:

| Pressure | Expected response |
| --- | --- |
| narrow phone | chips wrap without horizontal clipping |
| wide window | rows use space without extreme fixed gaps |
| accessibility text | chip height grows and rows reflow |
| long localization | labels wrap or expand by declared policy |
| right-to-left | semantic order and placement remain coherent |
| empty tags | container reports a stable empty size |

Geometry readers and preference keys have valid uses, but adding measurement feedback can create update loops. Prefer standard containers and the layout protocol before measuring global coordinates.

## Validation boundary

The layout code is illustrative and was not compiled or rendered. The custom helper is intentionally incomplete until a later companion-app implementation supplies executable tests. Xcode, previews, Simulator sizes, Dynamic Type, and right-to-left placement remain Not verified.

## Series navigation

- Previous: [Part 32: SwiftUI composition, modifiers, styles, and components](../2026-07-19-swiftui-composition-modifiers-styles-components/)
- Next: [Part 34: SwiftUI controls, forms, validation, focus, and keyboards](../2026-07-19-swiftui-controls-forms-validation-focus-keyboard/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Layout](https://developer.apple.com/documentation/swiftui/layout) defines custom container measurement and placement.
- [Building layouts with stack views](https://developer.apple.com/documentation/swiftui/building-layouts-with-stack-views) covers stack composition.
- [SafeAreaRegions](https://developer.apple.com/documentation/swiftui/safearearegions) identifies regions that affect safe-area behavior.
