import assert from 'node:assert/strict';
import { globSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { slug } from 'github-slugger';
import { buildTagIndex, getPageTags } from '../src/lib/content-tags.mjs';

const entries = [...globSync('src/content/docs/**/*.{md,mdx}')]
  .filter(file => !path.basename(file).startsWith('_'))
  .map(file => {
    const source = readFileSync(file, 'utf8');
    const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
    const data = match ? parse(match[1]) : {};
    const id = data.slug ?? file.replace('src/content/docs/', '').replace(/\.(md|mdx)$/, '').split('/').map(slug).join('/').replace(/\/index$/, '');
    return { id, data };
  });
const index = buildTagIndex(entries);
const readPage = route => readFileSync(path.join('dist', route === 'index' ? '' : route, 'index.html'), 'utf8');
const directory = readPage('tags');
assert.match(directory, /data-tag-directory/);
let memberships = 0;
for (const tag of index.values()) {
  const archive = readPage(`posts/tags/${tag.slug}`);
  assert.ok(archive.includes(`data-tag-archive="${tag.slug}"`), `Unified archive missing: ${tag.slug}`);
  assert.ok(!archive.includes('data-pagefind-body'), `Tag archive duplicates original content in search: ${tag.slug}`);
  for (const entry of tag.entries) {
    assert.ok(archive.includes(`data-tag-entry="${entry.id}"`), `${entry.id} missing from ${tag.slug}`);
    memberships++;
  }
  assert.ok(directory.includes(`/posts/tags/${encodeURIComponent(tag.slug)}/`), `Tag directory link missing: ${tag.slug}`);
}
let pages = 0;
for (const entry of entries) {
  const tags = getPageTags(entry.data.tags ?? []);
  if (entry.data.draft === true || tags.length === 0) continue;
  const html = readPage(entry.id);
  // Posts use the blog footer; other pages expose the shared navigation region.
  if (!entry.id.startsWith('posts/')) {
    assert.match(html, /aria-label="Page tags"/, `Tag navigation missing: ${entry.id}`);
  }
  for (const tag of tags) {
    assert.ok(html.includes(`/posts/tags/${encodeURIComponent(tag.slug)}/`), `Clickable ${tag.slug} tag missing: ${entry.id}`);
  }
  pages++;
}
console.log(`Unified tag validation passed: ${index.size} archives, ${pages} tagged pages, ${memberships} memberships; topic/post tags and existing archive URLs verified.`);
