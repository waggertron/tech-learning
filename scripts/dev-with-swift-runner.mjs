import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";

const host = "127.0.0.1";
const sitePort = parsePort("SWIFT_SITE_PORT", 4321);
const runnerPort = parsePort("SWIFT_RUNNER_PORT", 8787);
const runnerURL = `http://${host}:${runnerPort}`;
const siteOrigin = `http://${host}:${sitePort}`;
const runnerScript = fileURLToPath(new URL("../tools/swift-runner/server.mjs", import.meta.url));
const astroScript = fileURLToPath(new URL("../node_modules/astro/astro.js", import.meta.url));
const children = new Set();
let stopping = false;

function parsePort(name, fallback) {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isInteger(value) || value < 1 || value > 65_535) {
    throw new Error(`${name} must be an integer from 1 to 65535.`);
  }
  return value;
}

function start(command, args, env = process.env) {
  const child = spawn(command, args, { env, stdio: "inherit" });
  children.add(child);
  child.once("exit", () => children.delete(child));
  return child;
}

async function waitForRunner(runner) {
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    if (runner.exitCode !== null) {
      throw new Error(`Local Swift runner exited with code ${runner.exitCode}.`);
    }
    try {
      const response = await fetch(`${runnerURL}/v1/swift/capabilities`);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Local Swift runner did not become ready at ${runnerURL}.`);
}

async function stopChild(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  child.kill("SIGINT");
  await Promise.race([
    once(child, "exit"),
    new Promise((resolve) => setTimeout(resolve, 3_000)),
  ]);
  if (child.exitCode === null && child.signalCode === null) child.kill("SIGTERM");
}

async function stopAll() {
  if (stopping) return;
  stopping = true;
  await Promise.all([...children].map(stopChild));
}

async function main() {
  const runner = start(process.execPath, [runnerScript], {
    ...process.env,
    SWIFT_RUNNER_ALLOWED_ORIGINS: siteOrigin,
    SWIFT_RUNNER_PORT: String(runnerPort),
  });
  await waitForRunner(runner);

  const astro = start(process.execPath, [
    astroScript,
    "dev",
    "--host",
    host,
    "--port",
    String(sitePort),
  ], {
    ...process.env,
    PUBLIC_SWIFT_RUNNER_URL: runnerURL,
  });

  console.log(`Swift-enabled site starting at ${siteOrigin}/tech-learning`);
  const outcome = await Promise.race([
    once(process, "SIGINT").then(() => ({ expected: true })),
    once(process, "SIGTERM").then(() => ({ expected: true })),
    once(runner, "exit").then(([code]) => ({ code, expected: stopping })),
    once(astro, "exit").then(([code]) => ({ code, expected: stopping })),
  ]);
  await stopAll();
  if (!outcome.expected) process.exitCode = outcome.code || 1;
}

main().catch(async (error) => {
  console.error(error instanceof Error ? error.message : String(error));
  await stopAll();
  process.exitCode = 1;
});
