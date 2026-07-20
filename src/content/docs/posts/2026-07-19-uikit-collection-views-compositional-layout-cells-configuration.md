---
title: UIKit collection views and compositional layout
description: "Build list, grid, and attachment sections from compositional layout, registrations, content configurations, and stable diffable identifiers."
date: 2026-07-19
tags: [ios, swift, uikit, collection-views, compositional-layout]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-uikit-collection-views-compositional-layout-cells-configuration/
series:
  slug: zero-to-ios-hero
  order: 54
---

A collection view can render lists, grids, carousels, and mixed sections. Layout describes geometry. Registrations describe reusable presentation. A diffable snapshot describes current identity and order.

## Build layout per section

```swift
let layout = UICollectionViewCompositionalLayout { section, environment in
    if section == 0 {
        return NSCollectionLayoutSection.list(
            using: UICollectionLayoutListConfiguration(appearance: .insetGrouped),
            layoutEnvironment: environment
        )
    }

    let columns = environment.container.effectiveContentSize.width > 700 ? 4 : 2
    return attachmentGrid(columns: columns)
}
```

The environment reports available container space. The layout does not branch on device name.

## Register configuration, not a decoration subclass

```swift
let noteRegistration = UICollectionView.CellRegistration<UICollectionViewListCell, NoteID> {
    [weak self] cell, _, id in
    guard let note = self?.notesByID[id] else { return }
    var content = UIListContentConfiguration.subtitleCell()
    content.text = note.title
    content.secondaryText = note.body
    cell.contentConfiguration = content
}
```

Subclass when the cell owns meaningful custom behavior or hierarchy. Content and background configurations cover many presentation-only cases.

## Keep three responsibilities separate

```text
snapshot: which sections and items exist
layout: where those items go
registration: how one item appears now
```

Stable IDs connect them. Cell configuration retrieves current model data. Supplementary views such as section headers follow the same reuse rules.

## Validate changing environments

Test compact and wide windows, Dynamic Type, long localization, right-to-left order, empty sections, rapid snapshots, selection, focus, keyboard navigation, image cancellation, and memory pressure.

## Validation boundary

Layout, registrations, diffable updates, reuse, focus, performance, and accessibility remain Not verified without an Apple runtime.

## Series navigation

- Previous: [Part 53: UIKit table views, reuse, prefetching, and diffable data](../2026-07-19-uikit-table-views-reuse-prefetching-diffable-data/)
- Next: [Part 55: UIKit scrolling, drawing, layers, animation, and haptics](../2026-07-19-uikit-scrolling-drawing-layers-animation-haptics/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [UICollectionView](https://developer.apple.com/documentation/uikit/uicollectionview) renders flexible collections.
- [UICollectionViewCompositionalLayout](https://developer.apple.com/documentation/uikit/uicollectionviewcompositionallayout) composes section layouts.
- [UICollectionView.CellRegistration](https://developer.apple.com/documentation/uikit/uicollectionview/cellregistration) configures reusable cells.

## Related topics

- [UIKit table views, reuse, prefetching, and diffable data](../2026-07-19-uikit-table-views-reuse-prefetching-diffable-data/)
- [Adaptive design for iPhone, iPad, and windows](../2026-07-19-ios-adaptive-design-iphone-ipad-windows/)
