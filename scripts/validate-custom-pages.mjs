import { spawn } from "node:child_process";
import { once } from "node:events";
import { chromium } from "playwright";

const port = Number(process.env.VALIDATE_CUSTOM_PORT ?? 4322);
const host = process.env.VALIDATE_CUSTOM_HOST ?? "127.0.0.1";
const baseUrl = process.env.VALIDATE_CUSTOM_BASE_URL ?? `http://${host}:${port}/tech-learning`;

let previewProcess = null;
let startedPreview = false;

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchOk(url) {
  try {
    const response = await fetch(url, { redirect: "follow" });
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForPreview() {
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    if (await fetchOk(`${baseUrl}/`)) return;
    await sleep(250);
  }
  throw new Error(`Preview server did not become ready at ${baseUrl}`);
}

async function ensurePreview() {
  if (await fetchOk(`${baseUrl}/`)) return;

  startedPreview = true;
  previewProcess = spawn(
    "npm",
    ["run", "preview", "--", "--host", host, "--port", String(port)],
    {
      stdio: ["ignore", "pipe", "pipe"],
      env: process.env,
    },
  );

  let logs = "";
  previewProcess.stdout.on("data", (chunk) => {
    logs += chunk.toString();
  });
  previewProcess.stderr.on("data", (chunk) => {
    logs += chunk.toString();
  });

  previewProcess.once("exit", (code) => {
    if (code !== 0 && code !== null) {
      console.error(logs);
    }
  });

  try {
    await waitForPreview();
  } catch (error) {
    if (/listen EPERM|EACCES|permission/i.test(logs)) {
      throw new Error(
        `${error.message}\nPreview could not bind a local port. In Codex, rerun this command with escalated permissions.`,
      );
    }
    throw new Error(`${error.message}\nPreview logs:\n${logs}`);
  }
}

async function stopPreview() {
  if (!startedPreview || !previewProcess) return;
  if (previewProcess.exitCode !== null) return;

  previewProcess.kill("SIGINT");
  await Promise.race([
    once(previewProcess, "exit"),
    sleep(3000).then(() => {
      if (previewProcess.exitCode === null) previewProcess.kill("SIGTERM");
    }),
  ]);
}

async function assertNoPageErrors(page, action) {
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  await action();

  if (pageErrors.length > 0) {
    throw new Error(`Page errors:\n${pageErrors.join("\n")}`);
  }
  if (consoleErrors.some((message) => !/favicon/i.test(message))) {
    throw new Error(`Console errors:\n${consoleErrors.join("\n")}`);
  }
}

async function validateDslCalculator(browser) {
  const page = await browser.newPage();
  await assertNoPageErrors(page, async () => {
    await page.goto(`${baseUrl}/posts/series/domain-specific-languages/`, {
      waitUntil: "domcontentloaded",
    });
    const calc = page.locator("[data-dsl-calculator]");
    await calc.waitFor();

    const initial = await calc.locator("[data-recommendation]").innerText();
    if (initial !== "Keep normal code or typed configuration") {
      throw new Error(`Unexpected DSL calculator initial recommendation: ${initial}`);
    }

    for (const name of [
      "ruleVolatility",
      "sharedSystems",
      "mistakeCost",
      "businessReview",
      "auditPressure",
      "boundedDomain",
    ]) {
      await calc.locator(`select[name="${name}"]`).selectOption("5");
    }
    for (const name of [
      "implementationComplexity",
      "toolingMaintenance",
      "migrationCost",
      "generalLanguageRisk",
      "runtimeRisk",
    ]) {
      await calc.locator(`select[name="${name}"]`).selectOption("1");
    }
    await calc.locator('select[name="existingFit"]').selectOption("1");
    await page.waitForFunction(() =>
      document.querySelector("[data-recommendation]")?.textContent === "Build a custom DSL candidate",
    );
  });
  await page.close();
}

async function validateReactOutput(browser) {
  const page = await browser.newPage();
  await assertNoPageErrors(page, async () => {
    await page.goto(`${baseUrl}/posts/2026-07-07-react-events-and-local-state/`, {
      waitUntil: "domcontentloaded",
    });
    const output = page.locator(".react-example-output").first();
    await output.waitFor();
    await output.locator("button", { hasText: "Count: 0" }).click();
    await output.locator("button", { hasText: "Count: 1" }).waitFor();
  });
  await page.close();
}

async function validateReplMarkup(browser) {
  const page = await browser.newPage();
  await assertNoPageErrors(page, async () => {
    await page.goto(`${baseUrl}/topics/cs/coding-problems/binary-search/704-binary-search/`, {
      waitUntil: "domcontentloaded",
    });
    await page.getByRole("tab", { name: "Python" }).first().click();
    await page.locator(".pyrepl .pyrepl__run", { hasText: "Run Python" }).first().waitFor();
    await page.getByRole("tab", { name: "TypeScript" }).first().click();
    await page.locator(".tsrepl .tsrepl__run", { hasText: "Run TS" }).first().waitFor();
    await page.getByRole("tab", { name: "Go" }).first().click();
    await page.locator(".gorepl .gorepl__run", { hasText: "Run Go" }).first().waitFor();
    await page.getByRole("tab", { name: "Swift" }).first().click();
    await page.locator(".swiftrepl button", { hasText: "Run Swift" }).first().waitFor();

    const replCounts = await page.evaluate(() => ({
      python: document.querySelectorAll(".pyrepl").length,
      typescript: document.querySelectorAll(".tsrepl").length,
      go: document.querySelectorAll(".gorepl").length,
      swift: document.querySelectorAll(".swiftrepl").length,
    }));

    for (const [name, count] of Object.entries(replCounts)) {
      if (count < 1) throw new Error(`Expected at least one ${name} REPL`);
    }
  });
  await page.close();
}

async function validateActiveSidebarEntry(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await assertNoPageErrors(page, async () => {
    await page.goto(`${baseUrl}/topics/cs/coding-problems/binary-search/704-binary-search/`, {
      waitUntil: "domcontentloaded",
    });

    await page.waitForFunction(
      () => {
        const sidebar = document.getElementById("starlight__sidebar");
        const activeEntry = sidebar?.querySelector('a[aria-current="page"]');
        if (!sidebar || !activeEntry || sidebar.dataset.activeEntryReady !== "true") return false;

        const sidebarRect = sidebar.getBoundingClientRect();
        const activeRect = activeEntry.getBoundingClientRect();
        return (
          sidebar.scrollTop > 0 &&
          activeRect.top >= sidebarRect.top &&
          activeRect.bottom <= sidebarRect.bottom
        );
      },
      undefined,
      { timeout: 5000 },
    );

    const activeState = await page.evaluate(() => {
      const sidebar = document.getElementById("starlight__sidebar");
      const activeEntry = sidebar?.querySelector('a[aria-current="page"]');
      if (!(activeEntry instanceof HTMLAnchorElement)) return null;

      return {
        href: activeEntry.getAttribute("href"),
        backgroundImage: getComputedStyle(activeEntry).backgroundImage,
        boxShadow: getComputedStyle(activeEntry).boxShadow,
        color: getComputedStyle(activeEntry).color,
        ancestorsOpen: activeEntry.closest("details:not([open])") === null,
      };
    });

    if (!activeState?.href?.endsWith("/topics/cs/coding-problems/binary-search/704-binary-search/")) {
      throw new Error(`Unexpected active sidebar entry: ${activeState?.href ?? "missing"}`);
    }
    if (!activeState.backgroundImage.includes("linear-gradient")) {
      throw new Error("Active sidebar entry is missing its yellow gradient");
    }
    if (activeState.boxShadow.includes("inset")) {
      throw new Error("Active sidebar entry still has an inset border");
    }
    if (activeState.color !== "rgb(66, 32, 6)") {
      throw new Error(`Unexpected active sidebar text color: ${activeState.color}`);
    }
    if (!activeState.ancestorsOpen) {
      throw new Error("Active sidebar entry is hidden inside a collapsed group");
    }
  });
  await page.close();
}

try {
  await ensurePreview();
  const browser = await chromium.launch({ headless: true });
  try {
    await validateDslCalculator(browser);
    await validateReactOutput(browser);
    await validateReplMarkup(browser);
    await validateActiveSidebarEntry(browser);
  } finally {
    await browser.close();
  }
  console.log("Custom page validation passed: sidebar state, DSL calculator, React output, and four-language REPL markup checked.");
} finally {
  await stopPreview();
}
