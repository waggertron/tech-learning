# Unified content tags

Tags connect every public page in the `docs` collection, including dated posts, topic pages, coding problems, personal pages, and tagged guides. The same tag archive contains every matching page.

## Public routes

- `/tags/` lists all tags alphabetically with their page counts.
- `/posts/tags/<tag>/` is the shared archive for a tag. This preserves existing blog tag URLs and incoming bookmarks.
- Untagged pages do not acquire a tag list or an archive membership.

The explicit route at `src/pages/posts/tags/[tag].astro` takes precedence over Starlight Blog's broader injected `/[...prefix]/tags/[tag]` route. Archives are not paginated by the installed blog plugin, so there are no former tag-page pagination routes to migrate. Blog pagination at `/posts/2/` remains unchanged.

## Authoring

Continue declaring a `tags` array in page frontmatter. Tags are trimmed, matched without case differences, and deduplicated within each page. Use descriptive tag names such as `system-design` or `capacity-planning`.

Tag URLs use the same GitHub slug convention as the existing blog plugin. Two different labels that collapse to the same URL, such as `C++` and `C#`, fail the build with a useful error. Rename them to distinct labels such as `cpp` and `csharp`; the index never silently drops or combines distinct tags.

Starlight's `draft: true` excludes an entry from the public index. The repo's separate `status: draft` field does not hide a page from the build, so it does not hide that page from tags either. Hidden sidebar entries remain public and remain tagged.

## Rendering and navigation

`src/components/ContentTags.astro` renders an accessible Page tags navigation region for non-blog content. Posts retain Starlight Blog's existing footer tags and metadata, with the links now resolving to the unified archives. The homepage links to the tag directory.

`src/starlight-tags.ts` runs after blog middleware and adjusts existing blog sidebar tag counts to the full catalog. It also provides a Browse all tags link, without duplicating the plugin's metadata or post navigation.

Archive links resolve relative to each rendered route and retain the `/tech-learning` deployment boundary. No browser JavaScript is needed for tag navigation. Archives are excluded from full-text search so their repeated titles and descriptions do not displace the original articles in search results.

## Verification

```bash
node --test tests/content-tags.test.mjs
npm run build
node scripts/validate-content-tags.mjs
node scripts/validate-content-tags-browser.mjs
npm run validate:links
```

The shared frontmatter schema normalizes tags before either the blog plugin or topic components consume them. The unit suite checks that ingestion behavior, mixed content membership, deduplication, draft boundaries, slug collisions, invalid routes, and relative URLs. It also checks every tag in the current source catalog, including the patient lookup case study.

The built-output check verifies the tag directory, every archive membership, clickable tags on every tagged page, deployment-safe destinations, and that the custom archive replaced each former blog-only archive. The normal link validator checks all emitted destinations and fragments.
