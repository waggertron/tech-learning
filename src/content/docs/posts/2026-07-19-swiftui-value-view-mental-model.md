---
title: SwiftUI's value-view mental model
description: "Trace what SwiftUI recomputes, where state persists, and how identity and dependency reads control updates."
date: 2026-07-19
tags: [ios, swift, swiftui, state, identity]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-swiftui-value-view-mental-model/
series:
  slug: zero-to-ios-hero
  order: 31
---

A SwiftUI view is a value that describes the interface for its current inputs. It is not a screen object that survives until dismissal.

That distinction explains why `body` can run many times without resetting a counter, why changing one dependency updates some views but not others, and why unstable identity can make state appear to vanish.

## Separate the description from the storage

Consider a counter:

```swift
import SwiftUI

struct CounterView: View {
    @State private var count = 0

    var body: some View {
        VStack(spacing: 12) {
            Text("Count: \(count)")
            Button("Increment") {
                count += 1
            }
        }
        .padding()
    }
}
```

`CounterView` is a small struct. SwiftUI can create a new value whenever the inputs change. The integer does not persist because that struct instance lives forever. `@State` asks SwiftUI to manage storage associated with the view's position and identity.

Think in three layers:

```text
inputs and dependency reads
            |
            v
      View value and body
            |
            v
 rendered elements matched by identity
            |
            v
 SwiftUI-managed persistent storage
```

The view value describes. SwiftUI reconciles. Storage survives while its identity survives.

## `body` is a calculation

Treat `body` as a pure description of the current state. It may be evaluated during an update even when the final pixels barely change.

```swift
struct TraceCounterView: View {
    @State private var count = 0

    var body: some View {
        let _ = Self.trace(count)

        Button("Count: \(count)") {
            count += 1
        }
    }

    private static func trace(_ count: Int) {
        print("Evaluate body with count \(count)")
    }
}
```

This print is a learning probe, not an application contract. The framework does not promise a particular number of evaluations. Tests should assert visible behavior or model output, never a `body` evaluation count.

Avoid side effects in `body`:

```swift
// Wrong: rendering can start repeated work.
var body: some View {
    let _ = repository.reload()
    return Text("Notes")
}
```

Use lifecycle APIs such as `task`, event handlers, or an injected model for work with effects. Part 39 develops that boundary.

## Dependencies drive invalidation

SwiftUI records values read while producing the interface. When an observed dependency changes, the affected description can be evaluated again.

```swift
struct NoteSummary: View {
    let title: String
    let isFavorite: Bool

    var body: some View {
        HStack {
            Text(title)
            if isFavorite {
                Image(systemName: "star.fill")
                    .accessibilityLabel("Favorite")
            }
        }
    }
}
```

Plain stored properties are immutable inputs to this value. State wrappers and observable models establish other dependency relationships. A view that does not read a changed property does not need to describe UI for that property.

Keep dependency reads close to the UI that needs them. Passing one enormous model through every row makes ownership harder to see and can broaden updates.

## Structural identity and explicit identity

SwiftUI first understands identity from structure. These two branches occupy different structural positions:

```swift
if isEditing {
    NoteEditor(draft: draft)
} else {
    NoteDetail(note: note)
}
```

Switching branches replaces one subtree with another. Local state inside the removed subtree can be discarded.

Collections add explicit identity:

```swift
List(notes) { note in
    NoteRow(note: note)
}
```

Each `note.id` tells SwiftUI which logical element moved, changed, appeared, or disappeared. Array offsets are poor identity because insertion changes the offsets of otherwise unchanged notes.

```swift
// Fragile when the collection can reorder or filter.
ForEach(notes.indices, id: \.self) { index in
    NoteRow(note: notes[index])
}
```

Stable domain identity protects selection, focus, tasks, animation continuity, and state owned below each row.

## Identity resets can be intentional

The `id` modifier changes identity. That can reset a subtree, but it is a blunt tool:

```swift
NoteEditor(note: note)
    .id(note.id)
```

When `note.id` changes, SwiftUI treats the editor as a different element. Local state starts again. Use this only when replacement is the intended product behavior. Do not add random IDs to force refreshes. A random ID tells SwiftUI that nothing is the same on the next update.

## A Field Notes trace

Suppose a row owns only a temporary disclosure state:

```swift
struct NoteRow: View {
    let note: FieldNote
    @State private var showsTags = false

    var body: some View {
        VStack(alignment: .leading) {
            Button(note.title) {
                showsTags.toggle()
            }

            if showsTags {
                Text(note.tags.joined(separator: ", "))
                    .font(.caption)
            }
        }
    }
}
```

Recreating `NoteRow` values does not reset `showsTags`. Removing the identified note from the list does. Reusing an offset for a different note risks attaching the old row storage to the wrong domain object.

## A practical ownership test

For each value, ask:

1. Is it immutable input? Use a plain property.
2. Is it transient state owned by this interface identity? Consider `@State`.
3. Does a parent own it while this view edits it? Pass a narrow binding.
4. Is it durable domain data or an external effect? Keep it in an appropriate model or service boundary.
5. Is it derived from another source? Compute it instead of storing a second copy.

Later posts refine each wrapper. The mental model comes first: wrappers communicate ownership and dependencies. They do not turn the view struct into a persistent controller.

## Validation boundary

The snippets are production-shaped SwiftUI examples, but they were not compiled in this repository environment. Full Xcode, an Apple SDK, and Simulator runtimes are unavailable. The browser Swift runner cannot import SwiftUI and provides no framework evidence.

## Check your understanding

You should now be able to explain:

- Why repeated `body` evaluation does not reset `@State`.
- Why side effects do not belong in `body`.
- How dependency reads participate in updates.
- Why a stable note ID is safer than its array offset.
- When changing identity deliberately resets local state.

The next post turns these value descriptions into reusable views, modifiers, and styles without hiding product rules inside visual helpers.

## Series navigation

- Previous: [Part 30: Accessibility, localization, and inclusive product design](../2026-07-19-ios-accessibility-localization-inclusive-product-design/)
- Next: Part 32, Composition, modifiers, styles, and custom components
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- **SwiftUI framework model**: [SwiftUI](https://developer.apple.com/documentation/swiftui/) introduces declarative interface construction from views and controls.
- **Data dependencies**: [Model data](https://developer.apple.com/documentation/swiftui/model-data) covers state, bindings, observable data, and environment flow.
- **View identity**: [Demystify SwiftUI](https://developer.apple.com/videos/play/wwdc2021/10022/) explains identity, lifetime, and dependencies as the foundations of SwiftUI updates.

## Related topics

- [Accessibility, localization, and inclusive product design](../2026-07-19-ios-accessibility-localization-inclusive-product-design/), the interface contract these SwiftUI examples need to preserve.
- [Structures and value semantics](../2026-07-16-swift-structures-value-semantics/), the language model behind value-view descriptions.
- [Properties, methods, initialization, and deinitialization](../2026-07-16-swift-properties-methods-subscripts-initialization-deinitialization/), the Swift mechanics behind stored and computed values.
