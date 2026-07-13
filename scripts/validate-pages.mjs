import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(repoRoot, "dist");

const expectedRoutes = [
  "index.html",
  "posts/index.html",
  "posts/series/index.html",
  "topics/index.html",
  "posts/series/domain-specific-languages/index.html",
  "topics/cs/coding-problems/binary-search/704-binary-search/index.html",
];

const failureSignatures = [
  { label: "default route miss", pattern: /<pre[^>]*>\s*Cannot GET\b/i },
  { label: "500 title", pattern: /<title>\s*(500|Internal Server Error|Application error)/i },
  { label: "Astro runtime error", pattern: /AstroError/i },
  { label: "Next runtime error", pattern: /Unhandled Runtime Error/i },
  { label: "hydration failure", pattern: /hydration failed/i },
];

function listHtmlFiles() {
  if (!existsSync(distDir)) {
    throw new Error("dist/ does not exist. Run npm run build first.");
  }

  return execFileSync("find", [distDir, "-name", "*.html", "-type", "f"], {
    encoding: "utf8",
  })
    .trim()
    .split("\n")
    .filter(Boolean)
    .sort();
}

function stripTags(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function fail(errors, filePath, message) {
  const relativePath = path.relative(repoRoot, filePath);
  errors.push(`${relativePath}: ${message}`);
}

function validatePage(filePath, errors) {
  const relativePath = path.relative(distDir, filePath);
  const html = readFileSync(filePath, "utf8");
  const isNotFoundPage = relativePath === "404.html";
  const size = statSync(filePath).size;

  if (!isNotFoundPage && size < 2000) {
    fail(errors, filePath, `HTML body is suspiciously small (${size} bytes)`);
  }

  const title = /<title>([\s\S]*?)<\/title>/i.exec(html)?.[1]?.trim() ?? "";
  if (!title) {
    fail(errors, filePath, "missing <title>");
  }

  if (!isNotFoundPage && /\b404\b|not found/i.test(title)) {
    fail(errors, filePath, `unexpected error-like title "${title}"`);
  }

  const h1 = /<h1\b[^>]*>([\s\S]*?)<\/h1>/i.exec(html)?.[1]?.trim() ?? "";
  if (!isNotFoundPage && !stripTags(h1)) {
    fail(errors, filePath, "missing visible <h1>");
  }

  if (!isNotFoundPage && !html.includes("data-pagefind-body")) {
    fail(errors, filePath, "missing data-pagefind-body content region");
  }

  const text = stripTags(html);
  if (!isNotFoundPage && text.length < 120) {
    fail(errors, filePath, `visible text is suspiciously short (${text.length} characters)`);
  }

  for (const signature of failureSignatures) {
    if (signature.pattern.test(html)) {
      fail(errors, filePath, `contains failure signature "${signature.label}"`);
    }
  }
}

const errors = [];

for (const route of expectedRoutes) {
  const filePath = path.join(distDir, route);
  if (!existsSync(filePath)) {
    errors.push(`dist/${route}: expected route was not built`);
  }
}

const htmlFiles = listHtmlFiles();
for (const filePath of htmlFiles) {
  validatePage(filePath, errors);
}

if (errors.length > 0) {
  console.error("Page validation failed:");
  for (const error of errors.slice(0, 80)) {
    console.error(`- ${error}`);
  }
  if (errors.length > 80) {
    console.error(`...and ${errors.length - 80} more`);
  }
  process.exit(1);
}

console.log(`Page validation passed: ${htmlFiles.length} HTML pages checked.`);
