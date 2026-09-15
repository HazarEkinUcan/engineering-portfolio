# CLAUDE.md — website

Implementation notes for the portfolio site. The root `../CLAUDE.md` governs the
folder as a whole and its rules apply here too, especially the factual-accuracy
rules. `../planning/` holds the approved plans; this file covers how the code is
put together.

## Setup

```bash
npm install
npm run fonts      # copies IBM Plex woff2 out of node_modules into public/fonts
npm run dev        # http://localhost:4321
```

Until `npm run fonts` has run, the @font-face rules do not resolve and the
fallback stack renders. The site is fully usable either way.

Other scripts:

| Command | What it does |
|---|---|
| `npm run check` | `astro check` — TypeScript and content-schema validation |
| `npm run build` | static build into `dist/` |
| `npm run signature` | regenerates the hero mark from the real FANUC generator |
| `npm run media` | re-crops and re-encodes images and video from `../source material/` |

`npm run signature` and `npm run media` read from `../source material/`, which is
**read only**. They only ever write into `src/assets/` and `public/video/`. Their
output is committed, so a normal build needs neither Python nor the source folder.

## Architecture

- **Astro 5**, static output, zero JavaScript by default.
- **Content collections** (`src/content.config.ts`) with a Zod schema. Case
  studies are MDX in `src/content/projects/`.
- **Hand-written CSS** with design tokens, organised in cascade layers. No
  framework. `src/styles/tokens.css` is the only place a colour, size, duration
  or easing is defined — everything else references it.
- **Five small vanilla-TS behaviours** in `src/scripts/`, bundled through
  `main.ts`. Each is progressively enhanced: theme, reveal, menu, header and
  reading progress, section rail, copy-email, card video.

Layer order, declared once in `src/styles/global.css`:

```
@layer reset, tokens, base, layout, components, utilities;
```

## Publication gating

Every project carries `status: 'published' | 'pending'`.

A `pending` project stays in the content model, keeps its slug, and ships
nothing: it is filtered out of `getStaticPaths()` and out of the home page.
`src/content/projects/izmir-reservoir.mdx` is pending and must stay that way
until its source material arrives.

The schema's `superRefine` requires the fields a real case study needs
(`subtitle`, `summary`, `role`, `stack`, `card`, `glance`, …) **only** when
`status === 'published'`, so a pending entry cannot be published while it is
still incomplete. `workingTitle: true` logs a build warning, so a placeholder
title and slug cannot quietly become permanent.

## The hero signature

`src/assets/hero/signature-{wide,name}.svg` is **real output** from
`../source material/project 1/fanuc_writer_ls.py`, not a drawing of it.
`scripts/build-signature.mjs` runs the generator, rebuilds the pen-up TRAVEL
moves between strokes, and times each stroke from the generator's own feed
rates — 20 mm/sec writing, 100 mm/sec travel — scaled to a 1200 ms budget.

Each `<polyline>` carries `--len`, `--d` and `--t`. Nothing reads them at build
time any more: `src/styles/signature.css` styles the mark as a finished, static
drawing, and the 3D hero reads the schedule straight off those elements at
runtime rather than shipping a second copy of it.

To change the hero text, edit `VARIANTS` in `scripts/build-signature.mjs` and
re-run `npm run signature`. Keep it to the name plus at most one secondary line
— it is a signature, not an information panel. Changing it also changes the
reach envelope the robot writes into; check the arm still gets to the far end
of the longest line.

## The hero robot

`src/lib/robot/` is a real-time Three.js scene: an unbranded six-axis industrial
arm that redraws the signature. It is ported from `../robot-arm-prototype/`,
which is the approved reference implementation — **do not redesign or simplify
the geometry**; if the chunk needs to get smaller, fix the loading strategy
first. `design-spec.md` §6.5 records why a WebGL hero is allowed here and
nowhere else on the site.

| File | Responsibility | Typed? |
|---|---|---|
| `dimensions.ts` | Link lengths, base position and the signature→scene mapping every other file agrees on | yes |
| `signature.ts` | Reads the poster SVG's strokes, merges their vertical extents into text rows, densifies the geometry, and lays out the timetable | yes |
| `choreography.ts` | Where the tool tip is at a given second, and the closed-form two-link solve that puts it there | yes |
| `model.js` | Geometry, materials and joint hierarchy — ported verbatim | no |
| `ink.js` | The signature as scene geometry | no |
| `mount.js` (+ `mount.d.ts`) | Renderer, lights, camera profiles, theme, clock, disposer | no |

Three of those are JavaScript because `three@0.180` ships no type declarations.
The untyped surface is deliberately confined to the three files that import
Three.js; all the logic — timing, row detection, kinematics — is strict
TypeScript, and `mount.d.ts` types the boundary the loader crosses.

**Loading, and why the poster is gated.** The poster is the *completed*
signature. If it paints and the robot then takes over, the visitor watches a
finished mark appear, vanish, and be written again — which reads as a bug. So
the decision is made before first paint.

`HeroScene.astro` carries an inline `<script is:inline>` that runs before the
hero markup is parsed. It checks the two things knowable synchronously —
`prefers-reduced-motion` and a WebGL 2 context — and, only if both pass, sets
`data-hero-robot="pending"` on `<html>`. CSS hides the poster on that attribute,
so on the enhanced path the completed signature is never composited at all.

`src/scripts/heroRobot.ts` (0.7 KB gzipped, the only part in the main bundle)
then *reads that same flag* rather than re-deriving it. That is the invariant
worth protecting: **the poster is hidden if and only if the loader is going to
run.** Two independent checks could disagree and leave a permanently blank
hero. It waits for the hero to approach the viewport, then for an idle
callback, then dynamically imports `mount.js`, reveals the canvas, and calls
`handle.start()`. `mountRobot` resolves only after a frame has been painted, so
the reveal never lands on a blank canvas, and the sequence is armed *after* the
reveal so the writing starts from an empty trajectory in front of the visitor.

What the visitor sees: an empty mark area → the canvas fades in on the neutral
pose with no ink → the robot writes → the finished writing and the settled pose
stay indefinitely.

**Degradation, in order.** No JavaScript, reduced motion or no WebGL 2 → the
gate never fires, the completed poster is the hero, and Three.js is never
fetched. A failed import, a renderer that will not start, or a lost context →
`data-robot` becomes `unavailable`/`lost` and the CSS puts the poster back. If
the chunk simply takes longer than `PATIENCE_MS` (3 s) the poster is revealed
anyway — the one case where the completed mark is seen first, on the grounds
that an indefinitely blank hero is worse; a late arrival still cross-fades over
it. The hero is never empty for long and never blank forever.

**The end state is terminal.** `started` latches inside `mount.js`, so the
sequence runs once. Scrolling away pauses rendering and scrolling back does not
restart it: the completed writing and the settled pose stay until the page is
reloaded. Nothing loops, nothing clears, nothing resets.

**The arm does not chase strokes.** It travels to the start of a row, then
advances steadily along it while the ink draws underneath, with small tapered
wrist motion. That is how a six-axis machine actually writes, and chasing
individual strokes made the arm twitch. One pass, about six seconds, on first
view; it never loops. Travel between rows is a fixed slice of the budget and
stays visibly quicker than writing, in the same proportion as the generator's
own 100 mm/sec against 20 mm/sec.

**Synchronisation.** There is one clock. `mount.js` accumulates frame deltas
into `current`, and that single number drives both `sampleSequence()` (the arm)
and `ink.update()` (the writing), in one renderer and one camera. They cannot
drift, because there is nothing to drift from.

**Composition.** One model at every size; only the camera profile changes.
Below 640px the base is deliberately outside the frame so the name and the
working end of the arm get the room. Profiles live at the top of `mount.js`.

## Progressive enhancement

Four features are used behind detection, and none of them breaks content when
absent:

| Feature | Fallback |
|---|---|
| `animation-timeline: view()` | `@supports not (…)` branch; `reveal.ts` adds `.reveal-js` to `<html>` and an IntersectionObserver adds `.is-visible`. **Content is visible by default** — the class that hides it is only ever added by the script |
| Container queries | `@supports not (container-type: inline-size)` falls back to the media-query layout, which is a complete design on its own |
| `color-mix()` | `@supports not` fallback on the scrolled header background |
| WebGL 2 | Detected before Three.js is requested; without it the hero stays the completed static SVG and nothing is downloaded |

No polyfills.

## Media

Source stills are 13–19 MB phone PNGs. `scripts/encode-media.sh` produces the
cropped JPEG masters; `astro:assets` emits AVIF/WebP at the displayed widths.
Never reference anything in `../source material/` from a component.

Every crop in that script exists for a reason, and two of them are privacy
controls rather than editorial ones:

- the result photograph is cropped to remove a production drawing's title block,
  which carried a named draughtsman, part codes and dates;
- the workshop photograph is cropped to exclude the company logo, because that
  consent is unconfirmed.

Do not widen either crop without asking.

## Things that are deliberate

- **No contact form.** Email plus a copy button, no backend.
- **No proficiency bars, no percentages, no fabricated statistics.** The only
  numbers on the site are generator outputs verified by running the code.
- **No diagram depicts data that was not measured.** Diagrams explain methods.
- **The `em`/`i` element is set in the serif**, because Plex Sans italic is
  unremarkable and weakens the page.
- **`overflow-x: hidden` on `body`** — the page must never scroll sideways.

## Still to confirm

Marked `TODO(confirm)` in `src/data/site.ts`:

1. The availability line — omitted entirely until Hazar answers, rather than guessed.
2. Which email address to publish.
3. Whether the GitHub repository is public and should be linked.
4. Whether Neksus may be named — referenced from one place so the change is one edit.
5. The production domain, in `astro.config.mjs`.
