// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://waggertron.github.io',
  base: '/tech-learning',
  integrations: [
    starlight({
      title: 'Here Be Dragons',
      description: 'A shareable knowledge base of tech topics I research.',
      social: {
        github: 'https://github.com/waggertron/tech-learning',
      },
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: 'Topics',
          autogenerate: { directory: 'topics' },
          collapsed: false,
        },
        {
          label: 'Posts',
          autogenerate: { directory: 'posts' },
          collapsed: true,
        },
      ],
    }),
  ],
});
