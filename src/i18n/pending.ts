/**
 * Phase 1 scaffolding.
 *
 * A value wrapped in TODO_EN is the ENGLISH source text sitting in a translated
 * dictionary because that string has not been translated yet. It is not a
 * translation and must not be treated as one.
 *
 * The wrapper exists so the gap is countable: `npm run i18n:check` finds every
 * occurrence, reports it per locale, and exits non-zero while any remain. That
 * is what stops English quietly shipping inside a Turkish or German page.
 *
 * Translating a string means replacing `TODO_EN('...')` with the translated
 * literal. When the last one is gone the check passes and this file can go too.
 */
export const TODO_EN = (english: string): string => english;
