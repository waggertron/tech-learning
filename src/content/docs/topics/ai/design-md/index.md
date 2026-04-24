---
title: DESIGN.md — a design system for coding agents
description: Google Labs' open-source file format for giving AI coding agents a persistent, structured understanding of your brand — so they stop shipping generic Tailwind blue.
category: ai
tags: [ai, design-systems, tooling, agents, stitch, google-labs]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## Why it exists

Hand an AI coding agent a prompt like *"build me a dashboard in my brand colors"* and the result is almost always technically correct and visually anonymous — default Tailwind blue, the sans-serif the agent happens to prefer, generic border radii. The agent has no persistent handle on *your* visual identity.

Google Labs shipped [**DESIGN.md**](https://github.com/google-labs-code/design.md) in April 2026 to close that gap. It's a single file at the root of a repository, sibling to `README.md`, that pairs machine-readable design tokens with human-readable rationale. Any coding agent that reads it before generating UI gets a consistent starting point for your brand: colors, type scale, spacing, shape, and the *why* behind each choice.

Originally developed for [Stitch](https://stitch.withgoogle.com/) (Google's AI design tool), the spec was open-sourced so the same file can travel between Stitch, Claude Code, Cursor, Gemini CLI, Antigravity, and anything else that knows how to read it. Apache-2.0 licensed, actively developed, currently at version `alpha`.

## The format at a glance

```md
---
name: Heritage
colors:
  primary: "#1A1C1E"
  secondary: "#6C7278"
  tertiary: "#B8422E"
  neutral: "#F7F5F2"
typography:
  h1:
    fontFamily: Public Sans
    fontSize: 3rem
  body-md:
    fontFamily: Public Sans
    fontSize: 1rem
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 0.75rem
rounded:
  sm: 4px
  md: 8px
spacing:
  sm: 8px
  md: 16px
---

## Overview

Architectural Minimalism meets Journalistic Gravitas. The UI evokes a
premium matte finish — a high-end broadsheet or contemporary gallery.

## Colors

The palette is rooted in high-contrast neutrals and a single accent color.

- **Primary (#1A1C1E):** Deep ink for headlines and core text.
- **Secondary (#6C7278):** Sophisticated slate for borders, captions, metadata.
- **Tertiary (#B8422E):** "Boston Clay" — the sole driver for interaction.
- **Neutral (#F7F5F2):** Warm limestone foundation, softer than pure white.
```

Two layers, deliberately:

1. **YAML front matter** — normative tokens. Exact values, machine-parseable, validatable.
2. **Markdown body** — rationale. Tells the agent *how* and *when* to apply each token, and *why* the value exists at all.

An agent that reads this file produces headlines in Public Sans over a warm limestone background with "Boston Clay" call-to-action buttons — not default blue.

## Token schema

```yaml
version: <string>          # optional; current: "alpha"
name: <string>
description: <string>      # optional
colors:
  <token-name>: <Color>
typography:
  <token-name>: <Typography>
rounded:
  <scale-level>: <Dimension>
spacing:
  <scale-level>: <Dimension | number>
components:
  <component-name>:
    <property>: <string | token reference>
```

### Token types

| Type | Format | Example |
| --- | --- | --- |
| Color | `#` + hex (sRGB) | `"#1A1C1E"` |
| Dimension | number + unit (`px`, `em`, `rem`) | `48px`, `-0.02em` |
| Token Reference | `{path.to.token}` | `{colors.primary}` |
| Typography | object with `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`, `fontFeature`, `fontVariation` | see example above |

Token references let you express relationships — e.g. a button's `backgroundColor: "{colors.tertiary}"` stays in sync if the tertiary color changes.

### Components

Component entries map a name to a bundle of properties:

```yaml
components:
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    rounded: "{rounded.sm}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.tertiary-container}"
```

Valid properties: `backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`, `height`, `width`. Variants (hover, active, pressed) are separate component entries with a related key name — the naming carries the relationship.

## Section order

The markdown body uses `##` headings. Sections can be omitted, but any present must appear in this canonical order:

| # | Section | Aliases |
| --- | --- | --- |
| 1 | Overview | Brand & Style |
| 2 | Colors | |
| 3 | Typography | |
| 4 | Layout | Layout & Spacing |
| 5 | Elevation & Depth | Elevation |
| 6 | Shapes | |
| 7 | Components | |
| 8 | Do's and Don'ts | |

The `section-order` linting rule flags deviations — out-of-order sections pass, but with a warning, so agents still have something to work with on drafts.

### Unknown content

| Scenario | Behavior |
| --- | --- |
| Unknown section heading | Preserve; don't error |
| Unknown color token name | Accept if value is valid |
| Unknown typography token name | Accept as valid typography |
| Unknown component property | Accept with warning |
| Duplicate section heading | Error; reject the file |

Forward-compatible by design. A file authored against a future version of the spec should still be useful to an older agent.

## The CLI

Install:

```bash
npm install @google/design.md
# or run directly
npx @google/design.md lint DESIGN.md
```

All commands accept a file path or `-` for stdin, and output JSON by default — built for agent consumption, not human skimming.

### `lint` — validate structure, refs, and contrast

```bash
npx @google/design.md lint DESIGN.md
```

```json
{
  "findings": [
    {
      "severity": "warning",
      "path": "components.button-primary",
      "message": "textColor (#ffffff) on backgroundColor (#1A1C1E) has contrast ratio 15.42:1 — passes WCAG AA."
    }
  ],
  "summary": { "errors": 0, "warnings": 1, "info": 1 }
}
```

Exits `1` on errors, `0` otherwise — wire it into CI and fail builds on broken token references.

### `diff` — detect regressions between versions

```bash
npx @google/design.md diff DESIGN.md DESIGN-v2.md
```

```json
{
  "tokens": {
    "colors": { "added": ["accent"], "removed": [], "modified": ["tertiary"] },
    "typography": { "added": [], "removed": [], "modified": [] }
  },
  "regression": false
}
```

Exits `1` if the *after* file introduces more errors or warnings than the *before* file.

### `export` — ship tokens to other systems

```bash
npx @google/design.md export --format tailwind DESIGN.md > tailwind.theme.json
npx @google/design.md export --format dtcg DESIGN.md > tokens.json
```

- `tailwind` — drop-in Tailwind theme config.
- `dtcg` — [W3C Design Tokens Community Group](https://tr.designtokens.org/format/) format, the emerging industry standard.

### `spec` — inject the format into an agent prompt

```bash
npx @google/design.md spec
npx @google/design.md spec --rules
npx @google/design.md spec --rules-only --format json
```

Useful in custom agent prompts: dump the spec into the system message so the agent knows how to read and emit DESIGN.md files without training data.

### Programmatic API

```ts
import { lint } from '@google/design.md/linter';

const report = lint(markdownString);
console.log(report.findings);       // Finding[]
console.log(report.summary);        // { errors, warnings, info }
console.log(report.designSystem);   // Parsed DesignSystemState
```

## Linting rules

Seven rules ship in the initial release:

| Rule | Severity | What it checks |
| --- | --- | --- |
| `broken-ref` | error | Token references (`{colors.primary}`) that don't resolve |
| `missing-primary` | warning | Colors defined but no `primary` — agents will auto-generate one |
| `contrast-ratio` | warning | Component `backgroundColor`/`textColor` pairs below WCAG AA (4.5:1) |
| `orphaned-tokens` | warning | Color tokens defined but never referenced by any component |
| `missing-typography` | warning | Colors defined but no typography tokens — agents fall back to defaults |
| `section-order` | warning | Sections out of canonical order |
| `token-summary` | info | Count of tokens per section |
| `missing-sections` | info | Optional sections (spacing, rounded) absent when other tokens exist |

`broken-ref` is the one that catches real bugs — everything else is a nudge toward completeness.

## How to use it with coding agents

The recommended prompt pattern, from Google Labs' docs and early adopter agent skills:

> Always read `DESIGN.md` at the project root before generating any UI. Use the design tokens and their rationale to drive all styling decisions. If a token for the decision you need does not exist, choose a value consistent with the documented design language and note the addition in your response.

Concrete integrations in the wild:

- **Stitch MCP server** — Google ships an [Agent Skills library](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/) compatible with Claude Code, Cursor, Gemini CLI, and Antigravity.
- **Claude Code / Cursor rules** — drop a rule telling the agent to consult `DESIGN.md` before writing JSX, CSS, or Tailwind classes.
- **CI gate** — run `npx @google/design.md lint` on every PR to stop drift.

## Interop and adjacent standards

DESIGN.md tokens are inspired by the [W3C Design Token Format Module](https://tr.designtokens.org/format/) (DTCG). The `export --format dtcg` command is the bridge: author once in DESIGN.md, emit DTCG for tools that expect it (Style Dictionary, Figma Tokens Studio, etc.).

For Tailwind-first projects, `export --format tailwind` maps directly into `tailwind.config.js`'s `theme.extend`.

## Gotchas

- **It's `alpha`.** Expect the schema and CLI to change. Pin the version in CI.
- **YAML front matter is strict.** Duplicate section headings are a hard error. Unquoted strings starting with special characters (backticks, `@`, `!`) break YAML parsing — quote them.
- **`broken-ref` is your friend.** A typo in a `{colors.primry}` reference silently gives the agent nothing to anchor on; the lint rule catches it before the agent does weird things.
- **Don't put secrets or proprietary roadmap prose in DESIGN.md.** It's meant to live in your repo and be read by agents — including ones running in cloud environments.
- **Naming variants.** Hover and pressed states are separate `components:` entries, not nested. `button-primary` and `button-primary-hover` — flat namespace, related-by-prefix.
- **Agents still hallucinate.** DESIGN.md dramatically improves consistency but doesn't guarantee brand fidelity. Review output, gate on `lint`, and iterate the file when you see the agent drift.

## When DESIGN.md is overkill

- A one-off internal tool where visual consistency doesn't matter. Let the agent pick defaults.
- Projects that already use a rich design-token pipeline (Style Dictionary, Figma Tokens Studio). If your source of truth is elsewhere, consider generating `DESIGN.md` from it rather than authoring in both places.
- Non-UI work. The file is specifically about visual identity; it doesn't model API design, data models, or business logic.

## Status and outlook

- Apache-2.0, version `alpha`, active development.
- Open-source spec and CLI at [`github.com/google-labs-code/design.md`](https://github.com/google-labs-code/design.md).
- Google's position: the format is open and portable on purpose — Stitch uses it, but so should anything else.

This is early; the token schema is likely to grow (motion/animation tokens, dark-mode pairing, breakpoint-aware sizing are all obvious gaps). The core idea — a single file where design intent lives in the codebase, readable by both humans and agents — is the durable part.

## References

- [Google Labs announcement — "Stitch's DESIGN.md format is now open-source"](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/)
- [`google-labs-code/design.md` on GitHub](https://github.com/google-labs-code/design.md) — spec, CLI, linter
- [Stitch documentation](https://stitch.withgoogle.com/) — Google's AI design tool
- [W3C Design Token Format Module](https://tr.designtokens.org/format/) — the DTCG spec DESIGN.md interoperates with
- [MindWired AI explainer](https://mindwiredai.com/2026/04/23/design-md-is-now-open-source-googles-new-file-format-that-makes-ai-build-your-brand-correctly/) — third-party overview with examples

## Related topics

- [AI Coding Tool Blindspots](../coding-tool-blindspots/) — why agents default to generic styling in the first place
- [AI Skill Development](../skill-development/) — packaging DESIGN.md-aware skills for an agent
- [Prompt Engineering](../prompt-engineering/) — templating "always consult DESIGN.md" into reusable prompts
