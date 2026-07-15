import assert from "node:assert/strict";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";
import {
  buildCoverageManifest,
  collectApproachSections,
  hasTestHarness,
  serializeManifest,
  swiftCoverageErrors,
} from "../scripts/swift-catalog-coverage.mjs";
import { canonicalTestSupport } from "../scripts/swift-coding-problem-contract.mjs";
import {
  renderVectorBlock,
  serializeVectorDocument,
} from "../scripts/coding-problem-test-vectors.mjs";

const fixtureRoot = path.join(tmpdir(), `swift-catalog-coverage-${process.pid}`);
const catalogDir = path.join(fixtureRoot, "arrays-and-hashing");
const vectorRoot = path.join(tmpdir(), `swift-catalog-vectors-${process.pid}`);

const completePage = `---
title: "1. Complete Example"
description: "Synthetic coverage fixture."
---

import PythonRepl from './PythonRepl.astro';
import TypeScriptRepl from './TypeScriptRepl.astro';
import GoRepl from './GoRepl.astro';
import SwiftRepl from './SwiftRepl.astro';
import practiceCode from './001-complete.py?raw';
import practiceCodeTs from './001-complete.ts?raw';
import practiceCodeGo from './001-complete.go?raw';
import practiceCodeSwift from './001-complete.swift?raw';

## Try it yourself

<TabItem label="Python"><PythonRepl code={practiceCode} /></TabItem>
<TabItem label="TypeScript"><TypeScriptRepl code={practiceCodeTs} /></TabItem>
<TabItem label="Go"><GoRepl code={practiceCodeGo} /></TabItem>
<TabItem label="Swift"><SwiftRepl code={practiceCodeSwift} /></TabItem>

## Approach 1: Direct scan

<TabItem label="Python">\n\`\`\`python\nprint('ok')\n\`\`\`\n</TabItem>
<TabItem label="TypeScript">\n\`\`\`typescript\nconsole.log('ok')\n\`\`\`\n</TabItem>
<TabItem label="Go">\n\`\`\`go\npackage main\n\`\`\`\n</TabItem>
<TabItem label="Swift">\n\`\`\`swift\nprint("ok")\n\`\`\`\n</TabItem>
`;

const incompletePage = `---
title: "2. Missing Swift"
description: "Synthetic missing coverage fixture."
---

## Try it yourself

<TabItem label="Python">\n\`\`\`python\nprint('ok')\n\`\`\`\n</TabItem>

## Approach: One pass

<TabItem label="Python">\n\`\`\`python\nprint('ok')\n\`\`\`\n</TabItem>
`;

function completeVectorDocument() {
  return {
    schemaVersion: 1,
    problem: { category: "arrays-and-hashing", slug: "001-complete" },
    contract: {
      parameters: [{ name: "value", codec: "int" }],
      result: { codec: "int", comparison: "equal" },
      mutatedParameters: [],
      invalidInputPolicy: "excluded",
    },
    execution: {
      kind: "function",
      entrypoints: {
        python: { function: "identity" },
        typescript: { function: "identity" },
        go: { function: "identity" },
        swift: { type: "Solution", method: "identity" },
      },
    },
    cases: [
      { id: "positive", classification: "valid", arguments: [1], expected: { kind: "value", value: 1 } },
      { id: "zero", classification: "boundary", arguments: [0], expected: { kind: "value", value: 0 } },
      {
        id: "negative",
        classification: "invalid",
        arguments: [-1],
        expected: { kind: "excluded", reason: "The synthetic contract accepts nonnegative values." },
      },
    ],
  };
}

function validSwiftSource(role, vectorDocument) {
  const implementation = role === "starter"
    ? `        // TODO: Implement\n        fatalError("TODO: Implement")`
    : "        return value";
  return `// LEETCODE_TYPE: Solution

${canonicalTestSupport}

final class Solution {
    func identity(_ value: Int) -> Int {
${implementation}
    }
}

func runTests() {
${renderVectorBlock(vectorDocument, "swift")}
    reportSuccess()
}

runTests()
`;
}

function writeHarness(filePath, language, role, vectorDocument) {
  const harnesses = {
    python: "def _run_tests():\n    assert True\n",
    typescript: "function runTests() { if (!true) throw new Error('fail'); }\n",
    go: "package main\nfunc runTests() {}\nfunc main() { runTests() }\n",
    swift: validSwiftSource(role, vectorDocument),
  };
  writeFileSync(filePath, harnesses[language]);
}

before(() => {
  mkdirSync(catalogDir, { recursive: true });
  const vectorDocument = completeVectorDocument();
  const vectorDir = path.join(vectorRoot, "arrays-and-hashing");
  mkdirSync(vectorDir, { recursive: true });
  writeFileSync(
    path.join(vectorDir, "001-complete.json"),
    serializeVectorDocument(vectorDocument),
  );
  writeFileSync(path.join(catalogDir, "001-complete.mdx"), completePage);
  writeFileSync(path.join(catalogDir, "002-missing-swift.mdx"), incompletePage);

  for (const [language, extension] of Object.entries({
    python: "py",
    typescript: "ts",
    go: "go",
    swift: "swift",
  })) {
    writeHarness(
      path.join(catalogDir, `001-complete.${extension}`),
      language,
      "starter",
      vectorDocument,
    );
    writeHarness(
      path.join(catalogDir, `001-complete-approach1.${extension}`),
      language,
      "approach",
      vectorDocument,
    );
    if (language === "python") {
      writeHarness(
        path.join(catalogDir, `002-missing-swift.${extension}`),
        language,
        "starter",
        vectorDocument,
      );
      writeHarness(
        path.join(catalogDir, `002-missing-swift-approach1.${extension}`),
        language,
        "approach",
        vectorDocument,
      );
    }
  }
});

after(() => {
  rmSync(fixtureRoot, { recursive: true, force: true });
  rmSync(vectorRoot, { recursive: true, force: true });
});

test("recognizes language-specific harness evidence", () => {
  assert.equal(hasTestHarness("python", "assert value == 1"), true);
  assert.equal(hasTestHarness("typescript", "throw new Error('fail')"), true);
  assert.equal(hasTestHarness("go", "func main() {}"), true);
  assert.equal(hasTestHarness("swift", "#expect(value == 1)"), true);
  assert.equal(hasTestHarness("swift", "print(\"looks fine\")"), false);
});

test("parses numbered and unnumbered documented approaches", () => {
  const approaches = collectApproachSections(
    "## Approach: Scan\nbody\n## Approach 2: Hash map\nbody\n## Approach comparison\nbody",
  );
  assert.deepEqual(
    approaches.map(({ number, title }) => ({ number, title })),
    [
      { number: 1, title: "Scan" },
      { number: 2, title: "Hash map" },
    ],
  );
  assert.equal(approaches[1].section.trim(), "body");
});

test("inventories complete and missing Swift coverage", () => {
  const manifest = buildCoverageManifest({ catalogDir: fixtureRoot, vectorRoot });
  assert.equal(manifest.summary.pages, 2);
  assert.equal(manifest.summary.documentedApproaches, 2);
  assert.equal(manifest.summary.swiftReadyPages, 1);
  assert.equal(manifest.summary.swiftReadyApproaches, 1);
  assert.equal(manifest.summary.vectorReadyPages, 1);
  assert.equal(manifest.problems[0].swiftReady, true);
  assert.deepEqual(manifest.problems[0].helperTypes, []);
  assert.equal(manifest.problems[1].approaches[0].number, 1);
  assert.equal(swiftCoverageErrors(manifest).length, 2);
});

test("serializes deterministically", () => {
  const first = serializeManifest(buildCoverageManifest({ catalogDir: fixtureRoot, vectorRoot }));
  const second = serializeManifest(buildCoverageManifest({ catalogDir: fixtureRoot, vectorRoot }));
  assert.equal(first, second);
});
