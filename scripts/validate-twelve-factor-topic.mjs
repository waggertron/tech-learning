import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import {
  examples,
  factors,
  releaseUrl,
  repositories,
  repositoryFileUrl,
  topicDirectory,
} from "./twelve-factor-example-sources.mjs";
import { synchronizeTwelveFactorExamples } from "./sync-twelve-factor-examples.mjs";

function count(document, value) {
  return document.split(value).length - 1;
}

function factorSection(document, heading) {
  const start = document.indexOf(`## ${heading}`);
  if (start === -1) return "";
  const end = document.indexOf("\n## ", start + heading.length + 3);
  return document.slice(start, end === -1 ? document.length : end);
}

function factorAnchor(factor) {
  return factor.heading
    .toLowerCase()
    .replaceAll("/", "")
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/^-|-$/g, "");
}

function tabCode(section, language) {
  const tabStart = section.indexOf(`<TabItem label="${language}">`);
  if (tabStart === -1) return "";
  const tabEnd = section.indexOf("</TabItem>", tabStart);
  if (tabEnd === -1) return "";
  return section.slice(tabStart, tabEnd).match(/```[^\n]*\n([\s\S]*?)```/)?.[1] ?? "";
}

export function validateTopicDocuments(hub, pages) {
  const failures = [];
  const requireMatch = (condition, message) => {
    if (!condition) failures.push(message);
  };

  for (const factor of factors) {
    const page = pages.get(factor.page) ?? "";
    const section = factorSection(page, factor.heading);
    requireMatch(count(hub, `## ${factor.heading}`) === 1, `Hub must contain one ${factor.heading} heading`);
    requireMatch(count(page, `## ${factor.heading}`) === 1, `${factor.page} must contain one ${factor.heading} heading`);
    requireMatch(hub.includes(`[${factor.heading}](#factor-`), `Hub scan table must link ${factor.heading}`);
    requireMatch(hub.includes(`| ${factor.heading} |`), `Audit table must map ${factor.heading}`);
    const exampleRoute = `./${factor.page.replace(".mdx", "/")}#${factorAnchor(factor)}`;
    requireMatch(
      hub.includes(`[See ${factor.heading} examples in TypeScript, Python, and Go](${exampleRoute})`),
      `Hub example link must preserve ${factor.heading} and its rendered route`,
    );

    const factorExamples = examples.filter((example) => example.number === factor.number);
    requireMatch(factorExamples.length === 3, `${factor.heading} must have three language sources`);
    for (const language of Object.keys(repositories)) {
      const example = factorExamples.find((candidate) => candidate.language === language);
      requireMatch(Boolean(example), `${factor.heading} is missing ${language} evidence`);
      if (!example) continue;
      requireMatch(section.includes(`<TabItem label="${language}">`), `${factor.heading} is missing its ${language} tab`);
      requireMatch(section.includes(`{/* twelve-factor-source: ${example.id} */}`), `${example.id} source marker is missing from ${factor.heading}`);
      requireMatch(section.includes(`[${factor.heading} ${language} source](${example.sourceUrl})`), `${example.id} tagged source link is missing from ${factor.heading}`);
      requireMatch(
        tabCode(section, language).includes(example.proofToken),
        `${example.id} code is missing its API proof token: ${example.proofToken}`,
      );
    }
  }

  for (const [language, repository] of Object.entries(repositories)) {
    requireMatch(hub.includes(releaseUrl(repository)), `${language} release ${repository.tag} is not linked from the hub`);
    for (const page of pages.values()) {
      requireMatch(page.includes(releaseUrl(repository)), `${language} release ${repository.tag} is not linked from every example page`);
    }
    for (const path of [
      "AGENTS.md",
      "CLAUDE.md",
      ".agents/skills/twelve-factor-app/SKILL.md",
      ".claude/skills/twelve-factor-app/SKILL.md",
      ".agents/skills/twelve-factor-app/references/factor-checklist.md",
      repository.checker,
    ]) {
      requireMatch(hub.includes(repositoryFileUrl(repository, path)), `${language} hub link is missing ${path}`);
    }
    for (const command of repository.processCommands) {
      requireMatch(hub.includes(`\`${command}\``), `${language} process command is missing: ${command}`);
    }
    requireMatch(hub.includes(`\`${repository.port}\``), `${language} port ${repository.port} is missing`);
  }

  for (const token of [
    "`DATABASE_URL`",
    "`REDIS_URL`",
    "`RELEASE_ID`",
    "`APP_HOST`",
    "`PORT`",
    "`WORKER_CONCURRENCY`",
    "`SHUTDOWN_GRACE_MS`",
    "`TELEMETRY_MODE`",
    "`POST /v1/orders`",
    "`GET /v1/orders/{orderId}`",
    "`Idempotency-Key`",
    "`customerId`",
    "`amountCents`",
    "1 through 99",
    "`orders.v1`",
    "`db/migrations/001_orders.sql`",
  ]) {
    requireMatch(hub.includes(token), `Shared contract token is missing: ${token}`);
  }

  if (examples.length !== 36) failures.push(`Expected 36 examples, found ${examples.length}`);
  return failures;
}

export function validateDiscoveryDocuments(documents) {
  const failures = [];
  const requireLink = (document, link, location) => {
    if (!document.includes(link)) failures.push(`${location} is missing ${link}`);
  };

  requireLink(documents.opsIndex, "[Twelve-Factor Apps](./twelve-factor-app/)", "Operations index");
  requireLink(documents.topicsIndex, "[Twelve-Factor Apps](./ops/twelve-factor-app/)", "Topics index");
  for (const [location, document] of [
    ["Secrets topic", documents.secrets],
    ["Docker topic", documents.docker],
    ["Kubernetes topic", documents.kubernetes],
  ]) {
    requireLink(document, "[Twelve-Factor Apps](../twelve-factor-app/)", location);
  }
  for (const link of [
    "[Docker](../docker/)",
    "[Kubernetes](../kubernetes/)",
    "[GitOps](../gitops/)",
    "[Secrets, keys, and tokens](../secrets-keys-tokens/)",
    "[Scalability](../../system-design/scalability/)",
  ]) {
    requireLink(documents.hub, link, "Twelve-Factor related topics");
  }

  return failures;
}

async function main() {
  const hub = await readFile(`${topicDirectory}/index.mdx`, "utf8");
  const pages = new Map(
    await Promise.all(
      [...new Set(factors.map((factor) => factor.page))].map(async (page) => [
        page,
        await readFile(`${topicDirectory}/${page}`, "utf8"),
      ]),
    ),
  );
  const failures = validateTopicDocuments(hub, pages);
  const discoveryDocuments = {
    hub,
    opsIndex: await readFile("src/content/docs/topics/ops/index.md", "utf8"),
    topicsIndex: await readFile("src/content/docs/topics/index.mdx", "utf8"),
    secrets: await readFile("src/content/docs/topics/ops/secrets-keys-tokens.md", "utf8"),
    docker: await readFile("src/content/docs/topics/ops/docker/index.md", "utf8"),
    kubernetes: await readFile("src/content/docs/topics/ops/kubernetes/index.md", "utf8"),
  };
  failures.push(...validateDiscoveryDocuments(discoveryDocuments));

  try {
    const changed = await synchronizeTwelveFactorExamples({ write: false });
    if (changed.length > 0) failures.push(`Tagged snippets are out of sync: ${changed.join(", ")}`);
  } catch (error) {
    failures.push(error instanceof Error ? error.message : String(error));
  }

  if (failures.length > 0) {
    console.error("Twelve-Factor topic validation failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
  } else {
    console.log("Twelve-Factor topic validation passed: 12 factors, 36 tagged language examples, discovery links, release links, harness links, audit mappings, and shared contract.");
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
