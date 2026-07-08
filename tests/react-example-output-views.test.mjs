import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsDir = path.join(repoRoot, "src/content/docs/posts");
const astroConfigPath = path.join(repoRoot, "astro.config.mjs");
const headComponentPath = path.join(repoRoot, "src/components/Head.astro");
const runtimeScriptPath = path.join(repoRoot, "src/scripts/react-example-runtime.tsx");
const generatedRegistryPath = path.join(repoRoot, "src/generated/react-example-registry.tsx");
const generatedModuleDir = path.join(repoRoot, "src/generated/react-example-modules");
const reactPostFilePattern = /^2026-07-07-react-.+\.md$/;
const codeFencePattern = /```(tsx|typescript)\n([\s\S]*?)\n```/g;
const exampleHeadingPattern = /^## Example: (.+)$/gm;
const baseRequire = createRequire(import.meta.url);

const reactPostFiles = readdirSync(postsDir)
  .filter((fileName) => reactPostFilePattern.test(fileName))
  .sort();

function collectExamples() {
  return reactPostFiles.flatMap((fileName) => {
    const filePath = path.join(postsDir, fileName);
    const content = readFileSync(filePath, "utf8");
    const headings = [...content.matchAll(exampleHeadingPattern)];
    const fences = [...content.matchAll(codeFencePattern)];

    return fences.map((fence, index) => {
      const heading = headings
        .filter((headingMatch) => headingMatch.index < fence.index)
        .at(-1);
      const title = heading?.[1]?.trim() ?? `Code example ${index + 1}`;
      const absoluteFenceEnd = fence.index + fence[0].length;
      const nextFenceIndex = fences[index + 1]?.index ?? content.length;
      const afterFence = content.slice(absoluteFenceEnd, nextFenceIndex);

      return {
        fileName,
        index: index + 1,
        title,
        language: fence[1],
        code: fence[2],
        afterFence,
      };
    });
  });
}

function meaningfulCodeLines(code) {
  return code
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("//"));
}

function returnsJsx(code) {
  return /return\s*\(?\s*</.test(code) || /=>\s*\(?\s*</.test(code);
}

function exportsRenderableComponent(code) {
  if (/createFileRoute\(/.test(code)) return false;
  if (/\b(describe|it|test)\(/.test(code)) return false;
  if (/\bcreateRoot\(/.test(code)) return false;

  return (
    /export default function\s+[A-Z]/.test(code) ||
    /export function\s+[A-Z]/.test(code) ||
    /export const\s+[A-Z]\w*\s*(?::[^=]+)?=/.test(code) ||
    (!/\bexport\s+/.test(code) && /function\s+[A-Z]/.test(code))
  );
}

function isBrowserLiveRenderable(code) {
  if (!/<[A-Za-z][A-Za-z0-9.]*[\s>/]/.test(code)) return false;
  if (/createFileRoute\(/.test(code)) return false;
  if (/\b(describe|it|test)\(/.test(code)) return false;
  if (/\bcreateRoot\(/.test(code)) return false;
  if (/export\s+async\s+function\s+[A-Z]/.test(code)) return false;
  if (/export\s+default\s+async\s+function\s+[A-Z]/.test(code)) return false;

  return true;
}

const examples = collectExamples();

function parseRegistry() {
  const source = readFileSync(generatedRegistryPath, "utf8");
  const json = /export const reactExampleRegistry = ([\s\S]*?) as const;/.exec(source)?.[1];
  assert.ok(json, "React example registry should be parseable");
  return JSON.parse(json);
}

function moduleFilePath(modulePath) {
  return path.join(generatedModuleDir, modulePath.replace("./react-example-modules/", ""));
}

function transpileModuleSource(source, fileName) {
  return ts.transpileModule(source, {
    fileName,
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
}

function resolveLocalModule(fromFile, request) {
  const basePath = path.resolve(path.dirname(fromFile), request);
  return [basePath, `${basePath}.tsx`, `${basePath}.ts`, `${basePath}.js`].find((candidate) =>
    existsSync(candidate),
  );
}

function evaluateGeneratedModule(filePath, moduleCache = new Map()) {
  if (moduleCache.has(filePath)) return moduleCache.get(filePath).exports;

  const source = readFileSync(filePath, "utf8");
  const module = { exports: {} };
  moduleCache.set(filePath, module);

  const localRequire = (request) => {
    if (request === "react-native") {
      return baseRequire("react-native-web");
    }

    if (request.startsWith(".")) {
      const localPath = resolveLocalModule(filePath, request);
      assert.ok(localPath, `Missing local module ${request} imported by ${filePath}`);
      return evaluateGeneratedModule(localPath, moduleCache);
    }

    return baseRequire(request);
  };

  const script = new vm.Script(transpileModuleSource(source, filePath), { filename: filePath });
  const context = vm.createContext({
    AbortController,
    FormData,
    Intl,
    console,
    document: { title: "" },
    exports: module.exports,
    module,
    navigator: { onLine: true },
    require: localRequire,
    window: {
      addEventListener() {},
      clearInterval() {},
      clearTimeout() {},
      removeEventListener() {},
      setInterval() {
        return 1;
      },
      setTimeout() {
        return 1;
      },
    },
  });

  script.runInContext(context, { timeout: 1000 });
  return module.exports;
}

function deserializeFixtureValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => deserializeFixtureValue(item));
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  if (value.$type === "fn") {
    return () => undefined;
  }

  if (value.$type === "date") {
    return new Date(String(value.value ?? ""));
  }

  if (value.$type === "element") {
    return React.createElement(
      String(value.tag ?? "div"),
      deserializeFixtureValue(value.props ?? {}),
    );
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [key, deserializeFixtureValue(entry)]),
  );
}

function selectRenderTarget(moduleExports, componentName) {
  if (typeof moduleExports.default === "function") {
    return { component: moduleExports.default };
  }

  if (typeof moduleExports.default?.component === "function") {
    const story = Object.values(moduleExports).find(
      (value) => value && typeof value === "object" && "args" in value,
    );
    return { component: moduleExports.default.component, props: story?.args };
  }

  const component =
    moduleExports[componentName] ??
    Object.values(moduleExports).find((value) => typeof value === "function");

  assert.equal(typeof component, "function", `Generated module should export ${componentName}`);
  return { component };
}

function renderedFallbackHtml(example) {
  return /<div class="react-example-output__rendered">([\s\S]*?)<\/div>/.exec(
    example.afterFence,
  )?.[1];
}

test("Modern React examples have the expected coverage count", () => {
  assert.equal(examples.length, 78);
});

test("every Modern React example shows its imports near the top", () => {
  for (const example of examples) {
    const lines = meaningfulCodeLines(example.code);
    const importIndex = lines.findIndex((line) => line.startsWith("import "));

    assert.notEqual(
      importIndex,
      -1,
      `${example.fileName} example "${example.title}" should show at least one import statement`,
    );

    const firstLineAllowsDirective =
      lines[0] === '"use client";' || lines[0] === '"use server";';
    const allowedImportIndex = firstLineAllowsDirective ? 1 : 0;

    assert.ok(
      importIndex <= allowedImportIndex,
      `${example.fileName} example "${example.title}" should place imports before implementation code`,
    );
  }
});

test("every Modern React example has an accessible output view", () => {
  const outputIds = new Set();

  for (const example of examples) {
    const afterFence = example.afterFence.trimStart();

    assert.match(
      afterFence,
      /^<div class="react-example-output\b/,
      `${example.fileName} example "${example.title}" should place an output view immediately after the code fence`,
    );

    const outputId = /data-react-example-output="([^"]+)"/.exec(afterFence)?.[1];
    assert.ok(outputId, `${example.fileName} example "${example.title}" should have an output id`);
    assert.ok(
      !outputIds.has(outputId),
      `${example.fileName} example "${example.title}" reuses output id "${outputId}"`,
    );
    outputIds.add(outputId);

    assert.match(
      afterFence,
      /role="region"/,
      `${example.fileName} example "${example.title}" should expose the output view as a region`,
    );
    assert.match(
      afterFence,
      /aria-label="Output view: [^"]+"/,
      `${example.fileName} example "${example.title}" should have a descriptive output aria-label`,
    );
    assert.match(
      afterFence,
      /data-render-mode="(react-server|result)"/,
      `${example.fileName} example "${example.title}" should declare how the output was produced`,
    );
    assert.match(
      afterFence,
      /data-interaction-mode="(live-component|runner|static)"/,
      `${example.fileName} example "${example.title}" should declare how the output can be used`,
    );
    assert.doesNotMatch(
      afterFence.slice(0, 1200),
      /\b(TODO|placeholder|lorem ipsum)\b/i,
      `${example.fileName} example "${example.title}" should not ship placeholder output copy`,
    );
  }

  assert.equal(outputIds.size, examples.length);
});

test("rendered React examples are live and result examples are runnable", () => {
  for (const example of examples) {
    const outputStart = example.afterFence.slice(0, 1800);
    const renderMode = /data-render-mode="([^"]+)"/.exec(outputStart)?.[1];
    const interactionMode = /data-interaction-mode="([^"]+)"/.exec(outputStart)?.[1];

    if (renderMode === "react-server") {
      if (isBrowserLiveRenderable(example.code)) {
        assert.equal(
          interactionMode,
          "live-component",
          `${example.fileName} example "${example.title}" should mount a live React component`,
        );
        assert.match(
          outputStart,
          /data-live-entry="[^"]+"/,
          `${example.fileName} example "${example.title}" should point at a live registry entry`,
        );
      } else {
        assert.equal(
          interactionMode,
          "runner",
          `${example.fileName} example "${example.title}" should fall back to runner mode when it cannot hydrate in a browser`,
        );
        assert.match(
          outputStart,
          /data-runner-entry="[^"]+"/,
          `${example.fileName} example "${example.title}" should point at a runner registry entry`,
        );
      }
    }

    if (renderMode === "result") {
      assert.equal(
        interactionMode,
        "runner",
        `${example.fileName} example "${example.title}" should expose a runner mode`,
      );
      assert.match(
        outputStart,
        /data-runner-entry="[^"]+"/,
        `${example.fileName} example "${example.title}" should point at a runner registry entry`,
      );
    }
  }
});

test("the generated browser registry exposes live examples and runners", () => {
  assert.ok(existsSync(generatedRegistryPath), "React example browser registry should exist");

  const registry = readFileSync(generatedRegistryPath, "utf8");
  assert.match(registry, /export const reactExampleRegistry/);
  assert.match(registry, /2026-07-07-react-components-and-jsx-1-render-data-with-jsx/);
  assert.match(registry, /2026-07-07-react-vite-client-only-apps-2-minimal-vite-config/);
});

test("the React example runtime is bundled by Astro", () => {
  const head = readFileSync(headComponentPath, "utf8");

  assert.match(head, /import ['"]\.\.\/scripts\/react-example-runtime['"]/);
  assert.doesNotMatch(
    head,
    /<script[^>]*(is:inline|type="module")[^>]*>\s*import ['"]\.\.\/scripts\/react-example-runtime['"]/,
    "React example runtime should be loaded through an Astro-processed script",
  );
});

test("the React example runtime mounts previews as client islands", () => {
  const runtime = readFileSync(runtimeScriptPath, "utf8");

  assert.match(runtime, /import\s+\{\s*createRoot\s*\}\s+from ['"]react-dom\/client['"]/);
  assert.doesNotMatch(
    runtime,
    /\bhydrateRoot\b/,
    "Output previews should mount as client islands to avoid hydration mismatch failures in documentation examples",
  );
});

test("Astro compiles live TSX examples with the automatic React JSX runtime", () => {
  const config = readFileSync(astroConfigPath, "utf8");

  assert.match(
    config,
    /jsx:\s*['"]automatic['"]/,
    "Live generated TSX modules need automatic JSX so browser code does not depend on a missing React global",
  );
  assert.match(
    config,
    /jsxImportSource:\s*['"]react['"]/,
    "Automatic JSX should import the React runtime for generated TSX modules",
  );
});

test("JSX examples show React-rendered output instead of tag summaries", () => {
  for (const example of examples) {
    const outputStart = example.afterFence.slice(0, 1800);

    assert.doesNotMatch(
      outputStart,
      /renders <code>&lt;|Visible text can include| markup\./,
      `${example.fileName} example "${example.title}" should not describe tags as the output`,
    );

    if (returnsJsx(example.code) && exportsRenderableComponent(example.code)) {
      assert.match(
        outputStart,
        /data-render-mode="react-server"/,
        `${example.fileName} example "${example.title}" should be rendered by React server rendering`,
      );
      assert.match(
        outputStart,
        /class="react-example-output__rendered"/,
        `${example.fileName} example "${example.title}" should include the rendered HTML container`,
      );
    }
  }
});

test("the first JSX example renders the ProductCard with fixture props", () => {
  const example = examples.find(
    (item) =>
      item.fileName === "2026-07-07-react-components-and-jsx.md" &&
      item.title === "Render data with JSX",
  );

  assert.ok(example, "first React post should keep the Render data with JSX example");

  const outputStart = example.afterFence.slice(0, 1800);
  assert.match(outputStart, /data-render-mode="react-server"/);
  assert.match(outputStart, /class="product-card"/);
  assert.match(outputStart, /Trail shoes/);
  assert.match(outputStart, /\$\s*129\.00/);
  assert.match(outputStart, /In stock/);
  assert.doesNotMatch(outputStart, /ProductCard renders/);
});

test("live React output entries render non-empty generated module markup", () => {
  const registryById = new Map(parseRegistry().map((entry) => [entry.id, entry]));

  for (const example of examples) {
    const outputStart = example.afterFence.slice(0, 2400);
    const outputId = /data-react-example-output="([^"]+)"/.exec(outputStart)?.[1];
    const interactionMode = /data-interaction-mode="([^"]+)"/.exec(outputStart)?.[1];

    if (interactionMode !== "live-component") continue;

    const fallback = renderedFallbackHtml(example);
    assert.ok(
      fallback?.trim(),
      `${example.fileName} example "${example.title}" should ship non-empty fallback HTML`,
    );

    const entry = registryById.get(outputId);
    assert.ok(entry, `Registry should include ${outputId}`);
    assert.ok(entry.modulePath, `Live registry entry ${outputId} should have modulePath`);

    const liveModulePath = moduleFilePath(entry.modulePath);
    assert.ok(existsSync(liveModulePath), `Generated live module should exist for ${outputId}`);

    const moduleExports = evaluateGeneratedModule(liveModulePath);
    const target = selectRenderTarget(moduleExports, entry.componentName);
    const Component = target.component;
    const props = deserializeFixtureValue(target.props ?? entry.props ?? {});
    const element = React.createElement(Component, props);
    const wrapped = entry.needsQueryClientProvider
      ? React.createElement(
          baseRequire("@tanstack/react-query").QueryClientProvider,
          { client: new (baseRequire("@tanstack/react-query").QueryClient)() },
          element,
        )
      : element;
    let html;
    try {
      html = renderToStaticMarkup(wrapped);
    } catch (error) {
      if (
        /\bsuspended\b/i.test(error.message) &&
        /\b(Suspense|lazy)\b/.test(example.code)
      ) {
        continue;
      }

      throw new Error(`${outputId} failed to render generated markup: ${error.message}`);
    }

    assert.ok(
      html.trim(),
      `Generated live module ${outputId} should render non-empty markup`,
    );
    assert.doesNotMatch(
      html,
      /^<[^>]+><\/[^>]+>$/,
      `Generated live module ${outputId} should not render an empty shell`,
    );
  }
});
