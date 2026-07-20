# MCP Engineering Operations Companion

This npm workspace backs the MCP Server Design post series with compiling TypeScript and deterministic tests. Install dependencies once from the repository root so the site and companion use the shared lockfile.

```bash
npm ci
npm run test:mcp-companion
npm run build:mcp-companion
```

Run the local stdio server after building:

```bash
node dist/src/stdio.js
```

The process waits for MCP messages on standard input. Protocol messages use standard output. Diagnostics use standard error.

The host-loop tests use a fake model and need no credentials. A real provider adapter belongs behind the `ModelGateway` interface and should read its credential from the environment.
