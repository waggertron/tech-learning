---
title: "Modern React 37: Build, observe, and roll back a release"
description: "Build a local React artifact, record release-aware events, switch checkout variants, and serve an earlier artifact to recover."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-deployment-observability-feature-flags/
series:
  slug: modern-react-development
  order: 37
---

This is part 37 of the [Modern React development series](../series/modern-react-development/).

A release consists of bytes, configuration, and behavior. Build once, keep the artifact, and attach the same release identifier to observations. When a candidate fails, a saved previous artifact gives rollback a concrete destination.

## Concept

A production build transforms source into static assets. Deployment selects which artifact a server delivers. Runtime configuration is data read after those assets load. A feature flag chooses a behavior within an artifact; rolling back an artifact changes the code itself.

The example uses an intentionally local static server. It demonstrates the build and rollback mechanics without pretending to provide a public hosting platform, authentication service, or payment system.

## Mental model

Separate three controls:

| Control | Changes | Does not prove |
| --- | --- | --- |
| build | generated HTML and JavaScript | successful runtime behavior |
| flag | selected checkout variant | server authorization |
| rollback | artifact served to the next page load | data-schema rollback |

## Build and save an artifact

From the repository root after `npm ci`:

```bash
node node_modules/vite/bin/vite.js build --config companion/react-workbench/vite.config.ts
node companion/react-workbench/release.mjs previous-1
```

Vite writes `companion/react-workbench/dist/index.html`, hashed JavaScript under `dist/assets/`, and `dist/runtime-config.json`. The snapshot command copies those files into `releases/previous-1` and records a SHA-256 digest plus the file list in `release.json`. It rejects an existing name so a release cannot be silently overwritten.

After changing the application, repeat with a new name:

```bash
node node_modules/vite/bin/vite.js build --config companion/react-workbench/vite.config.ts
node companion/react-workbench/release.mjs candidate-2
node companion/react-workbench/serve.mjs candidate-2
```

Open `http://127.0.0.1:4175`. Inspect the network requests: `index.html` points to a hashed asset, while `/runtime-config.json` is fetched separately. A missing or malformed configuration produces an explicit startup message instead of silently selecting a feature variant.

The configuration contains only a release name and a Boolean checkout decision. Browser-delivered configuration is public. A private service credential would not belong there.

## Example: Observe a deterministic rollout

```tsx
import { useState } from "react";

type ReleaseEvent = { release: string; variant: "classic" | "new"; name: string };

export function ReleaseDemo({ initialEnabled = false, release = "candidate-2" }: { initialEnabled?: boolean; release?: string }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [events, setEvents] = useState<ReleaseEvent[]>([]);
  const variant = enabled ? "new" : "classic";
  function record(name: string) {
    setEvents((current) => [...current, { release, variant, name }]);
  }
  return (
    <section>
      <label><input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} /> Enable new checkout</label>
      <h3>{enabled ? "New checkout" : "Classic checkout"}</h3>
      <button type="button" onClick={() => record("checkout-completed")}>Complete simulated checkout</button>
      <button type="button" onClick={() => record("checkout-failed")}>Simulate checkout failure</button>
      <div role="status">
        {events.length === 0 ? <p>No release events yet</p> : <ul>{events.map((event, index) => <li key={index}>{event.release} / {event.variant} / {event.name}</li>)}</ul>}
      </div>
    </section>
  );
}
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-deployment-observability-feature-flags-1-observe-a-deterministic-rollout" data-render-mode="react-server" data-interaction-mode="live-component" data-live-entry="./react-example-modules/2026-07-07-react-deployment-observability-feature-flags-1-observe-a-deterministic-rollout.tsx" role="region" aria-label="Output view: Observe a deterministic rollout">
  <div class="react-example-output__header">React output</div>
  <div class="react-example-output__body">
    <div class="react-example-output__rendered"><section><label><input type="checkbox"/> Enable new checkout</label><h3>Classic checkout</h3><button type="button">Complete simulated checkout</button><button type="button">Simulate checkout failure</button><div role="status"><p>No release events yet</p></div></section></div>
  </div>
</div>

Both variants are reachable. Start with **Classic checkout**, enable the new checkout, then simulate a failure. The status records the release, variant, and event name. Disable the flag and the classic path returns without changing the bundle.

The checkbox is a local stand-in for a configuration decision, not a remote rollout service. The workbench starts it from `runtime-config.json`. The events remain in memory and reset on page reload. They demonstrate an event schema and visible failure feedback rather than a durable analytics backend.

In a real rollout, compare failure counts to attempts for the same release and cohort. A larger count can mean more users rather than worse behavior. Define the observation period and rollback threshold before expanding exposure. Do not transmit payment details or user-entered content as event fields.

For render-time reporting, use the [error boundary lesson](../2026-07-07-react-error-boundaries-recovery/). The simulated checkout failure here is an application event, so it is recorded directly by its action handler.

## Roll back the local artifact

Stop the local server with Ctrl-C. Serve the saved previous release:

```bash
node companion/react-workbench/serve.mjs previous-1
```

Reload the page and inspect `/release.json`. Its name identifies the selected artifact. The server uses `Cache-Control: no-store` so this exercise does not accidentally test an old cached page. Production caching needs a deliberate HTML/configuration policy alongside immutable hashed assets.

If both snapshots came from unchanged source, they will have the same content digest. That is a useful control: selecting a different release name is not evidence that the code changed. Make a visible application change between snapshots to test the complete rollback loop.

The loopback server does not implement SPA route fallback, public transport security, traffic switching, or migration rollback. Those deployment decisions belong to the chosen hosting platform and backend. A feature flag also does not authorize a server-side operation.

## Verify the release

The behavior test checks classic/new variants and a release-labelled failure event:

```bash
node --test --test-name-pattern='recovery and rollout' tests/react-example-output-views.test.mjs
```

Before release, run the production build and inspect the served artifact, configuration request, failure event, and rollback destination. React Profiler callbacks require a profiling-capable build; ordinary production behavior is not proven by a development timing display.

## Series navigation

- Previous: [Part 36: Internationalization and formatting](../2026-07-07-react-internationalization-formatting/)
- Next: none. This is the end of the core series.
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [Vite production builds](https://vite.dev/guide/build) describes generated assets and deployment-related configuration.
- [Vite static deployment](https://vite.dev/guide/static-deploy) distinguishes a build from a production host.
- [Vite environment variables](https://vite.dev/guide/env-and-mode) explains build-time replacement and client exposure.
- [createRoot error reporting](https://react.dev/reference/react-dom/client/createRoot) explains root render-error hooks.

## Related topics

- [Framework choice and project setup](../2026-07-07-react-framework-choice-project-setup/)
- [Error boundaries and recovery](../2026-07-07-react-error-boundaries-recovery/)
- [Testing](../../topics/testing/)
