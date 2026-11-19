import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { blogSchema } from 'starlight-blog/schema';
import { contentTagsSchema } from './lib/content-tags.mjs';

const topicExtension = z.object({
  category: z.string().optional(),
  parent: z.string().optional(),
  tags: contentTagsSchema,
  status: z.enum(['draft', 'published']).default('draft'),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  date: z.coerce.date().optional(),
  crosspost: z.array(z.enum(['devto', 'medium', 'linkedin', 'hashnode'])).optional(),
  canonical: z.string().url().optional(),
  series: z
    .object({
      slug: z.string(),
      order: z.number().int().positive().optional(),
    })
    .optional(),
});

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: (context) => docsSchema({
      extend: (schemaContext) => blogSchema(schemaContext).merge(topicExtension),
    })(context).transform((data) => ({
      ...data,
      excerpt: data.excerpt ?? data.description,
    })),
  }),
};
