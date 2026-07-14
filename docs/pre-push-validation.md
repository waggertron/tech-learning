# Pre-push validation

This repo uses an outcome-based validation workflow. A push is ready when the site renders real content, links connect, examples are trustworthy, and custom page behavior works.

## Acceptance criteria

1. **Pages display intended content**: Built HTML pages are non-empty, have titles, have visible headings, include the Starlight content region, and do not contain build or runtime failure markers.
2. **Links connect**: Built internal links resolve under `/tech-learning`, generated assets exist, and hash links point to real anchors.
3. **Code examples are trustworthy**: Fenced code languages are known, source examples parse, generated React output views are in sync, React output behavior tests pass, and the Swift runner contract and component tests pass.
4. **Custom functionality behaves as intended**: Browser smoke tests cover the DSL calculator, generated React output interaction, representative Python, TypeScript, and Go REPL markup, and the complete Swift REPL browser contract.
5. **The repo is safe to push**: No realistic credential strings, no banned prose patterns, no rendered planning residue, clean worktree, and no local preview process left behind.

## Commands

Run the full workflow before pushing:

```bash
npm run validate:pre-push
```

The command runs:

```bash
bash scripts/check-secrets.sh
npm run validate:style
npm run validate:published-content
npm run check:react-outputs
npm run test:react-outputs
npm run test:swift-runner-contract
npm run test:swift-repl
npm run validate:code-examples
npm run build
npm run validate:pages
npm run validate:links
npm run validate:custom-pages
npm run validate:swift-repl-browser
```

If local preview cannot bind a port inside Codex and reports `listen EPERM`, rerun the same validation command with escalated permissions. That is a sandbox limitation until it reproduces outside Codex.

If only the custom browser stage hits that sandbox bind error after the deterministic stages pass, use this split:

```bash
npm run validate:pre-push -- --skip-custom
npm run validate:custom-pages
npm run validate:swift-repl-browser
```

Run the custom command with local preview permission when Codex cannot bind `127.0.0.1`.

## Validation tiers

### Rendered pages

```bash
npm run build
npm run validate:pages
```

This checks the generated `dist/` HTML. It verifies expected routes, titles, headings, content regions, body size, and common failure markers.

Failure matching should stay structural. A teaching page may mention an error phrase such as `Internal Server Error` as lesson content, so add narrow failure signatures instead of broad text bans.

### Published content review

```bash
npm run validate:published-content
```

This catches public-content leaks such as internal series plans, future-file TODO sections, planning field labels, and repeated same-author source bullets in source sections. It protects the reader-facing boundary: page bodies should read like finished explanations, not agent work notes.

The check is intentionally narrow. It does not replace manual review for weak bullets, mechanical attribution, or source piles that use new wording.

### Links

```bash
npm run validate:links
```

This checks built internal links, generated assets, and hash targets. It also rejects local filesystem links and root-relative links that skip `/tech-learning`.

When fixing Markdown links, calculate the path from the rendered URL. A leaf file renders as a directory. For example, `topics/cs/coding-concepts/array-scans.md` renders at `/topics/cs/coding-concepts/array-scans/`, so a link to a coding problem uses `../../coding-problems/...`.

The internal link checker intentionally ignores code blocks and React example output regions. Literal `href` and `src` strings inside examples are validated through code-example contracts or React output tests, not as site navigation.

For external references, run this when network access is available:

```bash
npm run validate:external-links
```

External checks are separate because public sites rate-limit, block bots, or fail transiently. Use them for research-heavy posts, release batches, and changed external references.

### Code examples

```bash
npm run validate:code-examples
npm run check:react-outputs
npm run test:react-outputs
npm run test:swift-runner-contract
npm run test:swift-repl
```

The code validator checks fenced code language tags and syntax for source examples. The React commands verify generated output panels, live entry registration, runner panels, and example rendering contracts. The deterministic Swift commands verify the versioned browser-client contract, component markup, result presentation, cancellation coordination, and unavailable state without credentials or Docker.

Not every Markdown fence is executable. Explanatory snippets still need review, but source files and generated examples get deterministic checks.

### Custom page functionality

```bash
npm run validate:custom-pages
npm run validate:swift-repl-browser
```

This starts or reuses local preview, then runs Playwright smoke checks against:

- The DSL value calculator: default state and changed-input recommendation.
- A React output panel: live counter interaction.
- A coding problem page: Python, TypeScript, and Go REPL markup and controls.
- The isolated Swift REPL fixture: repeated and changed-source execution, hidden-panel layout, keyboard and accessible controls, timeout, cancellation, compiler failure, unavailable service behavior, one approach harness, and mobile width.

The tests stop any preview or fixture server they start. The Swift validator performs HTTP and served-script checks before launching Chromium, then removes its generated fixture caches.

For tabbed UI, activate the relevant tab before checking controls. Hidden Starlight tab panels can contain valid markup that is not currently visible to Playwright.

### Swift executor boundary

```bash
npm run test:swift-runner-executor
```

Run the Docker-backed executor suite when a change affects the pinned Swift image, container arguments, resource limits, timeouts, output accounting, source transfer, host isolation, or cleanup. It is not part of the default pre-push command because it requires a working local Docker daemon. A passing executor test proves the documented Swift 6.3.3 Linux standard-library boundary. It does not prove Apple SDK, simulator, signing, entitlement, or device behavior.

## Before pushing

Check local state:

```bash
git status -sb
pgrep -fl "astro preview|npm run preview|astro dev|vite"
```

Expected result:

- Worktree clean, unless the next step is commit.
- No preview process remains, unless manual review is intentionally still running.
- Branch is ahead by the expected commit count before push.

## When to add validation

Add or update validation when a bug reaches any of these surfaces:

- A page builds but renders empty or wrong content.
- A link points to a missing page, asset, or anchor.
- A code example is stale, invalid, or misleading.
- A custom component renders fallback HTML but does not respond to user input.
- The Swift browser contract, REPL component, runner fixture, or executor boundary changes.
- A generated artifact can drift from source content.
- Internal planning notes or mechanical source piles reach rendered pages.

Record new reusable validation rules in `docs/feature_tracker.md` and update `.agents/skills/pre-push-validation/SKILL.md` when future Codex sessions need the behavior.
