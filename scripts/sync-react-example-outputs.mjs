import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsDir = path.join(repoRoot, "src/content/docs/posts");
const reactPostFilePattern = /^2026-07-07-react-.+\.md$/;
const codeFencePattern = /```(tsx|typescript)\n([\s\S]*?)\n```/g;
const exampleHeadingPattern = /^## Example: (.+)$/gm;
const existingOutputPattern =
  /^\n*<div class="react-example-output\b[\s\S]*?\n  <\/div>\n<\/div>\n*/;

const checkOnly = process.argv.includes("--check");

function htmlEscape(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function unique(values) {
  return [...new Set(values)].filter(Boolean);
}

function sentence(value) {
  return value.replace(/\s+/g, " ").trim().replace(/\u2014/g, ",");
}

function humanList(values) {
  if (values.length === 0) return "";
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
}

function collectFunctionNames(code) {
  const patterns = [
    /export default function\s+([A-Z_a-z]\w*)/g,
    /export function\s+([A-Z_a-z]\w*)/g,
    /function\s+([A-Z_a-z]\w*)/g,
    /export const\s+([A-Z_a-z]\w*)/g,
    /const\s+([A-Z_a-z]\w*)\s*(?::[^=]+)?=/g,
  ];

  return unique(
    patterns.flatMap((pattern) => [...code.matchAll(pattern)].map((match) => match[1])),
  );
}

function collectJsxTags(code) {
  const tagMatches = [...code.matchAll(/(?<![\w.])<\/?([A-Za-z][A-Za-z0-9.]*)\b/g)];
  const tagNames = tagMatches.map((match) => match[1]).filter((tag) => tag !== "T");
  return unique(tagNames);
}

function collectVisibleText(code) {
  return unique(
    [...code.matchAll(/>([^<>{}\n]+)</g)]
      .map((match) => sentence(match[1]))
      .filter((text) => /[A-Za-z0-9]/.test(text))
      .filter((text) => text.length > 1)
      .slice(0, 4),
  );
}

function collectCalls(code) {
  const ignored = new Set([
    "Array",
    "Date",
    "Promise",
    "String",
    "Number",
    "Boolean",
    "return",
    "if",
    "for",
    "while",
    "switch",
    "catch",
    "function",
    "map",
    "filter",
    "reduce",
    "then",
    "catch",
  ]);

  return unique(
    [...code.matchAll(/\b([A-Za-z_]\w*)\(/g)]
      .map((match) => match[1])
      .filter((name) => !ignored.has(name))
      .filter((name) => !/^[A-Z]/.test(name))
      .slice(0, 4),
  );
}

function codeList(values) {
  return values.map((value) => `<code>${htmlEscape(value)}</code>`);
}

function tagList(values) {
  return values.map((value) => `<code>&lt;${htmlEscape(value)}&gt;</code>`);
}

function summarizeOutput(title, code) {
  const functionNames = collectFunctionNames(code);
  const jsxTags = collectJsxTags(code);
  const builtInTags = jsxTags.filter((tag) => /^[a-z]/.test(tag)).slice(0, 5);
  const customTags = jsxTags
    .filter((tag) => /^[A-Z]/.test(tag))
    .filter((tag) => tag !== functionNames[0])
    .slice(0, 4);
  const visibleText = collectVisibleText(code);
  const calls = collectCalls(code);
  const primaryName = functionNames[0];
  const subject = primaryName ? `<code>${htmlEscape(primaryName)}</code>` : "The example";
  const details = [];

  if (builtInTags.length > 0 || customTags.length > 0) {
    if (builtInTags.length > 0) {
      details.push(`${subject} renders ${humanList(tagList(builtInTags))} markup.`);
    } else {
      details.push(`${subject} renders ${humanList(codeList(customTags))} components.`);
    }

    if (customTags.length > 0) {
      details.push(`It composes ${humanList(codeList(customTags))}.`);
    }

    if (visibleText.length > 0) {
      details.push(`Visible text can include ${humanList(codeList(visibleText))}.`);
    }
  } else if (/\b(describe|it|test)\(/.test(code) && /\bexpect\(/.test(code)) {
    details.push(
      `${subject} reports a passing test when the rendered behavior matches the assertions.`,
    );
  } else if (/\bsatisfies Meta\b/.test(code) || /\bStoryObj\b/.test(code)) {
    details.push(`${subject} displays the component with the listed Storybook args.`);
  } else if (/\bswitch\s*\(\s*action\.type\s*\)/.test(code)) {
    details.push(`${subject} returns the next state for each action branch.`);
  } else if (/\bdefineConfig\(/.test(code)) {
    details.push(`${subject} produces a build configuration object for the selected tool.`);
  } else if (/["']use server["']/.test(code)) {
    details.push(`${subject} returns server-side mutation state for the caller to render.`);
  } else if (/\b(loader|createFileRoute|createRoute|Route)\b/.test(code)) {
    details.push(`${subject} returns route data and UI for the active navigation state.`);
  } else if (calls.length > 0) {
    details.push(`${subject} runs ${humanList(codeList(calls))} to produce its result.`);
  } else {
    details.push(`${subject} produces the runtime value shown by the example.`);
  }

  return sentence(`<p><strong>${htmlEscape(title)}.</strong> ${details.join(" ")}</p>`);
}

function buildOutputBlock({ id, title, code }) {
  return `<div class="react-example-output not-content" data-react-example-output="${htmlEscape(id)}" role="region" aria-label="Output view: ${htmlEscape(title)}">
  <div class="react-example-output__header">Output view</div>
  <div class="react-example-output__body">
    ${summarizeOutput(title, code)}
  </div>
</div>`;
}

function titleForFence(headings, fenceIndex, fallbackTitle) {
  const heading = headings.filter((headingMatch) => headingMatch.index < fenceIndex).at(-1);
  return heading?.[1]?.trim() ?? fallbackTitle;
}

function syncFile(fileName) {
  const filePath = path.join(postsDir, fileName);
  const original = readFileSync(filePath, "utf8");
  const headings = [...original.matchAll(exampleHeadingPattern)];
  const fences = [...original.matchAll(codeFencePattern)];
  let content = original;

  for (let index = fences.length - 1; index >= 0; index -= 1) {
    const fence = fences[index];
    const title = titleForFence(headings, fence.index, `Code example ${index + 1}`);
    const outputId = `${path.basename(fileName, ".md")}-${index + 1}-${slugify(title)}`;
    const outputBlock = `\n\n${buildOutputBlock({
      id: outputId,
      title,
      code: fence[2],
    })}\n\n`;
    const insertAt = fence.index + fence[0].length;
    const afterFence = content.slice(insertAt);
    const existingOutput = existingOutputPattern.exec(afterFence);
    const leadingBreaksLength = /^\n*/.exec(afterFence)?.[0].length ?? 0;
    const deleteLength = existingOutput?.[0]?.length ?? leadingBreaksLength;

    content = `${content.slice(0, insertAt)}${outputBlock}${content.slice(
      insertAt + deleteLength,
    )}`;
  }

  if (content !== original && !checkOnly) {
    writeFileSync(filePath, content);
  }

  return {
    changed: content !== original,
    examples: fences.length,
    fileName,
  };
}

const results = readdirSync(postsDir)
  .filter((fileName) => reactPostFilePattern.test(fileName))
  .sort()
  .map(syncFile);

const changed = results.filter((result) => result.changed);
const exampleCount = results.reduce((total, result) => total + result.examples, 0);

if (checkOnly && changed.length > 0) {
  console.error(
    `React example output views are out of sync in ${changed.length} file(s): ${changed
      .map((result) => result.fileName)
      .join(", ")}`,
  );
  process.exitCode = 1;
} else {
  console.log(
    `${checkOnly ? "Checked" : "Synced"} ${exampleCount} React example output view(s) across ${
      results.length
    } post(s). ${changed.length} file(s) ${checkOnly ? "would change" : "changed"}.`,
  );
}
