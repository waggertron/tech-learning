import { spawnSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
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
    maxBuffer: 1_048_576,
    timeout: 60_000,
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
  const fixtureFiles = readdirSync(fixtureRoot).sort();
  const pythonFiles = fixtureFiles.filter((fileName) => fileName.endsWith(".py"));
  const typeScriptFiles = fixtureFiles.filter((fileName) => fileName.endsWith(".ts"));
  const goFiles = fixtureFiles.filter((fileName) => fileName.endsWith(".go"));
  const swiftFiles = fixtureFiles.filter((fileName) => fileName.endsWith(".swift"));

  for (const fileName of pythonFiles) {
    const source = path.join(fixtureRoot, fileName);
    expectOutput(run("python3", [source], `Python vector proof ${fileName}`), "python");
  }

  for (const [index, fileName] of typeScriptFiles.entries()) {
    const source = path.join(fixtureRoot, fileName);
    const outputRoot = path.join(workRoot, `typescript-${index}`);
    run(
      path.join(repoRoot, "node_modules/.bin/tsc"),
      [
        source,
        "--target", "ES2022",
        "--module", "commonjs",
        "--strict",
        "--skipLibCheck",
        "--outDir", outputRoot,
      ],
      `TypeScript vector compile ${fileName}`,
    );
    expectOutput(
      run(
        "node",
        [path.join(outputRoot, fileName.replace(/\.ts$/, ".js"))],
        `TypeScript vector proof ${fileName}`,
      ),
      "typescript",
    );
  }

  const goEnvironment = { ...process.env, GOCACHE: path.join(workRoot, "go-cache") };
  for (const fileName of goFiles) {
    expectOutput(
      run(
        "go",
        ["run", path.join(fixtureRoot, fileName)],
        `Go vector proof ${fileName}`,
        goEnvironment,
      ),
      "go",
    );
  }

  const swiftEnvironment = {
    ...process.env,
    CLANG_MODULE_CACHE_PATH: path.join(workRoot, "swift-cache"),
    SWIFT_MODULECACHE_PATH: path.join(workRoot, "swift-cache"),
  };
  for (const [index, fileName] of swiftFiles.entries()) {
    const swiftExecutable = path.join(workRoot, `swift-vector-proof-${index}`);
    run(
      "swiftc",
      [
        "-swift-version", "6",
        "-warnings-as-errors",
        path.join(fixtureRoot, fileName),
        "-o", swiftExecutable,
      ],
      `Swift vector compile ${fileName}`,
      swiftEnvironment,
    );
    expectOutput(
      run(swiftExecutable, [], `Swift vector proof ${fileName}`, swiftEnvironment),
      "swift",
    );
  }

  console.log(
    `Shared coding-problem vectors passed: ${pythonFiles.length} Python, ` +
      `${typeScriptFiles.length} TypeScript, ${goFiles.length} Go, and ` +
      `${swiftFiles.length} Swift proof program(s).`,
  );
} finally {
  rmSync(workRoot, { recursive: true, force: true });
}
