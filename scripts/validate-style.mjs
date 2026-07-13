import { spawnSync } from "node:child_process";

const checks = [
  {
    label: "U+2014 em dash",
    args: ["-n", "\\x{2014}", "src", "docs", ".agents", "AGENTS.md", "README.md"],
  },
  {
    label: "bold-label comma bullets",
    args: [
      "-n",
      "^\\s*(?:[-*]|[0-9]+\\.) \\*\\*[^*]+\\*\\*,",
      "src/content/docs",
      "docs",
      "README.md",
    ],
  },
];

const reviewPattern =
  "In conclusio[n]|To summariz[e]|Ultimatel[y]|At the end of the da[y]|\\butiliz[e]\\b|\\b[Ll]everag[e]\\b|\\bdelv[e]\\b|dive int[o]|\\brobus[t]\\b|\\bcomprehensiv[e]\\b|seamlessl[y]|effortlessl[y]|\\bstreamlin[e]\\b|unlock the powe[r]|harness the powe[r]|It's worth notin[g]|On the other han[d]";

let failed = false;

for (const check of checks) {
  const result = spawnSync("rg", check.args, { encoding: "utf8" });
  if (result.status === 0) {
    failed = true;
    console.error(`${check.label} check failed:`);
    console.error(result.stdout);
  } else if (result.status > 1) {
    failed = true;
    console.error(`${check.label} check errored:`);
    console.error(result.stderr);
  }
}

const review = spawnSync(
  "rg",
  ["-n", reviewPattern, "src/content/docs", "docs", "README.md"],
  { encoding: "utf8" },
);

if (review.status === 0) {
  const unexpected = review.stdout
    .split("\n")
    .filter(Boolean)
    .filter((line) => !line.startsWith("src/content/docs/topics/ai/ai-text-markers/index.md:"));
  if (unexpected.length > 0) {
    failed = true;
    console.error("AI-marker vocabulary review found unexpected hits:");
    console.error(unexpected.join("\n"));
  }
} else if (review.status > 1) {
  failed = true;
  console.error("AI-marker vocabulary scan errored:");
  console.error(review.stderr);
}

if (failed) process.exit(1);

console.log("Style validation passed.");
