import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  // The deployed URL - used for sitemap, canonical URLs, etc.
  site: 'https://manudubey.in',
  integrations: [
    tailwind({
      // Use our own global.css rather than Astro injecting a base stylesheet
      applyBaseStyles: false,
    }),
  ],
});
