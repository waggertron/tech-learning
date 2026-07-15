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
  assert.equal(records.length, 1);
  assert.deepEqual(records[0].errors, []);
  const classifications = new Set(records[0].document.cases.map((testCase) => testCase.classification));
  assert.deepEqual(classifications, new Set(["valid", "boundary", "invalid"]));
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

test("accepts operation-sequence contracts without rendering them as function calls", () => {
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
      arguments: [[{ operation: "push", arguments: [2] }, { operation: "getMin", arguments: [] }]],
      expected: { kind: "value", value: [null, 2] },
    },
    {
      id: "single-value",
      classification: "boundary",
      arguments: [[{ operation: "push", arguments: [1] }, { operation: "top", arguments: [] }]],
      expected: { kind: "value", value: [null, 1] },
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
  assert.throws(() => renderVectorBlock(operations, "swift"), /not implemented/);
});

test("committed proof fixtures match all four generated sources", () => {
  const document = binarySearchVector();
  const records = proofFixtureRecords(document);
  assert.equal(records.length, 4);
  for (const record of records) {
    assert.equal(readFileSync(record.outputPath, "utf8"), record.source);
  }
});

test("refuses an array proof until every language has structural comparison support", () => {
  const document = binarySearchVector();
  const arrayResult = clone(document);
  arrayResult.contract.result = { codec: "int-array", comparison: "equal" };
  arrayResult.cases = arrayResult.cases.map((testCase) => testCase.expected.kind === "value"
    ? { ...testCase, expected: { kind: "value", value: [testCase.expected.value] } }
    : testCase);
  assert.deepEqual(vectorDocumentErrors(arrayResult), []);
  assert.throws(() => renderVectorBlock(arrayResult, "typescript"), /scalar result codec/);
});
