import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = path.join(repoRoot, "src/content/docs");
const timeoutMs = Number(process.env.EXTERNAL_LINK_TIMEOUT_MS ?? 10000);
const concurrency = Number(process.env.EXTERNAL_LINK_CONCURRENCY ?? 6);

function listMarkdownFiles() {
  return execFileSync("find", [contentDir, "-name", "*.md", "-o", "-name", "*.mdx"], {
    encoding: "utf8",
  })
    .trim()
    .split("\n")
    .filter(Boolean)
    .sort();
}

function collectExternalLinks() {
  const links = new Map();

  for (const filePath of listMarkdownFiles()) {
    const content = readFileSync(filePath, "utf8");
    const relativePath = path.relative(repoRoot, filePath);
    for (const match of content.matchAll(/https?:\/\/[^\s)<>"']+/g)) {
      const url = match[0].replace(/[.,;:!?]+$/, "");
      if (!links.has(url)) links.set(url, []);
      links.get(url).push(relativePath);
    }
  }

  return [...links.entries()].map(([url, files]) => ({ url, files }));
}

async function fetchWithTimeout(url, method) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      method,
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "tech-learning-link-check/1.0",
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

function acceptableStatus(status) {
  return (status >= 200 && status < 400) || status === 401 || status === 403 || status === 405;
}

async function checkLink(entry) {
  try {
    let response = await fetchWithTimeout(entry.url, "HEAD");
    if (response.status === 405 || response.status === 403) {
      response = await fetchWithTimeout(entry.url, "GET");
    }

    if (!acceptableStatus(response.status)) {
      return {
        ...entry,
        ok: false,
        reason: `HTTP ${response.status}`,
      };
    }

    return { ...entry, ok: true };
  } catch (error) {
    return {
      ...entry,
      ok: false,
      reason: error?.name === "AbortError" ? "timeout" : String(error?.message ?? error),
    };
  }
}

async function runPool(entries) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < entries.length) {
      const current = entries[index];
      index += 1;
      results.push(await checkLink(current));
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, entries.length) }, worker));
  return results;
}

const links = collectExternalLinks();
const results = await runPool(links);
const failures = results.filter((result) => !result.ok);

if (failures.length > 0) {
  console.error("External link validation failed:");
  for (const failure of failures.slice(0, 80)) {
    console.error(`- ${failure.url}: ${failure.reason}`);
    console.error(`  Seen in: ${failure.files.slice(0, 5).join(", ")}`);
  }
  if (failures.length > 80) {
    console.error(`...and ${failures.length - 80} more`);
  }
  process.exit(1);
}

console.log(`External link validation passed: ${links.length} unique URLs checked.`);
