/**
 * The project routes, built once and used by both route files.
 *
 * `/projects/<slug>` and `/<locale>/projects/<slug>` are the same page in
 * different languages, so they are the same list of entries with a different
 * params shape. Slugs are identical in every locale by construction: the slug
 * is the filename, and the locale is the folder above it.
 *
 * A locale that has no entry for a slug simply produces no route for it. That
 * is the deliberate alternative to falling back to English: a missing Turkish
 * case study is a missing page, not an English page wearing a Turkish header,
 * and `npm run i18n:check` reports it by name.
 */
import type { CollectionEntry } from 'astro:content';
import type { Locale } from './locales';
import { getOngoing, getProjects } from './collections';
import { href } from './paths';

export type ProjectRouteProps =
  | {
      kind: 'project';
      locale: Locale;
      slug: string;
      entry: CollectionEntry<'projects'>;
      next?: { href: string; title: string };
    }
  | {
      kind: 'ongoing';
      locale: Locale;
      slug: string;
      entry: CollectionEntry<'ongoing'>;
    };

export interface ProjectRoute {
  locale: Locale;
  slug: string;
  props: ProjectRouteProps;
}

export async function projectRoutes(locale: Locale): Promise<ProjectRoute[]> {
  // Publication gating: a pending project keeps its slug in the content model
  // and ships nothing. site-plan.md §1.
  const published = await getProjects(locale);

  const completed: ProjectRoute[] = published.map((row, index) => {
    const next = published[(index + 1) % published.length];
    return {
      locale,
      slug: row.slug,
      props: {
        kind: 'project',
        locale,
        slug: row.slug,
        entry: row.entry,
        next:
          published.length > 1 && next
            ? { href: href(`/projects/${next.slug}`, locale), title: next.entry.data.title }
            : undefined,
      },
    };
  });

  // Ongoing builds live under the same /projects/ prefix but are a separate
  // collection with a separate layout — and no "next project" nav, which would
  // lead a reader from an unfinished build straight into finished work as
  // though the two were the same kind of thing.
  const ongoing: ProjectRoute[] = (await getOngoing(locale)).map((row) => ({
    locale,
    slug: row.slug,
    props: { kind: 'ongoing', locale, slug: row.slug, entry: row.entry },
  }));

  return [...completed, ...ongoing];
}

/**
 * A working title must not quietly become permanent once applications start
 * linking to it. technical-plan.md §3.
 */
export function warnOnWorkingTitle(props: ProjectRouteProps): void {
  if (props.kind === 'project' && props.entry.data.workingTitle) {
    console.warn(
      `[content] "${props.entry.id}" still has workingTitle: true — confirm the real project name and slug before launch.`,
    );
  }
}
