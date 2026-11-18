---
title: "Atlas Desk: a product design brief"
description: "A local research notebook that preserves capture, retrieval, and export across phone, tablet, and desktop."
date: 2026-07-20
tags: [ios, swift, case-study, atlas]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-20-atlas-desk-discovery-release-boundary/
---

A researcher captures a quotation on a phone, relates it to a source on iPad, and later exports the material on a Mac. The first release succeeds when one imported source and its notes remain searchable after relaunch and can be exported without losing their identities.

This is a design brief and project assignment. It does not describe a completed application.

## One useful vertical slice

Start with one text source, a note attached to a selected passage, title/tag search, and a portable export. Do not begin with collaborative editing or a universal file importer. The thin slice exposes ownership, indexing, and export consistency before network synchronization adds another authority.

## Model the durable state

```text
Document(id, source, revision)
    +-> Passage(documentID, range, excerpt)
            +-> ResearchNote(id, passageID, body, tags)

import -> validated source -> committed records -> indexed -> searchable
                                    |
                                    +-> export snapshot
```

Keep the imported source revision with a passage. A character range without the original revision can silently identify different text after editing. The search index is derived from committed data and can be rebuilt. Attachments belong to a durable record only after the record commit succeeds.

## Compare the main alternatives

A file snapshot is a reasonable first store for small documents. A model database becomes useful for indexed queries and relationships. Either choice needs a record-to-file ownership rule. For synchronization, compare explicit conflict copies with automatic merging: copying is noisier, but a wrong silent merge can lose a researcher's work.

## Walk through a failure

Test interruption between importing bytes and saving the record. A retry should identify the same source rather than create duplicates. If indexing fails, keep the document and expose indexing status. If a referenced passage no longer matches its revision, show the retained excerpt and ask for reassociation instead of pretending the range remains valid.

## Acceptance scenarios

1. Import a source, attach a note, relaunch, and retrieve both by a tag.
2. Interrupt indexing, restart it, and produce the same search results without duplicate notes.
3. Export a fixed revision while another editor changes a draft; the export remains internally consistent.
4. Delete a source and verify the documented passage/note/attachment policy.

A deterministic model test can prove transition and identity rules. The platform adapter then needs its own interface, permission, interruption, and integration checks. Keep evidence tied to the actual target and destination rather than treating a design review as an executed feature.

## Implementation boundary

No Atlas Desk app target, service integration, account transaction, or hardware journey is supplied by this brief. Use the [Field Notes capstone](../2026-07-19-swiftui-field-notes-capstone/) for the implemented notebook path. Build this assignment only when its distinct user task justifies the extra platform and validation cost.

## References

- [SwiftData](https://developer.apple.com/documentation/swiftdata) documents the central framework boundary for this assignment.
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/) provides platform interaction and accessibility guidance.

## Related topics

- [Apple platform selection](../2026-07-19-one-product-across-apple-platforms/)
- [Apple capability selection](../2026-07-19-widgetkit-live-activities/)

[Series reading guide](../series/zero-to-ios-hero/)
