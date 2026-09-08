# Twelve-Factor topic validation

The Twelve-Factor topic uses one shared order-service contract across TypeScript, Python, and Go. Its published code excerpts come from immutable repository tags, so the article can be checked against the releases it teaches.

## Source map

`scripts/twelve-factor-example-sources.mjs` is the source map. It records the 12 canonical factor titles, the example page for each factor, the three repository tags, one source range for every factor-language pair, and an API proof token for every excerpt.

The current releases are:

- TypeScript `v1.0.2`
- Python `v1.0.2`
- Go `v1.0.3`

Together they produce 36 required examples.

## Synchronize excerpts

After changing a release tag, source path, or line range, regenerate the code blocks and their source links:

```bash
npm run sync:twelve-factor-examples
```

The synchronizer fetches the tagged files, replaces the marked code blocks, and emits links to the exact line ranges. It also collapses each language tab to one authoritative excerpt.

Check synchronization without writing files:

```bash
npm run check:twelve-factor-examples
```

Both commands require network access to GitHub.

## Validate the topic contract

Run the focused gate before the site build:

```bash
npm run validate:twelve-factor-topic
```

The command runs negative contract tests and then checks the real topic. It fails when:

- A hub heading, example heading, scan-table label, source label, or audit row loses an exact `Factor I` through `Factor XII` numeral-title pair.
- A factor's hub-to-example link hides its canonical title or points to the wrong rendered route or anchor.
- Any factor lacks a TypeScript, Python, or Go tab and tagged source.
- A displayed excerpt loses the named library, package-manager, container, or runtime API that proves the example is concrete.
- The Operations indexes, related-topic links, or focused Secrets, Docker, and Kubernetes backlinks disappear.
- Any example page stops linking all three immutable reference releases.
- A repository release, root instruction file, Codex skill, Claude skill, factor checklist, or deterministic checker link is absent.
- A shared configuration name, process command, port, API path, request field, amount boundary, queue name, or migration path is absent.
- A displayed excerpt differs from the selected lines in its immutable tagged source.

The full `npm run validate:pre-push` workflow includes this gate.

## Validate the rendered tabs

After building the site, run:

```bash
npm run validate:twelve-factor-browser
```

The command starts a local preview and performs an HTTP check before opening Chromium. It checks all three example routes, their tab and panel relationships, four synchronized language groups per page, saved language selection between pages, and Arrow, Home, and End keyboard navigation. The process stops the preview it starts.

## Updating a release

1. Verify the replacement repository tag and its complete deterministic test suite.
2. Update the tag and any changed source ranges in `scripts/twelve-factor-example-sources.mjs`.
3. Update the hub's release table and repository-level harness links.
4. Run `npm run sync:twelve-factor-examples`.
5. Run `npm run validate:twelve-factor-topic`.
6. Run `npm run build`, then `npm run validate:twelve-factor-browser` and inspect the four rendered routes.

Do not move the source markers by hand. The validator expects each marker, language tab, and link inside the matching factor section.
