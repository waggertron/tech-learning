import { getCollection } from 'astro:content';
import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { buildTagIndex, relativeContentHref } from './lib/content-tags.mjs';

export const onRequest = defineRouteMiddleware(async (context, next) => {
  // Blog middleware populates its sidebar first. Keep its labels and navigation,
  // then count the full published catalog behind the shared tag destinations.
  await next();
  const { starlightRoute } = context.locals;
  if (!starlightRoute.id.startsWith('posts/')) return;
  const tags = buildTagIndex(await getCollection('docs'));
  const tagGroup = starlightRoute.sidebar.find(item => item.type === 'group' && item.label === context.locals.t('starlightBlog.sidebar.tags'));
  if (!tagGroup || tagGroup.type !== 'group') return;
  for (const item of tagGroup.entries) {
    if (item.type !== 'link') continue;
    const match = /\/posts\/tags\/([^/]+)\/?$/.exec(item.href);
    const tag = match && tags.get(decodeURIComponent(match[1]!));
    if (tag) item.label = `${tag.label} (${tag.entries.length})`;
  }
  tagGroup.entries.unshift({
    type: 'link', label: 'Browse all tags',
    href: relativeContentHref(context.url.pathname, 'tags', import.meta.env.BASE_URL),
    isCurrent: false, badge: undefined, attrs: {},
  });
});
