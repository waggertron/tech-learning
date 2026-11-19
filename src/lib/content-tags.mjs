import path from 'node:path';
import { z } from 'zod';
import { slug as slugify } from 'github-slugger';

/** @typedef {{ id: string, data: { title: string, description?: string, tags?: string[], draft?: boolean }, filePath?: string }} TaggedEntry */

/** @param {string[]} tags */
export function getPageTags(tags = []) {
  const seen = new Set();
  return tags.flatMap(value => {
    const label = value.trim().toLowerCase();
    const slug = slugify(label);
    if (!slug) throw new Error(`Tag "${value}" needs a usable URL slug.`);
    if (seen.has(label)) return [];
    seen.add(label);
    return [{ label, slug }];
  });
}

export const contentTagsSchema = z.array(z.string().trim().min(1)).default([])
  .transform(tags => getPageTags(tags).map(tag => tag.label));

/** @param {TaggedEntry[]} entries */
export function buildTagIndex(entries) {
  /** @type {Map<string, {label: string, slug: string, entries: TaggedEntry[]}>} */
  const index = new Map();
  for (const entry of entries) {
    if (entry.data.draft === true) continue;
    for (const tag of getPageTags(entry.data.tags)) {
      const group = index.get(tag.slug) ?? { ...tag, entries: [] };
      if (group.label !== tag.label) {
        throw new Error(`Tags "${group.label}" and "${tag.label}" have the same URL slug "${tag.slug}". Use distinct tag names.`);
      }
      if (!group.entries.some(candidate => candidate.id === entry.id)) group.entries.push(entry);
      index.set(tag.slug, group);
    }
  }
  for (const group of index.values()) {
    group.entries.sort((left, right) => left.data.title.localeCompare(right.data.title) || left.id.localeCompare(right.id));
  }
  return new Map([...index].sort(([, left], [, right]) => left.label.localeCompare(right.label)));
}

/** @param {string} pathname @param {string} route @param {string} base */
export function relativeContentHref(pathname, route, base = '/') {
  const destination = route.replace(/^\/+|\/+$/g, '').replace(/(^|\/)index$/, '');
  if (destination.includes(':') || destination.includes('?') || destination.includes('#') || destination.split('/').some(segment => segment === '.' || segment === '..')) {
    throw new Error(`Expected a local content route, received "${route}".`);
  }
  const from = decodeURI(pathname.endsWith('/') ? pathname : pathname + '/');
  const to = `${base.replace(/\/$/, '')}/${destination}/`;
  const relative = path.posix.relative(from, to);
  return relative ? relative.split('/').map(encodeURIComponent).join('/') + '/' : './';
}
