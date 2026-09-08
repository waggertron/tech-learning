import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { factors, topicDirectory } from "../scripts/twelve-factor-example-sources.mjs";
import {
  validateDiscoveryDocuments,
  validateTopicDocuments,
} from "../scripts/validate-twelve-factor-topic.mjs";

const hub = await readFile(`${topicDirectory}/index.mdx`, "utf8");
const pages = new Map(
  await Promise.all(
    [...new Set(factors.map((factor) => factor.page))].map(async (page) => [
      page,
      await readFile(`${topicDirectory}/${page}`, "utf8"),
    ]),
  ),
);
const discoveryDocuments = {
  hub,
  opsIndex: await readFile("src/content/docs/topics/ops/index.md", "utf8"),
  topicsIndex: await readFile("src/content/docs/topics/index.mdx", "utf8"),
  secrets: await readFile("src/content/docs/topics/ops/secrets-keys-tokens.md", "utf8"),
  docker: await readFile("src/content/docs/topics/ops/docker/index.md", "utf8"),
  kubernetes: await readFile("src/content/docs/topics/ops/kubernetes/index.md", "utf8"),
};

function mutatedPages(pageName, from, to) {
  const copy = new Map(pages);
  copy.set(pageName, copy.get(pageName).replace(from, to));
  return copy;
}

test("accepts the complete Twelve-Factor topic contract", () => {
  assert.deepEqual(validateTopicDocuments(hub, pages), []);
  assert.deepEqual(validateDiscoveryDocuments(discoveryDocuments), []);
});

test("rejects a mismatched hub factor heading", () => {
  const failures = validateTopicDocuments(hub.replace("## Factor I: Codebase", "## Factor I: Source tree"), pages);
  assert(failures.some((failure) => failure.includes("Hub must contain one Factor I: Codebase heading")));
});

test("rejects a mismatched example heading", () => {
  const changed = mutatedPages("examples-factors-01-04.mdx", "## Factor II: Dependencies", "## Factor II: Packages");
  assert(validateTopicDocuments(hub, changed).some((failure) => failure.includes("must contain one Factor II: Dependencies heading")));
});

test("rejects a mismatched scan-table label", () => {
  const changedHub = hub.replace("[Factor III: Config](#factor-iii-config)", "[Factor III: Configuration](#factor-iii-config)");
  assert(validateTopicDocuments(changedHub, pages).some((failure) => failure.includes("scan table must link Factor III: Config")));
});

test("rejects a mismatched audit mapping", () => {
  const changedHub = hub.replace("| Factor IV: Backing services |", "| Factor IV: Resources |");
  assert(validateTopicDocuments(changedHub, pages).some((failure) => failure.includes("Audit table must map Factor IV: Backing services")));
});

test("rejects a missing language tab and source evidence", () => {
  const changed = mutatedPages("examples-factors-05-08.mdx", '<TabItem label="Go">', '<TabItem label="Golang">');
  const failures = validateTopicDocuments(hub, changed);
  assert(failures.some((failure) => failure.includes("Factor V: Build, release, run is missing its Go tab")));
});

test("rejects a hub example link that hides the canonical factor title", () => {
  const changedHub = hub.replace(
    "See Factor I: Codebase examples in TypeScript, Python, and Go",
    "Compare the process layouts",
  );
  assert(
    validateTopicDocuments(changedHub, pages).some((failure) =>
      failure.includes("Hub example link must preserve Factor I: Codebase"),
    ),
  );
});

test("rejects a missing Operations discovery link", () => {
  const changed = {
    ...discoveryDocuments,
    opsIndex: discoveryDocuments.opsIndex.replace(
      "[Twelve-Factor Apps](./twelve-factor-app/)",
      "Twelve-Factor Apps",
    ),
  };
  assert(
    validateDiscoveryDocuments(changed).some((failure) =>
      failure.includes("Operations index is missing"),
    ),
  );
});
