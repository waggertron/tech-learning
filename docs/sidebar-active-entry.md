# Active sidebar entry

Every content page keeps its matching sidebar link visible. Starlight supplies the semantic current-page marker with `aria-current="page"`. The site adds two behaviors around that marker:

1. The active link receives a warm yellow gradient, dark text, an amber leading marker, and a soft shadow without an inset border.
2. The sidebar collapses groups outside the active page path, opens the active link's ancestor groups, and centers the link when it falls outside the visible sidebar area.

The script does not move the sidebar when the active link is already visible. This preserves the reader's nearby navigation context while keeping unrelated sections out of view until the reader opens them.

## Implementation contract

- `src/scripts/sidebar-active-entry.ts` owns inactive group collapse, ancestor expansion, and scroll positioning.
- `src/components/Head.astro` loads the behavior on every page.
- `src/styles/custom.css` owns the visual marker.
- `scripts/validate-custom-pages.mjs` checks the current link, open ancestors, collapsed inactive groups, nonzero sidebar scroll, visible position, yellow gradient, text contrast, and absence of an inset border in Chromium.

The implementation uses Starlight's public accessibility state instead of matching page titles or reconstructing routes. If Starlight changes its sidebar markup, the browser contract fails before deployment.

## Validation

Run the focused browser check after changing the sidebar script, styles, or Starlight integration:

```bash
npm run build
npm run validate:custom-pages
```

The full pre-push suite includes both commands.
