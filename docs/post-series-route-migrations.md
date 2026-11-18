# Post series route migrations

Captured before consolidation on 2026-11-17. The [execution checklist](./plans/current/2026-11-17-post-series-value-improvement-plan.md) governs completion.

The machine-readable [inventory](./data/post-series-route-migrations.json) retains original titles, headings, inbound reference locations with line text, outbound URLs, and explicitly referenced fragments. Routes omit the deployment prefix; built destinations include `/tech-learning`. `active` means a source has been retired and its compatibility route is enabled. Retained sources have no redirect.

## Baseline

- `npm run build`: passed at plan creation, 1,204 static pages.
- `npm run validate:style` and `npm run validate:published-content`: passed.
- `npm run validate:pages` and `npm run validate:links`: passed, 1,204 pages each.
- `npm run validate:post-discovery`: passed outside sandbox, 233 catalog posts.
- `swift build --package-path companion/field-notes/Packages/FieldNotesCore`: passed outside sandbox.
- `./scripts/test-package.sh` from `companion/field-notes`: passed outside sandbox, seven tests. The plan originally invoked this wrapper from the repository root; the wrapper requires the companion working directory.
- Swift: Apple 6.3.3, target arm64-apple-macosx26.0. Selected developer directory: CommandLineTools. Full Xcode, simctl runtimes/devices, and XcodeGen unavailable.
- Initial sandbox Chromium and compiler-cache failures disappeared outside sandbox. These are environment limits, not content failures.

## Route and reference inventory

| Original source | Destination source | Referenced fragments | Inbound locations | Outbound URLs | State |
| --- | --- | --- | --- | --- | --- |
| `2026-07-19-ios-architecture-tests-refactoring-decisions-tradeoffs.md` | `2026-07-19-ios-testing-strategy-seams-confidence.md` | none found | 6 | 7 | compatibility enabled |
| `2026-07-19-ios-swiftui-uikit-navigation-accessibility-ui-tests.md` | `2026-07-19-ios-xctest-xcuitest-test-plans-coexistence.md` | none found | 6 | 7 | compatibility enabled |
| `2026-07-19-ios-persistence-core-data-files-caches-migrations-secure-storage.md` | `2026-07-19-ios-persistence-core-data-files-caches-migrations-secure-storage.md` | none found | 6 | 8 | retained |
| `2026-07-19-ios-security-privacy-permissions-platform-policy.md` | `2026-07-19-ios-persistence-core-data-files-caches-migrations-secure-storage.md` | none found | 12 | 8 | compatibility enabled |
| `2026-07-19-ios-background-work-notifications-deep-links-app-extensions.md` | `2026-07-19-ios-background-work-notifications-deep-links-app-extensions.md` | none found | 12 | 8 | retained |
| `2026-07-19-ios-logging-analytics-crashes-privacy-feature-flags.md` | `2026-07-19-ios-persistence-core-data-files-caches-migrations-secure-storage.md` | none found | 7 | 7 | compatibility enabled |
| `2026-07-19-ios-instruments-responsiveness-energy-launch-networking.md` | `2026-07-19-ios-performance-memory-energy-launch-device-matrices.md` | none found | 6 | 7 | compatibility enabled |
| `2026-07-19-ios-build-settings-signing-entitlements-ci-dependencies-release-configuration.md` | `2026-07-19-ios-persistence-core-data-files-caches-migrations-secure-storage.md` | none found | 6 | 8 | compatibility enabled |
| `2026-07-19-ios-testflight-app-store-review-launch-observability-evolution.md` | `2026-07-19-ios-persistence-core-data-files-caches-migrations-secure-storage.md` | none found | 7 | 8 | compatibility enabled |
| `2026-07-19-one-product-across-apple-platforms.md` | `2026-07-19-one-product-across-apple-platforms.md` | none found | 11 | 7 | retained |
| `2026-07-19-ipados-multitasking-pointer-keyboard-pencil-documents.md` | `2026-07-19-one-product-across-apple-platforms.md` | none found | 6 | 8 | compatibility enabled |
| `2026-07-19-macos-swiftui-scenes-commands-windows-settings-tables-documents.md` | `2026-07-19-one-product-across-apple-platforms.md` | none found | 7 | 8 | compatibility enabled |
| `2026-07-19-appkit-mac-catalyst-framework-choice.md` | `2026-07-19-one-product-across-apple-platforms.md` | none found | 6 | 8 | compatibility enabled |
| `2026-07-19-watchos-app-structure-watch-connectivity.md` | `2026-07-19-one-product-across-apple-platforms.md` | none found | 7 | 8 | compatibility enabled |
| `2026-07-19-watchos-workouts-complications-smart-stack-constraints.md` | `2026-07-19-one-product-across-apple-platforms.md` | none found | 7 | 8 | compatibility enabled |
| `2026-07-19-tvos-focus-remote-input-shelves-navigation.md` | `2026-07-19-one-product-across-apple-platforms.md` | none found | 7 | 7 | compatibility enabled |
| `2026-07-19-avkit-avfoundation-playback-streaming-media-sessions.md` | `2026-07-19-one-product-across-apple-platforms.md` | none found | 8 | 8 | compatibility enabled |
| `2026-07-19-visionos-windows-volumes-ornaments-spatial-input.md` | `2026-07-19-one-product-across-apple-platforms.md` | none found | 7 | 8 | compatibility enabled |
| `2026-07-19-realitykit-arkit-immersive-spaces-comfort-assets.md` | `2026-07-19-one-product-across-apple-platforms.md` | none found | 13 | 8 | compatibility enabled |
| `2026-07-19-widgetkit-live-activities.md` | `2026-07-19-widgetkit-live-activities.md` | none found | 6 | 8 | retained |
| `2026-07-19-app-intents-shortcuts-spotlight-system-actions.md` | `2026-07-19-widgetkit-live-activities.md` | none found | 6 | 8 | compatibility enabled |
| `2026-07-19-cloudkit-icloud-containers-sharing-sync.md` | `2026-07-19-widgetkit-live-activities.md` | none found | 7 | 8 | compatibility enabled |
| `2026-07-19-mapkit-core-location-geocoding-weatherkit.md` | `2026-07-19-widgetkit-live-activities.md` | none found | 9 | 8 | compatibility enabled |
| `2026-07-19-camera-photokit-image-pipelines-vision.md` | `2026-07-19-widgetkit-live-activities.md` | none found | 8 | 8 | compatibility enabled |
| `2026-07-19-audio-speech-recording-interruptions.md` | `2026-07-19-widgetkit-live-activities.md` | none found | 6 | 8 | compatibility enabled |
| `2026-07-19-video-capture-editing-playback-streaming-architecture.md` | `2026-07-19-widgetkit-live-activities.md` | none found | 12 | 8 | compatibility enabled |
| `2026-07-19-core-bluetooth-nearby-interaction-accessories-connectivity.md` | `2026-07-19-widgetkit-live-activities.md` | none found | 6 | 8 | compatibility enabled |
| `2026-07-19-healthkit-workoutkit-health-data-design.md` | `2026-07-19-widgetkit-live-activities.md` | none found | 9 | 8 | compatibility enabled |
| `2026-07-19-core-ml-vision-natural-language-on-device-intelligence.md` | `2026-07-19-widgetkit-live-activities.md` | none found | 6 | 8 | compatibility enabled |
| `2026-07-19-storekit-subscriptions-offers-entitlement-state.md` | `2026-07-19-widgetkit-live-activities.md` | none found | 13 | 8 | compatibility enabled |
| `2026-07-19-apple-pay-passes-wallet-transaction-ux.md` | `2026-07-19-widgetkit-live-activities.md` | none found | 11 | 8 | compatibility enabled |
| `2026-07-19-games-gamekit-spritekit-scenekit-metal-choices.md` | `2026-07-19-widgetkit-live-activities.md` | none found | 6 | 8 | compatibility enabled |
| `2026-07-20-home-matter-carplay-files-collaboration-specialized-extensions.md` | `2026-07-19-widgetkit-live-activities.md` | none found | 6 | 8 | compatibility enabled |
| `2026-07-20-atlas-desk-discovery-release-boundary.md` | `2026-07-20-atlas-desk-discovery-release-boundary.md` | none found | 5 | 8 | retained |
| `2026-07-20-atlas-desk-domain-architecture.md` | `2026-07-20-atlas-desk-discovery-release-boundary.md` | none found | 5 | 8 | compatibility enabled |
| `2026-07-20-atlas-desk-swiftui-phone-tablet-app.md` | `2026-07-20-atlas-desk-discovery-release-boundary.md` | none found | 5 | 8 | compatibility enabled |
| `2026-07-20-atlas-desk-storage-search-files-sync.md` | `2026-07-20-atlas-desk-discovery-release-boundary.md` | none found | 5 | 8 | compatibility enabled |
| `2026-07-20-atlas-desk-macos-product-design.md` | `2026-07-20-atlas-desk-discovery-release-boundary.md` | none found | 5 | 8 | compatibility enabled |
| `2026-07-20-atlas-desk-quality-release-review.md` | `2026-07-20-atlas-desk-discovery-release-boundary.md` | none found | 6 | 8 | compatibility enabled |
| `2026-07-20-pulsetrail-product-safety-privacy.md` | `2026-07-20-pulsetrail-product-safety-privacy.md` | none found | 5 | 8 | retained |
| `2026-07-20-pulsetrail-cross-device-architecture.md` | `2026-07-20-pulsetrail-product-safety-privacy.md` | none found | 5 | 8 | compatibility enabled |
| `2026-07-20-pulsetrail-healthkit-workoutkit-maps-location.md` | `2026-07-20-pulsetrail-product-safety-privacy.md` | none found | 6 | 8 | compatibility enabled |
| `2026-07-20-pulsetrail-watch-ui-complications-widgets-live-activities.md` | `2026-07-20-pulsetrail-product-safety-privacy.md` | none found | 6 | 8 | compatibility enabled |
| `2026-07-20-pulsetrail-offline-battery-sync-failure-recovery.md` | `2026-07-20-pulsetrail-product-safety-privacy.md` | none found | 5 | 8 | compatibility enabled |
| `2026-07-20-pulsetrail-testing-release-review.md` | `2026-07-20-pulsetrail-product-safety-privacy.md` | none found | 5 | 8 | compatibility enabled |
| `2026-07-20-screenroom-product-content-model.md` | `2026-07-20-screenroom-product-content-model.md` | none found | 5 | 8 | retained |
| `2026-07-20-screenroom-tvos-architecture-focus.md` | `2026-07-20-screenroom-product-content-model.md` | none found | 5 | 8 | compatibility enabled |
| `2026-07-20-screenroom-playback-media-lifecycle.md` | `2026-07-20-screenroom-product-content-model.md` | none found | 5 | 8 | compatibility enabled |
| `2026-07-20-screenroom-backend-auth-subscriptions-downloads.md` | `2026-07-20-screenroom-product-content-model.md` | none found | 5 | 8 | compatibility enabled |
| `2026-07-20-screenroom-performance-accessibility-resilience.md` | `2026-07-20-screenroom-product-content-model.md` | none found | 5 | 8 | compatibility enabled |
| `2026-07-20-screenroom-testing-release-review.md` | `2026-07-20-screenroom-product-content-model.md` | none found | 6 | 8 | compatibility enabled |
| `2026-07-20-neighborlink-product-trust-moderation.md` | `2026-07-20-neighborlink-product-trust-moderation.md` | none found | 6 | 8 | retained |
| `2026-07-20-neighborlink-architecture-identity-api-contracts.md` | `2026-07-20-neighborlink-product-trust-moderation.md` | none found | 6 | 8 | compatibility enabled |
| `2026-07-20-neighborlink-uikit-feed-search-forms-camera-maps.md` | `2026-07-20-neighborlink-product-trust-moderation.md` | none found | 5 | 8 | compatibility enabled |
| `2026-07-20-neighborlink-chat-offline-writes-push-deep-links.md` | `2026-07-20-neighborlink-product-trust-moderation.md` | none found | 5 | 8 | compatibility enabled |
| `2026-07-20-neighborlink-payments-privacy-security-moderation-operations.md` | `2026-07-20-neighborlink-product-trust-moderation.md` | none found | 5 | 8 | compatibility enabled |
| `2026-07-20-neighborlink-quality-release-review.md` | `2026-07-20-neighborlink-product-trust-moderation.md` | none found | 6 | 8 | compatibility enabled |
| `2026-07-20-spaceplanner-product-comfort-spatial-design.md` | `2026-07-20-spaceplanner-product-comfort-spatial-design.md` | none found | 6 | 8 | retained |
| `2026-07-20-spaceplanner-architecture-asset-pipeline.md` | `2026-07-20-spaceplanner-product-comfort-spatial-design.md` | none found | 5 | 8 | compatibility enabled |
| `2026-07-20-spaceplanner-windows-volumes-immersion-input.md` | `2026-07-20-spaceplanner-product-comfort-spatial-design.md` | none found | 5 | 8 | compatibility enabled |
| `2026-07-20-spaceplanner-realitykit-arkit-interaction-rendering.md` | `2026-07-20-spaceplanner-product-comfort-spatial-design.md` | none found | 5 | 8 | compatibility enabled |
| `2026-07-20-spaceplanner-persistence-collaboration-performance-accessibility.md` | `2026-07-20-spaceplanner-product-comfort-spatial-design.md` | none found | 5 | 8 | compatibility enabled |
| `2026-07-20-spaceplanner-testing-release-review.md` | `2026-07-20-spaceplanner-product-comfort-spatial-design.md` | none found | 5 | 7 | compatibility enabled |
| `2026-07-07-react-vite-client-only-apps.md` | `2026-07-07-react-framework-choice-project-setup.md` | none found | 9 | 9 | compatibility enabled |
| `2026-07-07-react-eslint-typescript-formatting-ci.md` | `2026-07-07-react-framework-choice-project-setup.md` | none found | 7 | 9 | compatibility enabled |
| `2026-04-24-composition-over-inheritance.md` | `2026-04-24-solid-principles.md` | none found | 4 | 10 | compatibility enabled |

## Compatibility proof

Passed on 2026-11-17: the actual old Instruments URL with `#design-the-boundary` reached the merged performance lesson's `#measure-one-repeatable-workload` in Chromium under `/tech-learning`. The generated page is a zero-second meta refresh with canonical destination and noindex. It has no Pagefind body; the catalog excludes the retired post. The static migration validator initially failed before the route existed, then passed for the two pilot routes after the build. The complete active map is checked again after consolidation.

Astro's static output is not an HTTP 301 response. [Astro 5 redirect configuration](https://v5.docs.astro.build/en/reference/configuration-reference/#redirects) documents this boundary. Compatibility routes choose a known section explicitly rather than relying on inherited hashes. Fine-grained React heading mappings are also recorded for rewriting internal references; an external old bookmark reaches the chosen compatibility section.

## Reference audit procedure

For each active mapping, update inbound links to the final destination and revise the label/prose. Audit outbound links on the destination, then reconcile adjacent previous/next links and the series hub. The inventory preserves historical references; maintained reader-facing sources should no longer point at retired routes. Old arbitrary fragments land at the explicitly chosen destination section rather than depend on undocumented hash forwarding.

Remaining historical matches in plans and the migration inventory are intentional. Record any other exceptions here with a reason.

## Supplemental reference changes

- React main reading order is now 37 installments. Expo/React Native is a standalone optional branch, with direct links back to the guide.
- SOLID and composition share the SOLID route; the old composition route points to its composition section. The mutex remains in the design collection with order 2.
- The Grok incident is standalone, linked from Auth related reading and Guardrails optional cases. AI Guardrails retains its existing 14-part order.
- Coding Agent Internals is standalone. Its preserved guide has one published article, with the unimplemented expansion removed from public discovery.
- The DSL destination remains a substantive guide with its calculator and worked examples.

## External reference audit, 2026-11-17

`EXTERNAL_LINK_CONCURRENCY=12 npm run validate:external-links` completed against the built site and reported the following existing failures. Every URL was already present in the pre-change HEAD snapshot. None targets a retired article or was introduced by this remediation. Internal routes and fragments pass separately. These unrelated references are recorded for follow-up rather than silently rewritten to a guessed source. HTTP 403/429 responses are treated by the validator as access restrictions, not as proof of content.

| Existing external URL | Observed failure | Original source evidence |
| --- | --- | --- |
| https://developer.apple.com/documentation/foundation/nsundomanager | HTTP 404 | `src/content/docs/posts/2026-07-19-ios-interaction-design-feedback.md` |
| https://scikit-learn.org/stable/tutorial/text_analytics/working_with_text_data.html | HTTP 404 | `src/content/docs/posts/2026-07-31-nltk-spacy-support-ticket-triage.md; src/content/docs/topics/ai/natural-language-processing/index.md` |
| https://analoghq.ai/aie-2026 | HTTP 404 | `src/content/docs/posts/2026-07-23-agentic-systems-need-ontologies.md` |
| https://llmbench.ai/agent | HTTP 404 | `src/content/docs/topics/ai/benchmarks/agent-benchmarks.md` |
| https://bytecoin.org/old/whitepaper.pdf | fetch failed | `src/content/docs/topics/blockchain/cryptocurrency/monero.md` |
| https://www.bicsi.org/standards/available-standards-store/single-document/ansi-tia-568-2-d | HTTP 404 | `src/content/docs/topics/networking/part-04-physical-layer-and-cabling.md` |
| https://docs.gitlab.com/ee/topics/gitlab_flow.html | HTTP 404 | `src/content/docs/topics/ops/gitflow/index.md` |
| https://neptune.ai/ | fetch failed | `src/content/docs/topics/ops/mlops/index.md` |
| https://nlp.stanford.edu/IR-book/ | fetch failed | `src/content/docs/topics/system-design/case-studies/facebook-post-search.md` |
| https://dimacs.rutgers.edu/~graham/pubs/papers/cmencyc.pdf | HTTP 404 | `src/content/docs/topics/system-design/case-studies/ad-click-aggregator.md` |
| https://calculator.aws/pricing/2/home | HTTP 404 | `src/content/docs/topics/system-design/estimation/index.md` |
