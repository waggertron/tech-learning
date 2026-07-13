import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = "src/content/docs";

const bannedPatterns = [
  {
    label: "internal post-series plan title",
    pattern: /\bpost series plan\b/i,
  },
  {
    label: "working-plan framing",
    pattern: /\bworking plan\b/i,
  },
  {
    label: "planned reading-order scaffold",
    pattern: /\bplanned reading order\b/i,
  },
  {
    label: "series planning fields",
    pattern: /\b(?:Code anchor|Wrong first move|Follow-up path)\b/,
  },
  {
    label: "evergreen topic TODO heading",
    pattern: /\bEvergreen topic page plan\b/i,
  },
  {
    label: "deferred page instruction",
    pattern: /\b(?:After the series plan is reviewed|That page should include:)\b/i,
  },
];

const sourceAliases = [
  {
    label: "Martin Fowler",
    pattern: /\b(?:Martin\s+)?Fowler(?:'s)?\b/i,
  },
];

function listMarkdownFiles(dir) {
  const entries = readdirSync(dir).sort();
  const files = [];

  for (const entry of entries) {
    const path = join(dir, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      files.push(...listMarkdownFiles(path));
    } else if (entry.endsWith(".md") || entry.endsWith(".mdx")) {
      files.push(path);
    }
  }

  return files;
}

function stripFencedCode(content) {
  return content.replace(/```[\s\S]*?```/g, "");
}

function findPlanningLeaks(path, content) {
  const findings = [];
  const lines = stripFencedCode(content).split("\n");

  lines.forEach((line, index) => {
    for (const check of bannedPatterns) {
      if (check.pattern.test(line)) {
        findings.push({
          path,
          line: index + 1,
          label: check.label,
          text: line.trim(),
        });
      }
    }
  });

  return findings;
}

function findRepeatedSourceBullets(path, content) {
  const findings = [];
  const lines = stripFencedCode(content).split("\n");

  for (let index = 0; index < lines.length; index += 1) {
    const heading = lines[index];
    if (!/^##\s+.*sources/i.test(heading)) continue;

    const sectionLines = [];
    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      if (/^##\s+/.test(lines[cursor])) break;
      sectionLines.push({ lineNumber: cursor + 1, text: lines[cursor] });
    }

    for (const source of sourceAliases) {
      const bulletLines = sectionLines.filter(
        ({ text }) => /^\s*-\s+/.test(text) && source.pattern.test(text),
      );

      if (bulletLines.length > 2) {
        findings.push({
          path,
          line: bulletLines[0].lineNumber,
          label: "repeated source bullets",
          text: `${bulletLines.length} separate ${source.label} bullets in one sources section`,
        });
      }
    }
  }

  return findings;
}

const findings = [];

for (const path of listMarkdownFiles(root)) {
  const content = readFileSync(path, "utf8");
  findings.push(...findPlanningLeaks(path, content));
  findings.push(...findRepeatedSourceBullets(path, content));
}

if (findings.length > 0) {
  console.error("Published content review failed:");
  for (const finding of findings) {
    console.error(`${finding.path}:${finding.line}: ${finding.label}: ${finding.text}`);
  }
  console.error("");
  console.error("Move internal planning notes to docs or memory. Consolidate repeated attribution bullets into a stronger grouped source discussion.");
  process.exit(1);
}

console.log("Published content review passed.");
