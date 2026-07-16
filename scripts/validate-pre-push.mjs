import { spawn } from "node:child_process";

const skipCustom = process.argv.includes("--skip-custom");
const includeExternal = process.argv.includes("--external-links");

const steps = [
  ["Secret scan", "bash", ["scripts/check-secrets.sh"]],
  ["Style validation", "npm", ["run", "validate:style"]],
  ["Published content review", "npm", ["run", "validate:published-content"]],
  ["React output sync", "npm", ["run", "check:react-outputs"]],
  ["React output tests", "npm", ["run", "test:react-outputs"]],
  ["Swift runner contract tests", "npm", ["run", "test:swift-runner-contract"]],
  ["Swift runner service tests", "npm", ["run", "test:swift-runner-service"]],
  ["Swift REPL component tests", "npm", ["run", "test:swift-repl"]],
  ["Coding-problem vector tests", "npm", ["run", "test:coding-problem-vectors"]],
  ["Coding-problem vector sync", "npm", ["run", "check:coding-problem-vectors"]],
  ["Swift coding-problem contract tests", "npm", ["run", "test:swift-catalog-contract"]],
  ["Swift catalog coverage tests", "npm", ["run", "test:swift-catalog-coverage"]],
  ["Swift catalog manifest", "npm", ["run", "check:swift-catalog-coverage"]],
  ["Code example validation", "npm", ["run", "validate:code-examples"]],
  ["Build", "npm", ["run", "build"]],
  ["Page validation", "npm", ["run", "validate:pages"]],
  ["Internal link validation", "npm", ["run", "validate:links"]],
];

if (includeExternal) {
  steps.push(["External link validation", "npm", ["run", "validate:external-links"]]);
}

if (!skipCustom) {
  steps.push(["Custom page validation", "npm", ["run", "validate:custom-pages"]]);
  steps.push(["Swift REPL browser validation", "npm", ["run", "validate:swift-repl-browser"]]);
}

function runStep([label, command, args]) {
  return new Promise((resolve, reject) => {
    console.log(`\n==> ${label}`);
    const child = spawn(command, args, {
      stdio: "inherit",
      env: process.env,
    });
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${label} failed with exit code ${code}`));
      }
    });
    child.on("error", reject);
  });
}

for (const step of steps) {
  await runStep(step);
}

console.log("\nPre-push validation passed.");
