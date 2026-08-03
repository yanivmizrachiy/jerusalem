// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// אתר מחוז ירושלים — סטטי + נקודת פרוקסי להמחשות (prerender=false)
export default defineConfig({
  site: 'https://jerusalem-virid.vercel.app',
  output: 'static',
  adapter: vercel(),
  compressHTML: true,
  build: { inlineStylesheets: 'auto' },
  integrations: [sitemap()],
});
