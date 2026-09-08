# External link backlog

Reader-facing external URLs that fail `npm run validate:external-links` belong here until a focused content pass can verify a replacement or remove the reference.

Last full audit: 2026-09-07

## Open failures

- [ ] Replace or remove `https://developer.apple.com/documentation/foundation/nsundomanager`.
  - Result: HTTP 404.
  - Rendered page: `posts/2026-07-19-ios-interaction-design-feedback/`.
  - Source: `src/content/docs/posts/2026-07-19-ios-interaction-design-feedback.md`.
- [ ] Replace or remove `https://scikit-learn.org/stable/tutorial/text_analytics/working_with_text_data.html`.
  - Result: HTTP 404.
  - Rendered pages: `posts/2026-07-31-nltk-spacy-support-ticket-triage/` and `topics/ai/natural-language-processing/`.
  - Sources: `src/content/docs/posts/2026-07-31-nltk-spacy-support-ticket-triage.md` and `src/content/docs/topics/ai/natural-language-processing/index.md`.
- [ ] Recheck or replace `https://neptune.ai/`.
  - Result: fetch failed.
  - Rendered page: `topics/ops/mlops/`.
  - Source: `src/content/docs/topics/ops/mlops/index.md`.
- [ ] Replace or remove `https://dimacs.rutgers.edu/~graham/pubs/papers/cmencyc.pdf`.
  - Result: HTTP 404.
  - Rendered page: `topics/system-design/case-studies/ad-click-aggregator/`.
  - Source: `src/content/docs/topics/system-design/case-studies/ad-click-aggregator.md`.
- [ ] Replace or remove `https://calculator.aws/pricing/2/home`.
  - Result: HTTP 404.
  - Rendered page: `topics/system-design/estimation/`.
  - Source: `src/content/docs/topics/system-design/estimation/index.md`.

## Completion rule

Close an item only after the source link is corrected or removed, the affected page builds, and `npm run validate:external-links` no longer reports the URL.
