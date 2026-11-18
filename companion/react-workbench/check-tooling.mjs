import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(root, "../..");
const tools = process.argv[2];
if (!tools || !path.isAbsolute(tools))
  throw new Error("Pass the absolute isolated tooling directory");
const toolingRequire = createRequire(path.join(tools, "package.json"));
const repoRequire = createRequire(path.join(repo, "package.json"));
const output = path.join(root, ".tooling");
mkdirSync(output, { recursive: true });

const { ESLint } = toolingRequire("eslint");
const hooks = toolingRequire("eslint-plugin-react-hooks");
const eslint = new ESLint({
  cwd: repo,
  overrideConfigFile: true,
  overrideConfig: [
    {
      files: ["**/*.jsx"],
      plugins: { "react-hooks": hooks },
      languageOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        parserOptions: { ecmaFeatures: { jsx: true } },
      },
      rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "error",
      },
    },
  ],
});
const broken = await eslint.lintFiles([
  path.join(root, "tooling/RoomTitleBroken.jsx"),
]);
const fixed = await eslint.lintFiles([
  path.join(root, "tooling/RoomTitleFixed.jsx"),
]);
assert.ok(
  broken[0].messages.some(
    (entry) => entry.ruleId === "react-hooks/exhaustive-deps",
  ),
);
assert.equal(fixed[0].errorCount + fixed[0].warningCount, 0);
writeFileSync(
  path.join(output, "lint-results.json"),
  JSON.stringify({ broken, fixed }, null, 2) + "\n",
);
console.log(`Broken Effect: ${broken[0].messages[0].message}`);
console.log("Fixed Effect: zero errors and warnings");

const { transformSync } = repoRequire("@babel/core");
const input = path.join(root, "tooling/CompilerProbe.tsx");
const result = transformSync(readFileSync(input, "utf8"), {
  filename: input,
  configFile: false,
  babelrc: false,
  parserOpts: { plugins: ["typescript", "jsx"] },
  plugins: [toolingRequire.resolve("babel-plugin-react-compiler")],
});
assert.ok(
  result?.code?.includes("react/compiler-runtime"),
  "Compiler must emit its cache runtime import",
);
assert.match(result.code, /const \$ = _c\(\d+\)/);
assert.match(result.code, /\$\[\d+\] !== query/);
writeFileSync(path.join(output, "compiler-output.js"), result.code + "\n");
console.log(
  "Compiler transform: cache runtime import and input-keyed cache guards verified",
);

const build = spawnSync(
  process.execPath,
  [
    path.join(repo, "node_modules/vite/bin/vite.js"),
    "build",
    "--config",
    path.join(root, "compiler.config.ts"),
  ],
  {
    cwd: repo,
    encoding: "utf8",
    env: { ...process.env, REACT_TOOLING_DIR: tools },
  },
);
process.stdout.write(build.stdout ?? "");
process.stderr.write(build.stderr ?? "");
assert.equal(build.status, 0, "Compiler-enabled production build must pass");
const versions = Object.fromEntries(
  ["babel-plugin-react-compiler", "eslint", "eslint-plugin-react-hooks"].map(
    (name) => {
      const packageFile = path.join(
        tools,
        "node_modules",
        name,
        "package.json",
      );
      return [name, JSON.parse(readFileSync(packageFile, "utf8")).version];
    },
  ),
);
writeFileSync(
  path.join(output, "versions.json"),
  JSON.stringify(versions, null, 2) + "\n",
);
console.log(`Verified tooling: ${JSON.stringify(versions)}`);
