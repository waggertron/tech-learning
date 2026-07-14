import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { swiftSourceContractErrors } from "./swift-coding-problem-contract.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultCatalogDir = path.join(
  repoRoot,
  "src/content/docs/topics/cs/coding-problems",
);
const defaultManifestPath = path.join(
  repoRoot,
  "docs/data/swift-coding-problem-coverage.json",
);

export const languages = {
  python: {
    extension: "py",
    fenceNames: ["python"],
    label: "Python",
    repl: "PythonRepl",
  },
  typescript: {
    extension: "ts",
    fenceNames: ["typescript", "ts"],
    label: "TypeScript",
    repl: "TypeScriptRepl",
  },
  go: {
    extension: "go",
    fenceNames: ["go"],
    label: "Go",
    repl: "GoRepl",
  },
  swift: {
    extension: "swift",
    fenceNames: ["swift"],
    label: "Swift",
    repl: "SwiftRepl",
  },
};

const helperPatterns = [
  ["list-node", /\bListNode\b/],
  ["tree-node", /\bTreeNode\b/],
  ["trie-node", /\bTrieNode\b/],
  ["graph-node", /\bGraphNode\b/],
  ["heap", /\bheapq\b|container\/heap|\bPriorityQueue\b|\bBinaryHeap\b|\bMinHeap\b|\bMaxHeap\b/],
  ["interval", /SWIFT_CATALOG_HELPER:\s*Interval/],
];

function posixRelative(from, to) {
  return path.relative(from, to).split(path.sep).join("/");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractTitle(content, slug) {
  const rawTitle = /^title:\s*(.+)$/m.exec(content)?.[1]?.trim();
  if (!rawTitle) return slug;
  return rawTitle.replace(/^(["'])(.*)\1$/, "$2");
}

function sectionAfter(content, headingPattern) {
  const heading = headingPattern.exec(content);
  if (!heading) return "";
  const start = heading.index + heading[0].length;
  const nextHeading = /^##\s+/gm;
  nextHeading.lastIndex = start;
  const next = nextHeading.exec(content);
  return content.slice(start, next?.index ?? content.length);
}

function collectRawImports(content) {
  const imports = new Map();
  const pattern = /import\s+(\w+)\s+from\s+['"]\.\/([^'"]+)\?raw['"];?/g;

  for (const match of content.matchAll(pattern)) {
    imports.set(match[2], match[1]);
  }

  return imports;
}

function sectionEvidence(section, language) {
  const config = languages[language];
  const labelPattern = new RegExp(
    `<TabItem\\s+label=["']${escapeRegExp(config.label)}["']`,
  );
  const fencePattern = new RegExp(
    "```(?:" + config.fenceNames.map(escapeRegExp).join("|") + ")\\n",
  );

  return {
    tab: labelPattern.test(section),
    codeFence: fencePattern.test(section),
    repl: new RegExp(`<${config.repl}\\b`).test(section),
  };
}

export function hasTestHarness(language, source) {
  const patterns = {
    python: [/\bassert\b/, /\b_run_tests\s*\(/, /if\s+__name__\s*==/],
    typescript: [/\bassert\s*\(/, /console\.assert\s*\(/, /\brunTests\s*\(/, /throw\s+new\s+Error/],
    go: [/\bfunc\s+runTests\s*\(/, /\bfunc\s+main\s*\(/, /\bpanic\s*\(/],
    swift: [/\bfunc\s+runTests\s*\(/, /#expect\s*\(/, /\bprecondition\s*\(/, /\bfatalError\s*\(/],
  };

  return patterns[language].some((pattern) => pattern.test(source));
}

function sourceRecord({
  catalogDir,
  filePath,
  language,
  rawImports,
  requiredHelpers,
  role,
  section,
}) {
  const exists = existsSync(filePath);
  const source = exists ? readFileSync(filePath, "utf8") : "";
  const fileName = path.basename(filePath);
  const importName = rawImports.get(fileName) ?? null;
  const usedInSection = importName
    ? new RegExp(`code=\\{${escapeRegExp(importName)}\\}`).test(section)
    : false;
  const contractErrors = exists && language === "swift"
    ? swiftSourceContractErrors({
      fileName,
      source,
      role,
      requiredHelpers,
    })
    : [];

  return {
    path: posixRelative(catalogDir, filePath),
    exists,
    imported: importName !== null,
    usedInSection,
    testHarness: exists && hasTestHarness(language, source),
    contractErrors,
  };
}

export function collectApproachSections(content) {
  const headingPattern = /^## Approach(?:\s+(\d+))?:\s*(.+)$/gm;
  const headings = [...content.matchAll(headingPattern)];

  return headings.map((heading, index) => {
    const start = heading.index + heading[0].length;
    const nextHeading = /^##\s+/gm;
    nextHeading.lastIndex = start;
    const end = nextHeading.exec(content)?.index ?? content.length;
    return {
      number: heading[1] ? Number(heading[1]) : index + 1,
      title: heading[2].trim(),
      section: content.slice(start, end),
    };
  });
}

function collectHelperTypes(slug, combinedSource) {
  const helpers = helperPatterns
    .filter(([, pattern]) => pattern.test(combinedSource))
    .map(([name]) => name);

  if (slug.includes("clone-graph")) helpers.push("graph-node");
  if (slug.includes("copy-list-with-random-pointer")) helpers.push("random-list-node");

  return [...new Set(helpers)].sort();
}

function relatedSource(problemDir, slug) {
  return readdirSync(problemDir)
    .filter((fileName) => fileName.startsWith(`${slug}.`) || fileName.startsWith(`${slug}-approach`))
    .filter((fileName) => Object.values(languages).some(({ extension }) => fileName.endsWith(`.${extension}`)))
    .sort()
    .map((fileName) => readFileSync(path.join(problemDir, fileName), "utf8"))
    .join("\n");
}

function parseProblem({ catalogDir, category, pagePath }) {
  const content = readFileSync(pagePath, "utf8");
  const problemDir = path.dirname(pagePath);
  const slug = path.basename(pagePath, ".mdx");
  const rawImports = collectRawImports(content);
  const combinedSource = `${content}\n${relatedSource(problemDir, slug)}`;
  const helperTypes = collectHelperTypes(slug, combinedSource);
  const practiceSection = sectionAfter(content, /^## Try it yourself\s*$/m);
  const practice = Object.fromEntries(
    Object.keys(languages).map((language) => [language, sectionEvidence(practiceSection, language)]),
  );
  const starterFiles = Object.fromEntries(
    Object.entries(languages).map(([language, config]) => [
      language,
      sourceRecord({
        catalogDir,
        filePath: path.join(problemDir, `${slug}.${config.extension}`),
        language,
        rawImports,
        requiredHelpers: helperTypes,
        role: "starter",
        section: practiceSection,
      }),
    ]),
  );
  const approaches = collectApproachSections(content).map((approach) => {
    const languageEvidence = Object.fromEntries(
      Object.keys(languages).map((language) => [
        language,
        sectionEvidence(approach.section, language),
      ]),
    );
    const sourceFiles = Object.fromEntries(
      Object.entries(languages).map(([language, config]) => [
        language,
        sourceRecord({
          catalogDir,
          filePath: path.join(
            problemDir,
            `${slug}-approach${approach.number}.${config.extension}`,
          ),
          language,
          rawImports,
          requiredHelpers: helperTypes,
          role: "approach",
          section: approach.section,
        }),
      ]),
    );
    const swift = languageEvidence.swift;
    const swiftSource = sourceFiles.swift;

    return {
      number: approach.number,
      title: approach.title,
      languageTabs: Object.keys(languages).filter((language) => languageEvidence[language].tab),
      codeFences: Object.keys(languages).filter(
        (language) => languageEvidence[language].codeFence,
      ),
      repls: Object.keys(languages).filter((language) => languageEvidence[language].repl),
      sourceFiles: Object.fromEntries(
        Object.keys(languages).map((language) => [
          language,
          sourceFiles[language].exists ? sourceFiles[language].path : null,
        ]),
      ),
      sourceHarnesses: Object.keys(languages).filter(
        (language) => sourceFiles[language].testHarness,
      ),
      swiftContractErrors: swiftSource.contractErrors,
      swiftReady:
        swift.tab &&
        (swift.codeFence || swift.repl) &&
        swiftSource.exists &&
        swiftSource.testHarness &&
        swiftSource.contractErrors.length === 0,
    };
  });
  const swiftPractice = practice.swift;
  const swiftStarter = starterFiles.swift;

  return {
    category,
    slug,
    title: extractTitle(content, slug),
    page: posixRelative(catalogDir, pagePath),
    helperTypes,
    practiceTabs: Object.keys(languages).filter((language) => practice[language].tab),
    practiceRepls: Object.keys(languages).filter((language) => practice[language].repl),
    starterFiles: Object.fromEntries(
      Object.keys(languages).map((language) => [
        language,
        starterFiles[language].exists ? starterFiles[language].path : null,
      ]),
    ),
    starterHarnesses: Object.keys(languages).filter(
      (language) => starterFiles[language].testHarness,
    ),
    starterImports: Object.keys(languages).filter(
      (language) => starterFiles[language].imported && starterFiles[language].usedInSection,
    ),
    swiftContractErrors: swiftStarter.contractErrors,
    swiftReady:
      swiftPractice.tab &&
      swiftPractice.repl &&
      swiftStarter.exists &&
      swiftStarter.imported &&
      swiftStarter.usedInSection &&
      swiftStarter.testHarness &&
      swiftStarter.contractErrors.length === 0,
    approaches,
  };
}

function countSourceFiles(catalogDir) {
  const counts = Object.fromEntries(Object.keys(languages).map((language) => [language, 0]));

  for (const categoryEntry of readdirSync(catalogDir, { withFileTypes: true })) {
    if (!categoryEntry.isDirectory()) continue;
    const categoryDir = path.join(catalogDir, categoryEntry.name);
    for (const fileName of readdirSync(categoryDir)) {
      for (const [language, config] of Object.entries(languages)) {
        if (fileName.endsWith(`.${config.extension}`)) counts[language] += 1;
      }
    }
  }

  return counts;
}

function summarizeLanguage(problems, language) {
  return {
    starterFiles: problems.filter((problem) => problem.starterFiles[language] !== null).length,
    starterHarnesses: problems.filter((problem) => problem.starterHarnesses.includes(language)).length,
    practiceTabs: problems.filter((problem) => problem.practiceTabs.includes(language)).length,
    practiceRepls: problems.filter((problem) => problem.practiceRepls.includes(language)).length,
    approachTabs: problems.flatMap((problem) => problem.approaches)
      .filter((approach) => approach.languageTabs.includes(language)).length,
    approachSources: problems.flatMap((problem) => problem.approaches)
      .filter((approach) => approach.sourceFiles[language] !== null).length,
    approachHarnesses: problems.flatMap((problem) => problem.approaches)
      .filter((approach) => approach.sourceHarnesses.includes(language)).length,
  };
}

export function buildCoverageManifest({ catalogDir = defaultCatalogDir } = {}) {
  const problems = readdirSync(catalogDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((categoryEntry) => {
      const categoryDir = path.join(catalogDir, categoryEntry.name);
      return readdirSync(categoryDir)
        .filter((fileName) => fileName.endsWith(".mdx"))
        .sort()
        .map((fileName) => parseProblem({
          catalogDir,
          category: categoryEntry.name,
          pagePath: path.join(categoryDir, fileName),
        }));
    });
  const documentedApproaches = problems.reduce(
    (total, problem) => total + problem.approaches.length,
    0,
  );
  const categories = [...new Set(problems.map((problem) => problem.category))].map((category) => {
    const categoryProblems = problems.filter((problem) => problem.category === category);
    const categoryApproaches = categoryProblems.flatMap((problem) => problem.approaches);
    return {
      category,
      pages: categoryProblems.length,
      documentedApproaches: categoryApproaches.length,
      swiftReadyPages: categoryProblems.filter((problem) => problem.swiftReady).length,
      swiftReadyApproaches: categoryApproaches.filter((approach) => approach.swiftReady).length,
    };
  });

  return {
    schemaVersion: 2,
    catalogRoot: "src/content/docs/topics/cs/coding-problems",
    summary: {
      pages: problems.length,
      categories: categories.length,
      documentedApproaches,
      sourceFiles: countSourceFiles(catalogDir),
      languageCoverage: Object.fromEntries(
        Object.keys(languages).map((language) => [language, summarizeLanguage(problems, language)]),
      ),
      swiftReadyPages: problems.filter((problem) => problem.swiftReady).length,
      swiftReadyApproaches: problems.flatMap((problem) => problem.approaches)
        .filter((approach) => approach.swiftReady).length,
    },
    categories,
    problems,
  };
}

export function swiftCoverageErrors(manifest) {
  const errors = [];

  for (const problem of manifest.problems) {
    if (!problem.swiftReady) {
      const missing = [];
      if (problem.starterFiles.swift === null) missing.push("starter file");
      if (!problem.starterHarnesses.includes("swift")) missing.push("starter test harness");
      if (!problem.starterImports.includes("swift")) missing.push("starter import");
      if (!problem.practiceTabs.includes("swift")) missing.push("practice tab");
      if (!problem.practiceRepls.includes("swift")) missing.push("practice REPL");
      for (const contractError of problem.swiftContractErrors) {
        missing.push(`contract: ${contractError}`);
      }
      errors.push(`${problem.page}: missing Swift ${missing.join(", ")}`);
    }

    for (const approach of problem.approaches) {
      if (approach.swiftReady) continue;
      const missing = [];
      if (approach.sourceFiles.swift === null) missing.push("source file");
      if (!approach.sourceHarnesses.includes("swift")) missing.push("test harness");
      if (!approach.languageTabs.includes("swift")) missing.push("tab");
      if (!approach.codeFences.includes("swift") && !approach.repls.includes("swift")) {
        missing.push("code or REPL");
      }
      for (const contractError of approach.swiftContractErrors) {
        missing.push(`contract: ${contractError}`);
      }
      errors.push(
        `${problem.page} approach ${approach.number}: missing Swift ${missing.join(", ")}`,
      );
    }
  }

  return errors;
}

export function serializeManifest(manifest) {
  return `${JSON.stringify(manifest, null, 2)}\n`;
}

function printSummary(manifest) {
  const { summary } = manifest;
  console.log(
    `Swift catalog coverage: ${summary.swiftReadyPages}/${summary.pages} pages and ` +
    `${summary.swiftReadyApproaches}/${summary.documentedApproaches} approaches ready.`,
  );
}

function runCli() {
  const mode = process.argv.includes("--validate")
    ? "validate"
    : process.argv.includes("--check")
      ? "check"
      : "write";
  const manifest = buildCoverageManifest();
  const serialized = serializeManifest(manifest);
  const existing = existsSync(defaultManifestPath)
    ? readFileSync(defaultManifestPath, "utf8")
    : null;

  if (mode === "write") {
    mkdirSync(path.dirname(defaultManifestPath), { recursive: true });
    if (existing !== serialized) writeFileSync(defaultManifestPath, serialized);
    printSummary(manifest);
    console.log(`Wrote ${posixRelative(repoRoot, defaultManifestPath)}.`);
    return;
  }

  if (existing !== serialized) {
    console.error(
      "Swift catalog coverage manifest is stale. Run npm run sync:swift-catalog-coverage.",
    );
    process.exitCode = 1;
    return;
  }

  printSummary(manifest);
  console.log("Swift catalog coverage manifest is in sync.");

  if (mode === "validate") {
    const errors = swiftCoverageErrors(manifest);
    if (errors.length > 0) {
      console.error(`Swift catalog validation failed with ${errors.length} missing coverage item(s):`);
      for (const error of errors.slice(0, 25)) console.error(`- ${error}`);
      if (errors.length > 25) console.error(`- ... ${errors.length - 25} more`);
      process.exitCode = 1;
    }
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli();
}
