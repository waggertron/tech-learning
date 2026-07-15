import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const helperRoot = path.join(repoRoot, "tools/swift-catalog/helpers");

export const swiftSuccessMarker = "All Swift tests passed";

export const helperFiles = {
  "graph-node": "GraphNode.swift",
  heap: "BinaryHeap.swift",
  interval: "Interval.swift",
  "list-node": "ListNode.swift",
  "random-list-node": "RandomListNode.swift",
  "tree-node": "TreeNode.swift",
  "trie-node": "TrieNode.swift",
};

function normalized(source) {
  return source.replaceAll("\r\n", "\n").trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function canonicalHelper(fileName) {
  return normalized(readFileSync(path.join(helperRoot, fileName), "utf8"));
}

export const canonicalTestSupport = canonicalHelper("TestSupport.swift");

export function canonicalHelperSource(helperType) {
  const fileName = helperFiles[helperType];
  if (!fileName) throw new Error(`Unknown Swift catalog helper: ${helperType}`);
  return canonicalHelper(fileName);
}

export function swiftFileNameErrors(fileName, role) {
  const errors = [];
  const starterPattern = /^(?!.*-approach\d+\.swift$)\d+-[a-z0-9]+(?:-[a-z0-9]+)*\.swift$/;
  const approachPattern = /^\d+-[a-z0-9]+(?:-[a-z0-9]+)*-approach[1-9]\d*\.swift$/;
  const expectedPattern = role === "starter" ? starterPattern : approachPattern;

  if (!expectedPattern.test(fileName)) {
    errors.push(
      role === "starter"
        ? "starter filename must be <number>-<slug>.swift"
        : "approach filename must be <number>-<slug>-approachN.swift",
    );
  }

  return errors;
}

export function swiftSourceContractErrors({
  expectedVectorBlock,
  fileName,
  source,
  role,
  requiredHelpers = [],
}) {
  const errors = swiftFileNameErrors(fileName, role);
  const normalizedSource = normalized(source);

  if (/^\s*import\s+/m.test(source)) {
    errors.push("source must use only the Swift standard library and contain no imports");
  }
  if (!normalizedSource.includes(canonicalTestSupport)) {
    errors.push("source must include the canonical TestSupport.swift block");
  }
  if (expectedVectorBlock && !normalizedSource.includes(normalized(expectedVectorBlock))) {
    errors.push("source must include the exact canonical shared test-vector block");
  }
  if (!/^func runTests\(\)\s*\{/m.test(source)) {
    errors.push("source must declare func runTests()");
  }
  if (!/^runTests\(\)\s*$/m.test(source)) {
    errors.push("source must call runTests() at top level");
  }
  if (!/^\s*reportSuccess\(\)\s*$/m.test(source)) {
    errors.push(`runTests() must report success with ${JSON.stringify(swiftSuccessMarker)}`);
  }

  const withoutSupport = normalizedSource.replace(canonicalTestSupport, "");
  if (!/\bexpect(?:Equal|True)\s*\(/.test(withoutSupport)) {
    errors.push("runTests() must contain at least one canonical expectation call");
  }

  const typeDirective = /^\/\/ LEETCODE_TYPE: ([A-Za-z_][A-Za-z0-9_]*)\s*$/m.exec(source);
  if (!typeDirective) {
    errors.push("source must declare // LEETCODE_TYPE: <TypeName>");
  } else {
    const typeName = escapeRegExp(typeDirective[1]);
    const typeDeclaration = new RegExp(`\\b(?:final\\s+)?(?:class|struct)\\s+${typeName}\\b`);
    if (!typeDeclaration.test(source)) {
      errors.push(`LEETCODE_TYPE ${typeDirective[1]} must name a declared class or struct`);
    }
  }

  if (role === "starter") {
    if (!/^\s*\/\/ TODO: Implement\s*$/m.test(source)) {
      errors.push("starter must contain the exact marker // TODO: Implement");
    }
    if (!/fatalError\("TODO: Implement"\)/.test(source)) {
      errors.push('starter placeholder must be fatalError("TODO: Implement")');
    }
  } else if (/TODO: Implement|fatalError\("TODO: Implement"\)/.test(source)) {
    errors.push("completed approach source must not contain the starter TODO placeholder");
  }

  for (const helperType of requiredHelpers) {
    if (!normalizedSource.includes(canonicalHelperSource(helperType))) {
      errors.push(`source must include the canonical ${helperFiles[helperType] ?? helperType} block`);
    }
  }

  return errors;
}
