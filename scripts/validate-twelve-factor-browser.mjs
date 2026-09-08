import { spawn } from "node:child_process";
import { once } from "node:events";
import { existsSync } from "node:fs";
import { chromium } from "playwright";

const port = Number(process.env.VALIDATE_TWELVE_FACTOR_PORT ?? 4335);
const host = process.env.VALIDATE_TWELVE_FACTOR_HOST ?? "127.0.0.1";
const origin = `http://${host}:${port}`;
const basePath = "/tech-learning";
const routes = [
  "/topics/ops/twelve-factor-app/examples-factors-01-04/",
  "/topics/ops/twelve-factor-app/examples-factors-05-08/",
  "/topics/ops/twelve-factor-app/examples-factors-09-12/",
];
const labels = ["TypeScript", "Python", "Go"];
let server = null;

async function sleep(milliseconds) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitForServer() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${origin}${basePath}/`);
      if (response.ok) return;
    } catch {}
    await sleep(250);
  }
  throw new Error(`Twelve-Factor preview did not become ready at ${origin}${basePath}/.`);
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

async function verifyHTTP() {
  for (const route of routes) {
    const response = await fetch(`${origin}${basePath}${route}`);
    const html = await response.text();
    if (!response.ok || html.length < 10_000) {
      throw new Error(`${route} returned HTTP ${response.status} with ${html.length} bytes.`);
    }
    for (const marker of [
      '<starlight-tabs data-sync-key="twelve-factor-language"',
      'role="tablist"',
      'role="tabpanel"',
      "TypeScript",
      "Python",
      "Go",
    ]) {
      if (!html.includes(marker)) throw new Error(`${route} is missing HTML marker: ${marker}`);
    }
  }
}

async function selectedLabels(page) {
  return page.locator('starlight-tabs [role="tab"][aria-selected="true"]').allTextContents()
    .then((values) => values.map((value) => value.trim()));
}

async function expectSynchronized(page, label) {
  const selected = await selectedLabels(page);
  if (selected.length !== 4 || selected.some((value) => value !== label)) {
    throw new Error(`Expected four synchronized ${label} tabs, received ${JSON.stringify(selected)}.`);
  }
}

async function verifyTabStructure(page, route) {
  const groups = page.locator("starlight-tabs");
  if ((await groups.count()) !== 4) throw new Error(`${route} does not contain four tab groups.`);

  for (let index = 0; index < 4; index += 1) {
    const group = groups.nth(index);
    const tabs = group.getByRole("tab");
    const panels = group.locator(':scope > [role="tabpanel"]');
    if ((await tabs.count()) !== 3 || (await panels.count()) !== 3) {
      throw new Error(`${route} tab group ${index + 1} does not contain three tabs and panels.`);
    }
    const tabLabels = (await tabs.allTextContents()).map((value) => value.trim());
    if (JSON.stringify(tabLabels) !== JSON.stringify(labels)) {
      throw new Error(`${route} tab group ${index + 1} has labels ${JSON.stringify(tabLabels)}.`);
    }
    const relationshipFailures = await group.evaluate((element) => {
      const localTabs = [...element.querySelectorAll('[role="tab"]')];
      const localPanels = [...element.querySelectorAll(':scope > [role="tabpanel"]')];
      return localTabs.flatMap((tab, tabIndex) => {
        const panel = localPanels[tabIndex];
        const href = tab.getAttribute("href")?.slice(1);
        return panel && tab.id && href === panel.id && panel.getAttribute("aria-labelledby") === tab.id
          ? []
          : [tabIndex];
      });
    });
    if (relationshipFailures.length > 0) {
      throw new Error(`${route} tab group ${index + 1} has broken tab-panel relationships.`);
    }
  }
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

    await page.goto(`${origin}${basePath}/`, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => localStorage.removeItem("starlight-synced-tabs__twelve-factor-language"));

    await page.goto(`${origin}${basePath}${routes[0]}`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => customElements.get("starlight-tabs") !== undefined);
    await verifyTabStructure(page, routes[0]);
    await expectSynchronized(page, "TypeScript");
    await page.locator("starlight-tabs").first().getByRole("tab", { name: "TypeScript" }).focus();
    await page.keyboard.press("ArrowRight");
    await expectSynchronized(page, "Python");

    await page.goto(`${origin}${basePath}${routes[1]}`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => customElements.get("starlight-tabs") !== undefined);
    await verifyTabStructure(page, routes[1]);
    await expectSynchronized(page, "Python");
    await page.locator("starlight-tabs").first().getByRole("tab", { name: "Python" }).focus();
    await page.keyboard.press("End");
    await expectSynchronized(page, "Go");

    await page.goto(`${origin}${basePath}${routes[2]}`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => customElements.get("starlight-tabs") !== undefined);
    await verifyTabStructure(page, routes[2]);
    await expectSynchronized(page, "Go");
    await page.locator("starlight-tabs").first().getByRole("tab", { name: "Go" }).focus();
    await page.keyboard.press("Home");
    await expectSynchronized(page, "TypeScript");
    await page.keyboard.press("ArrowRight");
    await expectSynchronized(page, "Python");

    if (pageErrors.length > 0) throw new Error(`Page errors:\n${pageErrors.join("\n")}`);
    if (consoleErrors.length > 0) throw new Error(`Console errors:\n${consoleErrors.join("\n")}`);
  } finally {
    await browser.close();
  }
}

try {
  server = spawn("npm", ["run", "preview", "--", "--host", host, "--port", String(port)], {
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let logs = "";
  server.stdout.on("data", (chunk) => { logs += chunk.toString(); });
  server.stderr.on("data", (chunk) => { logs += chunk.toString(); });

  try {
    await waitForServer();
    await verifyHTTP();
    await verifyBrowser();
  } catch (error) {
    throw new Error(`${error instanceof Error ? error.message : String(error)}\nPreview logs:\n${logs}`);
  }
  console.log("Twelve-Factor browser validation passed: HTTP, tab semantics, synchronization, persistence, and keyboard navigation checked on all three example pages.");
} finally {
  await stopServer();
}
