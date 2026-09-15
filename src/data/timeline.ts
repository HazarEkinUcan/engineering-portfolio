/**
 * Education and experience, newest first. site-plan.md §7.
 * Every entry is verified from the CV, the internship report or the
 * reference letter. No throughput or cycle-time figures exist, so none appear.
 *
 * The prose lives in `src/i18n/<locale>.ts` under `timeline`. What stays here
 * is the part that is not language: whether an entry is education or
 * experience, and where its link points. Paired by position, and checked.
 */
import { t } from '../i18n/ui';
import type { Locale } from '../i18n/locales';

export interface TimelineEntry {
  period: string;
  title: string;
  org: string;
  place: string;
  kind: 'education' | 'experience';
  detail?: string;
  bullets?: readonly string[];
  link?: { label: string; href: string };
}

interface TimelineMeta {
  kind: 'education' | 'experience';
  linkHref?: string;
}

/** In the order the entries are listed in the dictionary. */
const meta: readonly TimelineMeta[] = [
  { kind: 'education' },
  { kind: 'experience', linkHref: '/projects/writing-robot' },
  { kind: 'experience' },
  { kind: 'education' },
];

export function timeline(locale: Locale): TimelineEntry[] {
  const entries = t(locale).timeline;
  if (entries.length !== meta.length) {
    throw new Error(
      `[i18n] timeline: ${entries.length} entries in the ${locale} dictionary but ${meta.length} in timeline.ts. They are paired by position.`,
    );
  }
  return entries.map((entry, i) => {
    const m = meta[i]!;
    return {
      period: entry.period,
      title: entry.title,
      org: entry.org,
      place: entry.place,
      kind: m.kind,
      detail: entry.detail || undefined,
      bullets: entry.bullets.length ? entry.bullets : undefined,
      link: m.linkHref && entry.linkLabel ? { label: entry.linkLabel, href: m.linkHref } : undefined,
    };
  });
}

export const languages = (locale: Locale): string => t(locale).languages;
