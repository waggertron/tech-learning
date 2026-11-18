import assert from "node:assert/strict";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import { once } from "node:events";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(root, "../..");
const suffix = Date.now();
const previous = `verify-previous-${suffix}`;
const candidate = `verify-candidate-${suffix}`;
const configPath = path.join(root, "dist/runtime-config.json");
const build = spawnSync(
  process.execPath,
  [
    path.join(repo, "node_modules/vite/bin/vite.js"),
    "build",
    "--config",
    path.join(root, "vite.config.ts"),
  ],
  { cwd: repo, stdio: "inherit" },
);
assert.equal(build.status, 0);
const original = readFileSync(configPath);

function snapshot(name, enabled) {
  writeFileSync(
    configPath,
    JSON.stringify({ release: name, newCheckout: enabled }),
  );
  const result = spawnSync(
    process.execPath,
    [path.join(root, "release.mjs"), name],
    { cwd: repo, stdio: "inherit" },
  );
  assert.equal(result.status, 0);
}

async function inspect(name, enabled) {
  const child = spawn(process.execPath, [path.join(root, "serve.mjs"), name], {
    cwd: repo,
    env: { ...process.env, REACT_WORKBENCH_PORT: "0" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const exit = once(child, "exit");
  let timeout;
  try {
    const url = await new Promise((resolve, reject) => {
      timeout = setTimeout(
        () => reject(new Error("Local release server did not start")),
        10000,
      );
      child.stdout.on("data", (chunk) => {
        const match = String(chunk).match(/http:\/\/127\.0\.0\.1:\d+/);
        if (match) resolve(match[0]);
      });
      child.once("error", reject);
      child.once("exit", (code) =>
        reject(new Error(`Local server exited: ${code}`)),
      );
    });
    const manifest = await fetch(`${url}/release.json`).then((response) =>
      response.json(),
    );
    const config = await fetch(`${url}/runtime-config.json`).then((response) =>
      response.json(),
    );
    const html = await fetch(`${url}/`).then((response) => response.text());
    assert.equal(manifest.name, name);
    assert.equal(config.release, name);
    assert.equal(config.newCheckout, enabled);
    assert.match(html, /assets\/index-[^" ]+\.js/);
    console.log(
      `Served ${name}: expected configuration and hashed asset verified`,
    );
    return manifest.digest;
  } finally {
    clearTimeout(timeout);
    child.kill("SIGTERM");
    await exit;
  }
}

try {
  snapshot(previous, false);
  snapshot(candidate, true);
  const candidateDigest = await inspect(candidate, true);
  const previousDigest = await inspect(previous, false);
  assert.notEqual(candidateDigest, previousDigest);
  console.log(
    "Rollback verified: candidate flag-on artifact replaced by saved previous flag-off artifact",
  );
} finally {
  writeFileSync(configPath, original);
  rmSync(path.join(root, "releases", previous), {
    recursive: true,
    force: true,
  });
  rmSync(path.join(root, "releases", candidate), {
    recursive: true,
    force: true,
  });
}
