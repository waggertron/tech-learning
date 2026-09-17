import { existsSync } from "node:fs";
import { chromium } from "playwright";

const siteOrigin = process.env.SWIFT_SITE_ORIGIN ?? "http://127.0.0.1:4321";
const runnerURL = process.env.SWIFT_RUNNER_URL ?? "http://127.0.0.1:8787";
const pageURL = `${siteOrigin}/tech-learning/posts/2026-07-16-swift-values-variables-types-inference/`;

async function verifyHTTP() {
  const capabilitiesResponse = await fetch(`${runnerURL}/v1/swift/capabilities`, {
    headers: { Origin: siteOrigin },
  });
  if (!capabilitiesResponse.ok) {
    throw new Error(`Swift runner capability check returned HTTP ${capabilitiesResponse.status}.`);
  }
  const capabilities = await capabilitiesResponse.json();
  if (
    capabilities.toolchain !== "6.3.3" ||
    capabilities.languageMode !== "6" ||
    !capabilities.harnessVersions?.includes("swift-standard-v1")
  ) {
    throw new Error(`Unexpected Swift runner capabilities: ${JSON.stringify(capabilities)}`);
  }

  const pageResponse = await fetch(pageURL);
  const html = await pageResponse.text();
  if (!pageResponse.ok || html.length < 100_000) {
    throw new Error(`Unexpected Swift page response: HTTP ${pageResponse.status}, ${html.length} bytes.`);
  }
  for (const marker of [
    "Zero to iOS Hero 4: Values, variables, types, and inference",
    "Run Swift",
    `data-runner-url=\"${runnerURL}\"`,
  ]) {
    if (!html.includes(marker)) throw new Error(`Swift page HTML is missing marker: ${marker}`);
  }
}

async function verifyBrowser() {
  const executable = chromium.executablePath();
  if (!existsSync(executable)) throw new Error(`Playwright Chromium is missing: ${executable}`);

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    await page.goto(pageURL, { waitUntil: "domcontentloaded" });
    const repl = page.locator(
      '.swiftrepl[data-repl-id^="swift-values-variables-types-inference-"]',
    );
    await repl.waitFor({ state: "visible" });

    const editor = repl.locator(".cm-content");
    await editor.click();
    await page.keyboard.press(process.platform === "darwin" ? "Meta+A" : "Control+A");
    await page.keyboard.insertText('print("browser page ready")');
    await repl.getByRole("button", { name: "Run Swift" }).click();
    await repl.getByRole("status").filter({ hasText: "done" }).waitFor({ timeout: 30_000 });
    await repl.locator("[data-stdout]").filter({ hasText: "browser page ready" }).waitFor();
    await repl.locator("[data-timing]").filter({ hasText: "Swift version 6.3.3" }).waitFor();
    await repl.locator("[data-timing]").filter({ hasText: "linux-gnu" }).waitFor();

    if (errors.length > 0) throw new Error(`Browser errors:\n${errors.join("\n")}`);
  } finally {
    await browser.close();
  }
}

await verifyHTTP();
await verifyBrowser();
console.log("Local Swift runner browser validation passed: HTTP contract, edited source, Docker execution, output, and Linux toolchain evidence checked.");
