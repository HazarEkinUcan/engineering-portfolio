# Hazar Ekin Uçan — portfolio

Engineering portfolio. Astro 5, static output, no CSS framework, no client-side
libraries.

```bash
npm install
npm run fonts
npm run dev
```

Then open http://localhost:4321.

| Command | What it does |
|---|---|
| `npm run dev` | development server |
| `npm run build` | static build into `dist/` |
| `npm run preview` | serve the build locally |
| `npm run check` | TypeScript and content-schema validation |
| `npm run fonts` | copy IBM Plex woff2 into `public/fonts/` |
| `npm run signature` | regenerate the hero mark from the FANUC generator |
| `npm run media` | re-crop and re-encode images and video |

Deployment target is Cloudflare Pages: build `npm run build`, output `dist`,
Node 22. Nothing is deployed yet.

See `CLAUDE.md` for architecture notes and `../planning/` for the approved
content, design and technical plans.
