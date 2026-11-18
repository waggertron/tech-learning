import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  cacheDir: ".vite",
  esbuild: { jsx: "automatic", jsxImportSource: "react" },
  build: { outDir: "dist", emptyOutDir: true },
});
