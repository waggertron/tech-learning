---
title: "Zero to iOS Hero 10: Strings, Unicode, and formatting"
description: "Treat Swift text as Unicode grapheme clusters, normalize search keys deliberately, use String.Index, and format dates and measurements at display boundaries."
date: 2026-07-16
tags: [swift, ios, unicode, foundation]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-16-swift-strings-unicode-formatting/
series:
  slug: zero-to-ios-hero
  order: 10
---

This is part 10 of the [Zero to iOS Hero series](../series/zero-to-ios-hero/).

Text is where byte-oriented assumptions meet human writing. A visible character can contain several Unicode scalars. Two strings can be equal even when their encoded bytes differ. A date that looks natural in one locale can be backwards or ambiguous in another.

Swift's `String` models Unicode text first. Work with that model, then choose a lower-level representation only when the boundary actually speaks UTF-8, UTF-16, or Unicode scalars.

## Four views of the same text

One string can be viewed at several levels:

```text
String
    |
    +-> Character view: extended grapheme clusters
    |
    +-> unicodeScalars: Unicode scalar values
    |
    +-> utf8: 8-bit code units
    |
    +-> utf16: 16-bit code units
```

Those counts answer different questions. Do not call all of them "characters."

```swift
let family = "👨‍👩‍👧‍👦"

print(family.count)                // 1 Character
print(family.unicodeScalars.count) // Several scalars
print(family.utf8.count)           // 25 UTF-8 code units
```

The family emoji is one user-perceived character assembled from several people and zero-width joiners. Its single `Character` does not occupy one byte.

## `Character` means an extended grapheme cluster

A Swift `Character` is one extended grapheme cluster:

```swift
let plain: Character = "A"
let accented: Character = "é"
let flag: Character = "🇺🇸"
let family: Character = "👨‍👩‍👧‍👦"
```

Each declaration contains one `Character`, but their scalar and encoded forms differ.

This model keeps common user-facing operations aligned with what people see. A cursor can move over the family emoji as one grapheme. Deleting one `Character` does not leave half of its joiner sequence in ordinary text logic.

Grapheme boundaries can change when strings are mutated. Adding a combining mark may extend the previous character rather than add another character count.

## Canonical equality is not byte equality

The visible letter `é` has more than one Unicode representation:

```swift
let precomposed = "caf\u{E9}"
let decomposed = "cafe\u{301}"

print(precomposed == decomposed) // true
print(precomposed.utf8.elementsEqual(decomposed.utf8)) // false
```

Swift string equality uses canonical equivalence. The two strings have the same linguistic grapheme even though their UTF-8 code-unit sequences differ.

This is why a raw byte comparison is usually the wrong user-text comparison. It can still be correct for a cryptographic digest, wire protocol, or file format whose contract is explicitly encoded bytes.

Name the boundary before choosing the view.

## String indexes are not integers

Swift strings do not support integer subscripts:

```swift
let title = "Café 👨‍👩‍👧‍👦"
// title[0] // Error
```

Different graphemes need different numbers of code units, so the implementation cannot jump from integer zero to an arbitrary visible character using fixed-width arithmetic.

Use `String.Index`:

```swift
let firstIndex = title.startIndex
let firstCharacter = title[firstIndex]

let secondIndex = title.index(after: firstIndex)
let secondCharacter = title[secondIndex]

let lastIndex = title.index(before: title.endIndex)
let lastCharacter = title[lastIndex]
```

As with other collections, `endIndex` is the position after the last element. It is not a valid subscript.

Offset an index only when the destination is in bounds:

```swift
if let index = title.index(
    title.startIndex,
    offsetBy: 4,
    limitedBy: title.endIndex
), index != title.endIndex {
    print(title[index])
}
```

Repeatedly offsetting from the beginning can turn a linear text operation into quadratic work. Traverse the string once when processing every character.

## Iterate at the representation the rule needs

For visible characters:

```swift
for character in title {
    print(character)
}
```

For a Unicode property or scalar-level protocol:

```swift
for scalar in title.unicodeScalars {
    print(scalar.value)
}
```

For UTF-8 input or output:

```swift
for byte in title.utf8 {
    print(byte)
}
```

Do not drop to bytes because they feel simpler. Byte code inherits encoding, validation, boundary, and reconstruction responsibilities.

## Substrings share storage temporarily

Slicing a string produces `Substring`:

```swift
let title = "ridge/weather"
let slash = title.firstIndex(of: "/")!
let category = title[..<slash]
```

`Substring` has string-like operations and can share the original string's storage. That avoids an immediate copy for short-lived parsing.

Store an independent `String` when the slice outlives the parsing operation:

```swift
let storedCategory = String(category)
```

Keeping one tiny `Substring` alive can retain the original large string storage. Convert at ownership boundaries rather than converting every temporary slice immediately.

## Search normalization is a product policy

Case, diacritics, width, punctuation, whitespace, script, and locale can all affect search. There is no universal `normalized()` call that produces the right search key for every language and product.

The Field Notes checkpoint chooses a narrow policy:

1. Convert to a canonical precomposed form.
2. Fold case and diacritics using a stable POSIX locale.
3. Collapse runs of whitespace to one space.

```swift
func normalizedSearchText(_ text: String) -> String {
    text
        .precomposedStringWithCanonicalMapping
        .folding(
            options: [.caseInsensitive, .diacriticInsensitive],
            locale: Locale(identifier: "en_US_POSIX")
        )
        .split(whereSeparator: \.isWhitespace)
        .joined(separator: " ")
}
```

Under this policy, `"  Café TRAIL  "` and a decomposed `"Cafe\u{301} trail"` produce the same key: `"cafe trail"`.

Diacritic-insensitive matching is not respectful or correct for every language, name, identifier, or security boundary. Keep original text for display. Use the search key only for the operation whose policy it implements.

## Normalization and localization solve different problems

Normalization prepares equivalent or intentionally folded text for comparison and search. Localization adapts reader-facing content to language, region, grammar, and convention.

Lowercasing an English sentence does not localize it. Replacing an accented name with an unaccented key does not create acceptable display text.

Keep these data roles separate:

```text
Original user text -> display and editing
Search key         -> matching under a documented policy
Localized resource -> reader-facing interface copy
Encoded bytes      -> storage or transport contract
```

One string should not silently serve every role.

## Interpolation is not sentence localization

String interpolation is useful for diagnostics and developer-controlled output:

```swift
let title = "Fog"
let rating = 5
let diagnostic = "\(title) has rating \(rating)"
```

Do not build localized sentences by concatenating fragments:

```swift
// Fragile for localization
let message = "Found " + String(count) + " notes"
```

Other languages can require different word order, plural forms, inflection, or spacing. Use localization resources and localized formatting so translators control the complete message.

The app-layer localization posts later in the series cover string catalogs and plural rules. This language post establishes the boundary: data interpolation is not a translation system.

## Format dates for their destination

A `Date` represents an instant, not a user-visible string. Format it at the boundary where a human or protocol consumes it.

Use ISO 8601 for a machine-facing representation when that is the contract:

```swift
let timestamp = Date(timeIntervalSince1970: 0)
let wireText = timestamp.formatted(.iso8601)
// 1970-01-01T00:00:00Z
```

Use `Date.FormatStyle` for localized reader-facing output:

```swift
let displayText = timestamp.formatted(
    .dateTime
        .year()
        .month(.wide)
        .day()
        .hour()
        .minute()
)
```

The reader's locale, calendar, and time zone can affect the result. That is desirable for display. Tests that assert exact text must inject or configure those dependencies rather than inheriting the developer machine.

Do not store a localized display string as the source of truth for an instant. Store the temporal value or a stable interchange representation, then format again for each destination.

## Format measurements with unit intent

A measurement combines a numeric value and unit:

```swift
let distance = Measurement(
    value: 3.2,
    unit: UnitLength.kilometers
)
```

Foundation's measurement format style can choose locale-appropriate units or preserve the supplied unit:

```swift
let text = distance.formatted(
    .measurement(
        width: .abbreviated,
        usage: .asProvided,
        numberFormatStyle: .number
            .precision(.fractionLength(1))
    )
    .locale(Locale(identifier: "en_US_POSIX"))
)
// 3.2 km
```

`.asProvided` means the format keeps kilometers. A usage such as `.road` can choose a unit appropriate to the locale and context.

The model should decide whether the stored value has a canonical unit. The display layer should decide how a reader sees it.

## Run the host checkpoint

The complete source is stored beside this post as `2026-07-16-swift-strings-unicode-formatting.swift`:

```swift
import Foundation

func normalizedSearchText(_ text: String) -> String {
    text
        .precomposedStringWithCanonicalMapping
        .folding(
            options: [.caseInsensitive, .diacriticInsensitive],
            locale: Locale(identifier: "en_US_POSIX")
        )
        .split(whereSeparator: \.isWhitespace)
        .joined(separator: " ")
}

let composed = "  Café TRAIL  "
let decomposed = "Cafe\u{301} trail"
let normalizedComposed = normalizedSearchText(composed)
let normalizedDecomposed = normalizedSearchText(decomposed)
precondition(normalizedComposed == normalizedDecomposed)

let family = "👨‍👩‍👧‍👦"
precondition(family.count == 1)

let timestamp = Date(timeIntervalSince1970: 0)
let timestampText = timestamp.formatted(.iso8601)

let distance = Measurement(value: 3.2, unit: UnitLength.kilometers)
let distanceText = distance.formatted(
    .measurement(
        width: .abbreviated,
        usage: .asProvided,
        numberFormatStyle: .number.precision(.fractionLength(1))
    )
    .locale(Locale(identifier: "en_US_POSIX"))
)

print("Search key: \(normalizedComposed)")
print("Family characters: \(family.count), UTF-8 bytes: \(family.utf8.count)")
print("Timestamp: \(timestampText)")
print("Distance: \(distanceText)")
```

Expected output under the recorded host toolchain:

```text
Search key: cafe trail
Family characters: 1, UTF-8 bytes: 25
Timestamp: 1970-01-01T00:00:00Z
Distance: 3.2 km
```

This post intentionally has no browser Run button. Canonical folding, locale-aware formatting, `Date`, and `Measurement` come from Foundation, while the site's browser Swift contract is limited to the pinned Swift 6.3.3 Linux standard library. The sibling source is compiled on the host, and Foundation behavior remains separate from an Apple SDK app, Simulator, or device claim.

## Avoid fixed byte slicing for human text

This kind of boundary is unsafe unless the protocol defines bytes:

```swift
let prefixBytes = Array(title.utf8.prefix(10))
```

The tenth byte may fall inside a multi-byte scalar or grapheme cluster. Reconstructing a string can fail or replace invalid sequences. Even a valid scalar boundary can split a user-perceived character assembled from several scalars.

Truncate display text through an interface policy that understands layout, localization, accessibility, and grapheme boundaries. Do not implement a visual line limit by chopping storage bytes.

## Text cost needs measurement

Several intuitive operations are not constant time in the number of displayed characters:

- `String.count` must determine grapheme boundaries.
- Offsetting a string index walks the string.
- Case and diacritic folding allocates or transforms text.
- Locale-aware formatting consults richer rules than interpolation.

Build search keys at a deliberate boundary instead of recomputing them inside every comparison. Cache only after measuring and after defining invalidation when the original text or normalization policy changes.

Correct Unicode behavior comes before micro-optimization. A faster operation that slices a name incorrectly is not an optimization.

## Wrong first moves

- **Indexing user text by integer or byte offset**: Traverse `Character` values or use `String.Index`.
- **Assuming one visible character is one scalar or byte**: Choose the view that matches the contract.
- **Displaying normalized search keys**: Preserve original user text for display.
- **Lowercasing without a locale policy**: Decide whether the operation is linguistic search, stable identifiers, or protocol matching.
- **Concatenating localized sentence fragments**: Give translators the whole message and its plural behavior.
- **Storing formatted dates as temporal truth**: Store the instant and format at the destination.
- **Using a Linux compile to claim Apple interface behavior**: Keep Foundation, Apple SDK, Simulator, and device evidence distinct.

## Practice

Try these as separate experiments:

1. Compare precomposed and decomposed `é` as strings, UTF-8 views, and scalar views.
2. Print the character, scalar, UTF-8, and UTF-16 counts of several family and flag emoji.
3. Walk a title using `indices` and prove that `endIndex` is not an element.
4. Store a small `Substring`, then convert it to `String` at an ownership boundary.
5. Remove `.diacriticInsensitive` and record how the search policy changes.
6. Format the measurement with `.road` under two locales and compare the selected units.
7. Format the same instant for two time zones and explain why neither display changes the instant.

The locale exercises are behavior checks, not universal expected strings. Record the locale, calendar, time zone, toolchain, and operating system with exact formatting evidence.

## Checkpoint

You should now be able to explain:

- Why a Swift `Character` is an extended grapheme cluster.
- Why canonically equivalent strings can have different bytes.
- Why `String.Index` replaces integer subscripting.
- When `Substring` should become an owned `String`.
- Why search normalization is a product and language policy.
- Why dates, numbers, and measurements should be formatted at display boundaries.
- Why localized sentences need resources rather than concatenation.

The next post moves related data and behavior into a `FieldNote` structure and proves its value semantics.

## Series navigation

- Previous: [Part 9: Collections, sequences, and cost](../2026-07-16-swift-collections-sequences-cost/)
- Next: [Part 11: Structures and value semantics](../2026-07-16-swift-structures-value-semantics/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- **Unicode string model**: The Swift Programming Language chapter [Strings and Characters](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/stringsandcharacters/) defines grapheme clusters, canonical equality, indexes, substrings, and UTF views.
- **Date output contracts**: Apple's [`Date.FormatStyle`](https://developer.apple.com/documentation/foundation/date/formatstyle) reference separates localized date and time presentation from ISO 8601 interchange formatting.
- **Locale-aware values**: Apple's [`FormatStyle`](https://developer.apple.com/documentation/foundation/formatstyle) and [`Measurement.FormatStyle`](https://developer.apple.com/documentation/foundation/measurement/formatstyle) references document locale-aware numeric and measurement output, including provided-unit and contextual usage.

## Related topics

- [Sliding window](../../topics/cs/coding-concepts/sliding-window/), single-pass traversal over sequences with explicit boundaries.
- [String coding problems](../../topics/cs/coding-problems/sliding-window/), algorithm practice where ASCII assumptions must stay explicit.
- [React internationalization and formatting](../2026-07-07-react-internationalization-formatting/), the same display-boundary concerns in a web stack.
