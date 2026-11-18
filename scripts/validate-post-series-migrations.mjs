import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import migrations from '../docs/data/post-series-route-migrations.json' with { type: 'json' };

const active = migrations.filter(entry => entry.active);
const keys = new Set();
for (const entry of active) {
  assert.ok(!keys.has(entry.oldRoute), `Duplicate migration: ${entry.oldRoute}`);
  keys.add(entry.oldRoute);
  assert.notEqual(entry.oldRoute, entry.newRoute, 'A compatibility route cannot redirect to itself');
  assert.match(entry.newRoute, /^\/posts\/[a-z0-9-]+\/$/, 'Only explicit local article destinations are allowed');
  assert.ok(!existsSync(entry.oldSource), `Retired source remains: ${entry.oldSource}`);
  assert.ok(existsSync(entry.newSource), `Destination source missing: ${entry.newSource}`);
  assert.ok(!active.some(other => other.oldRoute === entry.newRoute), `Redirect chain: ${entry.oldRoute}`);
  const expected = '/tech-learning' + entry.newRoute + (entry.destinationFragment ? '#' + entry.destinationFragment : '');
  const output = readFileSync(path.join('dist', entry.oldRoute, 'index.html'), 'utf8');
  assert.match(output, /http-equiv="refresh"/i, `Missing static redirect: ${entry.oldRoute}`);
  assert.ok(output.includes(expected), `Wrong destination for ${entry.oldRoute}: ${expected}`);
  assert.ok(!output.includes('data-pagefind-body'), `Retired route remains indexed: ${entry.oldRoute}`);
  const destination = readFileSync(path.join('dist', entry.newRoute, 'index.html'), 'utf8');
  if (entry.destinationFragment) {
    assert.ok(destination.includes(`id="${entry.destinationFragment}"`), `Missing destination fragment: ${expected}`);
  }
  // The homepage enumerates the entire post catalog, even rows hidden by pagination.
  const home = readFileSync('dist/index.html', 'utf8');
  assert.ok(!home.includes(`href="posts/${entry.oldRoute.split('/')[2]}/"`), `Retired route in post browser: ${entry.oldRoute}`);
}
function contentFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? contentFiles(file) : /\.(md|mdx|astro)$/.test(file) ? [file] : [];
  });
}
const series = new Map();
for (const file of contentFiles('src/content/docs')) {
  const source = readFileSync(file, 'utf8');
  for (const entry of active) {
    const slug = entry.oldRoute.split('/')[2];
    assert.ok(!source.includes('/' + slug + '/'), `Live content references retired route: ${file} -> ${slug}`);
  }
  const metadata = /series:\n  slug: ([^\n]+)\n  order: (\d+)/.exec(source);
  if (metadata) {
    const list = series.get(metadata[1]) ?? [];
    list.push(Number(metadata[2]));
    series.set(metadata[1], list);
  }
}
for (const slug of ['zero-to-ios-hero', 'modern-react-development']) {
  const orders = series.get(slug)?.sort((a, b) => a - b);
  assert.ok(orders?.length, `Empty core series: ${slug}`);
  assert.deepEqual(orders, orders.map((_, index) => index + 1), `Noncontiguous or duplicate reading order: ${slug}`);
}
console.log(`Post migration checks passed: ${active.length} direct static routes, destination anchors, and catalog/search exclusions.`);
