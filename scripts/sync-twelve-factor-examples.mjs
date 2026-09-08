import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import {
  examples,
  topicDirectory,
} from "./twelve-factor-example-sources.mjs";

const checkOnly = process.argv.includes("--check");

function fail(message) {
  throw new Error(message);
}

async function fetchExcerpt(example, cache) {
  if (!cache.has(example.rawUrl)) {
    cache.set(
      example.rawUrl,
      fetch(example.rawUrl).then(async (response) => {
        if (!response.ok) {
          fail(`Could not fetch ${example.rawUrl}: HTTP ${response.status}`);
        }
        return (await response.text()).replaceAll("\r\n", "\n").split("\n");
      }),
    );
  }
  const lines = await cache.get(example.rawUrl);
  if (lines.length < example.endLine) {
    fail(`${example.id} ends at line ${example.endLine}, but its source has ${lines.length} lines`);
  }
  return lines.slice(example.startLine - 1, example.endLine).join("\n");
}

function replaceExample(document, example, excerpt) {
  const heading = `## ${example.heading}`;
  const sectionStart = document.indexOf(heading);
  if (sectionStart === -1) fail(`Missing heading: ${heading}`);
  const nextHeading = document.indexOf("\n## ", sectionStart + heading.length);
  const sectionEnd = nextHeading === -1 ? document.length : nextHeading;
  const section = document.slice(sectionStart, sectionEnd);

  const tabStartText = `<TabItem label="${example.language}">`;
  const tabStart = section.indexOf(tabStartText);
  if (tabStart === -1) fail(`Missing ${example.language} tab under ${example.heading}`);
  const tabEnd = section.indexOf("</TabItem>", tabStart);
  if (tabEnd === -1) fail(`Unclosed ${example.language} tab under ${example.heading}`);

  const tab = section.slice(tabStart, tabEnd);
  const fences = [...tab.matchAll(/```[^\n]*\n[\s\S]*?```/g)];
  if (fences.length === 0) fail(`Missing code block for ${example.id}`);

  const first = fences[0];
  const last = fences.at(-1);
  const before = tab
    .slice(0, first.index)
    .replace(/\n?\{\/\* twelve-factor-source: [^*]+ \*\/\}\n?/g, "\n")
    .replace(/\n?<!-- twelve-factor-source: [^>]+ -->\n?/g, "\n");
  const after = tab
    .slice(last.index + last[0].length)
    .replace(/\n?\[[^\]]+ source\]\([^\n]+\)\n?/g, "\n");
  const generated = [
    `{/* twelve-factor-source: ${example.id} */}`,
    `\`\`\`${example.codeLanguage}`,
    excerpt,
    "```",
    `[${example.heading} ${example.language} source](${example.sourceUrl})`,
  ].join("\n");
  const updatedTab = `${before.trimEnd()}\n\n${generated}\n${after.trimStart()}`;
  const updatedSection = `${section.slice(0, tabStart)}${updatedTab}${section.slice(tabEnd)}`;
  return `${document.slice(0, sectionStart)}${updatedSection}${document.slice(sectionEnd)}`;
}

export async function synchronizeTwelveFactorExamples({ write = false } = {}) {
  const cache = new Map();
  const byPage = Map.groupBy(examples, (example) => example.page);
  const changed = [];

  for (const [page, pageExamples] of byPage) {
    const path = `${topicDirectory}/${page}`;
    const original = await readFile(path, "utf8");
    let updated = original;
    for (const example of pageExamples) {
      updated = replaceExample(updated, example, await fetchExcerpt(example, cache));
    }
    if (updated !== original) {
      changed.push(path);
      if (write) await writeFile(path, updated);
    }
  }

  return changed;
}

async function main() {
  const changed = await synchronizeTwelveFactorExamples({ write: !checkOnly });
  if (checkOnly && changed.length > 0) {
    fail(`Twelve-Factor examples are out of sync:\n${changed.map((path) => `- ${path}`).join("\n")}`);
  }
  console.log(
    checkOnly
      ? `Twelve-Factor snippet sync passed for ${examples.length} tagged examples.`
      : `Synchronized ${examples.length} tagged Twelve-Factor examples.`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
