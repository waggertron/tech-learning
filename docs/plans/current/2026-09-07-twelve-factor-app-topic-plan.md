# Twelve-Factor App long-form topic plan

Status: in progress

Created: 2026-09-07

Research baseline: `docs/research/2026-09-07-twelve-factor-app-research.md`

## Goal

Publish a long-form Operations topic that teaches the original Twelve-Factor App methodology, explains the application-platform contract beneath it, tests each factor through observable outcomes, and compares modern extensions without presenting proposals as settled canon.

## Audience and outcome

The primary reader is a software engineer who has heard "twelve-factor" used as shorthand but needs to design, review, or migrate an actual service. After reading, they should be able to:

- Explain the failure mode each canonical factor was designed to prevent.
- Separate durable principles from technology-specific wording in the original text.
- Map the principles to containers, orchestration, managed backing services, identity, and telemetry.
- Recognize where Twelve-Factor ends and production readiness, security, reliability, or data operations begin.
- Evaluate a service with evidence instead of declaring it compliant from a configuration checklist.
- Distinguish official modernization work from independent extension models.

## Scope

### Included

- The history, intent, and limits of the original methodology.
- All twelve canonical factors in their original order.
- A narrow-conduit model of application and platform responsibilities.
- Modern interpretations grounded in OCI, Buildpacks, SLSA, Kubernetes, OpenTelemetry, and NIST guidance.
- The official modernization repository and current proposal status.
- Kevin Hoffman's reordered 15-factor model.
- IBM's seven missing factors.
- CNCF's 2022 reassessment.
- NGINX amendments as historical prior art, with a source caveat.
- One coherent order service implemented in TypeScript, Python, and Go.
- A TypeScript, Python, and Go example for every canonical factor, for 36 factor-language examples.
- Three standalone, runnable reference repositories with locked dependencies, unit tests, local integration tests, and CI.
- Repository-level Codex and Claude harnesses that guide changes through the Twelve-Factor contract and invoke deterministic checks.
- Container and Kubernetes excerpts that demonstrate the platform contract.
- Verification questions and failure tests for every factor.

### Excluded

- Treating Kubernetes as a requirement for twelve-factor design.
- Publishing an invented combined list of every proposed factor.
- A complete Kubernetes operations tutorial.
- A complete secure software development, SRE, or software supply-chain standard.
- Unrelated frameworks that borrow the twelve-factor name for AI agents or AgentOps.
- Real credentials, production endpoints, or realistic secret-shaped placeholders.
- Treating an AI instruction file or skill response as proof that the application follows the factors.

## Editorial thesis

Use Twelve-Factor as an application-platform contract and diagnostic lens. Do not mistake it for a complete definition of production readiness.

The canonical twelve provide the article's numbered spine. Modern official proposals and independent extensions appear in a separate, dated comparison. Every modern addition must answer one of two questions:

1. Does it preserve the original application-platform boundary with a newer mechanism?
2. Does it add a concern that the original methodology did not cover?

## Planned public content

Target hub: `src/content/docs/topics/ops/twelve-factor-app/index.mdx`

Working title: `Twelve-Factor Apps, What Still Holds and What Changed`

Target hub length: 450 to 550 lines.

The code examples are split into three child pages so the conceptual entry stays readable:

- `src/content/docs/topics/ops/twelve-factor-app/examples-factors-01-04.mdx`
- `src/content/docs/topics/ops/twelve-factor-app/examples-factors-05-08.mdx`
- `src/content/docs/topics/ops/twelve-factor-app/examples-factors-09-12.mdx`

Each child page covers four factors with synchronized TypeScript, Python, and Go tabs. Each hub section links directly to its matching example heading. Do not split the canonical explanation itself across the example pages.

Proposed public reference repositories:

- `https://github.com/waggertron/twelve-factor-typescript`
- `https://github.com/waggertron/twelve-factor-python`
- `https://github.com/waggertron/twelve-factor-go`

Each repository must work on its own. The tech-learning entry links to the repository and a tagged release that matches the published snippets. Local development must not require cloud credentials or production services.

Required discovery changes:

- `src/content/docs/topics/ops/index.md`
- `src/content/docs/topics/index.mdx`

Candidate backlink changes:

- `src/content/docs/topics/ops/secrets-keys-tokens.md`
- Docker topic, if a focused related link fits the existing section.
- Kubernetes topic, if a focused related link clarifies the application-platform boundary.

## Content architecture

1. Open with a deployment failure caused by hidden host state, mutable runtime setup, local sessions, and inaccessible logs.
2. Define the methodology and reject common category errors.
3. Draw the application-platform boundary with an ASCII diagram.
4. Provide a scan table for all twelve factors.
5. Teach factors I through XII in canonical order.
6. Thread equivalent TypeScript, Python, and Go services through the factors.
7. Explain literal readings that have aged poorly.
8. Compare official modernization proposals and independent extensions.
9. Name missing production concerns and connect them to complementary frameworks.
10. Finish with an evidence-based service audit checklist.
11. Provide primary references and related local topics.

## Review outline

This outline describes the intended reader experience. Section names may tighten during drafting, but their purpose and order should remain stable unless review finds a structural problem.

### Main entry: Twelve-Factor Apps, What Still Holds and What Changed

#### 1. Opening: the server nobody can reproduce

- Begin with an application that runs on one long-lived server because its packages, config, sessions, build output, and logs are bound to that machine.
- Show the operational symptoms: deployments are manual, rollback is uncertain, scaling copies hidden state, and failures erase useful evidence.
- Frame Twelve-Factor as a way to replace those hidden assumptions with an explicit contract.

Reader outcome: recognize the class of problem before learning the numbered factors.

#### 2. What Twelve-Factor is, and what it is not

- Define it as a methodology for service applications.
- State its original portability, deployment, parity, and scaling goals.
- Establish that it is language-neutral.
- Reject four category errors: it is not a microservices mandate, Kubernetes checklist, cloud certification, or complete production-readiness standard.
- Include a short history from the 2011 origin through the current open-source modernization effort.

Reader outcome: use the framework at the right scope.

#### 3. The contract between application and platform

- Introduce the narrow-conduit model.
- Use an ASCII diagram to separate application responsibilities from platform responsibilities.
- Explain why a small interface lets applications and platforms evolve independently.
- Introduce the running order-service example and its three process types: web, worker, and admin.

Reader outcome: understand the idea connecting all twelve factors.

#### 4. The twelve factors at a glance

- Provide a scan table with factor, original intent, modern interpretation, and proof question.
- Explain the repeated teaching pattern used in every detailed section:
  1. Original principle.
  2. Failure it prevents.
  3. Modern reading.
  4. TypeScript, Python, and Go example link.
  5. Evidence that proves the design works.
- Use the exact numbered heading pattern `Factor I: Codebase` through `Factor XII: Admin processes` in the hub and example pages.

Reader outcome: form a map before reading the details.

#### 5. Factor I: Codebase

- Explain one codebase tracked in revision control with many deploys.
- Separate deployable application identity from repository layout.
- Address monorepos and shared libraries without turning repository count into dogma.
- Trace a release back to a commit and build target.
- Link to the Fastify/BullMQ, FastAPI/Dramatiq/Typer, and chi/Asynq/Cobra command-layout examples.
- Proof question: can an operator identify the source revision and build target for every running release?

#### 6. Factor II: Dependencies

- Explain explicit declaration and isolation from host packages.
- Compare manifests, lockfiles, clean installation, and runtime artifact contents.
- Extend the factor to dependency verification and supply-chain evidence without claiming the original covered them.
- Link to `npm ci`, frozen `uv` synchronization, and Go module verification examples.
- Proof question: can a clean environment resolve and verify every required dependency without hidden machine state?

#### 7. Factor III: Config

- Define config as values that vary between deploys.
- Apply the open-source test: could the code be published without exposing credentials or environment-specific values?
- Explain environment variables, mounted files, secret stores, and workload identity as delivery mechanisms.
- Separate configuration schema from secret material.
- Link to Zod, `pydantic-settings`, and `caarlos0/env` validation examples.
- Proof question: does invalid or missing config fail at startup without printing sensitive values?

#### 8. Factor IV: Backing services

- Explain databases, queues, caches, object stores, and third-party APIs as attached resources.
- Preserve the URL-and-credentials attachment idea while rejecting false semantic interchangeability.
- Show why contract tests matter when swapping providers.
- Link to PostgreSQL and queue clients constructed from injected endpoints in all three languages.
- Proof question: can a backing resource change without code edits, and do tests detect semantic incompatibility?

#### 9. Factor V: Build, release, run

- Separate compilation and packaging, deploy-specific release assembly, and runtime execution.
- Explain immutable artifacts, release identity, promotion, rollback, and provenance.
- Show why installing dependencies or modifying code during startup breaks the boundary.
- Link to the Node, Python wheel, and Go binary container examples.
- Proof question: can the exact artifact be promoted and rolled back without rebuilding it?

#### 10. Factor VI: Processes

- Explain stateless, share-nothing application processes.
- Clarify that durable state still exists in backing services.
- Cover sessions, uploads, caches, idempotency, and retry-safe effects.
- Link to Fastify, FastAPI, and chi handlers that persist through PostgreSQL rather than process memory.
- Proof question: can any instance disappear after accepting work without losing required state?

#### 11. Factor VII: Port binding

- Explain the self-contained service listener and platform routing contract.
- Distinguish network servers from workers, scheduled jobs, and function invocation contracts.
- Link to Fastify, Uvicorn, and chi listeners using validated port config.
- Proof question: can the platform start and route the service without framework-specific server installation?

#### 12. Factor VIII: Concurrency

- Explain process types and horizontal scaling.
- Separate scaling the web fleet from scaling worker capacity.
- Add bounded concurrency, queue pressure, resource limits, and backpressure.
- Link to BullMQ, Dramatiq, and Asynq worker examples.
- Proof question: can each workload type scale independently without unbounded work inside one process?

#### 13. Factor IX: Disposability

- Explain fast startup and graceful shutdown.
- Walk through readiness removal, work draining, timeouts, retries, and termination grace.
- Distinguish liveness from readiness and startup.
- Link to Node signal handling, FastAPI lifespan, and Go context-driven shutdown examples.
- Proof question: can the platform stop an instance at an arbitrary time without corrupting work or causing an avoidable outage?

#### 14. Factor X: Dev/prod parity

- Explain the original time, people, and tools gaps.
- Replace the fantasy of identical environments with risk-based contract parity.
- Identify which boundaries belong in unit, integration, container, staging, and production verification.
- Link to the three PostgreSQL contract tests using each ecosystem's Testcontainers library.
- Proof question: are the production-significant differences known and tested at the right layer?

#### 15. Factor XI: Logs

- Explain logs as event streams written without application-managed routing or retention.
- Preserve stdout and stderr as the collection boundary for containers.
- Extend the discussion to structured events, metrics, traces, correlation, sampling, and access policy.
- Link to Pino, structlog, `slog`, and OpenTelemetry examples.
- Proof question: can an operator connect a failed request to its release, trace, and relevant events without entering the application instance?

#### 16. Factor XII: Admin processes

- Explain one-off tasks that use the same code, config, and release as long-running processes.
- Replace casual production shells with bounded commands, short-lived authority, and audit evidence.
- Use database migration as the running example.
- Link to Commander, Typer, and Cobra implementations.
- Proof question: is every production-changing admin action attributable to a release, identity, command, and result?

#### 17. One service, three ecosystems

- Reassemble the factor examples into the web, worker, and admin process model.
- Show that TypeScript, Python, and Go expose the same platform contract despite different libraries.
- Include one shared deployment diagram.
- Explain which details belong to application code and which belong to container or Kubernetes configuration.
- Link to all three example pages, reference repositories, and validation commands.

Reader outcome: see the factors operate as a system instead of isolated rules.

#### 18. Repository-level AI harnesses for Twelve-Factor work

- Explain the three harness layers: always-on repository instructions, on-demand workflow skills, and deterministic enforcement.
- Show the common file layout for `AGENTS.md`, `CLAUDE.md`, `.agents/skills/twelve-factor-app/`, `.claude/skills/twelve-factor-app/`, and the validation script.
- Explain that Codex reads root `AGENTS.md` and repository skills under `.agents/skills`.
- Explain that Claude reads root `CLAUDE.md` and project skills under `.claude/skills`.
- Keep `AGENTS.md` as the canonical always-on project contract and let `CLAUDE.md` import it before adding Claude-specific invocation guidance.
- Keep the Codex and Claude `SKILL.md` bodies equivalent within each repository and fail CI when they drift.
- Show explicit invocation for both tools and describe the prompts that should trigger the skill implicitly.
- Require the skill to identify affected factors, inspect existing contracts, run the repository's checks, and report evidence.
- Show why deterministic tests and CI enforce outcomes while agent instructions guide decisions.
- Link to the harness files and tagged releases in all three reference repositories.

Reader outcome: add reusable AI guidance without confusing agent compliance with application evidence.

#### 19. Where literal compliance goes wrong

- One codebase does not ban monorepos.
- Config separation does not require every value to live in an environment variable.
- Attached resources are not semantically interchangeable.
- Stateless application processes do not eliminate stateful systems.
- Port binding is not the invocation model for every workload.
- Dev/prod parity does not mean reproducing the entire production topology on a laptop.
- Stdout logs do not complete an observability strategy.
- Admin processes do not justify unrestricted production shells.

Reader outcome: preserve intent without copying dated mechanisms.

#### 20. The official modernization in progress

- Add a dated status note for the `next` branch.
- Cover open Config, Logs, and Identity issues.
- Cover the process-combination, Identity, and four-facets pull requests.
- Label the dynamic-config pull request as closed without merge.
- Explain the proposed Continuously Deployable, Configurable, Scalable, and Observable facets as a summary lens.

Reader outcome: know what the official project is considering without mistaking it for adopted text.

#### 21. Extended proposals

- Present Kevin Hoffman's reordered 15-factor model.
- Present IBM's factors XIII through XIX and their enterprise production scope.
- Use the CNCF 2022 reassessment to distinguish application-level and service-level concerns.
- Mention NGINX's historical microservices amendments with the source limitation.
- Consolidate overlaps around API contracts, telemetry, identity, scheduling, upgrades, audit, security, measurement, and testing.
- State clearly that these models do not form one cumulative canon.

Reader outcome: compare extension models by the gaps they address.

#### 22. What the twelve factors still do not cover

- Identity and authorization.
- Secure development and vulnerability response.
- Supply-chain integrity.
- Health and resource contracts.
- Data lifecycle and disaster recovery.
- Network security.
- Reliability targets and capacity planning.
- Delivery governance.
- Point to OpenTelemetry, SLSA, NIST SSDF, Kubernetes, and related local topics where they supply the missing model.

Reader outcome: know when another framework is required.

#### 23. Audit your service

- Finish with observable questions rather than a compliance score.
- Group the audit under source, build, config, runtime, lifecycle, telemetry, and administration.
- Include failure exercises: clean build, config rejection, instance kill, duplicate message, backing-service swap, rollback, and migration trace.
- Explain that a failed check reveals a boundary to improve, not a reason to claim the application is "not twelve-factor."

Reader outcome: leave with a practical review method.

#### 24. References and related topics

- Synthesize canonical Twelve-Factor sources into one reference group.
- Separate official modernization sources from independent proposals.
- Group library references by TypeScript, Python, and Go.
- Link to Docker, Kubernetes, GitOps, secrets, scalability, and relevant security material in this site.

### Example page 1: Factors I through IV

#### Page opening

- Reintroduce the shared order-service contract.
- Show how to select synchronized TypeScript, Python, and Go tabs.
- Link back to the main entry.

#### Factor examples

1. Factor I: Codebase, three process types from one versioned application.
2. Factor II: Dependencies, complete declarations and locked clean installs.
3. Factor III: Config, startup validation with safe failure output.
4. Factor IV: Backing services, PostgreSQL and queue clients created from injected endpoints.

Each factor includes:

- One short explanation of what the code proves.
- Synchronized TypeScript, Python, and Go tabs.
- The real libraries used.
- A focused command or test and its expected observation.
- A warning about what the example does not prove.

#### Page close

- Link to factors V through VIII.
- Link to the TypeScript, Python, and Go reference repositories at the release used by the entry.

### Example page 2: Factors V through VIII

#### Factor examples

5. Factor V: Build, release, run, one immutable artifact with release metadata.
6. Factor VI: Processes, durable state outside web and worker memory.
7. Factor VII: Port binding, self-contained service listeners.
8. Factor VIII: Concurrency, independently scalable web and worker process types with bounded work.

Use the same per-factor structure as the first example page.

#### Page close

- Link back to factors I through IV.
- Link forward to factors IX through XII.
- Link to the TypeScript, Python, and Go reference repositories at the release used by the entry.

### Example page 3: Factors IX through XII

#### Factor examples

9. Factor IX: Disposability, readiness, graceful shutdown, draining, and retries.
10. Factor X: Dev/prod parity, PostgreSQL contract tests through Testcontainers.
11. Factor XI: Logs, structured stdout events correlated with OpenTelemetry context.
12. Factor XII: Admin processes, bounded migration commands using the release's normal modules.

Use the same per-factor structure as the first example page.

#### Page close

- Link back to factors V through VIII.
- Link to the main audit checklist.
- Link to the TypeScript, Python, and Go reference repositories at the release used by the entry, plus each repository's validation command.

### Outline review questions

1. Does the opening establish a recognizable problem before introducing terminology?
2. Does each factor move from original intent to current practice without rewriting history?
3. Are the 36 examples easy to reach without interrupting the conceptual article?
4. Does the running order service stay coherent across all three languages?
5. Are official proposals visibly separated from independent extensions?
6. Does the limitations section prevent Twelve-Factor from being presented as a complete production standard?
7. Is the final audit useful to a team reviewing an existing service?
8. Does any section duplicate enough material that it should be combined before drafting?
9. Does the AI harness section clearly distinguish guidance from deterministic enforcement and show evidence for both Codex and Claude?

## Example architecture

The example uses one codebase and one immutable artifact with three process types:

```text
HTTP request -> web process -> database
Queue message -> worker process -> database
Release command -> admin job -> database migration
```

### TypeScript library suite

- Fastify for HTTP and Pino-backed structured logging.
- Zod for configuration validation.
- `pg` or `@fastify/postgres` for PostgreSQL.
- BullMQ for background work and bounded concurrency.
- OpenTelemetry JavaScript for traces and metrics.
- Commander for the admin command.
- Vitest and Testcontainers for Node.js for focused tests.

### Python library suite

- FastAPI and Uvicorn for HTTP serving.
- `pydantic-settings` for configuration validation.
- Psycopg 3 and `psycopg_pool` for PostgreSQL.
- Dramatiq for background work.
- structlog for structured events.
- OpenTelemetry Python for traces and metrics.
- Typer for the admin command.
- pytest and Testcontainers for Python for focused tests.

### Go library suite

- `chi/v5` with `net/http` for HTTP serving.
- `caarlos0/env/v11` for configuration validation.
- `pgx/v5` and `pgxpool` for PostgreSQL.
- Asynq for background work and bounded concurrency.
- `log/slog` for structured events.
- OpenTelemetry Go for traces and metrics.
- Cobra for the admin command.
- Go `testing` and Testcontainers for Go for focused tests.

Standard-library signal and lifecycle APIs are allowed where they are the direct production interface. Every third-party call shown in public content must correspond to a locked dependency and compile or import in its reference repository. Article snippets must come from those repositories or be checked mechanically against them.

## Repository-level AI harness design

Each language repository gets a harness tailored to its commands and libraries but built from the same contract:

```text
AGENTS.md
CLAUDE.md
.agents/
  skills/
    twelve-factor-app/
      SKILL.md
      agents/openai.yaml
      references/factor-checklist.md
.claude/
  skills/
    twelve-factor-app/
      SKILL.md
      references/factor-checklist.md
scripts/
  check-twelve-factor.*
```

### Always-on instructions

`AGENTS.md` contains concise repository facts, commands, architecture boundaries, safe examples, and rules that apply to every change. `CLAUDE.md` imports `AGENTS.md`, then adds only Claude-specific skill invocation or troubleshooting guidance. This keeps the shared contract in one always-on source.

### On-demand skills

Each tool gets a repository-discoverable `twelve-factor-app` skill:

- Codex: `.agents/skills/twelve-factor-app/SKILL.md`
- Claude: `.claude/skills/twelve-factor-app/SKILL.md`

Within one repository, the two `SKILL.md` bodies should remain equivalent and reference the same factor checklist. A deterministic drift check compares the tool-specific copies. The skill description should trigger for changes to dependencies, configuration, backing services, build or release flow, process types, networking, concurrency, shutdown, environment parity, telemetry, and admin commands.

The skill workflow should:

1. Identify the factors affected by the requested change.
2. Read the repository contract and relevant implementation files.
3. State the expected application-platform boundary.
4. Implement or review the change without weakening another factor.
5. Run the narrow factor checks, language tests, and full repository verification required by the change.
6. Report changed factors, commands, results, remaining risks, and any concern outside Twelve-Factor scope.

### Deterministic enforcement

The harness skill invokes a repository-owned check instead of judging compliance from prose. The check validates observable repository contracts such as locked dependencies, declared process commands, config tests, immutable builds, health behavior, structured telemetry, admin command parity, and the full test suite. CI runs the same command.

Some factors require behavior tests rather than static inspection. Disposability needs termination tests. Processes need retry and state-loss tests. Dev/prod parity needs contract tests against the real local service type. Passing an AI skill response is never completion evidence.

### Harness evaluation

Evaluate Codex and Claude separately with the same cases:

1. An explicit skill invocation for a config change.
2. An implicit trigger for a worker concurrency change.
3. A violating request that proposes build-time config baked into an artifact.
4. An unrelated documentation request that should not trigger the skill.
5. A no-change audit that should report verified no-op status.
6. A failed deterministic check that the agent must surface rather than explain away.

Official format references:

- [OpenAI Docs: Build skills](https://developers.openai.com/codex/skills)
- [OpenAI Docs: Custom instructions with AGENTS.md](https://developers.openai.com/codex/guides/agents-md)
- [Claude Code: Extend Claude with skills](https://code.claude.com/docs/en/skills)
- [Claude Code: How Claude remembers your project](https://code.claude.com/docs/en/memory)

## Extension handling

### Canonical baseline

- Preserve the original factor names and order.
- Use visible Roman numerals in every factor heading, link label, example heading, and audit mapping.
- Describe the original wording accurately before interpreting it.
- Link every factor to its canonical primary source.

### Official modernization

- Identify the `next` branch as in development.
- Cover open issues 3, 4, and 9 for Logs, Config, and Identity.
- Cover open pull requests 32, 34, and 40 for combined processes, Identity, and higher-level facets.
- Identify pull request 33 as closed without merge.
- Recheck every status immediately before publication.
- Do not call any proposal an adopted thirteenth factor.

### Independent extensions

- Present Hoffman's framework as a reordered 15-factor model with API First, Telemetry, and Authentication and Authorization as its clearest additions.
- Present IBM's Observable, Schedulable, Upgradable, Least Privilege, Auditable, Securable, and Measurable factors as an enterprise production-readiness extension.
- Use the CNCF reassessment to separate application-level and service-level concerns and surface security and automated testing gaps.
- Mention NGINX as historical microservices prior art without asserting an unverified numbered list.
- Consolidate overlapping proposals by concern so the comparison adds judgment rather than source repetition.

## Execution checklist

Checkboxes may be marked complete only when their Evidence line points to an artifact, command result, or inspected source. A wave is complete only after every child item is complete and the wave confirmation is checked.

### Wave 0: research and repository audit

- [x] Confirm that no dedicated Twelve-Factor topic or post already exists.
  - Evidence: repository search found only a passing reference in `src/content/docs/topics/ops/secrets-keys-tokens.md`.
- [x] Review the original introduction and all twelve canonical factor pages.
  - Evidence: the research dossier contains a section for factors I through XII with canonical links in its source inventory.
- [x] Establish the original history, scope, and last-update context.
  - Evidence: `Historical and current status` in the research dossier cites the canonical site and official project announcements.
- [x] Review the official modernization vision and application-platform model.
  - Evidence: the dossier cites the official repository, `VISION.md`, and the narrow-conduits project post.
- [x] Record current official issue and pull request status.
  - Evidence: `Extended proposals and competing expansions` records `next`, issues 3, 4, and 9, pull requests 32, 34, and 40, and closed pull request 33 as checked on 2026-09-07.
- [x] Research established independent extensions.
  - Evidence: the dossier covers Hoffman's 15 factors, IBM's seven factors, the CNCF 2022 reassessment, and NGINX prior art.
- [x] Research modern platform and standards mappings.
  - Evidence: the dossier source inventory includes OCI, Buildpacks, SLSA, Kubernetes, OpenTelemetry, and NIST primary documentation.
- [x] Select documented library suites for TypeScript, Python, and Go examples.
  - Evidence: `Proposed reader-facing examples` in the dossier defines the Fastify, FastAPI, chi, config, PostgreSQL, queue, telemetry, CLI, and test libraries, with official documentation in the source inventory.
- [x] Map every canonical factor to one example in each language.
  - Evidence: the dossier's `Factor-example coverage matrix` contains twelve rows and three language columns, defining 36 examples.
- [x] Define the local topic shape, related pages, and split threshold.
  - Evidence: `Proposed article structure` and `Local content integration` in the dossier identify the target path, 450 to 550 line target, discovery pages, and candidate backlinks.
- [x] Create the private research dossier.
  - Evidence: `docs/research/2026-09-07-twelve-factor-app-research.md`.
- [x] Create a review outline for the main entry and all three example pages.
  - Evidence: `Review outline` in this plan defines 24 main-entry sections, three example-page structures, and nine review questions.
- [x] Confirm Wave 0 is complete.
  - Evidence: every Wave 0 child item is checked and backed by the research dossier, repository audit, or review outline in this plan.

### Wave 1: page foundation and teaching frame

- [x] Create the topic directory and `index.mdx` with valid frontmatter.
  - Evidence: `src/content/docs/topics/ops/twelve-factor-app/index.mdx`; Astro check reported 0 errors, warnings, or hints.
- [x] Create the three child example pages with valid frontmatter and parent metadata.
  - Evidence: `examples-factors-01-04.mdx`, `examples-factors-05-08.mdx`, and `examples-factors-09-12.mdx` built as child routes under `/topics/ops/twelve-factor-app/`.
- [x] Import Starlight `Tabs` and `TabItem` components and configure synchronized language selection on every child page.
  - Evidence: all three child files import both components; the built HTML contains 12 `data-sync-key="twelve-factor-language"` tab groups.
- [x] Quote the frontmatter description and verify title, sidebar label, and metadata conventions against neighboring Ops topics.
  - Evidence: all four descriptions are double quoted; the hub follows the neighboring Ops topic schema, and child pages use `parent: twelve-factor-app` with title-based labels.
- [x] Write the opening failure story and define the methodology's scope.
  - Evidence: the hub opens with hidden packages, config, sessions, runtime compilation, and host-log failures, then defines the language-neutral methodology and its limits.
- [x] Add the application-platform ASCII diagram and explain the narrow-conduit model.
  - Evidence: `The application-platform contract` contains the ASCII flow from source to artifact, process types, configuration, attached resources, signals, and platform responsibilities.
- [x] Add the twelve-factor scan table with original intent and modern reading.
  - Evidence: `The twelve factors at a glance` contains twelve rows with original intent, modern reading, and proof question columns.
- [x] Use the exact visible heading titles `Factor I: Codebase` through `Factor XII: Admin processes` in the hub and matching example sections.
  - Evidence: source inspection found all twelve exact H2 titles once in the hub and once across the three child pages.
- [x] Verify the table of contents, factor links, and rendered heading anchors preserve each Roman numeral and canonical title.
  - Evidence: built HTML inspection found the twelve expected `factor-i-codebase` through `factor-xii-admin-processes` IDs in the hub and matching child pages; `npm run validate:links` passed.
- [x] Add direct links from every hub factor section to its factor heading on the matching example page.
  - Evidence: each hub factor section ends with a route-relative link to its child page and rendered factor anchor; all links passed the 800-page link validator.
- [x] Verify the opening does not present microservices, cloud, containers, or Kubernetes as requirements.
  - Evidence: `What Twelve-Factor is` explicitly states that none of those technologies or architectural forms is required.
- [x] Run `npm run build` for the Wave 1 batch.
  - Evidence: build passed with secret scan success, 0 Astro errors, 0 warnings, 0 hints, and 800 generated pages.
- [x] Confirm Wave 1 is complete.
  - Evidence: every Wave 1 child item is checked with file, rendered-output, build, or link-validation evidence.

### Wave 2: canonical factors I through VI

- [x] Teach I. Codebase with deploy traceability, monorepo nuance, and an audit question.
  - Evidence: the hub's `Factor I: Codebase` section connects one revision to many deploys, distinguishes a monorepo from multiple codebases, and gives a revision-trace audit method.
- [x] Teach II. Dependencies with complete declaration, isolation, lockfiles, and artifact verification.
  - Evidence: the hub's `Factor II: Dependencies` section covers manifests, transitive lock state, clean isolated installation, and artifact-time verification.
- [x] Teach III. Config with deploy variance, schema validation, mounted delivery, secrets, and identity boundaries.
  - Evidence: the hub's `Factor III: Config` section defines deploy-varying config, typed startup validation, environment and mounted delivery, secret-manager boundaries, workload identity, and safe failures.
- [x] Teach IV. Backing services with attachment contracts, semantic portability limits, and contract testing.
  - Evidence: the hub's `Factor IV: Backing services` section treats services as replaceable attachments while requiring semantic compatibility and contract tests.
- [x] Teach V. Build, release, run with immutable artifacts, release identity, provenance, promotion, and rollback.
  - Evidence: the hub's `Factor V: Build, release, run` section separates artifact creation, release binding, and execution, then adds identity, provenance, promotion, and rollback checks.
- [x] Teach VI. Processes with stateless execution, external durable state, session handling, and idempotency.
  - Evidence: the hub's `Factor VI: Processes` section covers replaceable processes, external session and durable state, interruption, retry, and idempotency.
- [x] Add and verify the TypeScript Codebase example using the Fastify and BullMQ process scripts from one `package.json`.
  - Evidence: `examples-factors-01-04.mdx` defines web, worker, and admin scripts in one manifest; an isolated strict TypeScript build imported Fastify and BullMQ successfully.
- [x] Add and verify the Python Codebase example using FastAPI, Dramatiq, and Typer entry points from one `pyproject.toml`.
  - Evidence: `examples-factors-01-04.mdx` defines all three entry points in one project; an isolated locked environment imported the FastAPI, Dramatiq, and Typer entry modules successfully.
- [x] Add and verify the Go Codebase example using one module with web, worker, and admin commands.
  - Evidence: `examples-factors-01-04.mdx` defines one Cobra command tree; `go test ./...` and `go build ./cmd/order-service` passed in the isolated verification module.
- [x] Add and verify the TypeScript Dependencies example using a committed lockfile and explicit imports.
  - Evidence: the example uses `npm ci` and `npm ls`; the isolated project generated a lockfile, installed Fastify, BullMQ, ioredis, pg, Zod, and Commander, and passed strict compilation.
- [x] Add and verify the Python Dependencies example using `pyproject.toml`, `uv.lock`, and frozen synchronization.
  - Evidence: the example uses `uv lock`, `uv sync --frozen`, and `uv run`; all commands passed in the isolated project, followed by compilation and import checks.
- [x] Add and verify the Go Dependencies example using `go.mod`, `go.sum`, and module verification.
  - Evidence: the example uses `go mod tidy`, `go mod verify`, and `go test ./...`; module verification and tests passed with the documented libraries.
- [x] Add and verify the TypeScript Config example using Zod.
  - Evidence: the example validates PostgreSQL, Redis, port, and environment fields with Zod; strict compilation passed against Zod 4.5.4.
- [x] Add and verify the Python Config example using `pydantic-settings`.
  - Evidence: the example uses `BaseSettings`, typed URLs, a prefix, and input-redacted validation errors; compilation and imports passed against Pydantic Settings 2.15.
- [x] Add and verify the Go Config example using `caarlos0/env/v11`.
  - Evidence: the example parses required PostgreSQL and Redis URLs plus port and environment values; `go test ./...` passed against env/v11 11.4.1.
- [x] Add and verify the TypeScript Backing services example using PostgreSQL and BullMQ clients built from injected endpoints.
  - Evidence: the example constructs `pg.Pool`, an ioredis connection, and a BullMQ queue from validated config; strict compilation passed with current packages.
- [x] Add and verify the Python Backing services example using Psycopg and Dramatiq configuration.
  - Evidence: the example constructs a Psycopg pool and Redis-backed Dramatiq broker from settings; compilation and imports passed in the locked environment.
- [x] Add and verify the Go Backing services example using `pgxpool` and Asynq clients.
  - Evidence: the example constructs both clients from parsed URLs; `go test ./...` and the production binary build passed with pgx/v5 5.11.0 and Asynq 0.26.0.
- [x] Add and verify the TypeScript Build, release, run example using compiled Node output and release metadata.
  - Evidence: the multi-stage Dockerfile installs from the lockfile, compiles once, labels the image revision, and copies only production output; an exact Docker build succeeded with revision `verify`.
- [x] Add and verify the Python Build, release, run example using one locked wheel and release metadata.
  - Evidence: the multi-stage Dockerfile creates wheels from the frozen environment and installs them into the runtime image; an exact Docker build succeeded with revision `verify`.
- [x] Add and verify the Go Build, release, run example using one compiled binary and build metadata.
  - Evidence: the multi-stage Dockerfile verifies modules, embeds revision metadata with `-ldflags`, and copies one binary; an exact Docker build succeeded with revision `verify`.
- [x] Add and verify the TypeScript Processes example using PostgreSQL instead of process-local durable state.
  - Evidence: the Fastify handler writes order state through `pg.Pool`; strict compilation passed in the isolated project.
- [x] Add and verify the Python Processes example using FastAPI dependencies and Psycopg instead of process globals.
  - Evidence: the FastAPI route receives a request-scoped Psycopg connection through dependency injection; compilation and imports passed.
- [x] Add and verify the Go Processes example using chi handlers and `pgxpool` instead of process-local durable state.
  - Evidence: the chi handler writes through `pgxpool.Pool`; `go test ./...` and the production build passed.
- [x] Give every factor an original claim, failure mode, modern reading, and verification method.
  - Evidence: Factors I through VI each contain labeled `Original claim`, `Failure mode`, `Modern reading`, and `Verify it` passages in the hub.
- [x] Run `npm run build` for the Wave 2 batch.
  - Evidence: the final Wave 2 build passed with the secret scan, 0 Astro errors, 0 warnings, 0 hints, and 800 generated pages.
- [x] Confirm Wave 2 is complete.
  - Evidence: every Wave 2 child item is checked with source, dependency, compiler, test, container-build, or site-build evidence.

### Wave 3: canonical factors VII through XII

- [x] Teach VII. Port binding with self-contained listeners and non-HTTP invocation contracts.
  - Evidence: the hub's `Factor VII: Port binding` section separates the application listener, platform routing, and non-HTTP worker, job, consumer, and function contracts.
- [x] Teach VIII. Concurrency with process types, horizontal scaling, bounded work, and backpressure.
  - Evidence: the hub's `Factor VIII: Concurrency` section covers independent process scaling, per-process bounds, scaling signals, downstream capacity, and backpressure.
- [x] Teach IX. Disposability with startup, readiness, shutdown, draining, interruption, and retry safety.
  - Evidence: the hub's `Factor IX: Disposability` section distinguishes startup, readiness, liveness, graceful shutdown, hard kills, deadlines, idempotency, and retry checks.
- [x] Teach X. Dev/prod parity with time, people, and tools, plus risk-based contract parity.
  - Evidence: the hub's `Factor X: Dev/prod parity` section preserves the original three gaps and maps deliberate environment differences to unit, integration, staging, or production evidence.
- [x] Teach XI. Logs with event streams, stdout collection, structured context, metrics, and traces.
  - Evidence: the hub's `Factor XI: Logs` section covers event streams, stdout and stderr collection, structured fields, redaction, trace correlation, metrics, and platform-owned retention.
- [x] Teach XII. Admin processes with one-off jobs, release parity, bounded authority, and audit evidence.
  - Evidence: the hub's `Factor XII: Admin processes` section covers shared artifacts, narrow commands, short-lived authority, least privilege, timeouts, retry safety, and attributable results.
- [x] Add and verify the TypeScript Port binding example using Fastify and validated `PORT` config.
  - Evidence: `examples-factors-05-08.mdx` starts Fastify on `0.0.0.0` and `config.PORT`; strict TypeScript compilation passed against Fastify 5.12.3.
- [x] Add and verify the Python Port binding example using FastAPI and Uvicorn.
  - Evidence: the example starts the FastAPI import path through Uvicorn with validated settings; Python compilation and module imports passed against FastAPI 0.141.1 and Uvicorn 0.52.4.
- [x] Add and verify the Go Port binding example using chi and `http.Server`.
  - Evidence: the example serves a chi router through `http.Server` and returns listener failures; `go test ./...` compiled it against chi/v5 5.3.2.
- [x] Add and verify the TypeScript Concurrency example using a BullMQ `Worker` with a bound.
  - Evidence: the example declares worker concurrency and a rate limiter around an injected Redis connection; strict compilation passed against BullMQ 6.3.4 and ioredis 6.0.0.
- [x] Add and verify the Python Concurrency example using a separately scalable Dramatiq actor.
  - Evidence: the example defines retry and execution limits on a Dramatiq actor plus explicit process and thread counts in the worker command; compilation and imports passed against Dramatiq 2.2.1.
- [x] Add and verify the Go Concurrency example using an Asynq server with a bound.
  - Evidence: the example supplies a finite concurrency value and weighted queues to Asynq; `go test ./...` passed against Asynq 0.26.0.
- [x] Add and verify the TypeScript Disposability example using signal handlers, Fastify close, and BullMQ drain behavior.
  - Evidence: the example drops readiness on `SIGTERM` or `SIGINT`, closes Fastify, waits for active BullMQ jobs, closes clients, and enforces a deadline; strict compilation passed.
- [x] Add and verify the Python Disposability example using FastAPI lifespan and explicit resource shutdown.
  - Evidence: the example keeps readiness false until PostgreSQL opens, then removes readiness before closing the Dramatiq broker and Psycopg pool; compilation and imports passed.
- [x] Add and verify the Go Disposability example using `signal.NotifyContext`, `http.Server.Shutdown`, and worker shutdown.
  - Evidence: the example connects one signal context to readiness removal, Asynq shutdown, and bounded HTTP shutdown; Go tests verified both ready and draining responses.
- [x] Add and verify the TypeScript Dev/prod parity example using Vitest and Testcontainers for Node.js.
  - Evidence: the isolated Vitest test passed against a disposable PostgreSQL 18 container using `@testcontainers/postgresql` 12.1.0 and the production `pg` client.
- [x] Add and verify the Python Dev/prod parity example using pytest and Testcontainers for Python.
  - Evidence: the isolated pytest test passed against a disposable PostgreSQL 18 container using the current `testcontainers.community.postgres` import, Testcontainers 4.15.0, and Psycopg 3.3.5.
- [x] Add and verify the Go Dev/prod parity example using Go `testing` and Testcontainers for Go.
  - Evidence: the isolated Go test passed against a disposable PostgreSQL 18 container using the PostgreSQL Testcontainers module 0.44.0 and pgx/v5 5.11.0.
- [x] Add and verify the TypeScript Logs example using Fastify's Pino logger and OpenTelemetry trace context.
  - Evidence: the example emits structured service, release, request, trace, and order fields through `request.log`; strict compilation passed against OpenTelemetry API 1.9.1 and Fastify's Pino-backed logger.
- [x] Add and verify the Python Logs example using structlog and OpenTelemetry trace context.
  - Evidence: the example configures JSON rendering and adds a valid active trace identifier; compilation and imports passed against structlog 26.1.0 and OpenTelemetry API 1.44.0.
- [x] Add and verify the Go Logs example using `slog` and OpenTelemetry trace context.
  - Evidence: the example emits JSON to stdout through `slog` and adds valid OpenTelemetry span context; `go test ./...` passed against OpenTelemetry trace 1.46.0.
- [x] Add and verify the TypeScript Admin processes example using Commander and the shared database module.
  - Evidence: the example parses a bounded migration target and reuses the normal config, database, and migration modules; strict compilation passed against Commander 15.0.0.
- [x] Add and verify the Python Admin processes example using Typer and the shared settings and database modules.
  - Evidence: the example exposes one migration command through Typer and reuses the installed settings, connection, and migration modules; compilation and imports passed against Typer 0.27.2.
- [x] Add and verify the Go Admin processes example using Cobra and the shared config and database packages.
  - Evidence: the example adds a migration subcommand to the normal binary and reuses config, pgxpool, and migration packages; `go test ./...` passed against Cobra 1.10.2.
- [x] Give every factor an original claim, failure mode, modern reading, and verification method.
  - Evidence: Factors VII through XII each contain labeled `Original claim`, `Failure mode`, `Modern reading`, and `Verify it` passages; source inspection found all six exact factor headings in both the hub and matching example pages.
- [x] Run `npm run build` for the Wave 3 batch.
  - Evidence: the final Wave 3 build passed with the secret scan, 0 Astro errors, 0 warnings, 0 hints, and 800 generated pages.
- [x] Confirm Wave 3 is complete.
  - Evidence: every Wave 3 child item is checked with source review, current-library compilation or import, unit or integration tests, site build, or link-validation evidence. Go commands used task-specific caches after the Codex sandbox denied writes to the host cache; no repository workaround was added.

### Wave 4: extensions, limits, and current judgment

- [x] Add the literal-compliance pitfalls without caricaturing the original method.
  - Evidence: `Where literal compliance misleads` preserves eight durable principles while correcting overly literal readings of repository layout, config delivery, resource attachment, state, invocation, parity, logs, and admin access.
- [x] Add a dated official modernization status box.
  - Evidence: `Official modernization status` begins with a September 8, 2026 status callout that separates the `next` development branch from the canonical text still hosted at `12factor.net`.
- [x] Explain the open Config, Logs, Identity, process-combination, and facets proposals.
  - Evidence: the official-work table links issues 3, 4, and 9 and pull requests 32, 34, and 40, records each as open, and explains the proposed direction without calling it adopted.
- [x] Clearly label dynamic-config pull request 33 as closed without merge.
  - Evidence: the official-work table says `Closed without merge`; the GitHub API reported `state: closed`, `closed_at: 2025-04-02T19:36:15Z`, and `merged_at: null` for pull request 33.
- [x] Compare Hoffman's 15-factor model and preserve its reordered sequence.
  - Evidence: `Hoffman's reordered 15-factor model` reproduces the complete 1 through 15 sequence verified against the O'Reilly book page and explains API First, Telemetry, Authentication and Authorization, and the reordered lifecycle.
- [x] Compare IBM's seven missing factors and explain their enterprise platform scope.
  - Evidence: the IBM section preserves Factors XIII through XIX from Observable through Measurable and identifies their containerized microservice, Kubernetes, enterprise production-readiness scope and internal overlaps.
- [x] Include CNCF's application-level versus service-level distinction and its security and testing critique.
  - Evidence: `A CNCF-hosted 2022 reassessment` explains the two levels, identifies security and automated testing as omissions, and labels the source as a guest post rather than CNCF policy.
- [x] Include the NGINX amendments as historical prior art with the source limitation.
  - Evidence: the NGINX section links the archived 58-page deck retained by the official project's prior-art list, notes the original article is unavailable, and declines to invent a numbered factor canon.
- [x] Consolidate overlaps across API contracts, telemetry, identity, scheduling, upgrades, audit, security, measurement, and testing.
  - Evidence: `Where the extensions overlap` maps all nine concerns to proposal families, their nearest canonical homes, and practical treatment in one comparison table.
- [x] Add a missing-concerns section covering security, supply chain, health, resources, data, reliability, and governance.
  - Evidence: `What the factors still do not settle` covers identity, secure development, software supply chain, health and resources, data lifecycle, network security, reliability, and delivery governance with complementary directions.
- [x] Recheck official proposal status and record the check date in the published page.
  - Evidence: GitHub API checks on September 8, 2026 found `next` as the default branch at `3ad5a5f36312cc8ad876abae1bd691acd790d4d1`; issues 3, 4, and 9 and pull requests 32, 34, and 40 open; and pull request 33 closed without merge. The date appears in both the status callout and table.
- [x] Run `npm run build` for the Wave 4 batch.
  - Evidence: build passed with the secret scan, 0 Astro errors, 0 warnings, 0 hints, and 800 generated pages. Style, published-content, code-example, and 800-page internal-link validation also passed.
- [x] Confirm Wave 4 is complete.
  - Evidence: every Wave 4 child item is checked with published source, rendered HTML, primary-source status, or validation evidence.

### Wave 5: standalone reference repositories and verification

Proposed repositories:

- `waggertron/twelve-factor-typescript`
- `waggertron/twelve-factor-python`
- `waggertron/twelve-factor-go`

#### Shared application contract

- [ ] Define one versioned HTTP, job-payload, database, config, telemetry, health, and admin-command contract for all three repositories.
  - Evidence: pending.
- [ ] Define the order lifecycle and idempotency invariant used by all three implementations.
  - Evidence: pending.
- [ ] Define valid fixtures that stay within the documented order and job schemas.
  - Evidence: pending.
- [ ] Define separate, intentional invalid fixtures for config, HTTP, job, and migration failure tests.
  - Evidence: pending.
- [ ] Inventory every external surface: PostgreSQL, Redis-backed queue, telemetry export, container runtime, and HTTP clients.
  - Evidence: pending.
- [ ] Assign a local path to every external surface using Docker services, in-memory exporters, or strict fakes without cloud credentials.
  - Evidence: pending.
- [ ] Define common commands for setup, unit tests, integration tests, start, stop, and cleanup in each repository.
  - Evidence: pending.
- [ ] Reserve configurable local ports and isolated Docker Compose project names so the three repositories can run without collisions.
  - Evidence: pending.

#### TypeScript reference repository

- [ ] Create the standalone `waggertron/twelve-factor-typescript` repository with README, license, `.gitignore`, and contribution notes.
  - Evidence: pending.
- [ ] Add a strict TypeScript configuration, `package.json`, and committed npm lockfile.
  - Evidence: pending.
- [ ] Pin Fastify, Zod, PostgreSQL, BullMQ, OpenTelemetry, Commander, Vitest, and Testcontainers dependencies to resolved versions.
  - Evidence: pending.
- [ ] Implement startup config validation with Zod and safe error output.
  - Evidence: pending.
- [ ] Implement the Fastify order API, liveness endpoint, and readiness endpoint.
  - Evidence: pending.
- [ ] Implement PostgreSQL persistence with the repository's declared client library.
  - Evidence: pending.
- [ ] Implement BullMQ enqueue and worker process types with bounded concurrency.
  - Evidence: pending.
- [ ] Implement idempotent order processing under repeated delivery.
  - Evidence: pending.
- [ ] Implement graceful web and worker shutdown with readiness removal before drain.
  - Evidence: pending.
- [ ] Implement Pino JSON events and OpenTelemetry trace and release correlation.
  - Evidence: pending.
- [ ] Implement a Commander migration command using the normal config and database modules.
  - Evidence: pending.
- [ ] Add a multi-stage Dockerfile that runs compiled output from one immutable image.
  - Evidence: pending.
- [ ] Add Docker Compose services for the app, PostgreSQL, Redis, and an optional local telemetry collector or console exporter.
  - Evidence: pending.
- [ ] Add unit tests for config parsing, order validation, idempotency, readiness transitions, log fields, and command argument handling.
  - Evidence: pending.
- [ ] Add Testcontainers integration tests for PostgreSQL persistence and BullMQ retry behavior.
  - Evidence: pending.
- [ ] Add an HTTP smoke test covering startup, readiness, order submission, processing, and persisted result retrieval.
  - Evidence: pending.
- [ ] Add a failure test proving shutdown does not accept new work after readiness changes.
  - Evidence: pending.
- [ ] Add targeted start, stop, and cleanup commands that remove only this repository's containers, volumes, and temporary test artifacts.
  - Evidence: pending.
- [ ] Add CI for clean install, type checking, unit tests, integration tests, container build, and secret scanning.
  - Evidence: pending.
- [ ] Document local setup, architecture, process types, configuration, all twelve factor mappings, test commands, and cleanup.
  - Evidence: pending.
- [ ] Run the documented workflow from a clean clone without cloud credentials.
  - Evidence: pending.
- [ ] Confirm no containers, processes, generated files, or test data remain after cleanup.
  - Evidence: pending.
- [ ] Commit and push the verified TypeScript repository.
  - Evidence: pending.
- [ ] Tag the exact TypeScript release referenced by the entry and confirm the remote tag.
  - Evidence: pending.

#### Python reference repository

- [ ] Create the standalone `waggertron/twelve-factor-python` repository with README, license, `.gitignore`, and contribution notes.
  - Evidence: pending.
- [ ] Add `pyproject.toml`, a committed `uv.lock`, package layout, and type-checker configuration.
  - Evidence: pending.
- [ ] Pin FastAPI, Uvicorn, `pydantic-settings`, Psycopg, Dramatiq, structlog, OpenTelemetry, Typer, pytest, and Testcontainers dependencies to resolved versions.
  - Evidence: pending.
- [ ] Implement startup config validation with `pydantic-settings` and safe error output.
  - Evidence: pending.
- [ ] Implement the FastAPI order API, liveness endpoint, and readiness endpoint.
  - Evidence: pending.
- [ ] Implement PostgreSQL persistence with Psycopg and `psycopg_pool`.
  - Evidence: pending.
- [ ] Implement Dramatiq enqueue and worker process types with bounded concurrency.
  - Evidence: pending.
- [ ] Implement idempotent order processing under repeated delivery.
  - Evidence: pending.
- [ ] Implement FastAPI lifespan and worker shutdown with readiness removal before drain.
  - Evidence: pending.
- [ ] Implement structlog JSON events and OpenTelemetry trace and release correlation.
  - Evidence: pending.
- [ ] Implement a Typer migration command using the normal settings and database modules.
  - Evidence: pending.
- [ ] Add a multi-stage Dockerfile that installs from the lock and runs one immutable image.
  - Evidence: pending.
- [ ] Add Docker Compose services for the app, PostgreSQL, Redis, and an optional local telemetry collector or console exporter.
  - Evidence: pending.
- [ ] Add unit tests for config parsing, order validation, idempotency, readiness transitions, log fields, and command argument handling.
  - Evidence: pending.
- [ ] Add Testcontainers integration tests for PostgreSQL persistence and Dramatiq retry behavior.
  - Evidence: pending.
- [ ] Add an HTTP smoke test covering startup, readiness, order submission, processing, and persisted result retrieval.
  - Evidence: pending.
- [ ] Add a failure test proving shutdown does not accept new work after readiness changes.
  - Evidence: pending.
- [ ] Add targeted start, stop, and cleanup commands that remove only this repository's containers, volumes, virtual environments, caches, and temporary test artifacts.
  - Evidence: pending.
- [ ] Add CI for frozen install, type checking, unit tests, integration tests, container build, and secret scanning.
  - Evidence: pending.
- [ ] Document local setup, architecture, process types, configuration, all twelve factor mappings, test commands, and cleanup.
  - Evidence: pending.
- [ ] Run the documented workflow from a clean clone without cloud credentials.
  - Evidence: pending.
- [ ] Confirm no containers, processes, generated files, or test data remain after cleanup.
  - Evidence: pending.
- [ ] Commit and push the verified Python repository.
  - Evidence: pending.
- [ ] Tag the exact Python release referenced by the entry and confirm the remote tag.
  - Evidence: pending.

#### Go reference repository

- [ ] Create the standalone `waggertron/twelve-factor-go` repository with README, license, `.gitignore`, and contribution notes.
  - Evidence: pending.
- [ ] Add `go.mod`, committed `go.sum`, command layout, and internal package boundaries.
  - Evidence: pending.
- [ ] Pin chi, `caarlos0/env`, pgx, Asynq, OpenTelemetry, Cobra, and Testcontainers dependencies to resolved versions.
  - Evidence: pending.
- [ ] Implement startup config validation with `caarlos0/env` and safe error output.
  - Evidence: pending.
- [ ] Implement the chi order API, liveness endpoint, and readiness endpoint.
  - Evidence: pending.
- [ ] Implement PostgreSQL persistence with `pgxpool`.
  - Evidence: pending.
- [ ] Implement Asynq enqueue and worker process types with bounded concurrency.
  - Evidence: pending.
- [ ] Implement idempotent order processing under repeated delivery.
  - Evidence: pending.
- [ ] Implement context-driven web and worker shutdown with readiness removal before drain.
  - Evidence: pending.
- [ ] Implement `slog` JSON events and OpenTelemetry trace and release correlation.
  - Evidence: pending.
- [ ] Implement a Cobra migration command using the normal config and database packages.
  - Evidence: pending.
- [ ] Add a multi-stage Dockerfile that copies one binary into an immutable runtime image.
  - Evidence: pending.
- [ ] Add Docker Compose services for the app, PostgreSQL, Redis, and an optional local telemetry collector or console exporter.
  - Evidence: pending.
- [ ] Add unit tests for config parsing, order validation, idempotency, readiness transitions, log fields, and command argument handling.
  - Evidence: pending.
- [ ] Add Testcontainers integration tests for PostgreSQL persistence and Asynq retry behavior.
  - Evidence: pending.
- [ ] Add an HTTP smoke test covering startup, readiness, order submission, processing, and persisted result retrieval.
  - Evidence: pending.
- [ ] Add a failure test proving shutdown does not accept new work after readiness changes.
  - Evidence: pending.
- [ ] Add targeted start, stop, and cleanup commands that remove only this repository's containers, volumes, binaries, caches, and temporary test artifacts.
  - Evidence: pending.
- [ ] Add CI for module verification, formatting, vetting, unit tests, integration tests, container build, and secret scanning.
  - Evidence: pending.
- [ ] Document local setup, architecture, process types, configuration, all twelve factor mappings, test commands, and cleanup.
  - Evidence: pending.
- [ ] Run the documented workflow from a clean clone without cloud credentials.
  - Evidence: pending.
- [ ] Confirm no containers, processes, generated files, or test data remain after cleanup.
  - Evidence: pending.
- [ ] Commit and push the verified Go repository.
  - Evidence: pending.
- [ ] Tag the exact Go release referenced by the entry and confirm the remote tag.
  - Evidence: pending.

#### Repository-level Codex and Claude harnesses

- [ ] Add a concise root `AGENTS.md` to each reference repository with its application contract, architecture boundaries, safe example rules, normal commands, and required Twelve-Factor checks.
  - Evidence: pending.
- [ ] Add a root `CLAUDE.md` to each reference repository that imports `@AGENTS.md` and contains only Claude-specific skill invocation or troubleshooting guidance.
  - Evidence: pending.
- [ ] Create `.agents/skills/twelve-factor-app/SKILL.md` in each reference repository using the Codex skill structure and language-specific commands.
  - Evidence: pending.
- [ ] Add `agents/openai.yaml` to each Codex skill and verify its metadata matches the skill's purpose and invocation text.
  - Evidence: pending.
- [ ] Create `.claude/skills/twelve-factor-app/SKILL.md` in each reference repository using the Claude project-skill structure and the same language-specific workflow.
  - Evidence: pending.
- [ ] Add a concise `references/factor-checklist.md` to both tool-specific skill directories in each repository, covering `Factor I` through `Factor XII` with the exact canonical titles.
  - Evidence: pending.
- [ ] Keep the Codex and Claude `SKILL.md` workflow bodies equivalent within each repository and add a deterministic drift check.
  - Evidence: pending.
- [ ] Tailor the TypeScript harness to npm, Fastify, Zod, BullMQ, PostgreSQL, OpenTelemetry, Commander, Vitest, and its repository commands.
  - Evidence: pending.
- [ ] Tailor the Python harness to uv, FastAPI, Pydantic Settings, Dramatiq, Psycopg, structlog, OpenTelemetry, Typer, pytest, and its repository commands.
  - Evidence: pending.
- [ ] Tailor the Go harness to Go modules, chi, `caarlos0/env`, Asynq, pgx, `slog`, OpenTelemetry, Cobra, `go test`, and its repository commands.
  - Evidence: pending.
- [ ] Make each skill description trigger for relevant dependency, configuration, backing-service, build, release, process, networking, concurrency, shutdown, parity, telemetry, and admin-command work.
  - Evidence: pending.
- [ ] Require each skill workflow to identify affected factors, inspect current contracts, preserve application-platform boundaries, run focused checks, and report commands and evidence.
  - Evidence: pending.
- [ ] Require each skill to surface failed deterministic checks and forbid claims of compliance based only on instructions, skill presence, or agent explanation.
  - Evidence: pending.
- [ ] Add a repository-owned `scripts/check-twelve-factor.*` command to each language repository for mechanically verifiable contracts.
  - Evidence: pending.
- [ ] Make the deterministic command validate dependency locks, declared process commands, configuration tests, artifact boundaries, health behavior, structured telemetry, admin-command parity, harness drift, and the full required test suite.
  - Evidence: pending.
- [ ] Wire the deterministic Twelve-Factor command into each repository's normal verification command and CI workflow without requiring Codex, Claude, or a paid agent invocation.
  - Evidence: pending.
- [ ] Validate every Codex skill with the official skill validator and verify that Codex discovers the root `AGENTS.md` and repository skill.
  - Evidence: pending.
- [ ] Test explicit Codex invocation with a configuration change and record the factor analysis, commands, and results.
  - Evidence: pending.
- [ ] Test implicit Codex invocation with a worker-concurrency change and record the factor analysis, commands, and results.
  - Evidence: pending.
- [ ] Test an unrelated Codex documentation request and confirm the Twelve-Factor skill does not trigger unnecessarily.
  - Evidence: pending.
- [ ] Test a violating Codex request and a failing deterministic check, confirming the violation and failure are surfaced rather than explained away.
  - Evidence: pending.
- [ ] Verify that Claude loads the root `CLAUDE.md` import and discovers the repository skill.
  - Evidence: pending.
- [ ] Test explicit Claude invocation with a configuration change and record the factor analysis, commands, and results.
  - Evidence: pending.
- [ ] Test implicit Claude invocation with a worker-concurrency change and record the factor analysis, commands, and results.
  - Evidence: pending.
- [ ] Test an unrelated Claude documentation request and confirm the Twelve-Factor skill does not trigger unnecessarily.
  - Evidence: pending.
- [ ] Test a violating Claude request and a failing deterministic check, confirming the violation and failure are surfaced rather than explained away.
  - Evidence: pending.
- [ ] Run the no-change audit case in Codex and Claude and confirm both report verified no-op status without inventing work.
  - Evidence: pending.
- [ ] Record sanitized prompt, output, discovery, validator, and deterministic-check evidence for both tools in each repository.
  - Evidence: pending.
- [ ] Link the `AGENTS.md`, `CLAUDE.md`, Codex skill, Claude skill, factor checklist, and deterministic check from the article's AI harness section.
  - Evidence: pending.
- [ ] Confirm each tagged reference release contains the tested harness files and matches the linked source.
  - Evidence: pending.

#### Cross-repository parity and article synchronization

- [ ] Run the same valid and invalid contract fixtures against all three repositories.
  - Evidence: pending.
- [ ] Confirm all three repositories expose equivalent web, worker, and admin behavior.
  - Evidence: pending.
- [ ] Confirm all three repositories demonstrate graceful shutdown and readiness ordering.
  - Evidence: pending.
- [ ] Confirm all three repositories demonstrate idempotent or deduplicated worker behavior under retry.
  - Evidence: pending.
- [ ] Confirm all three repositories emit structured events with release and trace correlation.
  - Evidence: pending.
- [ ] Confirm all three repositories run a bounded migration from the same artifact as their long-running process types.
  - Evidence: pending.
- [ ] Confirm all examples use safe placeholders and contain no realistic credential patterns.
  - Evidence: pending.
- [ ] Add observable audit questions and failure-injection ideas for all twelve factors.
  - Evidence: pending.
- [ ] Make every displayed snippet originate from a tagged repository source file or pass an exact snippet-to-source synchronization check.
  - Evidence: pending.
- [ ] Validate configuration names, process commands, ports, payloads, database schema, and paths across the article and all three repositories.
  - Evidence: pending.
- [ ] Add a tech-learning coverage check that fails unless every factor has TypeScript, Python, and Go example evidence.
  - Evidence: pending.
- [ ] Make the coverage check fail when any hub heading, example heading, link label, or audit mapping omits or mismatches its required `Factor I` through `Factor XII` numeral-title pair.
  - Evidence: pending.
- [ ] Add a tech-learning validation command that checks coverage, source links, release tags, and snippet synchronization.
  - Evidence: pending.
- [ ] Update `docs/feature_tracker.md` for the durable example validation command.
  - Evidence: pending.
- [ ] Confirm each reference repository URL and tagged-release URL returns successfully.
  - Evidence: pending.
- [ ] Run `npm run build` for the Wave 5 article batch.
  - Evidence: pending.
- [ ] Confirm Wave 5 is complete.
  - Evidence: pending until every Wave 5 child item is checked.

### Wave 6: discovery and cross-linking

- [ ] Add the topic under Platform in `src/content/docs/topics/ops/index.md`.
  - Evidence: pending.
- [ ] Add the topic under Operations in `src/content/docs/topics/index.mdx`.
  - Evidence: pending.
- [ ] Add related links from the topic to Docker, Kubernetes, GitOps, secrets, and scalability using rendered-route-relative paths.
  - Evidence: pending.
- [ ] Link the hub and all three example pages in both directions, including previous and next example navigation.
  - Evidence: pending.
- [ ] Verify each factor's hub link resolves to the correct example-page heading.
  - Evidence: pending.
- [ ] Verify every rendered factor link and heading displays the exact Roman numeral and canonical factor title.
  - Evidence: pending.
- [ ] Link the TypeScript example tabs and repository summary to the tagged TypeScript reference release.
  - Evidence: pending.
- [ ] Link the Python example tabs and repository summary to the tagged Python reference release.
  - Evidence: pending.
- [ ] Link the Go example tabs and repository summary to the tagged Go reference release.
  - Evidence: pending.
- [ ] Replace or supplement the secrets page's passing Twelve-Factor reference with a local topic link.
  - Evidence: pending.
- [ ] Evaluate focused backlinks from Docker and Kubernetes, adding only links that improve reader navigation.
  - Evidence: pending.
- [ ] Verify every changed internal link from its rendered route.
  - Evidence: pending.
- [ ] Run `npm run build` for the Wave 6 batch.
  - Evidence: pending.
- [ ] Confirm Wave 6 is complete.
  - Evidence: pending until every Wave 6 child item is checked.

### Wave 7: publication review and validation

- [ ] Run the writing-style review, including the U+2014 em dash ban and restrained hyphenation.
  - Evidence: pending.
- [ ] Run prose cleanup for repetition, canned transitions, inflated claims, and mechanical bullet structure.
  - Evidence: pending.
- [ ] Run the published-content review and remove planning residue, maintainer notes, and repeated source piles.
  - Evidence: pending.
- [ ] Confirm all frontmatter descriptions are double quoted.
  - Evidence: pending.
- [ ] Confirm the hub, child pages, table of contents, links, and audit mappings consistently use the exact `Factor I: Codebase` through `Factor XII: Admin processes` titles.
  - Evidence: pending.
- [ ] Scan changed content for realistic credential patterns and unsafe examples.
  - Evidence: pending.
- [ ] Verify claims against primary sources and keep third-party proposals labeled by author and status.
  - Evidence: pending.
- [ ] Confirm the published pages contain exactly twelve TypeScript, twelve Python, and twelve Go factor examples.
  - Evidence: pending.
- [ ] Confirm every example imports or calls at least one actual library or direct runtime API named in its locked reference repository.
  - Evidence: pending.
- [ ] Confirm language-tab selection is synchronized and keyboard accessible on all three example pages.
  - Evidence: pending.
- [ ] Re-run the snippet-to-source synchronization check after prose cleanup.
  - Evidence: pending.
- [ ] Confirm the final page length or apply the documented split rule.
  - Evidence: pending.
- [ ] Run `npm run build` and record the result.
  - Evidence: pending.
- [ ] Run `npm run validate:pre-push` and record the result.
  - Evidence: pending.
- [ ] Inspect the built topic route and intended content.
  - Evidence: pending.
- [ ] Verify internal links and spot-check external sources.
  - Evidence: pending.
- [ ] Confirm Wave 7 is complete.
  - Evidence: pending until every Wave 7 child item is checked.

### Final closeout

- [ ] Confirm every wave and child item is checked with evidence.
  - Evidence: pending.
- [ ] Confirm the published topic answers the audience outcomes in this plan.
  - Evidence: pending.
- [ ] Confirm all 36 factor-language examples are present, source-backed, and covered by the focused validation command.
  - Evidence: pending.
- [ ] Confirm all twelve factor sections are visibly numbered with the correct Roman numeral and canonical title everywhere they are presented or linked.
  - Evidence: pending.
- [ ] Confirm the TypeScript reference repository is public, runnable from a clean clone, unit tested, integration tested, CI green, tagged, and linked from the entry.
  - Evidence: pending.
- [ ] Confirm the TypeScript repository includes discovered and evaluated Codex and Claude skills, shared always-on instructions, and a green deterministic Twelve-Factor CI check.
  - Evidence: pending.
- [ ] Confirm the Python reference repository is public, runnable from a clean clone, unit tested, integration tested, CI green, tagged, and linked from the entry.
  - Evidence: pending.
- [ ] Confirm the Python repository includes discovered and evaluated Codex and Claude skills, shared always-on instructions, and a green deterministic Twelve-Factor CI check.
  - Evidence: pending.
- [ ] Confirm the Go reference repository is public, runnable from a clean clone, unit tested, integration tested, CI green, tagged, and linked from the entry.
  - Evidence: pending.
- [ ] Confirm the Go repository includes discovered and evaluated Codex and Claude skills, shared always-on instructions, and a green deterministic Twelve-Factor CI check.
  - Evidence: pending.
- [ ] Confirm official proposal statuses were checked on the publication date.
  - Evidence: pending.
- [ ] Confirm the worktree contains only intended changes.
  - Evidence: pending.
- [ ] Move this plan from `docs/plans/current/` to `docs/plans/history/` in the final content batch.
  - Evidence: pending.
- [ ] Mark the plan complete only after the history path exists and all validation evidence is recorded.
  - Evidence: pending.

## Current position

Waves 0 through 4 are complete. Wave 5 is the next execution wave. The hub and three example pages now cover all twelve factors with verified language examples plus a dated analysis of official modernization work, independent extensions, and remaining production concerns. The standalone reference repositories, AI harnesses, integrated article sections, and final publication work remain pending.
