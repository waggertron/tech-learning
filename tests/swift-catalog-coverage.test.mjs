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

const fixtureRoot = path.join(tmpdir(), `swift-catalog-coverage-${process.pid}`);
const catalogDir = path.join(fixtureRoot, "arrays-and-hashing");

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

function validSwiftSource(role) {
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
    expectEqual(Solution().identity(1), 1)
    reportSuccess()
}

runTests()
`;
}

function writeHarness(filePath, language, role) {
  const harnesses = {
    python: "def _run_tests():\n    assert True\n",
    typescript: "function runTests() { if (!true) throw new Error('fail'); }\n",
    go: "package main\nfunc runTests() {}\nfunc main() { runTests() }\n",
    swift: validSwiftSource(role),
  };
  writeFileSync(filePath, harnesses[language]);
}

before(() => {
  mkdirSync(catalogDir, { recursive: true });
  writeFileSync(path.join(catalogDir, "001-complete.mdx"), completePage);
  writeFileSync(path.join(catalogDir, "002-missing-swift.mdx"), incompletePage);

  for (const [language, extension] of Object.entries({
    python: "py",
    typescript: "ts",
    go: "go",
    swift: "swift",
  })) {
    writeHarness(path.join(catalogDir, `001-complete.${extension}`), language, "starter");
    writeHarness(
      path.join(catalogDir, `001-complete-approach1.${extension}`),
      language,
      "approach",
    );
    if (language === "python") {
      writeHarness(path.join(catalogDir, `002-missing-swift.${extension}`), language, "starter");
      writeHarness(
        path.join(catalogDir, `002-missing-swift-approach1.${extension}`),
        language,
        "approach",
      );
    }
  }
});

after(() => {
  rmSync(fixtureRoot, { recursive: true, force: true });
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
  const manifest = buildCoverageManifest({ catalogDir: fixtureRoot });
  assert.equal(manifest.summary.pages, 2);
  assert.equal(manifest.summary.documentedApproaches, 2);
  assert.equal(manifest.summary.swiftReadyPages, 1);
  assert.equal(manifest.summary.swiftReadyApproaches, 1);
  assert.equal(manifest.problems[0].swiftReady, true);
  assert.deepEqual(manifest.problems[0].helperTypes, []);
  assert.equal(manifest.problems[1].approaches[0].number, 1);
  assert.equal(swiftCoverageErrors(manifest).length, 2);
});

test("serializes deterministically", () => {
  const first = serializeManifest(buildCoverageManifest({ catalogDir: fixtureRoot }));
  const second = serializeManifest(buildCoverageManifest({ catalogDir: fixtureRoot }));
  assert.equal(first, second);
});
