# Post discovery and theme

The homepage shows ten posts at a time, newest first. Its date selector reorders the full catalog before displaying ten rows, so oldest first reaches the earliest posts. Without JavaScript, the newest rows and archive links remain usable.

Starlight Blog owns `/posts/`, paginated archives, tag pages, post metadata, and `/posts/rss.xml`. The homepage discovery component is excluded from Pagefind so hidden rows do not create misleading search hits. The homepage consumes its `Astro.locals.starlightBlog.posts` data. `src/components/PostBrowser.astro` owns the selector and compact list.

## Compatibility

`starlight-blog` is pinned to `0.19.0`, which supports the installed Starlight `0.32` and Astro `5` stack. Newer plugin releases require newer framework versions. Recheck peer dependencies and route behavior before upgrading. `astro.config.mjs` fixes the build timezone to UTC so the plugin preserves date-only publication days on every build host.

The plugin reserves the `/posts/` listing route. `src/content/docs/posts/index.mdx` is retained as legacy curated source and is excluded from plugin post discovery. Its body is not the rendered archive. New post discovery comes from frontmatter, not manual additions to that index.

## Authoring

Dated posts stay under `src/content/docs/posts/` and include a `date` and a quoted `description`. The schema uses the description as the list excerpt unless explicit `excerpt` frontmatter is supplied. This prevents the plugin from rendering entire posts, including interactive examples, in archive lists.

Series guides live under `src/content/docs/post-series/`. Their explicit `slug: posts/series/...` values preserve public routes and existing relative links. Keep them outside `posts/`, because the pinned plugin treats every source in that directory as a dated post. `src/components/MarkdownContent.astro` renders series guides with ordinary Starlight content and delegates other pages to the plugin override. The plugin's component override warning is expected for this intentional wrapper. Archive and tag pages contain semantic post previews instead of `data-pagefind-body`, so page validation checks that specific structure and dates on those routes.

## Visual system

`DESIGN.md` records the design contract. `src/styles/custom.css` owns forest green accents, pale light surfaces, deep green dark surfaces, and the active sidebar colors. Self-hosted Newsreader headings and Source Sans 3 body fonts live in `public/fonts/`, with licenses and source URLs. Code retains its existing monospace styling.

## Verification

```bash
npm run build
npm run validate:pages
npm run validate:links
npm run validate:post-discovery
npm run validate:custom-pages
```

The post discovery browser check covers date order in both directions, pagination, tag and RSS routes, representative existing post and series routes, loaded fonts, mobile overflow, both themes, and no-JavaScript links. It starts and stops its own preview server and writes screenshots to a fresh operating-system temporary directory. `POST_DISCOVERY_BASE_URL` can point it at an already-running local preview.
