import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  canonicalHelperSource,
  canonicalTestSupport,
  swiftFileNameErrors,
  swiftSourceContractErrors,
} from "../scripts/swift-coding-problem-contract.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fixtureRoot = path.join(repoRoot, "tests/fixtures/swift-coding-problem-contract");

function fixture(fileName) {
  return readFileSync(path.join(fixtureRoot, fileName), "utf8");
}

test("accepts the canonical starter and completed approach fixtures", () => {
  assert.deepEqual(
    swiftSourceContractErrors({
      fileName: "704-binary-search.swift",
      source: fixture("704-binary-search.swift"),
      role: "starter",
    }),
    [],
  );
  assert.deepEqual(
    swiftSourceContractErrors({
      fileName: "704-binary-search-approach1.swift",
      source: fixture("704-binary-search-approach1.swift"),
      role: "approach",
    }),
    [],
  );
});

test("keeps starter and approach filenames distinct", () => {
  assert.deepEqual(swiftFileNameErrors("704-binary-search.swift", "starter"), []);
  assert.deepEqual(swiftFileNameErrors("704-binary-search-approach2.swift", "approach"), []);
  assert.equal(swiftFileNameErrors("704-binary-search-approach2.swift", "starter").length, 1);
  assert.equal(swiftFileNameErrors("704-binary-search.swift", "approach").length, 1);
  assert.equal(swiftFileNameErrors("binary-search.swift", "starter").length, 1);
  assert.equal(swiftFileNameErrors("704-binary-search-final.swift", "approach").length, 1);
});

test("rejects a deliberately invalid source without repairing it", () => {
  const invalidSource = `// LEETCODE_TYPE: Missing\nfunc runTests() {}\nrunTests()\n`;
  const errors = swiftSourceContractErrors({
    fileName: "704-binary-search.swift",
    source: invalidSource,
    role: "starter",
  });

  assert.ok(errors.some((error) => error.includes("TestSupport.swift")));
  assert.ok(errors.some((error) => error.includes("report success")));
  assert.ok(errors.some((error) => error.includes("must name a declared")));
  assert.ok(errors.some((error) => error.includes("TODO: Implement")));
});

test("requires exact canonical helper code only when the problem needs it", () => {
  const approach = fixture("704-binary-search-approach1.swift");
  const missingErrors = swiftSourceContractErrors({
    fileName: "704-binary-search-approach1.swift",
    source: approach,
    role: "approach",
    requiredHelpers: ["list-node"],
  });
  assert.ok(missingErrors.some((error) => error.includes("ListNode.swift")));

  const withListNode = approach.replace(
    canonicalTestSupport,
    `${canonicalTestSupport}\n\n${canonicalHelperSource("list-node")}`,
  );
  assert.deepEqual(
    swiftSourceContractErrors({
      fileName: "704-binary-search-approach1.swift",
      source: withListNode,
      role: "approach",
      requiredHelpers: ["list-node"],
    }),
    [],
  );
});

test("defines every helper named by the catalog manifest", () => {
  for (const helperType of [
    "graph-node",
    "heap",
    "interval",
    "list-node",
    "random-list-node",
    "tree-node",
    "trie-node",
  ]) {
    assert.ok(canonicalHelperSource(helperType).length > 40);
  }
});
