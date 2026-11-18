import { createRoot } from "react-dom/client";
import { PerformanceComparison } from "../../../src/content/docs/posts/_react-example-modules/PerformanceLab";
import { RecoveryDemo } from "../../../src/content/docs/posts/_react-example-modules/RecoveryDemo";
import { ReleaseDemo } from "../../../src/content/docs/posts/_react-example-modules/ReleaseDemo";

const root = document.getElementById("root");
if (!root) throw new Error("Missing root element");

type RuntimeConfig = { release: string; newCheckout: boolean };

async function start() {
  const response = await fetch("/runtime-config.json");
  if (!response.ok)
    throw new Error("Release configuration could not be loaded");
  const config: RuntimeConfig = await response.json();
  if (
    typeof config.release !== "string" ||
    typeof config.newCheckout !== "boolean"
  ) {
    throw new Error("Invalid release configuration");
  }
  if (!root) throw new Error("Missing root element");
  createRoot(root).render(
    <main>
      <h1>React behavior workbench</h1>
      <section aria-label="Performance demonstration">
        <h2>Performance</h2>
        <PerformanceComparison />
      </section>
      <section aria-label="Recovery demonstration">
        <h2>Recovery</h2>
        <RecoveryDemo />
      </section>
      <section aria-label="Release demonstration">
        <h2>Release controls</h2>
        <ReleaseDemo
          initialEnabled={config.newCheckout}
          release={config.release}
        />
      </section>
    </main>,
  );
}

void start().catch((error: unknown) => {
  if (root)
    root.textContent =
      error instanceof Error ? error.message : "Startup failed";
});
