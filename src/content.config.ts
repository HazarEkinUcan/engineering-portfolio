import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Project case studies.
 *
 * The schema does real work beyond typing:
 *
 *  · `role` is required before a project can be published. A case study
 *    cannot ship without an explicit statement of what Hazar built and
 *    contributed — and it is a positive field, not a disclaimer field,
 *    because over-claiming happens in the description of one's own work.
 *  · `alt` has a minimum length, so it will not accept "robot".
 *  · `stack` is capped at six, so a card cannot degenerate into a list.
 *  · `status` gates publication: a `pending` entry keeps its slug and its
 *    place in the model, and ships nothing.
 *  · `workingTitle` flags a placeholder name and slug, and warns at build
 *    time so a temporary title cannot quietly become permanent.
 *
 * See planning/technical-plan.md §3.
 */

const evidenceKind = z.enum([
  'video',
  'code',
  'output',
  'architecture',
  'data',
  'dataset',
  'system-design',
]);

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: ({ image }) =>
    z
      .object({
        order: z.number(),
        status: z.enum(['published', 'pending']).default('published'),
        workingTitle: z.boolean().default(false),

        title: z.string(),
        subtitle: z.string().optional(),
        summary: z.string().max(320).optional(),

        roleLabel: z.string().optional(),
        context: z.string().optional(),
        period: z.string().optional(),
        stack: z.array(z.string()).min(3).max(6).optional(),
        evidence: z.array(evidenceKind).optional(),

        role: z.string().optional(),
        limits: z.string().optional(),

        chapters: z.array(z.object({ id: z.string(), label: z.string() })).optional(),

        glance: z
          .object({
            what: z.string(),
            built: z.string(),
          })
          .optional(),

        card: z
          .object({
            media: image().optional(),
            alt: z.string().min(24),
            /** Credit line for licensed cover media, shown under the card. */
            credit: z.string().optional(),
            creditHref: z.string().url().optional(),
            video: z
              .object({
                mp4: z.string(),
                webm: z.string().optional(),
                poster: z.string(),
              })
              .optional(),
          })
          .optional(),

        hero: z
          .object({
            media: image(),
            alt: z.string().min(24),
            /** Credit line for licensed media, shown under the image. */
            credit: z.string().optional(),
            creditHref: z.string().url().optional(),
          })
          .optional(),

        seo: z
          .object({
            description: z.string().max(160),
            ogImage: z.string().optional(),
          })
          .optional(),
      })
      .superRefine((data, ctx) => {
        if (data.status !== 'published') return;

        const required: (keyof typeof data)[] = [
          'subtitle',
          'summary',
          'roleLabel',
          'context',
          'period',
          'stack',
          'evidence',
          'role',
          'glance',
          'card',
          'seo',
        ];

        for (const key of required) {
          if (data[key] === undefined) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [key as string],
              message: `"${String(key)}" is required before a project can be published. Set status: pending until the material exists.`,
            });
          }
        }
      }),
});

/**
 * Ongoing builds.
 *
 * A separate collection, deliberately. The `projects` schema above refuses to
 * publish anything without evidence, a role statement and a glance — the exact
 * guardrails that stop unfinished work being presented as a case study. Folding
 * a live build into it would mean weakening that gate, so this collection gets
 * its own shape instead: it has no evidence field to fill in falsely, and it
 * requires the things an honest build page needs and a finished one does not.
 *
 *  · `status` is a fixed literal. There is one state a project on this page can
 *    be in, and it cannot drift into "planned" or "concept".
 *  · `updated` is required, and rendered. A build log with no date is a stub.
 *  · `targets` is required and non-empty, and every entry is a target — the
 *    layout labels the whole block as such, so nothing here can read as a
 *    measured specification.
 *  · `currentStatus` is required: the page must say, in plain items, exactly
 *    how far along the work actually is.
 */
const ongoing = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/ongoing' }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      /** The only state this collection describes. Not "planned", not "concept". */
      status: z.literal('ongoing'),

      title: z.string(),
      subtitle: z.string().optional(),
      summary: z.string().max(320),

      /** Shown as "Last updated". A build page without one is not a build log. */
      updated: z.string(),
      /** The one-line living status under the title. */
      statusLine: z.string(),

      context: z.string().optional(),
      started: z.string().optional(),
      focus: z.string().optional(),

      /** The line that stands where a completed card lists its evidence. */
      targetLine: z.string(),

      /** Engineering targets — never achieved specifications. */
      targets: z.array(z.object({ key: z.string(), value: z.string() })).min(3),
      /**
       * The sentence under the targets that says they are targets, and the one
       * under the status that says what will be added later. Both talk about
       * the specific thing being built, so they live with the entry rather than
       * in the shared UI dictionary — a shared default here would describe one
       * project on every other project's page.
       */
      targetsNote: z.string(),
      statusNote: z.string(),

      /** Where the work actually stands, in plain items. */
      currentStatus: z.array(z.string()).min(2),

      chapters: z.array(z.object({ id: z.string(), label: z.string() })).optional(),

      /** One concept visual, and the note that keeps it honest. */
      media: z
        .object({
          src: image(),
          alt: z.string().min(24),
          caption: z.string(),
          /** Rendered whole rather than cropped — concept art is not a photograph. */
          contain: z.boolean().default(true),
        })
        .optional(),

      seo: z
        .object({
          description: z.string().max(160),
          ogImage: z.string().optional(),
        })
        .optional(),
    }),
});

export const collections = { projects, ongoing };
