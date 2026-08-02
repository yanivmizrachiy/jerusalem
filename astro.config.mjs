// @ts-check
import { defineConfig } from 'astro/config';

// אתר מחוז ירושלים — סטטי, עברית, RTL
export default defineConfig({
  output: 'static',
  compressHTML: true,
  build: { inlineStylesheets: 'auto' },
});
