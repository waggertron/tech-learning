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
  assert.equal(records.length, 34);
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
