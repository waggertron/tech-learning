# Availability and Deployment Reference

Reviewed on 2026-07-13. Use whenever code calls an API introduced after a target's deployment floor or shares code across Apple platforms.

## Distinguish the Versions

- **Compiler version**: Determines supported Swift syntax and language behavior.
- **Swift language mode**: Selects language rules such as Swift 6 concurrency checking.
- **SDK version**: Determines the APIs visible while compiling.
- **Deployment target**: Oldest operating-system version on which the binary may run.
- **Runtime version**: Operating system on the current simulator or device.
- **Submission minimum**: SDK or Xcode floor App Store Connect accepts. It does not force the same deployment target.

## Guarding APIs

- Use `@available` on declarations whose entire contract requires a newer operating system or Swift version.
- Use `if #available` or `guard #available` when one code path can use a newer API and another can provide a valid fallback.
- Use `if #unavailable` when the older path is clearer as the positive branch.
- Keep the required trailing `*` in platform availability conditions.
- Add compile-time platform conditions only when code cannot compile for another platform. Do not use `#if` where a runtime availability check is required.
- Prefer one boundary around a coherent feature over scattered checks around individual expressions.

## Content Rules

- State the deployment target near the first framework example and in companion project settings.
- Name the API's introduction version when it is newer than the course floor.
- Show a working fallback, raise the deployment target explicitly, or mark the example as a versioned optional section.
- Do not describe compiler acceptance against the latest SDK as proof that the call is safe on the deployment floor.
- Check extensions separately. Some APIs are unavailable or constrained in application extensions.
- Recheck availability when the supported matrix changes or when examples adopt APIs from the beta track.

## Example

```swift
if #available(iOS 18, *) {
    NewFeatureView()
} else {
    CompatibleFeatureView()
}
```

Use a real example-specific type or behavior in published material. The generic names above only show the guard shape.

## Primary Sources

- [Swift available attribute](https://docs.swift.org/swift-book/ReferenceManual/Attributes.html#ID348)
- [Swift availability conditions](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/statements/#Availability-Condition)
- [Xcode version support](https://developer.apple.com/support/xcode/)
- [App Store submission requirements](https://developer.apple.com/app-store/submitting/)
