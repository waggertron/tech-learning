// @ts-nocheck
import { ActivityPanel } from "../../content/docs/posts/_react-example-modules/ActivityPanel";
import { ErrorBoundary } from "../../content/docs/posts/_react-example-modules/ErrorBoundary";
import { PanelError } from "../../content/docs/posts/_react-example-modules/PanelError";
import { RevenuePanel } from "../../content/docs/posts/_react-example-modules/RevenuePanel";

export function DashboardPage() {
  return (
    <main>
      <h1>Dashboard</h1>
      <ErrorBoundary fallback={<PanelError />}>
        <RevenuePanel />
      </ErrorBoundary>
      <ErrorBoundary fallback={<PanelError />}>
        <ActivityPanel />
      </ErrorBoundary>
    </main>
  );
}
