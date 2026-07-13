# Swift Browser Runner

This document records the browser runner contract that Swift support must preserve or deliberately replace. It is the R1.1 baseline for the [Swift browser execution ADR](adr/2026-07-13-swift-browser-execution.md).

## Current Surfaces

The editable REPL is the primary practice surface. Python, TypeScript, and Go render the same structure with language-specific labels and execution behavior.

```text
  EDITABLE REPL
  ┌──────────────────────────────────────┐
  │ [Run language] [Reset]          idle │
  ├──────────────────────────────────────┤
  │ Starter note, only for TODO code     │
  ├──────────────────────────────────────┤
  │ 1  CodeMirror editor                 │
  │ 2  editable source                   │
  │ 3                           min 280px│
  ├──────────────────────────────────────┤
  │ standard output, error, or diagnostic│
  │ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ │
  ├──────────────────────────────────────┤
  │ latest timing and per-instance mean  │
  └──────────────────────────────────────┘
```

Worked approach blocks remain read-only. Each language component adds a toolbar before every matching Expressive Code block and reveals an output panel after the first run.

```text
  APPROACH BLOCK, IDLE                   APPROACH BLOCK, COMPLETE
  ┌──────────────────────────────┐       ┌──────────────────────────────┐
  │ [Run language]               │       │ [Run language]          done │
  ├──────────────────────────────┤       ├──────────────────────────────┤
  │ read-only highlighted source │       │ read-only highlighted source │
  │                              │       │                              │
  └──────────────────────────────┘       └──────────────────────────────┘
                                         ┌──────────────────────────────┐
                                         │ output                       │
                                         ├──────────────────────────────┤
                                         │ timing                       │
                                         └──────────────────────────────┘
  Output is hidden before execution.       Output is visible after execution.
```

## Shared Editable REPL Contract

| Area | Current behavior | Swift compatibility target |
| --- | --- | --- |
| Component input | Accepts a required raw `code` string and an optional author-supplied `id`. A random suffix makes the rendered `data-repl-id` unique. The original source is stored in `data-original`. | Accept raw Swift source, keep multiple instances independent, and expose a stable hook for tests without treating the random suffix as a durable identifier. |
| Editor | Uses CodeMirror 6 with line numbers, active-line highlighting, history, indentation, bracket matching, automatic closing, completion, language support, the One Dark theme, and Tab indentation. | Provide Swift syntax support and preserve keyboard editing, history, focus, and readable line layout. |
| Reset | Replaces the entire editor document with `data-original`, writes `(reset)` to output, returns status to `idle`, and clears timing. Runtime state and the run-history array are not reset. | Preserve the visible reset behavior and decide explicitly whether execution state and timing history also reset. |
| Run control | Disables only the selected instance's run button during its request. Reset remains enabled. A second REPL can start while the first runs. There is no stop or cancel control. | Prevent duplicate execution for one instance, define safe concurrency across instances, and add cancellation if execution can outlive an immediate browser action. |
| Output | Shows first-run guidance before execution. Each run clears the panel, then replaces it with captured output, errors, or `(no output)`. Output uses preformatted text, wraps, scrolls, and has a 280-pixel maximum height. | Separate standard output, standard error, and compiler diagnostics where that distinction helps learners. Bound output before it reaches the page. |
| Timing | Stores successful durations in a per-instance array. The first success shows the latest duration; later successes also show the arithmetic mean and run count. Failed runs do not contribute. | Define whether timing covers compilation, execution, transport, or the full request, then label it accurately. |
| Starter code | Shows an instructional note when source contains `TODO: implement` or `pass  # TODO`. The predicate is copied across all three components, including the Python-specific marker in TypeScript and Go. | Use a Swift-specific marker contract and test both starter and completed source. |
| Hidden tabs | Finds the nearest Starlight tab panel and observes its `hidden` attribute. When the panel becomes visible, it calls CodeMirror's `requestMeasure()`. | Preserve remeasurement so Swift editors opened after initial page layout have usable dimensions. |
| Multiple instances | Each root gets its own editor, original source, output, status, timing history, and button listeners. Python and TypeScript share a language runtime loader across the page. | Support several Swift starters and approach runners without cross-instance output, state, or cancellation leaks. |

The language editors differ only in syntax packages and indentation. Python uses four spaces and adds global and local-symbol completion. TypeScript uses two spaces. Go inserts a tab with a visual width of four columns.

## Execution Differences

| Behavior | Python | TypeScript | Go |
| --- | --- | --- | --- |
| Execution boundary | Pyodide 0.27.2 in the browser's main page context | Babel standalone strips types, then `new Function` executes JavaScript in the browser's main page context | Form-encoded request to the public Go Playground compile endpoint |
| First-run dependency | Downloads about 10 MB from jsDelivr and caches the shared Pyodide instance | Downloads about 400 KB from jsDelivr and shares the Babel loader | Requires network access for every run |
| Type or compiler checking | Python parsing and runtime behavior | No TypeScript type checking, only Babel transformation and JavaScript behavior | Go compiler diagnostics come from the Playground response |
| Output capture | Installs Pyodide standard-output and standard-error callbacks | Temporarily replaces global `console.log`, `console.error`, and `console.warn` | Joins Playground event messages |
| Timing boundary | Python execution after the runtime has loaded | JavaScript execution after Babel transformation | Network, remote compilation, remote execution, and response time |
| Timeout | A `sys.settrace` deadline interrupts after five seconds, checked every 256 trace events | None. An infinite loop can block the page | No client timeout. The service controls its own limits |
| Cancellation | None | None | None |
| Success status | `done` or `done (with stderr)` | `done` | `done` |
| Failure status | `timed out`, `error`, or `load failed` | `error` or `load failed` | `error` |
| Empty output | `(no output)` | `(no output)` | `(no output)` |

## Approach Block Contract

Each component scans `figure.frame` elements after the page loads and attaches controls only to its exact fenced language name:

- Python matches `pre[data-language="python"]`.
- TypeScript matches `pre[data-language="typescript"]`. A `ts` fence does not match.
- Go matches `pre[data-language="go"]`.

The approach runner reads the highlighted block's text, reconstructs enough of the first editable scaffold to execute its tests, and uses the same language runtime as the editable REPL.

Python appends the first scaffold's `_run_tests` function. TypeScript uses a build-time extraction of `_runTests`, inserts an `assert` helper, and caps recognized large `length` fixtures at 1,000 to keep quadratic examples usable. Go extracts struct declarations, `assert`, and `runTests` at build time. A partial Go function is wrapped in `package main`, inferred imports, helpers, tests, and `main`; a complete program beginning with `package` runs unchanged.

This contract has three consequences for Swift:

1. An approach block needs a deterministic way to recover shared types, assertions, fixtures, and the test entry point.
2. The first editable Swift scaffold cannot be an undocumented source of truth. The harness boundary must be named and testable.
3. The runner must distinguish a complete Swift program from a function or type fragment, or authoring must require one explicit format.

## Status and Failure Behavior

The current components use visible text statuses rather than a shared state model.

```text
reset ──> idle
run ────> loading runtime ──> running ──> done
                      │            │
                      │            ├──────────────> error
                      │            └──────────────> timed out, Python only
                      └───────────────────────────> load failed
```

Go skips the loading state. Reset can be used while a run is in progress because only the run button is disabled. None of the runners cancels underlying work when a tab is hidden, the page changes state, Reset is selected, or another instance starts.

Known failure behavior includes:

- Python reports runtime download failure separately and preserves any captured output before an execution error. Its shared Pyodide globals and output callbacks can leak state or route output incorrectly when instances overlap.
- TypeScript reports Babel load and transform failures, restores patched console methods in `finally`, and records runtime errors. User code still has access to the page, browser storage, network APIs, and the global JavaScript context. An infinite loop can freeze the page. Concurrent instances compete for the same global console methods.
- Go reports fetch failures, non-success HTTP responses, and compiler errors. It does not set a client deadline or expose service-unavailable and cancellation states separately. Unexpected response parsing failures are not normalized by `runGo`.
- No runner caps captured output before assigning it to the result panel. CSS limits panel height, not output size or memory use.
- A failed runtime loader promise remains cached for Python and TypeScript, so another click does not create a fresh loader attempt without a page reload.

## Accessibility Baseline

Current strengths:

- Run and Reset are native buttons with visible text.
- CodeMirror provides keyboard editing and focus behavior.
- Output remains selectable text, and long output is scrollable.
- Starlight tabs expose tab and tab-panel roles.

Current gaps:

- Status, output, and diagnostics have no live-region semantics.
- Status text is not programmatically associated with its run button or editor.
- The editor has no component-level accessible name that includes the language or exercise.
- Timing changes are visual text only.
- There is no cancellation control or keyboard path for stopping work.
- Shared approach-block buttons use generic labels such as `Run` or `Run TS` without the approach name.
- Automated browser coverage checks that the three tabs and run buttons exist, but it does not exercise screen-reader announcements, editor labeling, execution, Reset, hidden-tab dimensions, timeout, failure, or mobile layout.

R1.7 must close these gaps for Swift. Shared runner improvements can be proposed separately, but Swift must not copy the gaps as an implicit compatibility requirement.

## Existing Validation

The current build and browser checks establish a limited regression floor:

- `scripts/test_build.py` verifies that built coding-problem pages containing REPL data also contain run buttons. It checks one page for all three languages and at least nine non-trivial REPL instances.
- `scripts/validate-custom-pages.mjs` opens the Binary Search 704 page, selects each language tab, waits for each run button, and confirms at least one REPL root per language.
- `npm run build` runs the repository's build-time content and page checks.

These checks validate rendered presence, not compiler or runtime behavior. The Swift spike and final component need contract tests below the browser surface plus focused browser tests for the user-visible states.

## ADR Acceptance Questions

R1.2 must make each answer explicit:

1. Can the option compile and execute source edited after the static site is built?
2. Where do compilation and execution happen, and what Swift toolchain version is actually used?
3. How are standard output, standard error, compiler diagnostics, runtime failure, timeout, cancellation, and unavailable-service states represented?
4. What CPU, wall-clock, memory, output, process, filesystem, and network limits exist at the trust boundary?
5. Can multiple instances run without sharing mutable program state or misrouting output?
6. What does the first run download, how large is it, and what remains available offline?
7. What source code or metadata leaves the browser, how long is it retained, and what abuse controls are required?
8. How does the option work on GitHub Pages, in local development, and in automated tests without production credentials?
9. Can editable starters and read-only approach blocks share one explicit, versioned harness contract?
10. Which current behaviors are preserved, improved, or intentionally removed?

## Evidence Paths

- Editable components: `src/components/PythonRepl.astro`, `src/components/TypeScriptRepl.astro`, and `src/components/GoRepl.astro`
- Shared approach-runner styles: `src/styles/custom.css`
- Build assertions: `scripts/test_build.py`
- Browser presence check: `scripts/validate-custom-pages.mjs`
- Representative integration: `src/content/docs/topics/cs/coding-problems/binary-search/704-binary-search.mdx`
- Execution plan: `docs/plans/2026-07-13-zero-to-ios-hero-series-plan.md`
