import { createRequire } from "node:module";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { mergeConfig } from "vite";
import base from "./vite.config";

const toolingDir = process.env.REACT_TOOLING_DIR;
if (!toolingDir)
  throw new Error("Set REACT_TOOLING_DIR to the isolated tooling directory");
const toolingRequire = createRequire(path.join(toolingDir, "package.json"));
const compiler = toolingRequire.resolve("babel-plugin-react-compiler");

export default mergeConfig(base, {
  plugins: [react({ babel: { plugins: [compiler] } })],
  build: { outDir: ".tooling/compiler-dist" },
});
