/**
 * Locale-aware access to the two content collections.
 *
 * The collections are unchanged: the same schemas, the same guardrails. What
 * changed is the folder layout, so an entry id now reads `en/writing-robot`.
 * The locale is the first segment and the slug is the rest, which keeps route
 * slugs identical in every language.
 *
 * There is no fallback to English. A page in a locale that has no translation
 * is not generated, and `missingTranslations` reports the gap so the build can
 * say so out loud instead of quietly serving English inside a Turkish page.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from './locales';

type Name = 'projects' | 'ongoing';

/** Splits `tr/writing-robot` into its locale and its slug. */
export function splitId(id: string): { locale: Locale; slug: string } | null {
  const [first, ...rest] = id.split('/');
  if (!first || !isLocale(first) || rest.length === 0) return null;
  return { locale: first, slug: rest.join('/') };
}

export interface Localised<C extends Name> {
  entry: CollectionEntry<C>;
  slug: string;
  locale: Locale;
}

async function load<C extends Name>(name: C, locale: Locale): Promise<Localised<C>[]> {
  const all = (await getCollection(name)) as CollectionEntry<C>[];
  return all
    .flatMap((entry) => {
      const parts = splitId(entry.id);
      if (!parts || parts.locale !== locale) return [];
      return [{ entry, slug: parts.slug, locale: parts.locale }];
    })
    .sort((a, b) => (a.entry.data as { order: number }).order - (b.entry.data as { order: number }).order);
}

/** Published completed projects for one locale, in the homepage's order. */
export async function getProjects(locale: Locale): Promise<Localised<'projects'>[]> {
  const rows = await load('projects', locale);
  return rows.filter((r) => r.entry.data.status === 'published');
}

/** Ongoing builds for one locale, in their own order. */
export const getOngoing = (locale: Locale): Promise<Localised<'ongoing'>[]> =>
  load('ongoing', locale);

/**
 * Which slugs exist in English but not in another locale. The build reads this
 * so a missing translation is reported rather than silently skipped.
 */
export async function missingTranslations(): Promise<
  { collection: Name; locale: Locale; slugs: string[] }[]
> {
  const gaps: { collection: Name; locale: Locale; slugs: string[] }[] = [];
  for (const name of ['projects', 'ongoing'] as const) {
    const base = new Set((await load(name, DEFAULT_LOCALE)).map((r) => r.slug));
    for (const locale of LOCALES) {
      if (locale === DEFAULT_LOCALE) continue;
      const have = new Set((await load(name, locale)).map((r) => r.slug));
      const slugs = [...base].filter((s) => !have.has(s)).sort();
      if (slugs.length) gaps.push({ collection: name, locale, slugs });
    }
  }
  return gaps;
}
