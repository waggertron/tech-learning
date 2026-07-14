import { spawn } from "node:child_process";
import { once } from "node:events";
import { existsSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const port = Number(process.env.VALIDATE_SWIFT_REPL_PORT ?? 4334);
const host = process.env.VALIDATE_SWIFT_REPL_HOST ?? "127.0.0.1";
const baseURL = `http://${host}:${port}`;
const fixtureRoot = fileURLToPath(new URL("../tests/swift-repl/browser-fixture", import.meta.url));
let server = null;

async function sleep(milliseconds) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitForServer() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(baseURL);
      if (response.ok) return;
    } catch {}
    await sleep(250);
  }
  throw new Error(`Swift REPL fixture did not become ready at ${baseURL}.`);
}

async function stopServer() {
  if (!server || server.exitCode !== null) return;
  server.kill("SIGINT");
  await Promise.race([
    once(server, "exit"),
    sleep(3_000).then(() => {
      if (server.exitCode === null) server.kill("SIGTERM");
    }),
  ]);
}

function cleanFixtureCaches() {
  for (const directory of [".astro", "node_modules"]) {
    rmSync(new URL(`${directory}/`, `file://${fixtureRoot}/`), {
      force: true,
      maxRetries: 3,
      recursive: true,
      retryDelay: 100,
    });
  }
}

async function verifyHTTP() {
  const response = await fetch(baseURL);
  const html = await response.text();
  if (!response.ok || html.length < 5_000) {
    throw new Error(`Unexpected fixture response: HTTP ${response.status}, ${html.length} bytes.`);
  }
  for (const marker of ["Swift REPL browser fixture", "swiftrepl", "Run Swift", "_astro"]) {
    if (!html.includes(marker)) throw new Error(`Fixture HTML is missing marker: ${marker}`);
  }

  const scriptPaths = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1]);
  if (scriptPaths.length === 0) throw new Error("Fixture HTML did not emit a browser script.");
  const scripts = await Promise.all(
    scriptPaths.map(async (scriptPath) => {
      const scriptURL = new URL(scriptPath, baseURL);
      const scriptResponse = await fetch(scriptURL);
      if (!scriptResponse.ok) throw new Error(`Browser script failed: ${scriptURL}`);
      return scriptResponse.text();
    }),
  );
  if (!scripts.some((script) => /SwiftRepl|swiftrepl|swift-fixtures/.test(script))) {
    throw new Error("Served scripts do not contain the Swift REPL runtime.");
  }
}

function root(page, prefix) {
  return page.locator(`.swiftrepl[data-repl-id^="${prefix}-"]`);
}

async function runAndWait(repl, expectedStatus) {
  await repl.getByRole("button", { name: "Run Swift" }).click();
  await repl.getByRole("status").filter({ hasText: expectedStatus }).waitFor();
}

async function verifyBrowser() {
  const executable = chromium.executablePath();
  if (!existsSync(executable)) throw new Error(`Playwright Chromium is missing: ${executable}`);

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { height: 900, width: 1280 } });
    const pageErrors = [];
    const consoleErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    await page.goto(baseURL, { waitUntil: "domcontentloaded" });
    await page.locator(".swiftrepl").first().waitFor();
    if ((await page.locator(".swiftrepl").count()) !== 5) {
      throw new Error("Expected five independent Swift REPL instances.");
    }

    const success = root(page, "success");
    const runButton = success.getByRole("button", { name: "Run Swift" });
    await runButton.focus();
    await page.keyboard.press("Enter");
    await success.getByRole("status").filter({ hasText: "done" }).waitFor();
    await success.locator("[data-stdout]").filter({ hasText: "ready" }).waitFor();
    await success.locator("[data-timing]").filter({ hasText: "Swift version 6.3.3" }).waitFor();

    const editor = success.locator('.cm-editor[aria-label="Editable Swift source"] .cm-content');
    await editor.click();
    await page.keyboard.press(process.platform === "darwin" ? "Meta+A" : "Control+A");
    await page.keyboard.insertText('print("changed")');
    await runAndWait(success, "done");
    await success.locator("[data-stdout]").filter({ hasText: "changed" }).waitFor();
    await success.getByRole("button", { name: "Reset" }).click();
    if ((await editor.innerText()).trim() !== 'print("ready")') {
      throw new Error("Reset did not restore the original Swift source.");
    }
    await success.getByRole("status").filter({ hasText: "idle" }).waitFor();

    await page.getByRole("button", { name: "Show hidden Swift editor" }).click();
    const timeout = root(page, "timeout");
    await timeout.waitFor();
    const hiddenEditorBox = await timeout.locator(".cm-editor").boundingBox();
    const hiddenHostBox = await timeout.locator("[data-editor]").boundingBox();
    if (
      !hiddenEditorBox ||
      hiddenEditorBox.width < 200 ||
      hiddenEditorBox.height < 10 ||
      !hiddenHostBox ||
      hiddenHostBox.height < 270
    ) {
      throw new Error(`Hidden-tab editor did not remeasure: ${JSON.stringify(hiddenEditorBox)}`);
    }
    await runAndWait(timeout, "timed out");

    const cancellation = root(page, "cancellation");
    await cancellation.getByRole("button", { name: "Run Swift" }).click();
    await cancellation.getByRole("status").filter({ hasText: "running" }).waitFor();
    await cancellation.getByRole("button", { name: "Cancel" }).click();
    await cancellation.getByRole("status").filter({ hasText: "cancelled" }).waitFor();

    const compileFailure = root(page, "compile-failure");
    await runAndWait(compileFailure, "compile failed");
    await compileFailure
      .locator("[data-diagnostics]")
      .filter({ hasText: "cannot convert value of type String" })
      .waitFor();

    const unavailable = root(page, "unavailable");
    await runAndWait(unavailable, "runner unavailable");
    await unavailable.locator("[data-message]").filter({ hasText: "source remains" }).waitFor();

    const approachSection = page.locator('[data-test-section="approach"]');
    await approachSection.getByRole("button", { name: "Run Swift approach" }).click();
    await approachSection.getByRole("status").filter({ hasText: "done" }).waitFor();
    await approachSection.locator(".swift-code-run-output").filter({ hasText: "index=4" }).waitFor();

    await page.setViewportSize({ height: 844, width: 390 });
    const mobileOverflow = await success.evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));
    if (mobileOverflow.scrollWidth > mobileOverflow.clientWidth + 1) {
      throw new Error(`Swift REPL overflows mobile width: ${JSON.stringify(mobileOverflow)}`);
    }

    if (pageErrors.length > 0) throw new Error(`Page errors:\n${pageErrors.join("\n")}`);
    if (consoleErrors.length > 0) throw new Error(`Console errors:\n${consoleErrors.join("\n")}`);
    await page.close();
  } finally {
    await browser.close();
  }
}

try {
  server = spawn(
    "npx",
    [
      "astro",
      "dev",
      "--root",
      fixtureRoot,
      "--host",
      host,
      "--port",
      String(port),
    ],
    { env: process.env, stdio: ["ignore", "pipe", "pipe"] },
  );
  let logs = "";
  server.stdout.on("data", (chunk) => { logs += chunk.toString(); });
  server.stderr.on("data", (chunk) => { logs += chunk.toString(); });

  try {
    await waitForServer();
    await verifyHTTP();
    await verifyBrowser();
  } catch (error) {
    throw new Error(`${error instanceof Error ? error.message : String(error)}\nFixture logs:\n${logs}`);
  }
  console.log("Swift REPL browser validation passed: HTTP, runtime, states, accessibility, hidden layout, approach harness, and mobile width checked.");
} finally {
  await stopServer();
  cleanFixtureCaches();
}
