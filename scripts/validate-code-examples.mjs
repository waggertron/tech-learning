import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import ts from "typescript";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const knownFenceLanguages = new Set([
  "bash",
  "css",
  "dockerfile",
  "go",
  "graphql",
  "hcl",
  "html",
  "javascript",
  "js",
  "json",
  "markdown",
  "md",
  "mermaid",
  "proto",
  "python",
  "py",
  "rust",
  "sh",
  "shell",
  "solidity",
  "sql",
  "text",
  "toml",
  "ts",
  "tsx",
  "typescript",
  "xml",
  "yaml",
  "yml",
]);

function listFiles(args) {
  const result = spawnSync("find", args, { cwd: repoRoot, encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(result.stderr || `find failed for ${args.join(" ")}`);
  }

  return result.stdout.trim().split("\n").filter(Boolean).sort();
}

function listMarkdownFiles() {
  return listFiles(["src/content/docs", "-name", "*.md", "-o", "-name", "*.mdx"]);
}

function listSourceFiles(extension) {
  return listFiles(["src", "-name", `*.${extension}`]);
}

function checkFenceLanguages(errors) {
  for (const filePath of listMarkdownFiles()) {
    const content = readFileSync(path.join(repoRoot, filePath), "utf8");
    for (const match of content.matchAll(/```([^\n`]*)\n/g)) {
      const language = match[1].trim();
      if (!language) continue;

      const firstToken = language.split(/\s+/)[0].toLowerCase();
      if (!knownFenceLanguages.has(firstToken)) {
        errors.push(`${filePath}: unknown fenced code language "${language}"`);
      }
    }
  }
}

function checkTypeScriptSyntax(errors) {
  const files = [
    ...listSourceFiles("ts"),
    ...listSourceFiles("tsx"),
  ].filter((filePath) => !filePath.includes("/generated/"));

  for (const filePath of files) {
    const absolutePath = path.join(repoRoot, filePath);
    const source = readFileSync(absolutePath, "utf8");
    const output = ts.transpileModule(source, {
      fileName: absolutePath,
      reportDiagnostics: true,
      compilerOptions: {
        jsx: ts.JsxEmit.ReactJSX,
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
      },
    });

    for (const diagnostic of output.diagnostics ?? []) {
      if (diagnostic.category === ts.DiagnosticCategory.Error) {
        const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, " ");
        errors.push(`${filePath}: TypeScript syntax error: ${message}`);
      }
    }
  }
}

function checkPythonSyntax(errors) {
  const files = listSourceFiles("py");
  if (files.length === 0) return;

  const result = spawnSync("python3", ["-m", "py_compile", ...files], {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });

  if (result.status !== 0) {
    errors.push(`Python syntax check failed:\n${result.stderr || result.stdout}`);
  }
}

function checkGoSyntax(errors) {
  const files = listSourceFiles("go");
  if (files.length === 0) return;

  const hasGo = spawnSync("go", ["version"], { encoding: "utf8" });
  if (hasGo.status !== 0) {
    errors.push("Go syntax check skipped because the go binary is not available.");
    return;
  }

  for (const filePath of files) {
    const result = spawnSync("gofmt", ["-w=false", filePath], {
      cwd: repoRoot,
      encoding: "utf8",
    });
    if (result.status !== 0) {
      errors.push(`${filePath}: Go syntax check failed:\n${result.stderr || result.stdout}`);
    }
  }
}

function checkGeneratedReactContracts(errors) {
  const registry = path.join(repoRoot, "src/generated/react-example-registry.tsx");
  const modules = path.join(repoRoot, "src/generated/react-example-modules");
  if (!existsSync(registry) || !existsSync(modules)) {
    errors.push("React example generated registry or module directory is missing.");
  }
}

const errors = [];
checkFenceLanguages(errors);
checkTypeScriptSyntax(errors);
checkPythonSyntax(errors);
checkGoSyntax(errors);
checkGeneratedReactContracts(errors);

if (errors.length > 0) {
  console.error("Code example validation failed:");
  for (const error of errors.slice(0, 80)) {
    console.error(`- ${error}`);
  }
  if (errors.length > 80) {
    console.error(`...and ${errors.length - 80} more`);
  }
  process.exit(1);
}

console.log("Code example validation passed: fence tags and source syntax checked.");
