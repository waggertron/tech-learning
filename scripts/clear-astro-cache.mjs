import { rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(fileURLToPath(new URL('../package.json', import.meta.url)));

for (const cachePath of ['.astro', 'node_modules/.astro']) {
  rmSync(join(projectRoot, cachePath), { recursive: true, force: true });
}
