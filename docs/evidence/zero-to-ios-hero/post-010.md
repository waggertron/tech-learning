# Post 10 Evidence: Strings, Unicode, and Formatting

Date: 2026-07-16

## Published artifacts

- `src/content/docs/posts/2026-07-16-swift-strings-unicode-formatting.md`
- `src/content/docs/posts/2026-07-16-swift-strings-unicode-formatting.swift`

## Verified

- Apple Swift 6.3.2 compiled the Foundation-backed source in Swift 6 language mode with warnings treated as errors.
- The executable proved equal normalized keys for composed and decomposed accented text and one `Character` for the family grapheme cluster.
- The recorded output reports 25 UTF-8 bytes, the Unix epoch in ISO 8601 form, and `3.2 km` under the injected POSIX locale and provided-unit measurement policy.
- The first compile rejected an incorrect `Date.ISO8601FormatStyle.timeZone` call. The source now uses the supported `.iso8601` style and passes.
- Published-content validation passed for the expanded series.

## Boundary

This checkpoint imports Foundation and therefore has no browser Run button under the site's standard-library-only Swift runner contract. Host Foundation compilation does not prove an iOS app, SwiftUI, UIKit, Simulator, localization resource, or device behavior.

## Not verified

- The pinned stable authoring baseline is Swift 6.3.3. This host has Apple Swift 6.3.2 through Command Line Tools.
- Full Xcode, an iOS SDK app target, Simulator locale changes, and device locale behavior remain Not verified.

