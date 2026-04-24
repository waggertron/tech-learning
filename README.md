# tech-learning

A shareable, postable knowledge base of tech topics I research and educate myself on. One repo, three outputs:

1. **Browsable on GitHub**, every topic has a `README`-style markdown file that reads cleanly on github.com
2. **Static site**, Astro + Starlight build, deployed to GitHub Pages at [waggertron.github.io/tech-learning](https://waggertron.github.io/tech-learning/)
3. **Portable to social**, plain markdown, easy to paste into dev.to / Medium / LinkedIn

## Structure

```
src/content/docs/
├── topics/            # evergreen, categorized knowledge base
│   └── <category>/<slug>/
│       ├── index.md           # topic hub
│       ├── <subtopic>.md      # flat subtopic
│       └── <subtopic>/        # folder subtopic (has assets / children)
│           └── index.md
└── posts/             # dated write-ups, TILs, project notes
    └── YYYY-MM-DD-<slug>.md

templates/             # scaffolding templates (not part of the built site)
├── topic/
│   ├── index.md
│   ├── subtopic.md             # flat subtopic template
│   └── subtopic-folder/
│       └── index.md            # folder subtopic template
└── post.md
```

See [`docs/plans/2026-04-23-tech-learning-scaffold-design.md`](docs/plans/2026-04-23-tech-learning-scaffold-design.md) for the full design rationale.

## Authoring

### Add a new topic

```bash
npm run new:topic -- <category> <slug>
# e.g. npm run new:topic -- ai rag-basics
```

Creates `src/content/docs/topics/<category>/<slug>/` from the template with today's date. Edit `index.md`, set `title`, `description`, `tags`. Write.

### Add a subtopic

Two shapes, pick based on what you need:

- **Flat** (single page, no assets): `cp templates/topic/subtopic.md src/content/docs/topics/<category>/<topic>/<subtopic>.md`
- **Folder** (has images, code samples in files, or children): `cp -r templates/topic/subtopic-folder src/content/docs/topics/<category>/<topic>/<subtopic>`

Update frontmatter, set `parent` to the parent topic's slug so breadcrumbs work.

### Add a post

```bash
npm run new:post -- <slug>
# e.g. npm run new:post -- what-i-learned-about-rag
```

Creates `src/content/docs/posts/YYYY-MM-DD-<slug>.md` from the template with today's date.

## Local development

```bash
npm install
npm run dev        # http://localhost:4321/tech-learning/
npm run build      # production build (also type-checks)
npm run preview    # preview the production build
```

## Deployment

Pushes to `main` auto-deploy to GitHub Pages via `.github/workflows/deploy.yml`.

One-time setup on the repo: **Settings → Pages → Source: "GitHub Actions"**.

## Cross-posting checklist

When a post is ready to share externally:

1. Copy the markdown body (everything below the frontmatter block)
2. Paste into dev.to / Medium / LinkedIn / Hashnode
3. **Set the canonical URL** on the external platform to the `canonical` value from the post's frontmatter, this tells search engines the version on this site is the primary one
4. Adjust any platform-specific formatting:
   - dev.to / Hashnode: image paths need absolute URLs
   - Medium: strip Starlight-specific MDX components if any were used
   - LinkedIn: preview the first 2 lines, they get truncated in the feed

## Conventions

- Topics are **evergreen** (update them as your understanding grows); posts are **snapshots** (generally don't rewrite history)
- Keep nesting ≤ 3 levels (category → topic → subtopic)
- Images and assets live next to the markdown that uses them, not in a shared `assets/` dump
- Set `status: draft` in frontmatter while writing; flip to `published` when ready (currently informational only, all files ship)

## License

MIT, see [LICENSE](LICENSE).
