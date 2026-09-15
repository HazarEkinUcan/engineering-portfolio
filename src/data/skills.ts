/**
 * Capabilities. No proficiency bars, no percentages, no star ratings —
 * they are invented metrics. site-plan.md §6.
 *
 * The words live in `src/i18n/<locale>.ts` under `skills`, because every one
 * of them is translated. What stays here is the part that is not language: the
 * case-study section each group points at. The two are paired by position, and
 * `skillGroups(locale)` asserts that they are still the same length, so adding
 * a group in one place and forgetting the other fails loudly.
 */
import { t } from '../i18n/ui';
import type { Locale } from '../i18n/locales';

export interface SkillGroup {
  title: string;
  note?: string;
  items: readonly string[];
  evidence?: { label: string; href: string };
}

/** Evidence targets, in the order the groups are listed in the dictionary. */
const evidenceHrefs: readonly (string | null)[] = [
  '/projects/writing-robot#generate',
  '/projects/prosodic-vr#anchors',
  '/projects/prosodic-vr#anchors',
  null,
];

export function skillGroups(locale: Locale): SkillGroup[] {
  const groups = t(locale).skills;
  if (groups.length !== evidenceHrefs.length) {
    throw new Error(
      `[i18n] skills: ${groups.length} groups in the ${locale} dictionary but ${evidenceHrefs.length} evidence targets in skills.ts. They are paired by position.`,
    );
  }
  return groups.map((group, i) => {
    const href = evidenceHrefs[i];
    return {
      title: group.title,
      note: group.note || undefined,
      items: group.items,
      evidence: href && group.evidenceLabel ? { label: group.evidenceLabel, href } : undefined,
    };
  });
}

export interface HonestLabel {
  title: string;
  body: string;
}

/** Stated plainly rather than padded. site-plan.md §6. */
export const honestLabels = (locale: Locale): readonly HonestLabel[] => t(locale).honest;
