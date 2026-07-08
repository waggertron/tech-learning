import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsDir = path.join(repoRoot, "src/content/docs/posts");
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
      /<strong>[^<]+<\/strong>/,
      `${example.fileName} example "${example.title}" should summarize the output in visible text`,
    );
    assert.doesNotMatch(
      afterFence.slice(0, 1200),
      /\b(TODO|placeholder|lorem ipsum)\b/i,
      `${example.fileName} example "${example.title}" should not ship placeholder output copy`,
    );
  }

  assert.equal(outputIds.size, examples.length);
});
