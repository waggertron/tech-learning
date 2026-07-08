// @ts-nocheck
import { Profiler } from "react";
import { Dashboard } from "../../content/docs/posts/_react-example-modules/Dashboard";
import { reportRenderTiming } from "../../content/docs/posts/_react-example-modules/performance";

export function InstrumentedDashboard() {
  return (
    <Profiler
      id="dashboard"
      onRender={(id, phase, actualDuration) => {
        reportRenderTiming({ id, phase, actualDuration });
      }}
    >
      <Dashboard />
    </Profiler>
  );
}
