# React behavior workbench

This small client-only Vite application runs the same React modules as the performance, recovery, and release lessons. It uses the repository's installed dependencies and does not declare another application package.

From the repository root after `npm ci`:

```bash
node node_modules/vite/bin/vite.js --config companion/react-workbench/vite.config.ts --host 127.0.0.1
node node_modules/typescript/bin/tsc --noEmit --jsx react-jsx --module esnext --moduleResolution bundler --target es2022 --esModuleInterop --strict --types react,react-dom,node companion/react-workbench/src/main.tsx
node node_modules/vite/bin/vite.js build --config companion/react-workbench/vite.config.ts
node node_modules/prettier/bin/prettier.cjs --check 'companion/react-workbench/src/**/*.tsx' companion/react-workbench/vite.config.ts
```

The dev command keeps serving until stopped with Ctrl-C. Run the other commands in a separate terminal or after stopping it. Development Profiler callbacks provide actual render durations. Ordinary production React disables those callbacks, so the UI explains the missing timing instead of presenting a fabricated number.

## Behavior checks

```bash
node --test tests/react-example-output-views.test.mjs
```

The suite starts an isolated Vite server, opens Chromium, checks render-error isolation and successful retry, toggles both checkout variants, observes a release-labelled failure, and reads a real profiling callback. It closes its browser and server. Chromium must be installed for the current Playwright version and permitted to run in the environment.

## Compiler and lint experiment

Install versioned tools into a separate temporary directory:

```bash
REACT_TOOLING_DIR="$(mktemp -d)"
npm install --prefix "$REACT_TOOLING_DIR" --no-audit --no-fund --save-exact babel-plugin-react-compiler@1.0.0 eslint@10.15.0 eslint-plugin-react-hooks@7.1.1
node companion/react-workbench/check-tooling.mjs "$REACT_TOOLING_DIR"
```

The script verifies a missing Effect dependency, a corrected source with zero messages, Compiler cache generation, and a Compiler-enabled production build. Complete artifacts live under `.tooling/`, which is ignored. The Compiler configuration uses the Babel integration for the installed 4.x React Vite plugin. It does not silently change the ordinary workbench build.

## Release exercise

```bash
node node_modules/vite/bin/vite.js build --config companion/react-workbench/vite.config.ts
node companion/react-workbench/release.mjs previous-1
```

Change the application or `public/runtime-config.json`, rebuild, then snapshot `candidate-2`. Each name is immutable. `release.json` records the file set and content digest. Unchanged inputs produce identical content digests even if the snapshots have different names.

```bash
node companion/react-workbench/release.mjs candidate-2
node companion/react-workbench/serve.mjs candidate-2
```

Open `http://127.0.0.1:4175`. Stop the server, serve `previous-1`, and reload to exercise rollback. The server binds only to loopback. It is a local static-file exercise, not a public production server. It does not provide SPA route fallback or durable telemetry.

`runtime-config.json` is fetched after the JavaScript loads. It contains a public release identifier and an initial feature decision. The checkbox changes the local decision in memory, while the observed event includes release, variant, and event name. No payment or external service is called.
