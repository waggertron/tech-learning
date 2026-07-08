---
title: "Modern React 40: Deployment, observability, and feature flags"
description: "Deployment, observability, and feature flags for learning how React behaves in production."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-deployment-observability-feature-flags/
series:
  slug: modern-react-development
  order: 40
---

This is part 40 of the [Modern React development series](../series/modern-react-development/).

A React app changes character in production. Bundles are optimized, users have slower devices, networks fail, errors need reports, and feature rollouts need control. Deployment work gives the app feedback loops after it leaves a developer machine.

## Concept

Deployment ships the built app to users. Observability collects signals about what the app is doing. Feature flags control whether a capability is visible or active for a user, cohort, environment, or rollout stage.

## Terms

- **Deployment**: The process of building and publishing an application for users.
- **Observability**: Telemetry that helps teams understand runtime behavior through logs, metrics, traces, errors, and events.
- **Feature flag**: A runtime switch that controls a feature without requiring a new build.
- **Web vitals**: User experience metrics for loading, responsiveness, and visual stability.
- **CI**: Continuous integration, an automated environment that runs checks for a change.
- **PII**: Personally identifiable information, data that can identify a specific person.

## Mental model

Think of production as a long-running experiment with instruments. Deployments change the system, observability tells you what changed, and flags let you narrow or reverse exposure.

## How it is used

Use this layer for production error reporting, performance monitoring, release gates, gradual rollouts, A/B tests, kill switches, analytics events, and identifying regressions after a React or framework upgrade.

## How to use it

1. Build the app with the production command used by CI.
2. Report root errors and route errors to an error service.
3. Measure key user flows and web vitals.
4. Read feature flags from a provider or server boundary, then pass simple booleans or variants into UI.
5. Keep server-side authorization separate from client feature visibility.

## Example: Root error reporting

```tsx
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root")!, {
  onCaughtError(error, errorInfo) {
    reportError({
      name: "react-caught-error",
      message: error.message,
      componentStack: errorInfo.componentStack,
    });
  },
});

root.render(<App />);
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-deployment-observability-feature-flags-1-root-error-reporting" data-render-mode="result" data-interaction-mode="runner" data-runner-entry="2026-07-07-react-deployment-observability-feature-flags-1-root-error-reporting" role="region" aria-label="Output view: Root error reporting">
  <div class="react-example-output__header">Browser result</div>
  <div class="react-example-output__body">
    <div class="react-example-output__runner" data-react-example-runner="2026-07-07-react-deployment-observability-feature-flags-1-root-error-reporting">
  <button type="button" class="react-example-output__run-button">Run example</button>
  <div class="react-example-output__runner-output" aria-live="polite">
    <p><strong>Root error reporting.</strong> The browser entrypoint mounts the React tree into the root DOM node.</p>
  </div>
</div>
  </div>
</div>

React root options provide one place to report production render errors caught by boundaries.

## Example: Feature flag as a prop

```tsx
import { ClassicPaymentForm } from "./ClassicPaymentForm";
import { NewPaymentSheet } from "./NewPaymentSheet";

type CheckoutPageProps = {
  flags: {
    newPaymentSheet: boolean;
  };
};

export function CheckoutPage({ flags }: CheckoutPageProps) {
  return flags.newPaymentSheet ? (
    <NewPaymentSheet />
  ) : (
    <ClassicPaymentForm />
  );
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-deployment-observability-feature-flags-2-feature-flag-as-a-prop" data-render-mode="react-server" data-interaction-mode="live-component" data-live-entry="./react-example-modules/2026-07-07-react-deployment-observability-feature-flags-2-feature-flag-as-a-prop.tsx" role="region" aria-label="Output view: Feature flag as a prop">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><form><h2>New payment sheet</h2><button>Confirm payment</button></form></div>
  </div>
</div>

The component receives a simple decision. The flag system can live at the server, provider, or route boundary.

## Details to watch

- **Build parity**: CI should run the same production build command used for deployment.
- **Flag cleanup**: Expired flags become permanent complexity. Track owners and removal dates.
- **Telemetry privacy**: Telemetry should avoid personally identifiable information unless the system is designed and approved for it.
- **Client visibility**: A feature flag can hide UI, but it is not authorization.

## Series navigation

- Previous: [Part 39: Internationalization and formatting](../2026-07-07-react-internationalization-formatting/)
- Next: none. This is the end of the series.
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [createRoot error logging](https://react.dev/reference/react-dom/client/createRoot)
- [Next.js Deploying](https://nextjs.org/docs/app/getting-started/deploying)
- [Next.js useReportWebVitals](https://nextjs.org/docs/app/api-reference/functions/use-report-web-vitals)
- [Profiler](https://react.dev/reference/react/Profiler)

## Related topics

- [Web topics](../../topics/web/)
- [System design topics](../../topics/system-design/)
- [Testing](../../topics/testing/)
