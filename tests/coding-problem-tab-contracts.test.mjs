import assert from "node:assert/strict";
import test from "node:test";
import { validateCodingProblemTabContracts } from "../src/lib/coding-problem-tab-contracts.mjs";

test("accepts one starter exercise and unique approach language tabs", () => {
  const source = [
    "## Try it yourself",
    "",
    '<PythonRepl code={practiceCode} id="sample-py" />',
    "",
    "## Approach 1: Stack",
    "",
    "<Tabs>",
    '  <TabItem label="Python">',
    '    <PythonRepl code={approach1PyCode} id="sample-approach1-py" />',
    "  </TabItem>",
    '  <TabItem label="TypeScript">',
    '    <TypeScriptRepl code={approach1TsCode} id="sample-approach1-ts" />',
    "  </TabItem>",
    "</Tabs>",
  ].join("\n");

  assert.deepEqual(validateCodingProblemTabContracts(source, "sample.mdx"), []);
});

test("rejects a repeated language tab", () => {
  const source = [
    "<Tabs>",
    '  <TabItem label="Python"></TabItem>',
    '  <TabItem label="Python"></TabItem>',
    "</Tabs>",
  ].join("\n");

  assert.match(validateCodingProblemTabContracts(source)[0], /repeats the Python language tab/);
});

test("rejects duplicate runner IDs", () => {
  const source = [
    '<PythonRepl code={firstCode} id="same-id" />',
    '<TypeScriptRepl code={secondCode} id="same-id" />',
  ].join("\n");

  assert.match(validateCodingProblemTabContracts(source)[0], /runner id "same-id" duplicates line/);
});

test("rejects generic starter code inside a completed approach", () => {
  const source = [
    "## Approach 2: Optimal",
    "",
    '<PythonRepl code={practiceCode} id="sample-approach2-py" />',
  ].join("\n");

  assert.match(validateCodingProblemTabContracts(source)[0], /loads generic starter code/);
});
