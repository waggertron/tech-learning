---
title: "Modern React 20: Measure render work and understand Compiler"
description: "Measure a 12,000-row interaction, compare repeated derivation with memoization, and distinguish verified profiling from optional Compiler setup."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-performance-and-compiler/
series:
  slug: modern-react-development
  order: 20
---

This is part 20 of the [Modern React development series](../series/modern-react-development/).

Performance work needs an interaction whose cost can be observed. This lesson filters 12,000 deterministic reports while a separate counter changes unrelated state. The question is concrete: does changing the counter repeat the filter?

## Concept

React calls a component to calculate its next interface. A parent update can call children again even when the data they use has not changed. Memoization reuses a previous result while its inputs remain equal. It saves repeated work at the cost of dependency comparisons, retained values, and added reasoning.

React Compiler is a separate build-time optimizer. It can insert memoization for supported components and values. It is not enabled merely because an application uses React 19, Vite, or `useMemo`.

## Mental model

Keep three facts separate: what changed, which calculation ran, and how much time that render used. A counter update is useful here because it changes the parent without changing the filter input. A query update changes both.

## Example: Compare an unrelated update

```tsx
import { Profiler, useMemo, useRef, useState, type ProfilerOnRenderCallback } from "react";
import { createReportRows, reportRenderTiming, runExpensiveFilter, type RenderTiming } from "./performance";

const rows = createReportRows();

function BaselineReport({ query }: { query: string }) {
  const visible = runExpensiveFilter(rows, query);
  return <p>{visible.length} matching reports</p>;
}

function MemoizedReport({ query }: { query: string }) {
  const visible = useMemo(() => runExpensiveFilter(rows, query), [query]);
  return <p>{visible.length} matching reports</p>;
}

export function PerformanceComparison() {
  const [query, setQuery] = useState("north");
  const [memoized, setMemoized] = useState(false);
  const [counter, setCounter] = useState(0);
  const [display, setDisplay] = useState("No timing captured. Read after an interaction.");
  const latest = useRef<RenderTiming | null>(null);
  const capture: ProfilerOnRenderCallback = (id, phase, actualDuration) => {
    latest.current = { id, phase, actualDuration };
  };

  return (
    <section>
      <p>Workload: {rows.length} deterministic reports</p>
      <label>Report query <input value={query} onChange={(event) => setQuery(event.target.value)} /></label>
      <label><input type="checkbox" checked={memoized} onChange={(event) => setMemoized(event.target.checked)} /> Reuse unchanged calculation</label>
      <button type="button" onClick={() => setCounter(counter + 1)}>Update unrelated counter</button>
      <p>Unrelated counter: {counter}</p>
      <Profiler id="report" onRender={capture}>
        {memoized ? <MemoizedReport query={query} /> : <BaselineReport query={query} />}
      </Profiler>
      <button type="button" onClick={() => setDisplay(latest.current ? reportRenderTiming(latest.current) : "Profiler callbacks are unavailable in this build. Use the development workbench.")}>Read latest render timing</button>
      <p role="status">{display}</p>
    </section>
  );
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-performance-and-compiler-1-compare-an-unrelated-update" data-render-mode="react-server" data-interaction-mode="live-component" data-live-entry="./react-example-modules/2026-07-07-react-performance-and-compiler-1-compare-an-unrelated-update.tsx" role="region" aria-label="Output view: Compare an unrelated update">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><section><p>Workload: 12000 deterministic reports</p><label>Report query <input value="north"/></label><label><input type="checkbox"/> Reuse unchanged calculation</label><button type="button">Update unrelated counter</button><p>Unrelated counter: 0</p><p>6000 matching reports</p><button type="button">Read latest render timing</button><p role="status">No timing captured. Read after an interaction.</p></section></div>
  </div>
</div>

The helper `createReportRows` creates 12,000 uniquely identified rows, alternating North and South regions. Each row contains repeated searchable text. `runExpensiveFilter` normalizes that text and performs a case-insensitive match. This deliberate CPU workload makes the comparison visible without a server or network request. The helpers live beside the example in `_react-example-modules/performance.ts`.

`BaselineReport` recomputes during every render. `MemoizedReport` recomputes when `query` changes. The shared `rows` array is created outside both components, so its identity is stable. In a component that receives changing rows, the dependency list would also include `rows`.

The callback records a committed render's actual duration in a ref. Reading that ref happens on a separate button press. Updating display state directly on every profiling callback would itself create more renders and contaminate the experiment.

## Run the measurement

From a checkout of this repository:

```bash
npm ci
node node_modules/vite/bin/vite.js --config companion/react-workbench/vite.config.ts --host 127.0.0.1
```

Open the printed local URL. In the Performance section:

1. Leave reuse off and keep the query at `north`.
2. Click **Update unrelated counter**, then **Read latest render timing**. Record the number.
3. Repeat several times and compare a median rather than selecting the fastest sample.
4. Enable **Reuse unchanged calculation**, click the unrelated counter again, and read the timing.
5. Change the query. The memoized calculation now has new input and must run again.

The status displays a real callback value such as `report update: 4.32 ms`. That number is an example of the format, not a promised result. Hardware, browser, other work, and development instrumentation affect timings. The matching count stays the same for counter changes in both modes.

React's ordinary production build disables Profiler callbacks. The published output can therefore report that callbacks are unavailable. Use this development workbench, React DevTools, or a dedicated profiling production build to gather metrics. A missing callback is not a zero-millisecond render.

## Optional Compiler setup

This repository's Vite dependency uses `@vitejs/plugin-react` 4.x. The compatible documented Babel integration has this shape in an application that installs `babel-plugin-react-compiler`:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react({
    babel: { plugins: ["babel-plugin-react-compiler"] },
  })],
});
```

Put the Compiler first if there are other Babel plugins. Newer React Vite plugin versions have a different integration, so follow the installation instructions for the installed version.

For a useful comparison, first build the unmodified `BaselineReport`, then enable the Compiler and build it again. Look for Compiler-generated cache/runtime code in the transformed module, or the Memo badge in React DevTools. Check the same unrelated-counter interaction in a profiling-capable build. Do not infer activation from a successful build alone.

The workbench keeps the Compiler experiment in a separate configuration. Run the [versioned Compiler and lint checks](../2026-07-07-react-framework-choice-project-setup/#run-the-compiler-and-lint-checks) to transform the probe and build the complete workbench with the Compiler enabled. The normal development command above remains the manual-memoization comparison.

The probe source is `companion/react-workbench/tooling/CompilerProbe.tsx`. It filters supplied rows and renders the match count without `useMemo`. With Compiler 1.0.0, the captured transformed module begins with an import from `react/compiler-runtime`. Its filter cache uses both `query` and `rows` as keys:

```text
if ($[0] !== query || $[1] !== rows) {
  ... filter calculation and cache writes ...
} else {
  t1 = $[2];
}
```

This is an excerpt from generated output, not source to paste into an application. The complete output is written to `companion/react-workbench/.tooling/compiler-output.js`. The verification script asserts the runtime import and input-dependent cache, then builds the full app through `compiler.config.ts`. Both the transform and production build passed with the recorded plugin version. This proves activation and a compilable integration, not a universal speed improvement.

The manual version asks the author to write the cache dependency. The compiled probe shows the build generating one. Both still need correct input identity and pure calculations.

## Details to watch

- **New input**: `useMemo` cannot skip the filter when the query changes. A more selective algorithm, indexing, or background work may solve that cost better.
- **First render**: There is no cached result on mount. Memoization helps eligible later renders.
- **Purity**: Neither filter mutates the source rows or sends telemetry during render.
- **Measurement**: Profiler measures React render work for the wrapped subtree. It is not an end-to-end measure of network, layout, paint, or input latency.
- **Unbounded fixtures**: This is a fixed teaching workload, not a recommendation to render every matching row in a production table.

## Series navigation

- Previous: [Part 19: Testing components by behavior](../2026-07-07-react-testing-components-by-behavior/)
- Next: [Part 21: Choose a framework and prove the setup](../2026-07-07-react-framework-choice-project-setup/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [Profiler](https://react.dev/reference/react/Profiler) defines callback values and profiling-build requirements.
- [useMemo](https://react.dev/reference/react/useMemo) explains cache behavior and dependency comparisons.
- [Compiler installation](https://react.dev/learn/react-compiler/installation) distinguishes build integrations and evidence of activation.
- [Components and Hooks must be pure](https://react.dev/reference/rules/components-and-hooks-must-be-pure) defines the render contract optimizers rely on.

## Related topics

- [Framework choice and project setup](../2026-07-07-react-framework-choice-project-setup/)
- [Testing](../../topics/testing/)
