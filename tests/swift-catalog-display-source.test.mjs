import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { extractSwiftExampleSource } from "../src/lib/swift-catalog/display-source.mjs";
import {
  canonicalHelperSource,
  canonicalTestSupport,
  helperFiles,
} from "../scripts/swift-coding-problem-contract.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogRoot = path.join(repoRoot, "src/content/docs/topics/cs/coding-problems");
const removableBlocks = [
  canonicalTestSupport,
  ...Object.keys(helperFiles).map(canonicalHelperSource),
];

function approachFiles() {
  return readdirSync(catalogRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((category) => {
      const categoryRoot = path.join(catalogRoot, category.name);
      return readdirSync(categoryRoot)
        .filter((fileName) => /-approach\d+\.swift$/.test(fileName))
        .map((fileName) => path.join(categoryRoot, fileName));
    });
}

test("extracts every Swift approach without runner-only support code", () => {
  const files = approachFiles();
  assert.equal(files.length, 506);

  for (const filePath of files) {
    const source = readFileSync(filePath, "utf8");
    const typeName = /^\/\/ LEETCODE_TYPE: ([A-Za-z_][A-Za-z0-9_]*)\s*$/m.exec(source)?.[1];
    assert.ok(typeName, `${filePath} must declare its LeetCode type`);

    const example = extractSwiftExampleSource(source, removableBlocks);
    assert.match(example, new RegExp(`\\b(?:final\\s+)?(?:class|struct)\\s+${typeName}\\b`));
    assert.doesNotMatch(example, /\bfunc runTests\(\)/);
    assert.doesNotMatch(example, /\bfunc expectEqual</);
    assert.doesNotMatch(example, /All Swift tests passed/);
  }
});
