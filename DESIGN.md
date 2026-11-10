# Design

## Source of truth
Active, 2026-11-09. Applies to the homepage, post discovery, and Starlight theme. Evidence: existing homepage, custom CSS, content schema, and Starlight Blog 0.19 source. No prior design contract or screenshot baseline exists.

## Brand
Here Be Dragons is a technical field journal: curious, readable, and grounded in real software. Avoid promotional copy and decorative dashboard cards.

## Product goals
Readers can find dated posts from the homepage, switch newest/oldest order, and browse tags and paginated archives. Existing post and series URLs remain valid. No framework migration or content rewrite.

## Personas and jobs
Developers browse recent writing and return to reference pages on desktop or mobile.

## Information architecture
Home: short introduction, Topics and Posts links, name history, software explanation, site description, sortable post list, then repository information and the AI usage note. Posts: plugin archive, tags, RSS. Series guides retain posts/series routes while their sources live outside the plugin's posts directory.

## Design principles
Keep Starlight navigation and reading tools. Give typography the strongest visual identity. Use compact dated rows for discovery and quiet surfaces for long articles.

## Visual language
Forest accents (#256349) with pale cool surfaces (#f8faf8, #f0f5f1) in light mode, and deep blue-green surfaces (#142b26, #19332c) with mint links (#a4dabc) in dark mode. Newsreader headings and Source Sans 3 body text, self-hosted with licenses. Existing monospace code remains. Modest radii, no ornamental shadows, and no entrance animation.

## Components
PostBrowser owns the homepage date selector and post rows. Starlight Blog owns pagination, tags, RSS, and article metadata. A MarkdownContent wrapper keeps series guides outside blog rendering. custom.css owns shared theme tokens.

## Accessibility
Semantic headings, labeled native select, visible keyboard focus, sufficient text contrast, UTC publication dates, and usable links without JavaScript. Target WCAG AA. Respect reduced motion.

## Responsive behavior
Single-column reading and post rows. Controls wrap on narrow screens. Verify at 390px and desktop widths without horizontal overflow.

## Interaction states
Newest first is the server-rendered default. JavaScript enables oldest-first sorting. No entries gets a short empty message. Static content remains usable when scripts or fonts fail.

## Content voice
Direct, reader-facing labels: Posts, Sort by, Newest first, Oldest first. Follow repo writing rules.

## Implementation constraints
Astro 5 and Starlight 0.32 remain. Pin starlight-blog 0.19.0 for compatibility. Relative authored links resolve from rendered routes. Schema derives concise plugin excerpts from existing descriptions. Build and local browser checks precede any push or deployment.

## Open questions
None blocking this first version. Additional sort keys and broader theme customization are deferred.
