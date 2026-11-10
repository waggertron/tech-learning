# Post Discovery Implementation Plan

**Goal:** Add Starlight Blog, homepage date sorting, and a readable site theme.

**Architecture:** Pin the compatible plugin and reuse its post data. Preserve public URLs while separating series sources. Extend the existing Starlight CSS rather than replace the layout.

**Tech Stack:** Astro 5, Starlight 0.32, Starlight Blog 0.19, native HTML select and browser JavaScript.

**Spec:** DESIGN.md

## Constraints and review focus
Preserve current uncommitted content edits. Keep old post and series routes, GitHub Pages base URLs, no-JavaScript reading, both color themes, and mobile layouts working. No push or deployment requested.

## Tasks
- [x] Add a browser contract for homepage sorting, plugin archive/tag/feed routes, series route preservation, and mobile overflow. Run against the old build and confirm the missing selector fails.
- [x] Integrate plugin in astro.config.mjs and content.config.ts. Derive excerpts from descriptions. Move series sources with stable slugs and use a MarkdownContent wrapper for ordinary series rendering.
- [x] Add PostBrowser.astro and homepage discovery links. Render all dated posts for genuine newest/oldest sorting, with readable dates and descriptions.
- [x] Refresh custom.css and self-host licensed fonts. Update sidebar highlight verification to use the new theme.
- [x] Update feature tracker and focused authoring docs. Run npm run build, HTTP smoke checks, focused browser contract, existing custom-page checks, and link validation. Inspect desktop/mobile screenshots in both themes.
- [x] Request a bounded independent code review, address material findings, then archive this plan with verification evidence.

## Execution notes
User approved proceeding and explicitly requested local verification before shipping. Implement inline with bounded theme and series migration lanes. Do not commit or push unrelated work.

## Verification evidence

- `npm run build`: passed, zero Astro diagnostic errors/warnings/hints, 1,203 generated pages.
- `npm run validate:pages` and `npm run validate:links`: passed, all 1,203 pages.
- `npm run validate:post-discovery`: passed, 233 posts, sorting both directions, pagination, visible archive titles, UTC publication dates, tags, RSS, representative preserved routes, loaded fonts, mobile overflow, both themes, and no-JavaScript links.
- `npm run validate:custom-pages`: passed sidebar state, calculator, React output, coding-problem REPLs, and static Swift display.
- `npm run validate:style`, `npm run validate:published-content`, secret scan, and `git diff --check`: passed.
- Independent review found hidden archive titles and homepage search pollution; both addressed. No additional material findings.
- Desktop and mobile light/dark screenshots inspected. Browser artifacts live in the operating-system temp directory, not the worktree.

## Decisions

- Pin plugin 0.19.0 instead of upgrading Astro and Starlight majors.
- Separate series source files and preserve explicit public slugs; the MarkdownContent wrapper bypasses blog rendering for series routes.
- Keep the legacy curated posts index source intact. Its route is intentionally superseded by the plugin archive, which emits an expected route-conflict warning. The intentional content wrapper also emits a plugin override warning.
- Force UTC formatting during Astro execution to preserve date-only publication days.
- Scope local validation to rendered content, links, source style, and affected browser behavior. Example source code and backend services were unchanged; their full independent test suites were not rerun.
- No commit, push, or deployment performed.
