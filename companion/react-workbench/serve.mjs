import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const name = process.argv[2];
if (!name || !/^[a-z][a-z0-9-]*$/.test(name))
  throw new Error("Pass a saved release name");
const root = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "releases",
  name,
);
if (!existsSync(path.join(root, "release.json")))
  throw new Error("Unknown release");
const contentTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
};
const port = Number(process.env.REACT_WORKBENCH_PORT ?? "4175");
if (!Number.isInteger(port) || port < 0 || port > 65535)
  throw new Error("Invalid local server port");
const server = createServer((request, response) => {
  const pathname = decodeURIComponent(
    new URL(request.url ?? "/", "http://localhost").pathname,
  );
  const file = path.resolve(
    root,
    `.${pathname === "/" ? "/index.html" : pathname}`,
  );
  if (
    !file.startsWith(root + path.sep) ||
    !existsSync(file) ||
    !statSync(file).isFile()
  ) {
    response.writeHead(404).end("Not found");
    return;
  }
  response.writeHead(200, {
    "Content-Type":
      contentTypes[path.extname(file)] ?? "application/octet-stream",
    "Cache-Control": "no-store",
  });
  response.end(readFileSync(file));
});
server.listen(port, "127.0.0.1", () => {
  const address = server.address();
  if (address && typeof address !== "string")
    console.log(`Serving ${name} at http://127.0.0.1:${address.port}`);
});
