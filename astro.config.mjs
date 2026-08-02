// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// אתר מחוז ירושלים — סטטי, עברית, RTL
export default defineConfig({
  site: 'https://jerusalem-virid.vercel.app',
  output: 'static',
  compressHTML: true,
  build: { inlineStylesheets: 'auto' },
  integrations: [sitemap()],
});
