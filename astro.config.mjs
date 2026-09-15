// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// TODO(confirm): the production origin. Used for canonical URLs, the sitemap
// and Open Graph. Change here and nowhere else.
const SITE = 'https://hazarekinucan.com';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'never',
  /**
   * Locale routing.
   *
   * English keeps the bare paths it already had (`/about`, `/projects/...`),
   * so no existing URL moved. Turkish and German are served under `/tr` and
   * `/de` by a single `[locale]` route tree rather than three copies of the
   * site. `redirectToDefaultLocale` stays off: `/en/...` should not exist at
   * all, and a redirect would imply it does.
   */
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'tr', 'de'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', tr: 'tr', de: 'de' },
      },
    }),
  ],
  build: { inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  vite: {
    build: { assetsInlineLimit: 0 },
  },
});
