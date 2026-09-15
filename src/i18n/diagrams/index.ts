/**
 * Diagram copy, per locale.
 *
 * Diagrams are placed by the MDX bodies of the case studies, which cannot pass
 * props, so a diagram reads its own locale from the URL of the page it is
 * rendering into rather than being handed one. The URL is the only thing that
 * selects a language anywhere on this site, so this is the same source of
 * truth the header and the layouts use, not a second one.
 */
import en, { type DiagramStrings } from './en';
import tr from './tr';
import de from './de';
import type { Locale } from '../locales';
import { parsePath } from '../paths';

const DICT: Record<Locale, DiagramStrings> = { en, tr, de };

export const d = (locale: Locale): DiagramStrings => DICT[locale];

/** The locale of the page a diagram is rendering into. */
export const diagramsFor = (url: URL): DiagramStrings => DICT[parsePath(url.pathname).locale];

export type { DiagramStrings };
