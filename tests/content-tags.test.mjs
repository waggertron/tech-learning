import assert from 'node:assert/strict';
import test from 'node:test';
import { buildTagIndex, contentTagsSchema, getPageTags, relativeContentHref } from '../src/lib/content-tags.mjs';

const page = (id, tags, extra = {}) => ({ id, data: { title: id, tags, ...extra } });

test('a shared archive includes posts, topics, guides, and visible status-draft pages once', () => {
  const index = buildTagIndex([
    page('posts/lookup', ['AWS', 'aws', 'latency']),
    page('topics/patient', ['aws'], { status: 'draft' }),
    page('posts/series/guide', ['aws']),
    page('topics/private', ['aws'], { draft: true }),
    page('topics/untagged', []),
  ]);
  assert.deepEqual(index.get('aws').entries.map(entry => entry.id), ['posts/lookup', 'posts/series/guide', 'topics/patient']);
  assert.equal(index.get('aws').label, 'aws');
  assert.equal(index.has('private'), false);
  assert.equal(index.size, 2);
});

test('case and surrounding whitespace share a tag but punctuation collisions fail clearly', () => {
  assert.deepEqual(getPageTags([' AWS ', 'aws', 'System Design']).map(tag => tag.slug), ['aws', 'system-design']);
  assert.throws(() => buildTagIndex([page('topics/a', ['C++']), page('topics/b', ['C#'])]), /same URL slug.*c/);
  assert.throws(() => getPageTags(['!!!']), /usable URL slug/);
});

test('relative URLs preserve the deployment prefix at arbitrary route depth', () => {
  assert.equal(relativeContentHref('/tech-learning/topics/system-design/case-studies/patient/', 'posts/tags/aws', '/tech-learning'), '../../../../posts/tags/aws/');
  assert.equal(relativeContentHref('/tech-learning/posts/tags/aws/', 'topics/system-design/case-studies/patient', '/tech-learning'), '../../../topics/system-design/case-studies/patient/');
  assert.equal(relativeContentHref('/tech-learning/tags/', 'posts/tags/aws', '/tech-learning'), '../posts/tags/aws/');
  assert.equal(relativeContentHref('/tech-learning/posts/tags/aws', 'tags', '/tech-learning'), '../../../tags/');
  assert.equal(relativeContentHref('/tech-learning/tags/', 'posts/tags/café', '/tech-learning'), '../posts/tags/caf%C3%A9/');
});

test('invalid archive destinations cannot escape into external or dot-segment routes', () => {
  assert.throws(() => relativeContentHref('/tech-learning/tags/', 'https://example.com', '/tech-learning'), /local content route/);
  assert.throws(() => relativeContentHref('/tech-learning/tags/', '../outside', '/tech-learning'), /local content route/);
});

test('the actual published catalog is indexed by every declared tag, including patient lookup', async () => {
  const { globSync, readFileSync } = await import('node:fs');
  const { parse } = await import('yaml');
  const { slug } = await import('github-slugger');
  const entries = [...globSync('src/content/docs/**/*.{md,mdx}')].filter(file => !file.split('/').at(-1).startsWith('_')).map(file => {
    const source = readFileSync(file, 'utf8');
    const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
    const data = match ? parse(match[1]) : {};
    const id = data.slug ?? file.replace('src/content/docs/', '').replace(/\.(md|mdx)$/, '').split('/').map(slug).join('/').replace(/\/index$/, '');
    return { id, data };
  });
  const index = buildTagIndex(entries);
  let expectedMemberships = 0;
  for (const entry of entries.filter(entry => entry.data.draft !== true)) {
    for (const tag of getPageTags(entry.data.tags ?? [])) {
      expectedMemberships++;
      assert.equal(index.get(tag.slug).entries.filter(candidate => candidate.id === entry.id).length, 1, `${entry.id} must occur exactly once under ${tag.slug}`);
    }
  }
  assert.equal([...index.values()].reduce((sum, group) => sum + group.entries.length, 0), expectedMemberships);
  assert.ok(index.get('aws').entries.some(entry => entry.id === 'topics/system-design/case-studies/patient-lookup-aws'));
  assert.ok(index.get('system-design').entries.some(entry => entry.id.startsWith('posts/2026-')));
});

test('frontmatter ingestion normalizes tags before blog and topic consumers read them', () => {
  assert.deepEqual(contentTagsSchema.parse([' AWS ', 'aws', 'System Design']), ['aws', 'system design']);
  assert.deepEqual(contentTagsSchema.parse(undefined), []);
  assert.equal(contentTagsSchema.safeParse(['   ']).success, false);
  assert.equal(contentTagsSchema.safeParse([23]).success, false);
});
