# MCP Engineering Operations Companion

This package backs the MCP Server Design post series with compiling TypeScript and deterministic tests.

```bash
npm install
npm test
npm run build
```

Run the local stdio server after building:

```bash
node dist/src/stdio.js
```

The process waits for MCP messages on standard input. Protocol messages use standard output. Diagnostics use standard error.

The host-loop tests use a fake model and need no credentials. A real provider adapter belongs behind the `ModelGateway` interface and should read its credential from the environment.
