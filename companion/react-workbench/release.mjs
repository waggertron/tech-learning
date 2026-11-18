import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const name = process.argv[2];
if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) {
  throw new Error(
    "Pass one release name using lowercase letters, digits, and hyphens",
  );
}
const source = path.join(root, "dist");
const destination = path.join(root, "releases", name);
if (!existsSync(path.join(source, "index.html")))
  throw new Error("Build the workbench first");
if (existsSync(destination))
  throw new Error("Release already exists; choose a new name");
mkdirSync(path.dirname(destination), { recursive: true });
cpSync(source, destination, { recursive: true });
const files = readdirSync(destination, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) =>
    path.relative(destination, path.join(entry.parentPath, entry.name)),
  )
  .sort();
const digest = createHash("sha256");
for (const file of files) {
  digest.update(file);
  digest.update(readFileSync(path.join(destination, file)));
}
writeFileSync(
  path.join(destination, "release.json"),
  JSON.stringify({ name, digest: digest.digest("hex"), files }, null, 2) + "\n",
);
console.log(
  `Saved ${name}: ${files.length} files. Serve with node companion/react-workbench/serve.mjs ${name}`,
);
