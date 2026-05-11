# AGENTS.md

Instructions for AI coding agents working in this repo. See also `docs/AUTHORING.md` for the full content authoring reference.

## Critical rules

1. **Never use realistic-looking credential strings in example code.** Patterns like `sk_live_`, `ghp_`, `AKIA`, `xoxb-`, `eyJ` (JWT with realistic payload) trigger GitHub Push Protection and block pushes -- even when fake. Use placeholders: `YOUR_API_KEY_HERE`, `sk_live_<your_key>`, `<token>`, `REDACTED`.

2. **Quote all frontmatter descriptions** with double quotes. Unquoted descriptions containing `:`, `"`, or a leading backtick break the YAML parser and fail the build.

3. **Run `npm run build` after every batch of file changes.** YAML errors compound across files.

4. **Update both index files when adding a topic:** `topics/<category>/index.md` and `topics/index.mdx`.

5. **No em dashes (U+2014).** Use commas, colons, semicolons, or parens instead.

6. **Relative links only.** Never absolute paths. The `base: '/tech-learning'` config handles the prefix.

7. **ASCII diagrams only.** Mermaid is not wired up in this build.

## Repo structure

```
src/content/docs/
├── topics/
│   ├── ai/
│   ├── cs/
│   │   └── coding-problems/   (NeetCode 150 + bonus LeetCode problems)
│   ├── ops/
│   ├── system-design/
│   ├── testing/
│   └── web/
└── posts/
```

## Build and deploy

- Local build: `npm run build` (runs in ~15s, ~387 pages)
- Deployed to GitHub Pages on push to `main`
- Site URL: `https://waggertron.github.io/tech-learning/`
