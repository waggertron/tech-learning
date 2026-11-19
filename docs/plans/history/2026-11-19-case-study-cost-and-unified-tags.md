# Patient lookup cost update and unified tags

Date: 2026-11-19
Status: complete

## Scope

Expand the existing patient lookup case study using the supplied capacity/latency guide, preserving its URL and stronger consistency/measurement explanations. The new material is a full monthly cost model and its sensitivities, not a duplicate dated post.

Add unified tag discovery for every rendered page carrying frontmatter tags. Both posts and topic pages must show tags linked to a shared archive containing all matching pages. Preserve existing blog tag URLs and avoid changing archived post, series, or topic routes.

## Execution checklist

- [x] **C1**: Compare the supplied guide against existing content and confirm whether a duplicate is needed.
  - Evidence: `patient-lookup-aws.md` already covers source sections 1-8. Its existing route is retained; the source's section 9 cost model is the substantive addition.
- [x] **C2**: Verify AWS rate assumptions and reconcile transactional write capacity, table billing mode, and billed storage with the existing consistency design.
  - Evidence: Primary AWS pricing pages and regional Price List files checked on 2026-11-19. Transactional writes use 22 units per paired update; both database lines change with billing mode; stored-item overhead is explicit. Decimal arithmetic checks passed.
- [x] **C3**: Add an itemized cost model, total operating footprint, billing/traffic alternatives, break-even arithmetic, and validation procedure to the existing case study.
  - Evidence: Expanded existing case with complete modeled total $1,424.99, $1,600 budget, full on-demand total $1,085.77, sustained-volume core comparison and read-only break-even. Performance remains explicitly unmeasured.
- [x] **C4**: Update the three discovery indexes and related estimation link without changing the case-study route.
  - Evidence: Existing route preserved; three discovery indexes now mention cost. Estimation reference links to the expanded worked example and the case links back.
- [x] **T1**: Build a shared tag inventory covering all eligible rendered docs, with deterministic tag routes and no duplicate membership.
  - Evidence: Shared collection inventory passes six focused tests, covering mixed content, actual catalog membership, normalization, collisions, draft boundaries, and URL safety.
- [x] **T2**: Display accessible clickable tag links on posts and topic pages and provide a discoverable tag directory.
  - Evidence: ContentTags supplies accessible topic navigation; existing blog footer tags remain. Home and topic index expose the tag directory. Browser clicks from both types passed without JavaScript.
- [x] **T3**: Make existing blog tag URLs lead to the shared content rather than post-only results.
  - Evidence: Build proves explicit route priority at existing /posts/tags/<slug>/ URLs. All 732 archives include full mixed-content membership. Installed blog tag archives were not paginated, so no old pagination URLs are lost.
- [x] **T4**: Verify archive membership, tag routing/collisions, empty-tag behavior, mobile presentation, and navigation from both a post and a topic.
  - Evidence: Built output verifies 735 tagged pages and 3,320 memberships. Chromium checks passed HTTP/curl, post/topic clicks, mixed membership, preserved URLs, no-JavaScript navigation, and mobile directory width.
- [x] **D1**: Document tag authoring behavior and record the delivered capabilities in the feature tracker.
  - Evidence: docs/unified-tags.md and pre-push docs describe authoring, eligibility, collisions, shared routes, source/output/browser gates, and search exclusion. Feature tracker records both delivered changes.
- [x] **V1**: Run focused tag tests, arithmetic checks, published-content/style checks, site build, rendered-page and internal-link checks, plus focused browser verification.
  - Evidence: Six tag tests passed; Decimal checks confirmed all totals/break-even/storage; Markdown AST has zero unintended math nodes. Full validate:pre-push passed, including build, all site/internal links, 732 archives, 735 tagged pages/3,320 memberships, and no-JavaScript/mobile tag browser checks. Rendered case amounts passed.
- [x] **V2**: Independently review the cost assumptions and tag behavior, resolve significant findings, then archive this plan when all items are complete.
  - Evidence: Independent cost and tag reviews completed. Escaped currency fixed the only cost finding. Archive search exclusion failed against the first build, then passed in the final build. Final documentation aligned; plan archived.

## Constraints and validation

No new dependencies. Prices are dated engineering estimates, not AWS billing or latency guarantees. Keep source-specific assumptions visible and do not invent deployed/load-tested results. Primary sources support the rates and API contracts. Recalculate both read and write charges when comparing DynamoDB billing modes.

Run `npm run build` after each batch. Tag verification must exercise the actual generated routes and page controls, not only metadata helpers. The existing pre-push tiers remain the integration gate. No commit or push is included in this task unless separately requested.

## Review notes

- Independent arithmetic review confirmed the cost totals and caught currency being interpreted as inline math. Currency outside fenced examples is now escaped; the Markdown AST contains no unintended math nodes.
- Independent tag code review found no significant defects. A follow-up built-output check requires archive search exclusion to preserve original-article search quality. It failed against the first build as expected, then the archive metadata and page validator were corrected for the final gate.
