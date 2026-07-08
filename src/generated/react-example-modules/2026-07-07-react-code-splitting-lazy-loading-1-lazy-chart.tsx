// @ts-nocheck
import { lazy, Suspense } from "react";

const RevenueChart = lazy(() => import("../../content/docs/posts/_react-example-modules/RevenueChart"));

export function AnalyticsPanel() {
  return (
    <Suspense fallback={<p>Loading chart...</p>}>
      <RevenueChart />
    </Suspense>
  );
}
