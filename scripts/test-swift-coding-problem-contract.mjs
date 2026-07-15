import { spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fixtureRoot = path.join(repoRoot, "tests/fixtures/swift-coding-problem-contract");
const helperRoot = path.join(repoRoot, "tools/swift-catalog/helpers");
const catalogRoot = path.join(
  repoRoot,
  "src/content/docs/topics/cs/coding-problems",
);
const workRoot = mkdtempSync(path.join(tmpdir(), "swift-catalog-contract-"));
const cacheRoot = path.join(workRoot, "module-cache");
const environment = {
  ...process.env,
  CLANG_MODULE_CACHE_PATH: cacheRoot,
  SWIFT_MODULECACHE_PATH: cacheRoot,
};

function runSwift(arguments_, label) {
  const result = spawnSync("swiftc", arguments_, {
    cwd: repoRoot,
    encoding: "utf8",
    env: environment,
    maxBuffer: 1_048_576,
    timeout: 60_000,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${label} failed:\n${result.stdout}${result.stderr}`);
  }
}

function swiftFiles(root) {
  return readdirSync(root, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((entry) => {
      const entryPath = path.join(root, entry.name);
      if (entry.isDirectory()) return swiftFiles(entryPath);
      return entry.name.endsWith(".swift") ? [entryPath] : [];
    });
}

function runExecutable(executable, label) {
  const result = spawnSync(executable, [], {
    encoding: "utf8",
    env: environment,
    maxBuffer: 1_048_576,
    timeout: 10_000,
  });
  if (result.error) throw result.error;
  if (result.status !== 0 || result.stdout.trim() !== "All Swift tests passed") {
    throw new Error(`${label} failed:\n${result.stdout}${result.stderr}`);
  }
}

try {
  for (const fileName of readdirSync(helperRoot).filter((name) => name.endsWith(".swift")).sort()) {
    runSwift(
      [
        "-swift-version",
        "6",
        "-warnings-as-errors",
        "-parse-as-library",
        "-emit-module",
        path.join(helperRoot, fileName),
        "-o",
        path.join(workRoot, `${fileName}.swiftmodule`),
      ],
      `Compile ${fileName}`,
    );
  }

  for (const fileName of readdirSync(fixtureRoot).filter((name) => name.endsWith(".swift")).sort()) {
    const executable = path.join(workRoot, fileName.replace(/\.swift$/, ""));
    runSwift(
      [
        "-swift-version",
        "6",
        "-warnings-as-errors",
        path.join(fixtureRoot, fileName),
        "-o",
        executable,
      ],
      `Compile ${fileName}`,
    );

    if (fileName.includes("-approach")) {
      runExecutable(executable, `Run ${fileName}`);
    }
  }

  const catalogFiles = swiftFiles(catalogRoot);
  let completedApproaches = 0;
  for (const [index, filePath] of catalogFiles.entries()) {
    const fileName = path.basename(filePath);
    const executable = path.join(
      workRoot,
      `catalog-${index}-${fileName.replace(/\.swift$/, "")}`,
    );
    runSwift(
      [
        "-swift-version",
        "6",
        "-warnings-as-errors",
        filePath,
        "-o",
        executable,
      ],
      `Compile ${path.relative(repoRoot, filePath)}`,
    );

    if (fileName.includes("-approach")) {
      runExecutable(executable, `Run ${path.relative(repoRoot, filePath)}`);
      completedApproaches += 1;
    }
  }

  console.log(
    `Swift coding-problem contract passed: ${catalogFiles.length} catalog source(s) compiled, ` +
      `${completedApproaches} completed approach(es) ran.`,
  );
} finally {
  rmSync(workRoot, { recursive: true, force: true });
}
