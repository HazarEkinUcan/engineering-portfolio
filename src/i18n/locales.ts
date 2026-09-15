/**
 * The locale set, and the small facts that go with it.
 *
 * English is the default and is never prefixed, so its URLs are unchanged from
 * before this site became multilingual. Turkish and German live under /tr and
 * /de. The URL is the only source of truth for which locale a visitor is in:
 * nothing is stored, nothing is sniffed from the browser, and nothing redirects.
 */
export const LOCALES = ['en', 'tr', 'de'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** Locales that carry a URL prefix. English does not. */
export const PREFIXED_LOCALES = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

/** Native names, used in the Language menu. Never translated. */
export const LOCALE_LABEL: Record<Locale, string> = {
  en: 'English',
  tr: 'Türkçe',
  de: 'Deutsch',
};

/** What goes in <html lang>. */
export const HTML_LANG: Record<Locale, string> = { en: 'en', tr: 'tr', de: 'de' };

/** BCP 47 values for hreflang. Kept separate in case a region is added later. */
export const HREFLANG: Record<Locale, string> = { en: 'en', tr: 'tr', de: 'de' };

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
