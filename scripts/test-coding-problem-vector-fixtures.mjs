import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fixtureRoot = path.join(repoRoot, "tests/fixtures/coding-problem-vectors/generated");
const workRoot = mkdtempSync(path.join(tmpdir(), "coding-problem-vectors-"));
const expectedOutput = {
  go: "All shared test vectors passed",
  python: "All shared test vectors passed",
  swift: "All Swift tests passed",
  typescript: "All shared test vectors passed",
};

function run(command, arguments_, label, environment = process.env) {
  const result = spawnSync(command, arguments_, {
    cwd: repoRoot,
    encoding: "utf8",
    env: environment,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${label} failed:\n${result.stdout}${result.stderr}`);
  }
  return result.stdout.trim();
}

function expectOutput(actual, language) {
  if (actual !== expectedOutput[language]) {
    throw new Error(`${language} emitted ${JSON.stringify(actual)}`);
  }
}

try {
  const pythonSource = path.join(fixtureRoot, "704-binary-search.py");
  expectOutput(run("python3", [pythonSource], "Python vector proof"), "python");

  const typescriptSource = path.join(fixtureRoot, "704-binary-search.ts");
  const typescriptOutput = path.join(workRoot, "typescript");
  run(
    path.join(repoRoot, "node_modules/.bin/tsc"),
    [
      typescriptSource,
      "--target", "ES2022",
      "--module", "commonjs",
      "--strict",
      "--skipLibCheck",
      "--outDir", typescriptOutput,
    ],
    "TypeScript vector compile",
  );
  expectOutput(
    run("node", [path.join(typescriptOutput, "704-binary-search.js")], "TypeScript vector proof"),
    "typescript",
  );

  const goEnvironment = { ...process.env, GOCACHE: path.join(workRoot, "go-cache") };
  expectOutput(
    run("go", ["run", path.join(fixtureRoot, "704-binary-search.go")], "Go vector proof", goEnvironment),
    "go",
  );

  const swiftEnvironment = {
    ...process.env,
    CLANG_MODULE_CACHE_PATH: path.join(workRoot, "swift-cache"),
    SWIFT_MODULECACHE_PATH: path.join(workRoot, "swift-cache"),
  };
  const swiftExecutable = path.join(workRoot, "swift-vector-proof");
  run(
    "swiftc",
    [
      "-swift-version", "6",
      "-warnings-as-errors",
      path.join(fixtureRoot, "704-binary-search-approach1.swift"),
      "-o", swiftExecutable,
    ],
    "Swift vector compile",
    swiftEnvironment,
  );
  expectOutput(run(swiftExecutable, [], "Swift vector proof", swiftEnvironment), "swift");

  console.log("Shared coding-problem vectors compiled and passed in Python, TypeScript, Go, and Swift.");
} finally {
  rmSync(workRoot, { recursive: true, force: true });
}
