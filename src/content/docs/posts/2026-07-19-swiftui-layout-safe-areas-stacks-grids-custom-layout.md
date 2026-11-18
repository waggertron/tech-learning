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

A wrapping tag container must do more than name the `Layout` protocol. It needs a repeatable row-packing rule, measurements from child views, and a placement policy for narrow and right-to-left layouts.

## Measure and pack rows separately

The companion's pure algorithm lives in `Packages/FieldNotesCore/Sources/FieldNotesCore/TagFlow.swift`:

```swift
public struct FlowSize: Equatable, Sendable {
    public let width: Double
    public let height: Double
    public init(width: Double, height: Double) { self.width = width; self.height = height }
}

public struct FlowPosition: Equatable, Sendable {
    public let x: Double
    public let y: Double
    public init(x: Double, y: Double) { self.x = x; self.y = y }
}

public struct FlowMeasurement: Equatable, Sendable {
    public let size: FlowSize
    public let positions: [FlowPosition]
}

/// Widths are measured by the interface before this pure row-packing step.
public enum TagFlow {
    public static func measure(sizes: [FlowSize], width: Double, spacing: Double = 8, rightToLeft: Bool = false) -> FlowMeasurement {
        let available = max(0, width.isFinite ? width : sizes.reduce(0) { $0 + $1.width + spacing })
        var positions: [FlowPosition] = []
        var x = 0.0
        var y = 0.0
        var rowHeight = 0.0
        var usedWidth = 0.0
        for size in sizes {
            let itemWidth = min(available, max(0, size.width))
            if x > 0, x + itemWidth > available {
                x = 0
                y += rowHeight + spacing
                rowHeight = 0
            }
            positions.append(FlowPosition(x: rightToLeft ? available - x - itemWidth : x, y: y))
            usedWidth = max(usedWidth, x + itemWidth)
            rowHeight = max(rowHeight, size.height)
            x += itemWidth + spacing
        }
        return FlowMeasurement(size: FlowSize(width: rightToLeft ? available : usedWidth, height: sizes.isEmpty ? 0 : y + rowHeight), positions: positions)
    }
}
```

Each item either fits on the current row or starts the next one. Row height is the maximum child height. Empty input has zero height. A child wider than the proposal is assigned the available width; its measured height must come from that same constrained proposal.

Right-to-left placement mirrors each x coordinate within the available width. It preserves the input order rather than sorting the tags backwards.

## Connect the algorithm to SwiftUI

`Apps/SwiftUI/TagFlowLayout.swift` provides the complete adapter:

```swift
import FieldNotesCore
import SwiftUI

struct TagFlowLayout: Layout {
    var rightToLeft = false
    var spacing: CGFloat = 8

    private func measurement(proposal: ProposedViewSize, subviews: Subviews) -> (FlowMeasurement, [CGSize]) {
        let measured = subviews.map { $0.sizeThatFits(ProposedViewSize(width: proposal.width, height: nil)) }
        let width = proposal.width ?? measured.reduce(0) { $0 + $1.width + spacing }
        let result = TagFlow.measure(
            sizes: measured.map { FlowSize(width: $0.width, height: $0.height) },
            width: width, spacing: spacing, rightToLeft: rightToLeft
        )
        return (result, measured)
    }

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let result = measurement(proposal: proposal, subviews: subviews).0
        return CGSize(width: result.size.width, height: result.size.height)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let (result, sizes) = measurement(proposal: ProposedViewSize(width: bounds.width, height: nil), subviews: subviews)
        for index in subviews.indices {
            let point = result.positions[index]
            subviews[index].place(
                at: CGPoint(x: bounds.minX + point.x, y: bounds.minY + point.y),
                anchor: .topLeading,
                proposal: ProposedViewSize(width: min(bounds.width, sizes[index].width), height: sizes[index].height)
            )
        }
    }
}


```

`sizeThatFits` reports the measured container. `placeSubviews` uses the final bounds and places every child with an explicit top-leading anchor. The detail screen passes its environment layout direction into `rightToLeft`.

## Choose the simpler container first

A `VStack` or `HStack` expresses a single row or column. `LazyVGrid` is useful when a grid's column policy matches the content. A custom `Layout` earns its cost here because tags have unequal widths and need wrapping.

Do not ignore safe areas on the entire screen just to extend a background. The app keeps interactive content inside system-provided usable regions.

## Check geometry and rendering separately

`tagFlowBoundaries` tests empty input, two wrapped rows, larger child heights, a too-wide child, and mirrored x positions. These package tests passed with Swift 6.3.3. The source also includes narrow/large-text and RTL previews. Preview rendering, actual text measurement, and accessibility still need the Xcode target and remain unverified.

## Series navigation

- Previous: [Part 32: SwiftUI composition, modifiers, styles, and components](../2026-07-19-swiftui-composition-modifiers-styles-components/)
- Next: [Part 34: SwiftUI controls, forms, validation, focus, and keyboards](../2026-07-19-swiftui-controls-forms-validation-focus-keyboard/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [Layout](https://developer.apple.com/documentation/swiftui/layout) defines custom container measurement and placement.
- [Building layouts with stack views](https://developer.apple.com/documentation/swiftui/building-layouts-with-stack-views) covers stack composition.
- [SafeAreaRegions](https://developer.apple.com/documentation/swiftui/safearearegions) identifies regions that affect safe-area behavior.
