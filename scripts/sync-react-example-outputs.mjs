import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import vm from "node:vm";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsDir = path.join(repoRoot, "src/content/docs/posts");
const moduleDir = path.join(postsDir, "_react-example-modules");
const generatedDir = path.join(repoRoot, "src/generated");
const generatedModuleDir = path.join(generatedDir, "react-example-modules");
const registryPath = path.join(generatedDir, "react-example-registry.tsx");
const reactPostFilePattern = /^2026-07-07-react-.+\.md$/;
const codeFencePattern = /```(tsx|typescript)\n([\s\S]*?)\n```/g;
const exampleHeadingPattern = /^## Example: (.+)$/gm;
const checkOnly = process.argv.includes("--check");
const baseRequire = createRequire(import.meta.url);

function htmlEscape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sentence(value) {
  return String(value).replace(/\s+/g, " ").trim().replace(/\u2014/g, ",");
}

function containsJsx(code) {
  return /<[A-Za-z][A-Za-z0-9.]*[\s>/]/.test(code);
}

function exportedNames(code) {
  return [
    ...code.matchAll(/export default function\s+([A-Z_a-z]\w*)/g),
    ...code.matchAll(/export function\s+([A-Z_a-z]\w*)/g),
    ...code.matchAll(/export const\s+([A-Z_a-z]\w*)/g),
  ].map((match) => match[1]);
}

function firstComponentName(code) {
  const exported = exportedNames(code).find((name) => /^[A-Z]/.test(name));
  if (exported) return exported;

  return (
    /function\s+([A-Z]\w*)/.exec(code)?.[1] ??
    /const\s+([A-Z]\w*)\s*(?::[^=]+)?=/.exec(code)?.[1] ??
    null
  );
}

function prepareCode(code) {
  const componentName = firstComponentName(code);
  const hasExports = /\bexport\s+/.test(code);

  if (componentName && !hasExports) {
    return `${code}\n\nexport { ${componentName} };\n`;
  }

  return code;
}

function transpile(code, moduleId) {
  const result = ts.transpileModule(prepareCode(code), {
    fileName: moduleId,
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  });

  return result.outputText;
}

function modulePathForRequest(request) {
  const baseName = request.replace(/^\.\//, "");
  const candidates = [
    path.join(moduleDir, `${baseName}.tsx`),
    path.join(moduleDir, `${baseName}.ts`),
  ];

  return candidates.find((candidate) => {
    try {
      readFileSync(candidate, "utf8");
      return true;
    } catch {
      return false;
    }
  });
}

function createExampleEnvironment() {
  return {
    AbortController,
    FormData,
    Intl,
    console,
    document: { title: "" },
    navigator: { onLine: true },
    window: {
      addEventListener() {},
      removeEventListener() {},
      clearTimeout() {},
      setTimeout() {
        return 1;
      },
    },
  };
}

function isBrowserLiveRenderable(code) {
  if (!containsJsx(code)) return false;
  if (/\b(describe|it|test)\(/.test(code)) return false;
  if (/\bcreateRoot\(/.test(code)) return false;
  if (/\bcreateFileRoute\(/.test(code)) return false;
  if (/export\s+default\s+async\s+function\s+[A-Z]/.test(code)) return false;
  if (/export\s+async\s+function\s+[A-Z]/.test(code)) return false;
  return true;
}

function serializeFixtureValue(value) {
  if (value === null || value === undefined) return value;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (typeof value === "function") {
    return { $type: "fn", name: value.name || "noop" };
  }
  if (Array.isArray(value)) {
    return value.map((item) => serializeFixtureValue(item));
  }
  if (React.isValidElement(value)) {
    return {
      $type: "element",
      tag: typeof value.type === "string" ? value.type : "div",
      key: value.key ?? null,
      props: serializeFixtureValue(value.props ?? {}),
    };
  }
  if (value instanceof Date) {
    return { $type: "date", value: value.toISOString() };
  }
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, serializeFixtureValue(entry)]),
    );
  }

  return value;
}

function serializeFixtureProps(props) {
  return serializeFixtureValue(props ?? {});
}

function moduleImportPath(id) {
  return `./react-example-modules/${id}.tsx`;
}

function helperImportPath(spec) {
  return `../../content/docs/posts/_react-example-modules/${spec}`;
}

function rewriteModuleImports(code) {
  return code
    .replaceAll(/from\s+["']\.\/([^"']+)["']/g, (_match, spec) => `from "${helperImportPath(spec)}"`)
    .replaceAll(/import\(\s*["']\.\/([^"']+)["']\s*\)/g, (_match, spec) => `import("${helperImportPath(spec)}")`)
    .replaceAll(/from\s+["']react-native["']/g, 'from "react-native-web"');
}

function buildGeneratedModuleSource(code) {
  return `// @ts-nocheck
${rewriteModuleImports(prepareCode(code)).trim()}
`;
}

function existingOutputLength(afterFence) {
  const leadingBreaksLength = /^\n*/.exec(afterFence)?.[0].length ?? 0;
  const start = afterFence.slice(leadingBreaksLength);
  if (!start.startsWith('<div class="react-example-output')) {
    return leadingBreaksLength;
  }

  const tagPattern = /<\/?div\b[^>]*>/g;
  let depth = 0;
  let match;

  while ((match = tagPattern.exec(start))) {
    const tag = match[0];
    if (tag.startsWith("</div")) {
      depth -= 1;
      if (depth === 0) {
        let end = leadingBreaksLength + tagPattern.lastIndex;
        const artifact = /^(?:\s*<\/div>\s*)+/.exec(afterFence.slice(end));
        if (artifact) {
          end += artifact[0].length;
        }
        const trailingWhitespace = /^[\t ]*\n*/.exec(afterFence.slice(end))?.[0].length ?? 0;
        end += trailingWhitespace;
        return end;
      }
    } else {
      depth += 1;
    }
  }

  return leadingBreaksLength;
}

function evaluateModule(code, moduleId, moduleCache, environment) {
  if (moduleCache.has(moduleId)) return moduleCache.get(moduleId).exports;

  const module = { exports: {} };
  moduleCache.set(moduleId, module);

  const localRequire = (request) => {
    if (request === "react-native") {
      return baseRequire("react-native-web");
    }

    if (request.startsWith(".")) {
      const localPath = modulePathForRequest(request);
      if (!localPath) {
        throw new Error(`Missing local example module for ${request}`);
      }
      const localSource = readFileSync(localPath, "utf8");
      return evaluateModule(localSource, localPath, moduleCache, environment);
    }

    return baseRequire(request);
  };

  const script = new vm.Script(transpile(code, moduleId), { filename: moduleId });
  const context = vm.createContext({
    ...environment,
    exports: module.exports,
    module,
    require: localRequire,
  });
  script.runInContext(context, { timeout: 1000 });
  return module.exports;
}

function fixtureProps({ title, componentName }) {
  const reactChild = (text) => React.createElement("p", null, text);
  const noop = () => {};
  const asyncNoop = async () => {};
  const tasks = [
    { id: "task-1", title: "Draft release notes", done: true },
    { id: "task-2", title: "Verify analytics", done: false },
  ];
  const products = [
    { id: "shoe", name: "Trail shoes", priceCents: 12900, inStock: true },
    { id: "shell", name: "Rain shell", priceCents: 9900, inStock: false },
  ];

  const byComponent = {
    ActionButton: { kind: "link", href: "/account/billing", children: "Manage billing" },
    AccountLayout: { children: reactChild("Profile settings") },
    AnalyticsPanel: {},
    AppProviders: { children: reactChild("Cached data area") },
    AppointmentTime: { startsAt: "2026-07-08T17:00:00.000Z", locale: "en-US" },
    ArtistPage: { artistId: "maya" },
    AssigneeSummary: {
      users: [
        { id: "u1", name: "Ada Lovelace" },
        { id: "u2", name: "Grace Hopper" },
      ],
      selectedUserId: "u2",
    },
    Button: { variant: "danger", children: "Delete project", onClick: noop },
    ChatRoom: { roomId: "general" },
    CheckoutPage: { flags: { newPaymentSheet: true } },
    CommentForm: {
      comments: [
        { id: "comment-1", body: "Looks ready." },
        { id: "comment-2", body: "Ship it." },
      ],
      createComment: asyncNoop,
    },
    Dashboard: {},
    DashboardPage: {},
    DateRangeSelector: { initialRange: "30d" },
    DeleteProjectButton: { canDelete: true, onDelete: noop },
    DisplayNameForm: {},
    FavoriteButton: {},
    FilteredReport: {
      rows: [
        { id: "row-1", name: "Revenue" },
        { id: "row-2", name: "Retention" },
      ],
    },
    FocusNameButton: {},
    HelpDisclosure: {},
    HomeScreen: { onStart: noop },
    IconButton: {
      label: "Open menu",
      icon: React.createElement("span", { "aria-hidden": true }, "Menu"),
      onClick: noop,
    },
    InStockOnly: { checked: true, onChange: noop },
    InstrumentedDashboard: {},
    LikeButton: { liked: false, count: 41, saveLike: asyncNoop },
    List: {
      items: products,
      getKey: (item) => item.id,
      renderItem: (item) => item.name,
    },
    OnlineStatus: {},
    Panel: {
      title: "Billing",
      children: [
        React.createElement("p", { key: "copy" }, "Your card is current."),
        React.createElement("button", { key: "action", type: "button" }, "Update payment method"),
      ],
    },
    Price: { cents: 12900, currency: "USD", locale: "en-US" },
    ProductCard: { name: "Trail shoes", priceCents: 12900, inStock: true },
    ProductGrid: { products },
    ProductPage: { params: Promise.resolve({ id: "shoe" }) },
    ProductSearch: { products },
    ProjectPage: { projectId: "project-1" },
    ProjectRoute: {
      loaderData: {
        id: "project-1",
        name: "Launch plan",
        description: "Coordinate release tasks before the public launch.",
      },
    },
    ProjectTabs: {},
    ProjectTaskList: {
      projects: [
        { id: "project-1", name: "Launch", tasks },
        { id: "project-2", name: "Retrospective", tasks: tasks.slice(0, 1) },
      ],
    },
    ReducerCounter: {},
    ReportsPage: {},
    RenameProjectButton: { projectId: "project-1" },
    RoomTitle: { roomId: "general" },
    SaveStatus: {},
    SearchableGrid: { items: ["Trail shoes", "Rain shell", "Camp mug"] },
    SettingsForm: { action: noop },
    SettingsRow: {
      label: "Email updates",
      description: "Receive release notes and billing notices.",
      action: React.createElement("button", null, "Edit"),
    },
    TaskBoard: { tasks },
    TaskList: { tasks },
    TextField: { label: "Email", error: "Enter a valid email address." },
    ThemeProvider: { theme: "dark", children: reactChild("Theme-aware content") },
  };

  if (title === "Nested layout") return { children: reactChild("Billing settings") };
  if (title === "Generic account layout") return { children: reactChild("Profile settings") };
  return byComponent[componentName] ?? {};
}

function selectRenderTarget(exports, code) {
  if (typeof exports.default === "function") {
    return { component: exports.default, name: exports.default.name || "DefaultComponent" };
  }

  if (exports.default?.component) {
    const story = Object.values(exports).find(
      (value) => value && typeof value === "object" && "args" in value,
    );

    if (story?.args) {
      return {
        component: exports.default.component,
        name: exports.default.component.name || "StoryComponent",
        props: story.args,
      };
    }
  }

  const preferredName = firstComponentName(code);
  if (preferredName && typeof exports[preferredName] === "function") {
    return { component: exports[preferredName], name: preferredName };
  }

  const namedComponent = Object.entries(exports).find(
    ([name, value]) => /^[A-Z]/.test(name) && typeof value === "function",
  );

  if (!namedComponent) return null;
  return { component: namedComponent[1], name: namedComponent[0] };
}

function wrapElementForPackages(element, code) {
  if (!/@tanstack\/react-query/.test(code)) return element;

  const { QueryClient, QueryClientProvider } = baseRequire("@tanstack/react-query");
  return React.createElement(
    QueryClientProvider,
    { client: new QueryClient() },
    element,
  );
}

async function renderReactExample({ code, title, id }) {
  const moduleCache = new Map();
  const environment = createExampleEnvironment();
  const exports = evaluateModule(code, `${id}.tsx`, moduleCache, environment);
  const target = selectRenderTarget(exports, code);

  if (!target) {
    throw new Error("No exported React component found.");
  }

  const props = fixtureProps({ title, componentName: target.name });
  const resolvedProps = target.props ?? props;
  let element;

  if (target.component.constructor.name === "AsyncFunction") {
    element = await target.component(resolvedProps);
  } else {
    element = React.createElement(target.component, resolvedProps);
  }

  const wrapped = wrapElementForPackages(element, code);
  return renderToStaticMarkup(wrapped);
}

function resultOutput(title, reason) {
  return `<p><strong>${htmlEscape(title)}.</strong> ${htmlEscape(reason)}</p>`;
}

function runnerOutput(title, reason, id) {
  return `<div class="react-example-output__runner" data-react-example-runner="${htmlEscape(id)}">
  <button type="button" class="react-example-output__run-button">Run example</button>
  <div class="react-example-output__runner-output" aria-live="polite">
    ${resultOutput(title, reason)}
  </div>
</div>`;
}

async function outputBody({ title, code, id }) {
  const browserLiveRenderable = isBrowserLiveRenderable(code);

  if (/\b(describe|it|test)\(/.test(code) && /\bexpect\(/.test(code)) {
    return {
      mode: "result",
      interactionMode: "runner",
      label: "Test result",
      body: runnerOutput(title, "The test runner executes the assertions for this example.", id),
    };
  }

  if (/\bcreateRoot\(/.test(code)) {
    return {
      mode: "result",
      interactionMode: "runner",
      label: "Browser result",
      body: runnerOutput(title, "The browser entrypoint mounts the React tree into the root DOM node.", id),
    };
  }

  if (containsJsx(code)) {
    try {
      const rendered = await renderReactExample({ code, title, id });
      return {
        mode: "react-server",
        interactionMode: browserLiveRenderable ? "live-component" : "runner",
        label: "React output",
        body: `<div class="react-example-output__rendered">${rendered}</div>`,
      };
    } catch (error) {
      return {
        mode: "result",
        interactionMode: "runner",
        label: "Runtime result",
        body: resultOutput(
          title,
          `This example requires its framework runtime to render on the page: ${sentence(error.message)}.`,
        ),
      };
    }
  }

  if (/\bdefineConfig\(/.test(code)) {
    return {
      mode: "result",
      interactionMode: "runner",
      label: "Config result",
      body: runnerOutput(title, "The code exports configuration consumed by the build tool.", id),
    };
  }

  return {
    mode: "result",
    interactionMode: "runner",
    label: "Runtime result",
    body: runnerOutput(title, "The code exports a value or function used by the surrounding example.", id),
  };
}

function buildOutputBlock({ id, title, output, entry }) {
  const interactionMode = output.interactionMode ?? "runner";
  const entryAttr =
    interactionMode === "live-component"
      ? ` data-live-entry="${htmlEscape(entry?.modulePath ?? "")}"`
      : ` data-runner-entry="${htmlEscape(entry?.modulePath ?? "")}"`;

  return `<div class="react-example-output not-content" data-react-example-output="${htmlEscape(id)}" data-render-mode="${output.mode}" data-interaction-mode="${interactionMode}"${entryAttr} role="region" aria-label="Output view: ${htmlEscape(title)}">
  <div class="react-example-output__header">${output.label}</div>
  <div class="react-example-output__body">
    ${output.body}
  </div>
</div>`;
}

function titleForFence(headings, fenceIndex, fallbackTitle) {
  const heading = headings.filter((headingMatch) => headingMatch.index < fenceIndex).at(-1);
  return heading?.[1]?.trim() ?? fallbackTitle;
}

async function syncFile(fileName, generatedEntries, generatedModules) {
  const filePath = path.join(postsDir, fileName);
  const original = readFileSync(filePath, "utf8");
  const headings = [...original.matchAll(exampleHeadingPattern)];
  const fences = [...original.matchAll(codeFencePattern)];
  let content = original;

  for (let index = fences.length - 1; index >= 0; index -= 1) {
    const fence = fences[index];
    const title = titleForFence(headings, fence.index, `Code example ${index + 1}`);
    const outputId = `${path.basename(fileName, ".md")}-${index + 1}-${slugify(title)}`;
    const componentName = firstComponentName(fence[2]);
    const output = await outputBody({ title, code: fence[2], id: outputId });
    const modulePath = output.interactionMode === "live-component" ? moduleImportPath(outputId) : null;

    generatedEntries.push({
      id: outputId,
      title,
      fileName,
      modulePath,
      mode: output.mode,
      interactionMode: output.interactionMode,
      componentName,
      needsQueryClientProvider: /@tanstack\/react-query/.test(fence[2]),
      summary: output.mode === "result"
        ? `${title}. This example uses a runner so the runtime can execute the code path.`
        : `${title}. This example mounts a live React component in the browser.`,
      props: output.interactionMode === "live-component"
        ? serializeFixtureProps(fixtureProps({ title, componentName: componentName ?? "" }))
        : null,
    });

    if (modulePath) {
      generatedModules.set(modulePath, buildGeneratedModuleSource(fence[2]));
    }

    const outputBlock = `\n\n${buildOutputBlock({
      id: outputId,
      title,
      output,
      entry: { modulePath: modulePath ?? outputId },
    })}\n\n`;
    const insertAt = fence.index + fence[0].length;
    const afterFence = content.slice(insertAt);
    const deleteLength = existingOutputLength(afterFence);

    content = `${content.slice(0, insertAt)}${outputBlock}${content.slice(
      insertAt + deleteLength,
    )}`;
  }

  if (content !== original && !checkOnly) {
    writeFileSync(filePath, content);
  }

  return {
    changed: content !== original,
    examples: fences.length,
    fileName,
  };
}

function writeGeneratedFiles(generatedEntries, generatedModules) {
  mkdirSync(generatedDir, { recursive: true });
  mkdirSync(generatedModuleDir, { recursive: true });

  for (const [modulePath, source] of generatedModules.entries()) {
    const fileName = modulePath.replace("./react-example-modules/", "");
    writeFileSync(path.join(generatedModuleDir, fileName), source);
  }

  const registrySource = `export const reactExampleRegistry = ${JSON.stringify(
    generatedEntries,
    null,
    2,
  )} as const;\n`;
  writeFileSync(registryPath, registrySource);
}

const results = [];
const generatedEntries = [];
const generatedModules = new Map();
for (const fileName of readdirSync(postsDir)
  .filter((entry) => reactPostFilePattern.test(entry))
  .sort()) {
  results.push(await syncFile(fileName, generatedEntries, generatedModules));
}

writeGeneratedFiles(generatedEntries, generatedModules);

const changed = results.filter((result) => result.changed);
const exampleCount = results.reduce((total, result) => total + result.examples, 0);

if (checkOnly && changed.length > 0) {
  console.error(
    `React example output views are out of sync in ${changed.length} file(s): ${changed
      .map((result) => result.fileName)
      .join(", ")}`,
  );
  process.exitCode = 1;
} else {
  console.log(
    `${checkOnly ? "Checked" : "Synced"} ${exampleCount} React example output view(s) across ${
      results.length
    } post(s). ${changed.length} file(s) ${checkOnly ? "would change" : "changed"}.`,
  );
}
