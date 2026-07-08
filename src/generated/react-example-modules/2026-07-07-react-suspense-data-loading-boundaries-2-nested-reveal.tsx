// @ts-nocheck
import { Suspense } from "react";
import { ChartSkeleton } from "../../content/docs/posts/_react-example-modules/ChartSkeleton";
import { PageShellSkeleton } from "../../content/docs/posts/_react-example-modules/PageShellSkeleton";
import { RevenueChart } from "../../content/docs/posts/_react-example-modules/RevenueChart";
import { SummaryCards } from "../../content/docs/posts/_react-example-modules/SummaryCards";

export function Dashboard() {
  return (
    <Suspense fallback={<PageShellSkeleton />}>
      <SummaryCards />
      <Suspense fallback={<ChartSkeleton />}>
        <RevenueChart />
      </Suspense>
    </Suspense>
  );
}
