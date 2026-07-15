import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const defaultVectorRoot = path.join(
  repoRoot,
  "tools/coding-problem-vectors/vectors",
);
const defaultTemplateRoot = path.join(
  repoRoot,
  "tests/fixtures/coding-problem-vectors/templates",
);
const defaultGeneratedRoot = path.join(
  repoRoot,
  "tests/fixtures/coding-problem-vectors/generated",
);
const defaultCatalogRoot = path.join(
  repoRoot,
  "src/content/docs/topics/cs/coding-problems",
);

export const vectorLanguages = ["python", "typescript", "go", "swift"];
const classifications = ["valid", "boundary", "invalid"];
const comparisons = [
  "equal",
  "unordered",
  "multiset",
  "approximate",
  "identity",
  "structure",
  "mutated-arguments",
  "operation-results",
];
const codecs = [
  "boolean",
  "float",
  "graph-adjacency",
  "int",
  "int-array",
  "int-matrix",
  "interval-list",
  "list-node",
  "operation-sequence",
  "operation-results",
  "random-list",
  "string",
  "string-array",
  "string-matrix",
  "tree-level-order",
  "void",
];

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function exactKeys(value, allowed, location, errors) {
  if (!isObject(value)) {
    errors.push(`${location} must be an object`);
    return false;
  }
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) errors.push(`${location}.${key} is not part of schema version 1`);
  }
  return true;
}

function requiredString(value, location, errors, pattern) {
  if (typeof value !== "string" || value.length === 0) {
    errors.push(`${location} must be a non-empty string`);
    return;
  }
  if (value.includes("\n") || value.includes("\r")) {
    errors.push(`${location} must stay on one line`);
  }
  if (pattern && !pattern.test(value)) errors.push(`${location} has an invalid format`);
}

function isIntegerArray(value) {
  return Array.isArray(value) && value.every(Number.isSafeInteger);
}

function codecValueErrors(codec, value, location) {
  const errors = [];
  const arrayOf = (predicate) => Array.isArray(value) && value.every(predicate);

  if (codec === "int" && !Number.isSafeInteger(value)) errors.push(`${location} must be an integer`);
  if (codec === "float" && (typeof value !== "number" || !Number.isFinite(value))) {
    errors.push(`${location} must be a finite number`);
  }
  if (codec === "boolean" && typeof value !== "boolean") {
    errors.push(`${location} must be a boolean`);
  }
  if (codec === "string" && typeof value !== "string") errors.push(`${location} must be a string`);
  if ((codec === "int-array" || codec === "list-node") && !isIntegerArray(value)) {
    errors.push(`${location} must be an integer array`);
  }
  if (codec === "string-array" && !arrayOf((item) => typeof item === "string")) {
    errors.push(`${location} must be a string array`);
  }
  if (codec === "int-matrix" && !arrayOf(isIntegerArray)) {
    errors.push(`${location} must be an integer matrix`);
  }
  if (codec === "string-matrix" && !arrayOf(
    (row) => Array.isArray(row) && row.every((item) => typeof item === "string"),
  )) {
    errors.push(`${location} must be a string matrix`);
  }
  if (codec === "tree-level-order" && !arrayOf(
    (item) => item === null || Number.isSafeInteger(item),
  )) {
    errors.push(`${location} must be a level-order array of integers and nulls`);
  }
  if (codec === "graph-adjacency" && !arrayOf(isIntegerArray)) {
    errors.push(`${location} must be an integer adjacency list`);
  }
  if (codec === "interval-list" && !arrayOf(
    (interval) => isIntegerArray(interval) && interval.length === 2,
  )) {
    errors.push(`${location} must be a list of two-integer intervals`);
  }
  if (codec === "random-list" && !arrayOf((item) => {
    if (!exactObjectShape(item, ["value", "randomIndex"])) return false;
    return Number.isSafeInteger(item.value) &&
      (item.randomIndex === null || Number.isSafeInteger(item.randomIndex));
  })) {
    errors.push(`${location} must be random-list entries with value and randomIndex`);
  }
  if (codec === "operation-sequence" && !arrayOf((item) => {
    if (!exactObjectShape(item, ["operation", "arguments"])) return false;
    return /^[A-Za-z_][A-Za-z0-9_]*$/.test(item.operation) && Array.isArray(item.arguments);
  })) {
    errors.push(`${location} must be operation entries with raw argument arrays`);
  }
  if (codec === "operation-results" && !Array.isArray(value)) {
    errors.push(`${location} must be an operation result array`);
  }
  if (codec === "void" && value !== null) errors.push(`${location} must be null for void`);

  return errors;
}

function exactObjectShape(value, keys) {
  return isObject(value) &&
    Object.keys(value).length === keys.length &&
    keys.every((key) => Object.hasOwn(value, key));
}

function validateEntrypoint(entrypoint, language, executionKind, location, errors) {
  if (executionKind === "operation-sequence") {
    if (!exactKeys(entrypoint, ["type"], location, errors)) return;
    requiredString(entrypoint.type, `${location}.type`, errors, /^[A-Za-z_][A-Za-z0-9_]*$/);
    return;
  }
  if (language === "swift") {
    if (!exactKeys(entrypoint, ["type", "method"], location, errors)) return;
    requiredString(entrypoint.type, `${location}.type`, errors, /^[A-Za-z_][A-Za-z0-9_]*$/);
    requiredString(entrypoint.method, `${location}.method`, errors, /^[A-Za-z_][A-Za-z0-9_]*$/);
    return;
  }

  if (!exactKeys(entrypoint, ["function"], location, errors)) return;
  requiredString(entrypoint.function, `${location}.function`, errors, /^[A-Za-z_][A-Za-z0-9_]*$/);
}

export function vectorDocumentErrors(document, { expectedCategory, expectedSlug } = {}) {
  const errors = [];
  if (!exactKeys(
    document,
    ["schemaVersion", "problem", "contract", "execution", "proofFixture", "cases"],
    "vector",
    errors,
  )) return errors;

  if (document.schemaVersion !== 1) errors.push("vector.schemaVersion must equal 1");

  if (exactKeys(document.problem, ["category", "slug"], "vector.problem", errors)) {
    requiredString(document.problem.category, "vector.problem.category", errors, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    requiredString(document.problem.slug, "vector.problem.slug", errors, /^\d+-[a-z0-9]+(?:-[a-z0-9]+)*$/);
    if (expectedCategory && document.problem.category !== expectedCategory) {
      errors.push(`vector.problem.category must equal ${expectedCategory}`);
    }
    if (expectedSlug && document.problem.slug !== expectedSlug) {
      errors.push(`vector.problem.slug must equal ${expectedSlug}`);
    }
  }

  if (exactKeys(
    document.contract,
    ["parameters", "result", "mutatedParameters", "invalidInputPolicy"],
    "vector.contract",
    errors,
  )) {
    if (!Array.isArray(document.contract.parameters) || document.contract.parameters.length === 0) {
      errors.push("vector.contract.parameters must contain at least one parameter");
    } else {
      const names = new Set();
      document.contract.parameters.forEach((parameter, index) => {
        const location = `vector.contract.parameters[${index}]`;
        if (!exactKeys(parameter, ["name", "codec"], location, errors)) return;
        requiredString(parameter.name, `${location}.name`, errors, /^[A-Za-z_][A-Za-z0-9_]*$/);
        if (names.has(parameter.name)) errors.push(`${location}.name must be unique`);
        names.add(parameter.name);
        if (!codecs.includes(parameter.codec) || parameter.codec === "void") {
          errors.push(`${location}.codec is not a supported parameter codec`);
        }
      });

      if (!Array.isArray(document.contract.mutatedParameters)) {
        errors.push("vector.contract.mutatedParameters must be an array");
      } else {
        for (const name of document.contract.mutatedParameters) {
          if (!names.has(name)) errors.push(`vector.contract.mutatedParameters names unknown parameter ${name}`);
        }
        if (new Set(document.contract.mutatedParameters).size !== document.contract.mutatedParameters.length) {
          errors.push("vector.contract.mutatedParameters must not contain duplicates");
        }
      }
    }

    if (exactKeys(document.contract.result, ["codec", "comparison"], "vector.contract.result", errors)) {
      if (!codecs.includes(document.contract.result.codec)) {
        errors.push("vector.contract.result.codec is not supported");
      }
      if (!comparisons.includes(document.contract.result.comparison)) {
        errors.push("vector.contract.result.comparison is not supported");
      }
    }
    if (!["excluded", "solution-handled"].includes(document.contract.invalidInputPolicy)) {
      errors.push("vector.contract.invalidInputPolicy must be excluded or solution-handled");
    }
  }

  if (exactKeys(document.execution, ["kind", "entrypoints"], "vector.execution", errors)) {
    if (!["function", "operation-sequence"].includes(document.execution.kind)) {
      errors.push("vector.execution.kind must be function or operation-sequence");
    }
    if (exactKeys(document.execution.entrypoints, vectorLanguages, "vector.execution.entrypoints", errors)) {
      for (const language of vectorLanguages) {
        validateEntrypoint(
          document.execution.entrypoints[language],
          language,
          document.execution.kind,
          `vector.execution.entrypoints.${language}`,
          errors,
        );
      }
    }
  }

  if (document.execution?.kind === "operation-sequence") {
    const parameters = document.contract?.parameters;
    if (parameters?.length !== 1 || parameters[0]?.codec !== "operation-sequence") {
      errors.push("operation-sequence execution requires one operation-sequence parameter");
    }
    if (document.contract?.result?.codec !== "operation-results" ||
        document.contract?.result?.comparison !== "operation-results") {
      errors.push("operation-sequence execution requires operation-results comparison");
    }
  }

  if (document.proofFixture !== undefined && typeof document.proofFixture !== "boolean") {
    errors.push("vector.proofFixture must be a boolean when present");
  }

  if (!Array.isArray(document.cases) || document.cases.length === 0) {
    errors.push("vector.cases must contain cases");
    return errors;
  }

  const ids = new Set();
  const counts = Object.fromEntries(classifications.map((classification) => [classification, 0]));
  document.cases.forEach((testCase, index) => {
    const location = `vector.cases[${index}]`;
    if (!exactKeys(testCase, ["id", "classification", "arguments", "expected"], location, errors)) {
      return;
    }
    requiredString(testCase.id, `${location}.id`, errors, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    if (ids.has(testCase.id)) errors.push(`${location}.id must be unique`);
    ids.add(testCase.id);

    if (!classifications.includes(testCase.classification)) {
      errors.push(`${location}.classification is not supported`);
    } else {
      counts[testCase.classification] += 1;
    }

    if (!Array.isArray(testCase.arguments) ||
        testCase.arguments.length !== document.contract?.parameters?.length) {
      errors.push(`${location}.arguments must match the parameter count`);
    } else {
      document.contract.parameters.forEach((parameter, argumentIndex) => {
        errors.push(...codecValueErrors(
          parameter.codec,
          testCase.arguments[argumentIndex],
          `${location}.arguments[${argumentIndex}]`,
        ));
      });
    }

    if (!isObject(testCase.expected) || typeof testCase.expected.kind !== "string") {
      errors.push(`${location}.expected must declare a kind`);
      return;
    }
    if (testCase.expected.kind === "value") {
      exactKeys(testCase.expected, ["kind", "value"], `${location}.expected`, errors);
      errors.push(...codecValueErrors(
        document.contract?.result?.codec,
        testCase.expected.value,
        `${location}.expected.value`,
      ));
      if (document.execution?.kind === "operation-sequence" &&
          Array.isArray(testCase.arguments?.[0]) &&
          Array.isArray(testCase.expected.value)) {
        const operations = testCase.arguments[0];
        if (testCase.expected.value.length !== operations.length) {
          errors.push(`${location}.expected.value must align with every operation`);
        }
        if (operations[0]?.operation !== "init" || operations[0]?.arguments?.length !== 0) {
          errors.push(`${location} executable operation sequences must start with init and no arguments`);
        }
        if (testCase.expected.value[0] !== null) {
          errors.push(`${location}.expected.value[0] must be null for init`);
        }
        for (let operationIndex = 1; operationIndex < operations.length; operationIndex += 1) {
          if (operations[operationIndex]?.operation === "init") {
            errors.push(`${location}.arguments[0][${operationIndex}] must not reinitialize the subject`);
          }
        }
      }
    } else if (testCase.expected.kind === "excluded") {
      exactKeys(testCase.expected, ["kind", "reason"], `${location}.expected`, errors);
      requiredString(testCase.expected.reason, `${location}.expected.reason`, errors);
    } else if (testCase.expected.kind === "error") {
      exactKeys(testCase.expected, ["kind", "errorId"], `${location}.expected`, errors);
      requiredString(testCase.expected.errorId, `${location}.expected.errorId`, errors, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    } else {
      errors.push(`${location}.expected.kind is not supported`);
    }

    if (["valid", "boundary"].includes(testCase.classification) &&
        testCase.expected.kind !== "value") {
      errors.push(`${location} valid and boundary cases require a value expectation`);
    }
    if (testCase.classification === "invalid") {
      if (document.contract?.invalidInputPolicy === "excluded" &&
          testCase.expected.kind !== "excluded") {
        errors.push(`${location} invalid input must stay excluded by this problem contract`);
      }
      if (document.contract?.invalidInputPolicy === "solution-handled" &&
          testCase.expected.kind === "excluded") {
        errors.push(`${location} invalid input must exercise the solution-owned behavior`);
      }
    }
  });

  for (const classification of classifications) {
    if (counts[classification] === 0) {
      errors.push(`vector.cases must include at least one ${classification} case`);
    }
  }

  return errors;
}

function sortedJson(value) {
  if (Array.isArray(value)) return value.map(sortedJson);
  if (!isObject(value)) return value;
  return Object.fromEntries(
    Object.keys(value).sort().map((key) => [key, sortedJson(value[key])]),
  );
}

export function vectorDigest(document) {
  return createHash("sha256")
    .update(JSON.stringify(sortedJson(document)))
    .digest("hex");
}

export function serializeVectorDocument(document) {
  return `${JSON.stringify(document, null, 2)}\n`;
}

function vectorFiles(root) {
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((entry) => {
      const entryPath = path.join(root, entry.name);
      if (entry.isDirectory()) return vectorFiles(entryPath);
      return entry.name.endsWith(".json") ? [entryPath] : [];
    });
}

export function loadVectorDocuments({ vectorRoot = defaultVectorRoot } = {}) {
  return vectorFiles(vectorRoot).map((filePath) => {
    const source = readFileSync(filePath, "utf8");
    let document;
    try {
      document = JSON.parse(source);
    } catch (error) {
      throw new Error(`${filePath}: invalid JSON: ${error.message}`);
    }
    const expectedCategory = path.basename(path.dirname(filePath));
    const expectedSlug = path.basename(filePath, ".json");
    const errors = vectorDocumentErrors(document, { expectedCategory, expectedSlug });
    return { document, errors, filePath, source };
  });
}

export function loadProblemVector({ category, slug, vectorRoot = defaultVectorRoot }) {
  const filePath = path.join(vectorRoot, category, `${slug}.json`);
  if (!existsSync(filePath)) {
    return {
      caseCounts: { valid: 0, boundary: 0, invalid: 0 },
      document: null,
      errors: ["shared vector file is missing"],
      exists: false,
      filePath,
    };
  }

  const source = readFileSync(filePath, "utf8");
  let document;
  try {
    document = JSON.parse(source);
  } catch (error) {
    return {
      caseCounts: { valid: 0, boundary: 0, invalid: 0 },
      document: null,
      errors: [`invalid JSON: ${error.message}`],
      exists: true,
      filePath,
    };
  }
  const errors = vectorDocumentErrors(document, {
    expectedCategory: category,
    expectedSlug: slug,
  });
  const caseCounts = Object.fromEntries(classifications.map((classification) => [
    classification,
    Array.isArray(document.cases)
      ? document.cases.filter((testCase) => testCase.classification === classification).length
      : 0,
  ]));
  return { caseCounts, document, errors, exists: true, filePath };
}

function quoteString(value) {
  return JSON.stringify(value);
}

function renderLiteral(codec, value, language) {
  if (codec === "int" || codec === "float") return String(value);
  if (codec === "boolean") {
    if (language === "python") return value ? "True" : "False";
    return value ? "true" : "false";
  }
  if (codec === "string") return quoteString(value);

  const elementCodec = {
    "graph-adjacency": "int-array",
    "int-array": "int",
    "int-matrix": "int-array",
    "string-array": "string",
    "string-matrix": "string-array",
  }[codec];
  if (!elementCodec) throw new Error(`Proof renderer does not support codec ${codec}`);

  const items = value.map((item) => renderLiteral(elementCodec, item, language));
  if (language === "go") {
    const goType = {
      "graph-adjacency": "[][]int",
      "int-array": "[]int",
      "int-matrix": "[][]int",
      "string-array": "[]string",
      "string-matrix": "[][]string",
    }[codec];
    return `${goType}{${items.join(", ")}}`;
  }
  return `[${items.join(", ")}]`;
}

function renderRawScalar(value, language) {
  if (typeof value === "string") return quoteString(value);
  if (typeof value === "boolean") {
    if (language === "python") return value ? "True" : "False";
    return value ? "true" : "false";
  }
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  throw new Error(`Operation renderer does not support raw value ${JSON.stringify(value)}`);
}

function operationSubjectName(caseIndex) {
  return `subject${caseIndex + 1}`;
}

function renderOperationSequenceCase(document, language, testCase, caseIndex, indent) {
  const operations = testCase.arguments[0];
  const expected = testCase.expected.value;
  const entrypoint = document.execution.entrypoints[language];
  const subject = operationSubjectName(caseIndex);
  const lines = [];

  if (language === "python") lines.push(`${indent}${subject} = ${entrypoint.type}()`);
  if (language === "typescript") lines.push(`${indent}const ${subject} = new ${entrypoint.type}();`);
  if (language === "go") lines.push(`${indent}${subject} := New${entrypoint.type}()`);
  if (language === "swift") lines.push(`${indent}let ${subject} = ${entrypoint.type}()`);

  for (let index = 1; index < operations.length; index += 1) {
    const operation = operations[index];
    const method = language === "go"
      ? `${operation.operation[0].toUpperCase()}${operation.operation.slice(1)}`
      : operation.operation;
    const arguments_ = operation.arguments.map((value) => renderRawScalar(value, language));
    const call = `${subject}.${method}(${arguments_.join(", ")})`;
    const caseId = `${testCase.id}[${index}]`;
    if (expected[index] === null) {
      lines.push(`${indent}${call}${language === "typescript" ? ";" : ""}`);
      continue;
    }

    const expectedValue = renderRawScalar(expected[index], language);
    if (language === "python") {
      lines.push(`${indent}assert ${call} == ${expectedValue}, ${quoteString(caseId)}`);
    } else if (language === "typescript") {
      lines.push(`${indent}assert(${call} === ${expectedValue}, ${quoteString(caseId)});`);
    } else if (language === "go") {
      lines.push(`${indent}assert(${call} == ${expectedValue}, ${quoteString(caseId)})`);
    } else {
      lines.push(`${indent}expectEqual(${call}, ${expectedValue}, ${quoteString(caseId)})`);
    }
  }

  return lines;
}

function renderCall(document, language, arguments_) {
  const renderedArguments = arguments_.map((value, index) => renderLiteral(
    document.contract.parameters[index].codec,
    value,
    language,
  ));
  const entrypoint = document.execution.entrypoints[language];
  if (language === "swift") {
    return `${entrypoint.type}().${entrypoint.method}(${renderedArguments.join(", ")})`;
  }
  return `${entrypoint.function}(${renderedArguments.join(", ")})`;
}

function renderMutatedArgumentsCase(document, language, testCase, caseIndex, indent) {
  const mutated = document.contract.mutatedParameters;
  if (mutated.length !== 1) {
    throw new Error("Mutated-arguments rendering requires exactly one mutated parameter");
  }
  const parameterIndex = document.contract.parameters.findIndex(
    (parameter) => parameter.name === mutated[0],
  );
  const parameter = document.contract.parameters[parameterIndex];
  if (parameter.codec !== document.contract.result.codec) {
    throw new Error("Mutated-arguments rendering requires the observed parameter and result codecs to match");
  }

  const variable = `argument${caseIndex + 1}`;
  const renderedArguments = testCase.arguments.map((value, index) => renderLiteral(
    document.contract.parameters[index].codec,
    value,
    language,
  ));
  const expected = renderLiteral(
    document.contract.result.codec,
    testCase.expected.value,
    language,
  );
  const entrypoint = document.execution.entrypoints[language];
  const declaration = {
    python: `${variable} = ${renderedArguments[parameterIndex]}`,
    typescript: `const ${variable} = ${renderedArguments[parameterIndex]};`,
    go: `${variable} := ${renderedArguments[parameterIndex]}`,
    swift: parameter.codec === "string-matrix"
      ? `var ${variable}: [[Character]] = ${renderedArguments[parameterIndex]}`
      : `var ${variable} = ${renderedArguments[parameterIndex]}`,
  }[language];
  renderedArguments[parameterIndex] = language === "swift" ? `&${variable}` : variable;
  const call = language === "swift"
    ? `${entrypoint.type}().${entrypoint.method}(${renderedArguments.join(", ")})`
    : `${entrypoint.function}(${renderedArguments.join(", ")})`;

  return [
    `${indent}${declaration}`,
    `${indent}${call}${language === "typescript" ? ";" : ""}`,
    renderEqualAssertion(document, language, variable, expected, testCase.id, indent),
  ];
}

function renderGraphStructureCase(document, language, testCase, caseIndex, indent) {
  if (document.contract.parameters.length !== 1 ||
      document.contract.parameters[0].codec !== "graph-adjacency" ||
      document.contract.result.codec !== "graph-adjacency") {
    throw new Error("Graph structure rendering requires one graph-adjacency parameter and result");
  }

  const adjacency = renderLiteral("graph-adjacency", testCase.arguments[0], language);
  const expected = renderLiteral("graph-adjacency", testCase.expected.value, language);
  const original = `original${caseIndex + 1}`;
  const entrypoint = document.execution.entrypoints[language];
  const call = language === "swift"
    ? `${entrypoint.type}().${entrypoint.method}(${original})`
    : `${entrypoint.function}(${original})`;
  const declaration = {
    python: `${original} = make_graph(${adjacency})`,
    typescript: `const ${original} = makeGraph(${adjacency});`,
    go: `${original} := makeGraph(${adjacency})`,
    swift: `let ${original} = makeGraph(${adjacency})`,
  }[language];
  const assertion = {
    python: `assert is_valid_clone(${original}, ${call}, ${expected}), ${quoteString(testCase.id)}`,
    typescript: `assert(isValidClone(${original}, ${call}, ${expected}), ${quoteString(testCase.id)});`,
    go: `assert(isValidClone(${original}, ${call}, ${expected}), ${quoteString(testCase.id)})`,
    swift: `expectTrue(isValidClone(${original}, ${call}, ${expected}), ${quoteString(testCase.id)})`,
  }[language];
  return [`${indent}${declaration}`, `${indent}${assertion}`];
}

function commentPrefix(language) {
  return language === "python" ? "#" : "//";
}

function renderGoCollectionEquality(codec, call, expected) {
  const elementType = {
    "int-array": "int",
    "string-array": "string",
    "int-matrix": "[]int",
    "string-matrix": "[]string",
  }[codec];
  if (!elementType) throw new Error(`Go equality renderer does not support codec ${codec}`);

  const comparison = codec.endsWith("-matrix")
    ? "if len(actual[i]) != len(expected[i]) { return false }; for j := range actual[i] { if actual[i][j] != expected[i][j] { return false } }"
    : "if actual[i] != expected[i] { return false }";
  return `func(actual, expected []${elementType}) bool { if len(actual) != len(expected) { return false }; for i := range actual { ${comparison} }; return true }(${call}, ${expected})`;
}

function renderEqualAssertion(document, language, call, expected, caseId, indent) {
  const codec = document.contract.result.codec;
  const isCollection = ["int-array", "int-matrix", "string-array", "string-matrix"].includes(codec);
  if (language === "python") {
    return `${indent}assert ${call} == ${expected}, ${quoteString(caseId)}`;
  }
  if (language === "typescript") {
    const comparison = isCollection
      ? `JSON.stringify(${call}) === JSON.stringify(${expected})`
      : `${call} === ${expected}`;
    return `${indent}assert(${comparison}, ${quoteString(caseId)});`;
  }
  if (language === "go") {
    const comparison = isCollection
      ? renderGoCollectionEquality(codec, call, expected)
      : `${call} == ${expected}`;
    return `${indent}assert(${comparison}, ${quoteString(caseId)})`;
  }
  return `${indent}expectEqual(${call}, ${expected}, ${quoteString(caseId)})`;
}

export function renderVectorBlock(document, language) {
  if (!vectorLanguages.includes(language)) throw new Error(`Unknown vector language ${language}`);
  const supportedFunctionComparisons = ["equal", "mutated-arguments", "structure"];
  if (document.execution.kind === "function" &&
      !supportedFunctionComparisons.includes(document.contract.result.comparison)) {
    throw new Error("Proof rendering does not support this result comparison");
  }
  if (document.execution.kind === "function" &&
      !["boolean", "float", "graph-adjacency", "int", "string", "int-array", "int-matrix", "string-array", "string-matrix"]
        .includes(document.contract.result.codec)) {
    throw new Error("Proof rendering does not support this result codec");
  }

  const indent = language === "go" ? "\t" : "    ";
  const comment = commentPrefix(language);
  const digest = vectorDigest(document);
  const lines = [`${indent}${comment} TEST_VECTORS_BEGIN sha256:${digest}`];

  for (const [caseIndex, testCase] of document.cases.entries()) {
    if (testCase.expected.kind === "excluded") {
      const rawArguments = JSON.stringify(testCase.arguments);
      lines.push(
        `${indent}${comment} EXCLUDED_VECTOR ${testCase.id}: ${rawArguments} | ${testCase.expected.reason}`,
      );
      continue;
    }
    if (testCase.expected.kind !== "value") {
      throw new Error(`Proof rendering does not support expectation ${testCase.expected.kind}`);
    }

    if (document.execution.kind === "operation-sequence") {
      lines.push(...renderOperationSequenceCase(document, language, testCase, caseIndex, indent));
      continue;
    }

    if (document.contract.result.comparison === "mutated-arguments") {
      lines.push(...renderMutatedArgumentsCase(
        document,
        language,
        testCase,
        caseIndex,
        indent,
      ));
      continue;
    }

    if (document.contract.result.comparison === "structure") {
      lines.push(...renderGraphStructureCase(
        document,
        language,
        testCase,
        caseIndex,
        indent,
      ));
      continue;
    }

    const call = renderCall(document, language, testCase.arguments);
    const expected = renderLiteral(document.contract.result.codec, testCase.expected.value, language);
    lines.push(renderEqualAssertion(
      document,
      language,
      call,
      expected,
      testCase.id,
      indent,
    ));
  }

  lines.push(`${indent}${comment} TEST_VECTORS_END`);
  return lines.join("\n");
}

function catalogVectorFiles(document, language, catalogRoot = defaultCatalogRoot) {
  const extension = { python: "py", typescript: "ts", go: "go", swift: "swift" }[language];
  const categoryRoot = path.join(catalogRoot, document.problem.category);
  if (!existsSync(categoryRoot)) return [];
  return readdirSync(categoryRoot)
    .filter((fileName) => fileName.startsWith(document.problem.slug))
    .filter((fileName) => fileName.endsWith(`.${extension}`))
    .map((fileName) => path.join(categoryRoot, fileName));
}

function syncedCatalogSource(source, document, language, filePath) {
  const beginCount = source.split("TEST_VECTORS_BEGIN").length - 1;
  const endCount = source.split("TEST_VECTORS_END").length - 1;
  if (beginCount === 0 && endCount === 0) return null;
  if (beginCount !== 1 || endCount !== 1) {
    throw new Error(`${relative(filePath)} must contain exactly one complete test-vector block`);
  }
  const pattern = /^[ \t]*(?:#|\/\/) TEST_VECTORS_BEGIN[^\n]*\n[\s\S]*?^[ \t]*(?:#|\/\/) TEST_VECTORS_END$/m;
  if (!pattern.test(source)) {
    throw new Error(`${relative(filePath)} has malformed test-vector markers`);
  }
  return source.replace(pattern, renderVectorBlock(document, language));
}

function proofFileName(slug, language, template = false) {
  const extensions = { python: "py", typescript: "ts", go: "go", swift: "swift" };
  const suffix = language === "swift" && !template ? "-approach1" : "";
  const templateSuffix = template ? ".template" : "";
  return `${slug}${suffix}.${extensions[language]}${templateSuffix}`;
}

export function proofFixtureRecords(
  document,
  { templateRoot = defaultTemplateRoot, generatedRoot = defaultGeneratedRoot } = {},
) {
  if (!document.proofFixture) return [];
  return vectorLanguages.map((language) => {
    const templatePath = path.join(
      templateRoot,
      proofFileName(document.problem.slug, language, true),
    );
    const outputPath = path.join(
      generatedRoot,
      proofFileName(document.problem.slug, language),
    );
    if (!existsSync(templatePath)) throw new Error(`Missing proof template ${templatePath}`);
    const template = readFileSync(templatePath, "utf8");
    const markerCount = template.split("{{TEST_VECTORS}}").length - 1;
    if (markerCount !== 1) throw new Error(`${templatePath} must contain one vector marker`);
    return {
      language,
      outputPath,
      source: template.replace("{{TEST_VECTORS}}", renderVectorBlock(document, language)),
      templatePath,
    };
  });
}

function relative(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

function runCli() {
  const write = process.argv.includes("--write");
  const records = loadVectorDocuments();
  const failures = [];
  let caseCount = 0;
  let proofCount = 0;
  const expectedProofPaths = new Set();

  for (const record of records) {
    caseCount += record.document.cases?.length ?? 0;
    for (const error of record.errors) failures.push(`${relative(record.filePath)}: ${error}`);
    const canonical = serializeVectorDocument(record.document);
    if (record.source !== canonical) {
      if (write) writeFileSync(record.filePath, canonical);
      else failures.push(`${relative(record.filePath)} is not canonically formatted`);
    }
    if (record.errors.length > 0) continue;

    for (const language of vectorLanguages) {
      for (const filePath of catalogVectorFiles(record.document, language)) {
        const existing = readFileSync(filePath, "utf8");
        let synced;
        try {
          synced = syncedCatalogSource(existing, record.document, language, filePath);
        } catch (error) {
          failures.push(error.message);
          continue;
        }
        if (synced === null || synced === existing) continue;
        if (write) writeFileSync(filePath, synced);
        else failures.push(`${relative(filePath)} has a stale test-vector block`);
      }
    }

    for (const fixture of proofFixtureRecords(record.document)) {
      proofCount += 1;
      expectedProofPaths.add(fixture.outputPath);
      const existing = existsSync(fixture.outputPath)
        ? readFileSync(fixture.outputPath, "utf8")
        : null;
      if (existing === fixture.source) continue;
      if (write) {
        mkdirSync(path.dirname(fixture.outputPath), { recursive: true });
        writeFileSync(fixture.outputPath, fixture.source);
      } else {
        failures.push(`${relative(fixture.outputPath)} is missing or stale`);
      }
    }
  }

  if (existsSync(defaultGeneratedRoot)) {
    for (const entry of readdirSync(defaultGeneratedRoot, { withFileTypes: true })) {
      if (!entry.isFile()) continue;
      const filePath = path.join(defaultGeneratedRoot, entry.name);
      if (expectedProofPaths.has(filePath)) continue;
      if (write) unlinkSync(filePath);
      else failures.push(`${relative(filePath)} is a stale generated proof fixture`);
    }
  }

  if (failures.length > 0) {
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return;
  }

  console.log(
    `Coding-problem vectors passed: ${records.length} problem(s), ${caseCount} case(s), ` +
      `${proofCount} proof fixture(s).`,
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli();
}
