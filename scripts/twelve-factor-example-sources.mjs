export const topicDirectory =
  "src/content/docs/topics/ops/twelve-factor-app";

export const repositories = {
  TypeScript: {
    slug: "typescript",
    repository: "waggertron/twelve-factor-typescript",
    tag: "v1.0.2",
    port: "3101",
    processCommands: ["npm run start:web", "npm run start:worker", "npm run admin -- migrate --target 001"],
    checker: "scripts/check-twelve-factor.mjs",
  },
  Python: {
    slug: "python",
    repository: "waggertron/twelve-factor-python",
    tag: "v1.0.2",
    port: "3102",
    processCommands: ["web", "worker", "admin migrate --target 001"],
    checker: "scripts/check_twelve_factor.py",
  },
  Go: {
    slug: "go",
    repository: "waggertron/twelve-factor-go",
    tag: "v1.0.3",
    port: "3103",
    processCommands: ["orders web", "orders worker", "orders admin migrate --target 001"],
    checker: "scripts/check-twelve-factor.sh",
  },
};

export const factors = [
  [1, "I", "Codebase", "examples-factors-01-04.mdx"],
  [2, "II", "Dependencies", "examples-factors-01-04.mdx"],
  [3, "III", "Config", "examples-factors-01-04.mdx"],
  [4, "IV", "Backing services", "examples-factors-01-04.mdx"],
  [5, "V", "Build, release, run", "examples-factors-05-08.mdx"],
  [6, "VI", "Processes", "examples-factors-05-08.mdx"],
  [7, "VII", "Port binding", "examples-factors-05-08.mdx"],
  [8, "VIII", "Concurrency", "examples-factors-05-08.mdx"],
  [9, "IX", "Disposability", "examples-factors-09-12.mdx"],
  [10, "X", "Dev/prod parity", "examples-factors-09-12.mdx"],
  [11, "XI", "Logs", "examples-factors-09-12.mdx"],
  [12, "XII", "Admin processes", "examples-factors-09-12.mdx"],
].map(([number, numeral, title, page]) => ({
  number,
  numeral,
  title,
  page,
  heading: `Factor ${numeral}: ${title}`,
}));

const sourceRanges = {
  1: {
    TypeScript: ["package.json", 6, 22, "json", '"start:web"'],
    Python: ["pyproject.toml", 23, 26, "toml", "[project.scripts]"],
    Go: ["internal/commands/root.go", 11, 20, "go", "cobra.Command"],
  },
  2: {
    TypeScript: ["README.md", 15, 16, "bash", "npm ci"],
    Python: ["README.md", 16, 17, "bash", "uv sync --frozen"],
    Go: ["README.md", 39, 42, "bash", "go mod download"],
  },
  3: {
    TypeScript: ["src/config.ts", 13, 26, "typescript", "z.object"],
    Python: ["src/order_service/config.py", 12, 22, "python", "SettingsConfigDict"],
    Go: ["internal/config/config.go", 12, 21, "go", 'env:"DATABASE_URL,required"'],
  },
  4: {
    TypeScript: ["src/queue.ts", 23, 42, "typescript", "new Queue<OrderJob>"],
    Python: ["src/order_service/web.py", 20, 27, "python", "FastAPI"],
    Go: ["internal/commands/web.go", 43, 57, "go", "store.NewPool"],
  },
  5: {
    TypeScript: ["Dockerfile", 1, 17, "dockerfile", "FROM node:24-alpine"],
    Python: ["Dockerfile", 1, 14, "dockerfile", "FROM python:3.14-slim"],
    Go: ["Dockerfile", 1, 14, "dockerfile", "FROM golang:1.25-alpine"],
  },
  6: {
    TypeScript: ["src/store.ts", 46, 75, "typescript", "this.pool.connect()"],
    Python: ["src/order_service/store.py", 86, 112, "python", "connection.execute("],
    Go: ["internal/store/store.go", 36, 70, "go", "p.Pool.Begin(ctx)"],
  },
  7: {
    TypeScript: ["src/web.ts", 11, 28, "typescript", "app.listen"],
    Python: ["src/order_service/web.py", 46, 54, "python", "uvicorn.run"],
    Go: ["internal/commands/web.go", 56, 66, "go", "server.ListenAndServe()"],
  },
  8: {
    TypeScript: ["src/queue.ts", 58, 75, "typescript", "new Worker<OrderJob>"],
    Python: ["src/order_service/worker.py", 67, 88, "python", "Worker(broker"],
    Go: ["internal/commands/worker.go", 67, 84, "go", "asynq.NewServer"],
  },
  9: {
    TypeScript: ["src/web.ts", 30, 47, "typescript", 'process.once("SIGTERM"'],
    Python: ["src/order_service/worker.py", 37, 54, "python", "worker.stop("],
    Go: ["internal/commands/web.go", 68, 82, "go", "server.Shutdown"],
  },
  10: {
    TypeScript: ["tests/integration/services.test.ts", 20, 31, "typescript", "new PostgreSqlContainer"],
    Python: ["tests/integration/test_services.py", 33, 39, "python", "PostgresContainer("],
    Go: ["tests/integration/services_test.go", 17, 38, "go", "postgres.Run("],
  },
  11: {
    TypeScript: ["src/telemetry.ts", 21, 44, "typescript", "trace.getSpan"],
    Python: ["src/order_service/telemetry.py", 20, 45, "python", "trace.get_current_span"],
    Go: ["internal/telemetry/log.go", 47, 54, "go", "oteltrace.SpanContextFromContext"],
  },
  12: {
    TypeScript: ["src/admin.ts", 7, 20, "typescript", "command.parseAsync"],
    Python: ["src/order_service/admin.py", 13, 39, "python", "typer.Typer"],
    Go: ["internal/commands/admin.go", 15, 48, "go", "cobra.Command"],
  },
};

export const examples = factors.flatMap((factor) =>
  Object.entries(sourceRanges[factor.number]).map(
    ([language, [sourcePath, startLine, endLine, codeLanguage, proofToken]]) => {
      const repository = repositories[language];
      return {
        ...factor,
        language,
        sourcePath,
        startLine,
        endLine,
        codeLanguage,
        proofToken,
        id: `factor-${String(factor.number).padStart(2, "0")}-${repository.slug}`,
        rawUrl: `https://raw.githubusercontent.com/${repository.repository}/${repository.tag}/${sourcePath}`,
        sourceUrl: `https://github.com/${repository.repository}/blob/${repository.tag}/${sourcePath}#L${startLine}-L${endLine}`,
      };
    },
  ),
);

export function releaseUrl(repository) {
  return `https://github.com/${repository.repository}/tree/${repository.tag}`;
}

export function repositoryFileUrl(repository, path) {
  return `https://github.com/${repository.repository}/blob/${repository.tag}/${path}`;
}
