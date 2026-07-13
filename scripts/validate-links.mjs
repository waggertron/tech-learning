import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(repoRoot, "dist");
const siteBase = "/tech-learning";

const skippedSchemes = /^(https?:|mailto:|tel:|sms:|data:|javascript:)/i;

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

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripHtmlComments(html) {
  return html.replace(/<!--[\s\S]*?-->/g, "");
}

function stripBalancedDivsByClass(html, className) {
  let output = "";
  let cursor = 0;
  const classPattern = new RegExp(
    `<div\\b[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>`,
    "gi",
  );

  for (const match of html.matchAll(classPattern)) {
    output += html.slice(cursor, match.index);

    const divPattern = /<\/?div\b[^>]*>/gi;
    divPattern.lastIndex = match.index ?? 0;
    let depth = 0;
    let endIndex = match.index ?? 0;

    for (const divMatch of html.matchAll(divPattern)) {
      if (divMatch.index < (match.index ?? 0)) continue;

      if (divMatch[0].startsWith("</")) {
        depth -= 1;
      } else {
        depth += 1;
      }

      if (depth === 0) {
        endIndex = divMatch.index + divMatch[0].length;
        break;
      }
    }

    cursor = endIndex > (match.index ?? 0) ? endIndex : (match.index ?? 0) + match[0].length;
  }

  return output + html.slice(cursor);
}

function stripIgnoredRegions(html) {
  return stripHtmlComments(stripBalancedDivsByClass(html, "react-example-output"))
    .replace(/<pre\b[\s\S]*?<\/pre>/gi, "")
    .replace(/<code\b[\s\S]*?<\/code>/gi, "");
}

function anchorExists(html, rawHash) {
  if (!rawHash) return true;
  const hash = decodeURIComponent(rawHash).replace(/^#/, "");
  if (!hash) return true;
  const escaped = hash.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b(?:id|name)=["']${escaped}["']`).test(html);
}

function routeToDistPath(routePath) {
  let normalized = routePath;
  if (normalized === "") normalized = "/";

  if (normalized.endsWith("/")) {
    return path.join(distDir, normalized, "index.html");
  }

  const extension = path.extname(normalized);
  if (!extension) {
    return path.join(distDir, normalized, "index.html");
  }

  return path.join(distDir, normalized);
}

function resolveHref(currentFile, href) {
  const [withoutHash, rawHash = ""] = href.split("#");
  const [rawPath] = withoutHash.split("?");
  const hash = rawHash ? `#${rawHash}` : "";

  if (!rawPath) {
    return { filePath: currentFile, hash };
  }

  if (rawPath.startsWith(siteBase)) {
    return {
      filePath: routeToDistPath(rawPath.slice(siteBase.length) || "/"),
      hash,
    };
  }

  if (rawPath.startsWith("/")) {
    return { error: `root-relative reference does not include ${siteBase}: ${href}` };
  }

  const currentRouteDir = path.dirname(path.relative(distDir, currentFile));
  const resolvedRoute = path.normalize(path.join("/", currentRouteDir, rawPath));
  return {
    filePath: routeToDistPath(resolvedRoute),
    hash,
  };
}

function collectReferences(html) {
  const cleaned = stripIgnoredRegions(html);
  return [...cleaned.matchAll(/\b(href|src)=["']([^"']+)["']/g)].map((match) => ({
    kind: match[1],
    value: decodeHtml(match[2]),
  }));
}

const errors = [];
const htmlFiles = listHtmlFiles();

for (const filePath of htmlFiles) {
  const html = readFileSync(filePath, "utf8");
  const page = path.relative(repoRoot, filePath);

  for (const { kind, value: href } of collectReferences(html)) {
    if (!href || href.startsWith("#")) {
      if (kind === "href" && href.startsWith("#") && !anchorExists(html, href)) {
        errors.push(`${page}: missing local hash target ${href}`);
      }
      continue;
    }

    if (href.startsWith("file:") || href.includes("/Users/") || href.includes("\\Users\\")) {
      errors.push(`${page}: forbidden local path reference ${href}`);
      continue;
    }

    if (skippedSchemes.test(href)) continue;

    const resolved = resolveHref(filePath, href);
    if (resolved.error) {
      errors.push(`${page}: ${resolved.error}`);
      continue;
    }

    if (!existsSync(resolved.filePath)) {
      errors.push(`${page}: broken ${kind} ${href} -> ${path.relative(repoRoot, resolved.filePath)}`);
      continue;
    }

    if (kind === "href" && resolved.hash && resolved.filePath.endsWith(".html")) {
      const targetHtml = readFileSync(resolved.filePath, "utf8");
      if (!anchorExists(targetHtml, resolved.hash)) {
        errors.push(`${page}: missing hash target ${href}`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error("Link validation failed:");
  for (const error of errors.slice(0, 120)) {
    console.error(`- ${error}`);
  }
  if (errors.length > 120) {
    console.error(`...and ${errors.length - 120} more`);
  }
  process.exit(1);
}

console.log(`Link validation passed: ${htmlFiles.length} HTML pages checked.`);
