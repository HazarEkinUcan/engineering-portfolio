/**
 * Locale path arithmetic.
 *
 * Every internal link goes through here, so a page never has to know which
 * locale it is in to link somewhere. `strip` and `localise` are exact inverses,
 * which is what lets the Language menu send a visitor to the same page in
 * another language instead of back to the homepage.
 */
import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from './locales';

/** Splits a pathname into its locale and the locale-independent remainder. */
export function parsePath(pathname: string): { locale: Locale; rest: string } {
  const clean = pathname.replace(/\/+$/, '') || '/';
  const [, first, ...others] = clean.split('/');
  if (first && isLocale(first) && first !== DEFAULT_LOCALE) {
    return { locale: first, rest: '/' + others.join('/') };
  }
  return { locale: DEFAULT_LOCALE, rest: clean };
}

/** The locale-independent part of a path, with any prefix removed. */
export const stripLocale = (pathname: string): string => parsePath(pathname).rest;

/**
 * Adds the locale prefix to a site-relative path. English is returned
 * unchanged, which is why the existing English URLs did not move.
 */
export function localise(rest: string, locale: Locale): string {
  const path = rest.startsWith('/') ? rest : `/${rest}`;
  if (locale === DEFAULT_LOCALE) return path === '/' ? '/' : path.replace(/\/$/, '');
  const suffix = path === '/' ? '' : path.replace(/\/$/, '');
  return `/${locale}${suffix}`;
}

/**
 * Link helper for templates: takes a path written in English terms and returns
 * it in the active locale. Fragments and query strings survive.
 */
export function href(path: string, locale: Locale): string {
  const [pathname, ...tail] = path.split(/(?=[#?])/);
  return localise(pathname || '/', locale) + tail.join('');
}

/** Every locale's URL for the current page, for hreflang and the Language menu. */
export function alternates(pathname: string): { locale: Locale; path: string }[] {
  const { rest } = parsePath(pathname);
  return LOCALES.map((locale) => ({ locale, path: localise(rest, locale) }));
}
