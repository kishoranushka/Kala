# KALA — Project Memory

> Running log of work done, current state, and what's next. Read at the start of every session (auto-loaded via `CLAUDE.md`); update at the end of every session. Keep it short — this is a handoff note, not documentation (structure/how-to lives in `README.md`).

## Snapshot (last updated 2026-11-01)

- **What:** KALA art website — original paintings, mandalas, commissions. Faithful React port of the artist's own design canvas.
- **Design source of truth:** Claude Design canvas https://claude.ai/artifact/H27WqPukwCvbTamhj7wZ6J (`project/*.dc.html`, `kala-data.js`, `kala-motion.js`, `kala.css`). Re-read it when design questions come up — don't guess.
- **Stack:** Vite 6 + React 18 (JSX, no TS) + Tailwind CSS v4 (`@tailwindcss/vite`) + React Router 6 + GSAP 3 / ScrollTrigger.
- **Deploy:** Vercel project `kala` (linked via `.vercel/`, gitignored). `vercel.json` has SPA rewrite to `/index.html`.
- **Status:** All 10 pages ported and committed (`55fd81d`). Builds. No backend.

## Done

### 2026-10-29 — Initial port (commit 55fd81d)
- Scaffolded Vite/React/Tailwind v4 project; design tokens in `@theme` (`src/styles/index.css`), desktop-first breakpoints (`max-lg:`, `max-sm:`).
- Ported all pages: Home, Shop, Artwork (`/artwork/:id` + bag drawer + fullscreen viewer), Collections, Collection, Archive, Artist, Commission, Contact, Order (3-step).
- Full motion system in `src/motion/createMotion.js`, driven by data attributes (`data-reveal`, `data-words`, `data-spin`, `data-cursor`, `data-magnetic`…); intro curtain, page-transition curtain, custom cursor, circular menu; reduced-motion fallback.
- Content centralised in `src/data/works.js` + `src/data/site.js`; images/films in `src/assets/`.
- Bag state in `src/context/BagContext.jsx` (per visit only).
- Added `vercel.json` and linked Vercel project.

### 2026-11-01 — Session continuity setup
- Added `MEMORY.md` (this file) and `CLAUDE.md` (auto-loads this file + working rules).
- Added `/wrap-up` slash command (`.claude/commands/wrap-up.md`) to update this file at session end.

### 2026-11-01 — Beige redesign port (IN PROGRESS, page by page)
- Canvas was updated: all pages now use the beige "Homepage 2" look (canvas files `Home2.dc.html`, `home.css`, `home-beige.css`, `site.css`) + new `Walls.dc.html` page. `Main.dc.html` (indigo/Fraunces) is an unused alternate.
- User decisions: Home2 (beige) is `/`; keep + restyle Collections/Collection/Archive; roll out page by page, commit each.
- Done: theme tokens (role names: primary, secondary, page, surface, muted… in `src/styles/index.css` top block), header/footer/menu/progress, new data (10 new works, PHOTOS, REELS in `works.js`; real links in `site.js`), `CartButton`, gentle home opening. Commit `4ac1db2`.
- Remaining order: Home → Walls (new route `/walls`) → Shop → Artwork → Collections → Collection → Archive → Artist → Commission → Contact → Order.
- New canvas has NO films/videos; old `FILMS` + `Film.jsx` still used by old pages — drop when those pages are ported (tell user).
- Scratch copy of canvas files: re-download with Artifact read (`path` = `project/X.dc.html`; images: `path` = bare 32-hex blob id).

## Open / Next up

- Forms (commission, contact, order) validate but aren't wired to any backend — each says so on screen.
- Placeholder content still in data (`[Artist name]`, `[Medium]`, contact placeholders in `site.js`) — needs real values from the artist.
- Confirm Vercel deployment is live / production URL (not recorded yet).

## Decisions & gotchas

- Port must stay faithful to the canvas — no visual reinterpretation; keep all GSAP motion.
- Motion selects on data attributes — keep them when editing markup. Page-specific choreography goes through `usePageMotion(fn)` (see `src/pages/home/homeMotion.js`).
- Tailwind named text sizes set size only; line-height via `text-sm/[22px]`.
- Canvas blobs (`/_blob/<id>`) must be read one id at a time.
- Shell is Windows PowerShell 5.1 (no `&&`).

## Session log

<!-- Newest first. One entry per session: date — what changed — where things were left. -->
- 2026-11-01 — Set up MEMORY.md, CLAUDE.md and /wrap-up for session continuity. No code changes.
- 2026-10-29 — Built and committed the full React port.
