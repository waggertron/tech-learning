---
title: UIKit table views, reuse, prefetching, and diffable data
description: "Drive a searchable note table from stable identifiers, reusable cells, deterministic snapshots, and cancellable prefetch work."
date: 2026-07-19
tags: [ios, swift, uikit, table-views, diffable-data]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-uikit-table-views-reuse-prefetching-diffable-data/
series:
  slug: zero-to-ios-hero
  order: 53
---

A table view renders a changing linear collection. The model snapshot and the visible rows need one stable identity vocabulary.

## Configure by identifier

```swift
enum Section { case favorites, notes }
typealias DataSource = UITableViewDiffableDataSource<Section, NoteID>

let registration = UITableView.CellRegistration<UITableViewCell, NoteID> {
    [weak self] cell, _, id in
    guard let note = self?.notesByID[id] else { return }
    var content = cell.defaultContentConfiguration()
    content.text = note.title
    content.secondaryText = note.body
    cell.contentConfiguration = content
}
```

The closure retrieves current data by ID. It does not trust a stale array offset captured before filtering or reordering.

## Apply one snapshot

```swift
var snapshot = NSDiffableDataSourceSnapshot<Section, NoteID>()
snapshot.appendSections([.favorites, .notes])
snapshot.appendItems(favoriteIDs, toSection: .favorites)
snapshot.appendItems(otherIDs, toSection: .notes)
dataSource.apply(snapshot, animatingDifferences: true)
```

Mutate the model first, derive one snapshot, then apply it. Updating the backing array and table rows through separate commands creates invalid-update crashes and identity drift.

## Reset and cancel reuse work

Cells replace content, accessories, selection state, and images on every configuration. Prefetch tasks are keyed by note ID and cancelled when rows leave the prefetch window. Completion checks the represented ID before assigning an image.

Prefetching is an optimization. It cannot become the only path that loads required data.

## Preserve collection state

Search, refresh, deletion, and grouping reconcile selection and scroll intent. Empty library, no search results, loading, and failure are different states with different recovery.

## Validation boundary

Table reuse, snapshot animation, prefetch cancellation, scrolling, selection, performance, and accessibility remain Not verified.

## Series navigation

- Previous: [Part 52: UIKit text, forms, keyboards, focus, and validation](../2026-07-19-uikit-text-forms-keyboards-focus-validation/)
- Next: [Part 54: UIKit collection views and compositional layout](../2026-07-19-uikit-collection-views-compositional-layout-cells-configuration/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [UITableView](https://developer.apple.com/documentation/uikit/uitableview) renders linear collections.
- [UITableViewDiffableDataSource](https://developer.apple.com/documentation/uikit/uitableviewdiffabledatasource) applies identifier snapshots.
- [UITableViewDataSourcePrefetching](https://developer.apple.com/documentation/uikit/uitableviewdatasourceprefetching) reports anticipated rows.

## Related topics

- [SwiftUI lists, grids, scrolling, search, selection, and refresh](../2026-07-19-swiftui-lists-grids-scrolling-search-selection-refresh/)
- [UIKit views, controls, target-action, and delegation](../2026-07-19-uikit-views-controls-configuration-target-action-delegation/)
