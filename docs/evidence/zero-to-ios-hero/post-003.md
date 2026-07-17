# Post 3 Evidence: How to Learn by Building and Debugging

Date: 2026-07-16

## Published artifacts

- `src/content/docs/posts/2026-07-16-learning-by-building-debugging.mdx`
- `src/content/docs/posts/2026-07-16-learning-by-building-debugging.swift`
- `companion/field-notes/Labs/Orientation/AverageReadingsBroken.swift`
- `companion/field-notes/Labs/Orientation/AverageReadingsFixed.swift`

## Verified

- Apple Swift 6.3.2 compiled the published source and both lab variants in Swift 6 language mode with warnings treated as errors.
- The published source and fixed lab each exited successfully and printed `Average: 4`.
- The broken lab compiled, failed at its deliberate assertion, and reported `Expected 4, got 6`.
- Host LLDB stopped at the `average` function, stepped to the return, and inspected `values`, `total`, and `divisor` as `[2, 4, 6]`, `12`, and `2`.
- The site build emitted `dist/posts/2026-07-16-learning-by-building-debugging/index.html`.

## Environment note

The first LLDB process launch failed inside the managed sandbox with `process exited with status -1 (no such process)`. The same batch command passed on the host. This is sandbox evidence, not a source failure.

## Not verified

- The pinned stable authoring baseline is Swift 6.3.3. This host has Apple Swift 6.3.2 through Command Line Tools.
- The post's browser editor was not exercised through the complete browser and Docker path in this batch.
- Xcode's graphical breakpoint interface is outside this standard-library code anchor.

