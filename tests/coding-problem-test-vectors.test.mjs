import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  loadProblemVector,
  loadVectorDocuments,
  proofFixtureRecords,
  renderVectorBlock,
  vectorDigest,
  vectorDocumentErrors,
  vectorLanguages,
} from "../scripts/coding-problem-test-vectors.mjs";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function binarySearchVector() {
  return loadProblemVector({ category: "binary-search", slug: "704-binary-search" }).document;
}

test("loads the canonical registry with valid, boundary, and invalid cases", () => {
  const records = loadVectorDocuments();
  assert.equal(records.length, 162);
  for (const record of records) {
    assert.deepEqual(record.errors, []);
    const classifications = new Set(record.document.cases.map((testCase) => testCase.classification));
    assert.deepEqual(classifications, new Set(["valid", "boundary", "invalid"]));
  }
});

test("rejects unknown normalization fields instead of repairing them", () => {
  const document = binarySearchVector();
  const invalid = clone(document);
  invalid.cases[6].normalizedArguments = [[4], 4];
  const errors = vectorDocumentErrors(invalid);
  assert.ok(errors.some((error) => error.includes("normalizedArguments")));
});

test("keeps excluded invalid inputs outside every executable harness", () => {
  const document = binarySearchVector();
  const before = JSON.stringify(document);
  const invalidCases = document.cases.filter((testCase) => testCase.classification === "invalid");

  for (const language of vectorLanguages) {
    const block = renderVectorBlock(document, language);
    for (const testCase of invalidCases) {
      const matchingLines = block.split("\n").filter((line) => line.includes(testCase.id));
      assert.equal(matchingLines.length, 1);
      assert.ok(matchingLines[0].includes(
        `EXCLUDED_VECTOR ${testCase.id}: ${JSON.stringify(testCase.arguments)}`,
      ));
    }
    assert.ok(block.includes(vectorDigest(document)));
  }
  assert.equal(JSON.stringify(document), before);
});

test("requires solution-handled invalid inputs to declare behavior", () => {
  const document = binarySearchVector();
  const invalid = clone(document);
  invalid.contract.invalidInputPolicy = "solution-handled";
  const errors = vectorDocumentErrors(invalid);
  assert.ok(errors.some((error) => error.includes("solution-owned behavior")));
});

test("renders operation-sequence contracts without flattening state", () => {
  const document = binarySearchVector();
  const operations = clone(document);
  operations.problem = { category: "stack", slug: "155-min-stack" };
  operations.contract.parameters = [{ name: "operations", codec: "operation-sequence" }];
  operations.contract.result = { codec: "operation-results", comparison: "operation-results" };
  operations.execution = {
    kind: "operation-sequence",
    entrypoints: Object.fromEntries(vectorLanguages.map((language) => [language, { type: "MinStack" }])),
  };
  operations.cases = [
    {
      id: "push-and-minimum",
      classification: "valid",
      arguments: [[
        { operation: "init", arguments: [] },
        { operation: "push", arguments: [2] },
        { operation: "getMin", arguments: [] },
      ]],
      expected: { kind: "value", value: [null, null, 2] },
    },
    {
      id: "single-value",
      classification: "boundary",
      arguments: [[
        { operation: "init", arguments: [] },
        { operation: "push", arguments: [1] },
        { operation: "top", arguments: [] },
      ]],
      expected: { kind: "value", value: [null, null, 1] },
    },
    {
      id: "pop-empty-stack",
      classification: "invalid",
      arguments: [[{ operation: "pop", arguments: [] }]],
      expected: { kind: "excluded", reason: "The problem contract calls pop only on non-empty stacks." },
    },
  ];
  delete operations.proofFixture;

  assert.deepEqual(vectorDocumentErrors(operations), []);
  const swift = renderVectorBlock(operations, "swift");
  assert.match(swift, /let subject1 = MinStack\(\)/);
  assert.match(swift, /subject1\.push\(2\)/);
  assert.match(swift, /expectEqual\(subject1\.getMin\(\), 2, "push-and-minimum\[2\]"\)/);

  const go = renderVectorBlock(operations, "go");
  assert.match(go, /subject1 := NewMinStack\(\)/);
  assert.match(go, /subject1\.Push\(2\)/);
});

test("renders stateful constructors and collection operation results", () => {
  const operations = binarySearchVector();
  operations.problem = { category: "heap-priority-queue", slug: "703-kth-largest-element-in-a-stream" };
  operations.contract.parameters = [{ name: "operations", codec: "operation-sequence" }];
  operations.contract.result = { codec: "operation-results", comparison: "operation-results" };
  operations.execution = {
    kind: "operation-sequence",
    entrypoints: Object.fromEntries(vectorLanguages.map((language) => [language, { type: "KthLargest" }])),
  };
  operations.cases = [
    {
      id: "seeded-stream",
      classification: "valid",
      arguments: [[
        { operation: "init", arguments: [3, [4, 5, 8, 2]] },
        { operation: "snapshot", arguments: [] },
      ]],
      expected: { kind: "value", value: [null, [4, 5, 8]] },
    },
    {
      id: "empty-seed",
      classification: "boundary",
      arguments: [[
        { operation: "init", arguments: [1, []] },
        { operation: "snapshot", arguments: [] },
      ]],
      expected: { kind: "value", value: [null, []] },
    },
    {
      id: "missing-init",
      classification: "invalid",
      arguments: [[{ operation: "snapshot", arguments: [] }]],
      expected: { kind: "excluded", reason: "Executable sequences require construction first." },
    },
  ];
  delete operations.proofFixture;

  assert.deepEqual(vectorDocumentErrors(operations), []);
  assert.match(
    renderVectorBlock(operations, "swift"),
    /let subject1 = KthLargest\(3, \[4, 5, 8, 2\]\)/,
  );
  assert.match(
    renderVectorBlock(operations, "typescript"),
    /JSON\.stringify\(subject1\.snapshot\(\)\) === JSON\.stringify\(\[4, 5, 8\]\)/,
  );
  assert.match(
    renderVectorBlock(operations, "go"),
    /subject1 := NewKthLargest\(3, \[\]int\{4, 5, 8, 2\}\)/,
  );
});

test("committed proof fixtures match all four generated sources", () => {
  const documents = loadVectorDocuments()
    .map((record) => record.document)
    .filter((document) => document.proofFixture);
  assert.equal(documents.length, 3);
  for (const document of documents) {
    const records = proofFixtureRecords(document);
    assert.equal(records.length, 4);
    for (const record of records) {
      assert.equal(readFileSync(record.outputPath, "utf8"), record.source);
    }
  }
});

test("renders ordered array equality in every language", () => {
  const document = binarySearchVector();
  const arrayResult = clone(document);
  arrayResult.contract.result = { codec: "int-array", comparison: "equal" };
  arrayResult.cases = arrayResult.cases.map((testCase) => testCase.expected.kind === "value"
    ? { ...testCase, expected: { kind: "value", value: [testCase.expected.value] } }
    : testCase);
  assert.deepEqual(vectorDocumentErrors(arrayResult), []);
  assert.match(renderVectorBlock(arrayResult, "python"), /search\(\[-1, 0, 3, 5, 9, 12\], 9\) == \[4\]/);
  assert.match(renderVectorBlock(arrayResult, "typescript"), /JSON\.stringify\(search\(/);
  assert.match(renderVectorBlock(arrayResult, "go"), /func\(actual, expected \[\]int\) bool/);
  assert.match(renderVectorBlock(arrayResult, "swift"), /expectEqual\(Solution\(\)\.search\(/);
});

test("renders scale-aware approximate floating point assertions in every language", () => {
  const document = clone(binarySearchVector());
  document.contract.parameters = [
    { name: "x", codec: "float" },
    { name: "n", codec: "int" },
  ];
  document.contract.result = { codec: "float", comparison: "approximate" };
  document.execution.entrypoints = {
    python: { function: "my_pow" },
    typescript: { function: "myPow" },
    go: { function: "myPow" },
    swift: { type: "Solution", method: "myPow" },
  };
  document.cases = [
    {
      id: "negative-exponent",
      classification: "valid",
      arguments: [2, -2],
      expected: { kind: "value", value: 0.25 },
    },
    {
      id: "zero-exponent",
      classification: "boundary",
      arguments: [2, 0],
      expected: { kind: "value", value: 1 },
    },
    {
      id: "zero-negative-exponent",
      classification: "invalid",
      arguments: [0, -1],
      expected: { kind: "excluded", reason: "The result is undefined." },
    },
  ];
  delete document.proofFixture;

  assert.deepEqual(vectorDocumentErrors(document), []);
  assert.match(
    renderVectorBlock(document, "python"),
    /abs\(my_pow\(2, -2\) - 0\.25\) <= 1e-9 \* max\(1\.0, abs\(0\.25\)\)/,
  );
  assert.match(
    renderVectorBlock(document, "typescript"),
    /Math\.abs\(myPow\(2, -2\) - 0\.25\) <= 1e-9 \* Math\.max\(1, Math\.abs\(0\.25\)\)/,
  );
  assert.match(
    renderVectorBlock(document, "go"),
    /math\.Abs\(myPow\(2, -2\) - 0\.25\) <= 1e-9 \* math\.Max\(1, math\.Abs\(0\.25\)\)/,
  );
  assert.match(
    renderVectorBlock(document, "swift"),
    /expectTrue\(abs\(Solution\(\)\.myPow\(2, -2\) - 0\.25\) <= 1e-9 \* max\(1\.0, abs\(0\.25\)\), "negative-exponent"\)/,
  );
});

test("renders floating point array inputs in every language", () => {
  const document = clone(binarySearchVector());
  document.contract.parameters = [{ name: "weights", codec: "float-array" }];
  document.contract.result = { codec: "float", comparison: "approximate" };
  document.execution.entrypoints = {
    python: { function: "best_weight" },
    typescript: { function: "bestWeight" },
    go: { function: "bestWeight" },
    swift: { type: "Solution", method: "bestWeight" },
  };
  document.cases = [{
    id: "fractional-weights",
    classification: "valid",
    arguments: [[0.5, 0.25]],
    expected: { kind: "value", value: 0.5 },
  }];

  assert.match(renderVectorBlock(document, "python"), /best_weight\(\[0.5, 0.25\]\)/);
  assert.match(renderVectorBlock(document, "typescript"), /bestWeight\(\[0.5, 0.25\]\)/);
  assert.match(renderVectorBlock(document, "go"), /bestWeight\(\[\]float64\{0.5, 0.25\}\)/);
  assert.match(renderVectorBlock(document, "swift"), /bestWeight\(\[0.5, 0.25\]\)/);
});

test("renders Swift inout mutation observations", () => {
  const document = clone(binarySearchVector());
  document.contract.parameters = [{ name: "board", codec: "string-matrix" }];
  document.contract.result = { codec: "string-matrix", comparison: "mutated-arguments" };
  document.contract.mutatedParameters = ["board"];
  document.contract.invalidInputPolicy = "solution-handled";
  document.execution.entrypoints.swift = { type: "Solution", method: "solve" };
  document.cases = [
    {
      id: "captures-region",
      classification: "valid",
      arguments: [[["X", "X"], ["X", "O"]]],
      expected: { kind: "value", value: [["X", "X"], ["X", "O"]] },
    },
    {
      id: "single-cell",
      classification: "boundary",
      arguments: [[["O"]]],
      expected: { kind: "value", value: [["O"]] },
    },
    {
      id: "empty-board",
      classification: "invalid",
      arguments: [[]],
      expected: { kind: "value", value: [] },
    },
  ];

  assert.deepEqual(vectorDocumentErrors(document), []);
  const block = renderVectorBlock(document, "swift");
  assert.match(block, /var argument1: \[\[Character\]\] = \[\["X", "X"\], \["X", "O"\]\]/);
  assert.match(block, /Solution\(\)\.solve\(&argument1\)/);
  assert.match(block, /expectEqual\(argument1, \[\["X", "X"\], \["X", "O"\]\], "captures-region"\)/);
});

test("renders Swift graph structure and identity observations", () => {
  const document = clone(binarySearchVector());
  document.contract.parameters = [{ name: "node", codec: "graph-adjacency" }];
  document.contract.result = { codec: "graph-adjacency", comparison: "structure" };
  document.contract.mutatedParameters = [];
  document.contract.invalidInputPolicy = "excluded";
  document.execution.entrypoints.swift = { type: "Solution", method: "cloneGraph" };
  document.cases = [
    {
      id: "two-node-cycle",
      classification: "valid",
      arguments: [[[2], [1]]],
      expected: { kind: "value", value: [[2], [1]] },
    },
    {
      id: "empty-graph",
      classification: "boundary",
      arguments: [[]],
      expected: { kind: "value", value: [] },
    },
    {
      id: "invalid-neighbor",
      classification: "invalid",
      arguments: [[[2]]],
      expected: { kind: "excluded", reason: "Neighbor labels must name existing nodes." },
    },
  ];

  assert.deepEqual(vectorDocumentErrors(document), []);
  const block = renderVectorBlock(document, "swift");
  assert.match(block, /let original1 = makeGraph\(\[\[2\], \[1\]\]\)/);
  assert.match(block, /expectTrue\(isValidClone\(original1, Solution\(\)\.cloneGraph\(original1\), \[\[2\], \[1\]\]\), "two-node-cycle"\)/);
});

test("renders linked-list inputs, outputs, and mutation observations", () => {
  const document = clone(binarySearchVector());
  document.contract.parameters = [{ name: "head", codec: "list-node" }];
  document.contract.result = { codec: "list-node", comparison: "equal" };
  document.contract.mutatedParameters = [];
  document.execution.entrypoints.swift = { type: "Solution", method: "reverseList" };
  document.cases = [
    {
      id: "three-nodes",
      classification: "valid",
      arguments: [[1, 2, 3]],
      expected: { kind: "value", value: [3, 2, 1] },
    },
    {
      id: "empty-list",
      classification: "boundary",
      arguments: [[]],
      expected: { kind: "value", value: [] },
    },
    {
      id: "value-out-of-range",
      classification: "invalid",
      arguments: [[501]],
      expected: { kind: "excluded", reason: "Node values stay within the published range." },
    },
  ];

  assert.deepEqual(vectorDocumentErrors(document), []);
  const block = renderVectorBlock(document, "swift");
  assert.match(block, /let argument1Case1 = makeList\(\[1, 2, 3\]\)/);
  assert.match(block, /expectEqual\(listValues\(Solution\(\)\.reverseList\(argument1Case1\)\), \[3, 2, 1\], "three-nodes"\)/);

  document.contract.result.comparison = "mutated-arguments";
  document.contract.mutatedParameters = ["head"];
  document.execution.entrypoints.swift.method = "reorderList";
  const mutationBlock = renderVectorBlock(document, "swift");
  assert.match(mutationBlock, /let argument1 = makeList\(\[1, 2, 3\]\)/);
  assert.match(mutationBlock, /Solution\(\)\.reorderList\(argument1\)/);
  assert.match(mutationBlock, /expectEqual\(listValues\(argument1\), \[3, 2, 1\], "three-nodes"\)/);
});

test("renders cyclic linked-list construction without normalizing the cycle position", () => {
  const document = clone(binarySearchVector());
  document.contract.parameters = [{ name: "head", codec: "cyclic-list" }];
  document.contract.result = { codec: "boolean", comparison: "equal" };
  document.contract.mutatedParameters = [];
  document.execution.entrypoints.swift = { type: "Solution", method: "hasCycle" };
  document.cases = [
    {
      id: "cycle-to-middle",
      classification: "valid",
      arguments: [{ values: [3, 2, 0, -4], pos: 1 }],
      expected: { kind: "value", value: true },
    },
    {
      id: "single-node",
      classification: "boundary",
      arguments: [{ values: [1], pos: -1 }],
      expected: { kind: "value", value: false },
    },
    {
      id: "position-out-of-range",
      classification: "invalid",
      arguments: [{ values: [1], pos: 1 }],
      expected: { kind: "excluded", reason: "The cycle position must name an existing node." },
    },
  ];

  assert.deepEqual(vectorDocumentErrors(document), []);
  const block = renderVectorBlock(document, "swift");
  assert.match(block, /let cycle1 = makeCyclicList\(\[3, 2, 0, -4\], 1\)/);
  assert.match(block, /expectEqual\(Solution\(\)\.hasCycle\(cycle1\), true, "cycle-to-middle"\)/);
  assert.match(block, /EXCLUDED_VECTOR position-out-of-range/);
});

test("renders intersecting lists with an identity assertion", () => {
  const document = clone(binarySearchVector());
  document.contract.parameters = [{ name: "lists", codec: "intersecting-lists" }];
  document.contract.result = { codec: "list-node", comparison: "identity" };
  document.contract.mutatedParameters = [];
  document.execution.entrypoints.swift = { type: "Solution", method: "getIntersectionNode" };
  document.cases = [
    {
      id: "shared-tail",
      classification: "valid",
      arguments: [{ prefixA: [4, 1], prefixB: [5, 6, 1], shared: [8, 4, 5] }],
      expected: { kind: "value", value: [8, 4, 5] },
    },
    {
      id: "no-intersection",
      classification: "boundary",
      arguments: [{ prefixA: [1], prefixB: [2], shared: [] }],
      expected: { kind: "value", value: [] },
    },
    {
      id: "empty-first-list",
      classification: "invalid",
      arguments: [{ prefixA: [], prefixB: [2], shared: [] }],
      expected: { kind: "excluded", reason: "Both published input lists are non-empty." },
    },
  ];

  assert.deepEqual(vectorDocumentErrors(document), []);
  const block = renderVectorBlock(document, "swift");
  assert.match(block, /let intersection1 = makeIntersectingLists\(\[4, 1\], \[5, 6, 1\], \[8, 4, 5\]\)/);
  assert.match(block, /expectEqual\(listValues\(intersection1\.sharedHead\), \[8, 4, 5\], "shared-tail-shape"\)/);
  assert.match(block, /expectTrue\(sameNode\(Solution\(\)\.getIntersectionNode\(intersection1\.headA, intersection1\.headB\), intersection1\.sharedHead\), "shared-tail"\)/);
});

test("renders random-pointer list structure and deep-copy observations", () => {
  const document = clone(binarySearchVector());
  document.contract.parameters = [{ name: "head", codec: "random-list" }];
  document.contract.result = { codec: "random-list", comparison: "structure" };
  document.contract.mutatedParameters = [];
  document.execution.entrypoints.swift = { type: "Solution", method: "copyRandomList" };
  document.cases = [
    {
      id: "cross-links",
      classification: "valid",
      arguments: [[
        { value: 7, randomIndex: null },
        { value: 13, randomIndex: 0 },
      ]],
      expected: { kind: "value", value: [
        { value: 7, randomIndex: null },
        { value: 13, randomIndex: 0 },
      ] },
    },
    {
      id: "empty-list",
      classification: "boundary",
      arguments: [[]],
      expected: { kind: "value", value: [] },
    },
    {
      id: "random-index-out-of-range",
      classification: "invalid",
      arguments: [[{ value: 1, randomIndex: 1 }]],
      expected: { kind: "excluded", reason: "Random indexes must name an existing node." },
    },
  ];

  assert.deepEqual(vectorDocumentErrors(document), []);
  const block = renderVectorBlock(document, "swift");
  assert.match(block, /let original1 = makeRandomList\(\[RandomListEntry\(value: 7, randomIndex: nil\), RandomListEntry\(value: 13, randomIndex: 0\)\]\)/);
  assert.match(block, /expectTrue\(isValidRandomListClone\(original1, Solution\(\)\.copyRandomList\(original1\),/);
});

test("renders Swift level-order tree construction and observation", () => {
  const document = clone(binarySearchVector());
  document.contract.parameters = [{ name: "root", codec: "tree-level-order" }];
  document.contract.result = { codec: "tree-level-order", comparison: "equal" };
  document.contract.mutatedParameters = [];
  document.execution.entrypoints.swift = { type: "Solution", method: "invertTree" };
  document.cases = [
    {
      id: "full-tree",
      classification: "valid",
      arguments: [[4, 2, 7, 1, 3, 6, 9]],
      expected: { kind: "value", value: [4, 7, 2, 9, 6, 3, 1] },
    },
    {
      id: "empty-tree",
      classification: "boundary",
      arguments: [[]],
      expected: { kind: "value", value: [] },
    },
    {
      id: "orphaned-node",
      classification: "invalid",
      arguments: [[1, null, null, 2]],
      expected: { kind: "excluded", reason: "Level-order values must not follow a closed frontier." },
    },
  ];

  assert.deepEqual(vectorDocumentErrors(document), []);
  const block = renderVectorBlock(document, "swift");
  assert.match(block, /let treeArgument1Case1 = makeTree\(\[4, 2, 7, 1, 3, 6, 9\]\)/);
  assert.match(block, /expectEqual\(treeValues\(Solution\(\)\.invertTree\(treeArgument1Case1\)\), \[4, 7, 2, 9, 6, 3, 1\], "full-tree"\)/);
});

test("renders Swift tree node references with identity comparison", () => {
  const document = clone(binarySearchVector());
  document.contract.parameters = [
    { name: "root", codec: "tree-level-order" },
    { name: "p", codec: "tree-node-value" },
    { name: "q", codec: "tree-node-value" },
  ];
  document.contract.result = { codec: "tree-node-value", comparison: "identity" };
  document.contract.mutatedParameters = [];
  document.execution.entrypoints.swift = { type: "Solution", method: "lowestCommonAncestor" };
  document.cases = [
    {
      id: "root-split",
      classification: "valid",
      arguments: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 8],
      expected: { kind: "value", value: 6 },
    },
    {
      id: "ancestor-input",
      classification: "boundary",
      arguments: [[2, 1], 2, 1],
      expected: { kind: "value", value: 2 },
    },
    {
      id: "missing-reference",
      classification: "invalid",
      arguments: [[2, 1, 3], 1, 4],
      expected: { kind: "excluded", reason: "Both node references must exist in the tree." },
    },
  ];

  assert.deepEqual(vectorDocumentErrors(document), []);
  const block = renderVectorBlock(document, "swift");
  assert.match(block, /let treeNodeArgument2Case1 = findTreeNode\(treeArgument1Case1, 2\)/);
  assert.match(block, /let expectedTreeNodeCase1 = findTreeNode\(treeArgument1Case1, 6\)/);
  assert.match(block, /expectTrue\(sameTreeNode\(Solution\(\)\.lowestCommonAncestor\(treeArgument1Case1, treeNodeArgument2Case1, treeNodeArgument3Case1\), expectedTreeNodeCase1\), "root-split"\)/);
});
