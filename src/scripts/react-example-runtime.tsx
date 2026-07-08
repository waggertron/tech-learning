import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { reactExampleRegistry } from "../generated/react-example-registry";

type ReactExampleRegistryEntry = (typeof reactExampleRegistry)[number];

const moduleLoaders = import.meta.glob("../generated/react-example-modules/*.tsx") as Record<
  string,
  () => Promise<Record<string, unknown>>
>;
const registryById = new Map<string, ReactExampleRegistryEntry>(
  reactExampleRegistry.map((entry) => [entry.id, entry]),
);

function resolveModuleLoader(modulePath: string) {
  return (
    moduleLoaders[modulePath] ??
    moduleLoaders[`../generated/${modulePath.replace(/^\.\//, "")}`] ??
    moduleLoaders[`./${modulePath.replace(/^\.\.\//, "")}`]
  );
}

function deserializeFixtureValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => deserializeFixtureValue(item));
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  if ("$type" in value) {
    const marker = value as { $type: string; [key: string]: unknown };
    if (marker.$type === "fn") {
      return () => undefined;
    }

    if (marker.$type === "date") {
      return new Date(String(marker.value ?? ""));
    }

    if (marker.$type === "element") {
      const tag = String(marker.tag ?? "div");
      const props = deserializeFixtureValue(marker.props) as Record<string, unknown>;
      if (marker.key !== null && marker.key !== undefined) {
        props.key = String(marker.key);
      }
      return React.createElement(tag, props);
    }
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [key, deserializeFixtureValue(entry)]),
  );
}

function getRenderedContainer(panel: HTMLElement) {
  return panel.querySelector<HTMLElement>(".react-example-output__rendered");
}

async function mountLiveExample(panel: HTMLElement) {
  const id = panel.getAttribute("data-react-example-output");
  if (!id) return;

  const entry = registryById.get(id);
  if (!entry || entry.interactionMode !== "live-component" || !entry.modulePath) return;

  const loader = resolveModuleLoader(entry.modulePath);
  if (!loader) return;

  const rendered = getRenderedContainer(panel);
  if (!rendered) return;

  const module = await loader();
  const componentName = entry.componentName || "default";
  const Component =
    module.default ??
    module[componentName] ??
    Object.values(module).find((value): value is React.ComponentType => typeof value === "function");

  if (typeof Component !== "function") return;

  const props = deserializeFixtureValue(entry.props ?? {}) as Record<string, unknown>;
  const element = React.createElement(Component as React.ComponentType, props);
  const wrapped = entry.needsQueryClientProvider
    ? React.createElement(QueryClientProvider, { client: new QueryClient() }, element)
    : element;

  createRoot(rendered).render(wrapped);
}

function mountRunnerExample(panel: HTMLElement) {
  const id = panel.getAttribute("data-react-example-output");
  if (!id) return;

  const entry = registryById.get(id);
  if (!entry || entry.interactionMode !== "runner") return;

  const runnerRoot = panel.querySelector<HTMLElement>(".react-example-output__runner");
  const output = panel.querySelector<HTMLElement>(".react-example-output__runner-output");
  const button = panel.querySelector<HTMLButtonElement>(".react-example-output__run-button");

  if (!runnerRoot || !output || !button) return;

  button.addEventListener("click", async () => {
    if (runnerRoot.dataset.loaded === "true") return;
    runnerRoot.dataset.loaded = "true";

    const pre = document.createElement("pre");
    pre.className = "react-example-output__runner-pre";
    pre.textContent = entry.summary ?? "";
    output.replaceChildren(pre);
  });
}

function activatePanels() {
  document.querySelectorAll<HTMLElement>(".react-example-output").forEach((panel) => {
    const mode = panel.getAttribute("data-interaction-mode");
    if (mode === "live-component") {
      void mountLiveExample(panel);
      return;
    }

    if (mode === "runner") {
      mountRunnerExample(panel);
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", activatePanels, { once: true });
} else {
  activatePanels();
}
