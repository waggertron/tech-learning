import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsDir = path.join(repoRoot, "src/content/docs/posts");
const generatedRegistryPath = path.join(repoRoot, "src/generated/react-example-registry.tsx");
const reactPostFilePattern = /^2026-07-07-react-.+\.md$/;
const codeFencePattern = /```(tsx|typescript)\n([\s\S]*?)\n```/g;
const exampleHeadingPattern = /^## Example: (.+)$/gm;

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

  return true;
}

const examples = collectExamples();

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
