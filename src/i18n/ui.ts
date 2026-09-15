/**
 * Dictionary access. `t(locale)` is the only way a template reads copy, so a
 * page never hardcodes a language.
 */
import en, { type UIStrings } from './en';
import tr from './tr';
import de from './de';
import type { Locale } from './locales';

const DICT: Record<Locale, UIStrings> = { en, tr, de };

export const t = (locale: Locale): UIStrings => DICT[locale];

/** Fills {name} placeholders. Used for the one string that needs a date. */
export const fill = (template: string, values: Record<string, string>): string =>
  template.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match);

export type { UIStrings };
