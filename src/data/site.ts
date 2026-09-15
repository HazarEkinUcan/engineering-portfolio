/**
 * Site-wide facts. Everything here is either verified from a file in
 * `source material/` or explicitly marked TODO(confirm).
 * See planning/verified-project-facts.md.
 */

/*
 * The four strings that used to sit here — title, description, positioning and
 * status — are translated, so they moved to `src/i18n/<locale>.ts` under
 * `site`. What remains is what does not change with language: a name, an
 * address, two profile links and a date.
 */
export const site = {
  name: 'Hazar Ekin Uçan',
  shortName: 'Hazar Ekin Uçan',

  /* TODO(confirm): what Hazar is looking for and when he is available.
     site-plan.md §2.1 — omit the line entirely rather than guess, so this
     stays null until he answers. */
  availability: null as string | null,

  /* TODO(confirm): which address to publish. The CV address expires with
     graduation; a personal address is more durable. site-plan.md §8. */
  email: 'hucan@constructor.university',

  /* TODO(confirm): is the GitHub repository public and should it be linked?
     Until confirmed these render as profile links only, never as repo links. */
  links: [
    { label: 'GitHub', href: 'https://github.com/HazarEkinUcan' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/hazarekinucan' },
  ],

  /* TODO(confirm): may Neksus be named publicly? If not, swap this for
     'an industrial automation company in İzmir' — it is referenced from one
     place so the change is a single edit. */
  internshipCompany: 'Neksus Endüstriyel Otomasyon',

  lastUpdated: '2026-08-28',
} as const;

export interface NavItem {
  /** Key into the `nav` group of the locale dictionary. The label is not here. */
  key: 'work' | 'ongoing' | 'about' | 'contact';
  /** Written in English terms. `href()` adds the locale prefix at render time. */
  href: string;
  /**
   * Marks an item that opens a quick-access panel in the header, and says which
   * collection fills it. 'work' is the completed projects collection, 'ongoing'
   * the builds in progress — the two never mix.
   */
  panel?: 'work' | 'ongoing';
}

/*
 * Order is the header's order, left to right. The Language menu and the theme
 * toggle are not in this list: neither navigates anywhere, and both are
 * appended by the header itself after these four.
 */
export const nav: readonly NavItem[] = [
  { key: 'work', href: '/#work', panel: 'work' },
  { key: 'ongoing', href: '/#ongoing', panel: 'ongoing' },
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/#contact' },
];

/**
 * The one-line discipline label each project shows in the Work menu, keyed by
 * its content id. Everything else in that menu — order, number, title, URL —
 * is read from the projects collection, so the menu cannot drift out of step
 * with the homepage. A project with no entry here falls back to its stack.
 */
export const projectNavMeta: Record<string, string> = {
  'writing-robot': 'Robotics · Automation',
  'prosodic-vr': 'VR · Speech Analysis · Python',
  'izmir-water': 'Data · Machine Learning',
  'f1-race-prediction': 'Machine Learning · Motorsport',
};
