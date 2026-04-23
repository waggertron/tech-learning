import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

const topicExtension = z.object({
  category: z.string().optional(),
  parent: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published']).default('draft'),
  created: z.coerce.date().optional(),
  updated: z.coerce.date().optional(),
  date: z.coerce.date().optional(),
  crosspost: z.array(z.enum(['devto', 'medium', 'linkedin', 'hashnode'])).optional(),
  canonical: z.string().url().optional(),
});

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({ extend: topicExtension }),
  }),
};
