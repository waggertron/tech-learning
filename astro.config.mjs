// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  site: 'https://waggertron.github.io',
  base: '/tech-learning',
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [[rehypeKatex, { throwOnError: false, output: 'htmlAndMathml' }]],
  },
  vite: {
    esbuild: {
      jsx: 'automatic',
      jsxImportSource: 'react',
    },
    build: {
      chunkSizeWarningLimit: 700,
    },
    server: {
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
    },
  },
  integrations: [
    starlight({
      title: 'Here Be Dragons',
      description: 'A shareable knowledge base of tech topics I research.',
      social: {
        github: 'https://github.com/waggertron/tech-learning',
      },
      customCss: ['./src/styles/custom.css', 'katex/dist/katex.min.css'],
      components: {
        Footer: './src/components/Footer.astro',
        Head: './src/components/Head.astro',
        Search: './src/components/Search.astro',
      },
      pagefind: false,
      sidebar: [
        {
          label: 'Topics',
          autogenerate: { directory: 'topics' },
          collapsed: false,
        },
        {
          label: 'Posts',
          autogenerate: { directory: 'posts' },
          collapsed: false,
        },
        {
          label: 'Personal',
          autogenerate: { directory: 'personal' },
          collapsed: false,
        },
      ],
    }),
  ],
});
