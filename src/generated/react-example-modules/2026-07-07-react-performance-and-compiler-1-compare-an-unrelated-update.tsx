// @ts-nocheck
import { Profiler, useMemo, useRef, useState, type ProfilerOnRenderCallback } from "react";
import { createReportRows, reportRenderTiming, runExpensiveFilter, type RenderTiming } from "../../content/docs/posts/_react-example-modules/performance";

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
