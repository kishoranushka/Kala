# KALA — Project Memory

> Running log of work done, current state, and what's next. Read at the start of every session (auto-loaded via `CLAUDE.md`); update at the end of every session. Keep it short — this is a handoff note, not documentation (structure/how-to lives in `README.md`).

## Snapshot (last updated 2026-11-01)

- **What:** KALA by Anushka Kishor — paintings, mandalas, wall murals, painted wearables. Faithful React port of the artist's own design canvas.
- **Design source of truth:** Claude Design canvas https://claude.ai/artifact/H27WqPukwCvbTamhj7wZ6J. Live design = beige "Homepage 2" (`project/Home2.dc.html` + `home.css`, `home-beige.css`, `site.css`) and the inner `*.dc.html` pages. `Main.dc.html` (indigo/Fraunces) is an unused alternate. Re-read the canvas when design questions come up — don't guess.
- **Stack:** Vite 6 + React 18 (JSX) + Tailwind CSS v4 + React Router 6 + GSAP 3 / ScrollTrigger.
- **Deploy:** Vercel project `kala` (`.vercel/` gitignored); pushing `main` to github.com/kishoranushka/Kala likely auto-deploys.
- **Status:** All 11 pages on the beige redesign, committed. Builds clean. No backend.

## Done

### 2026-10-29 — Initial port (`55fd81d`)
- Vite/React/Tailwind v4 project, all pages, full GSAP motion system (data-attribute hooks), cart (was "bag") context, Vercel config.

### 2026-11-01 — Session continuity
- `MEMORY.md`, `CLAUDE.md` (auto-loads memory), `/wrap-up` command. Pushed.

### 2026-11-01 — Beige redesign port (`4ac1db2` … `85483e1`, not pushed yet)
- **Theme:** role-named tokens at top of `src/styles/index.css` (primary, secondary, page, surface, mat, soft, muted, link…, `--radius-ui` 6px, fonts). Palette classes codemodded across src. Remaining hex only in illustration paint constants (HomeMandalas, FlowerGlyph tints) + shadows.
- **Chrome:** header (wordmark + "by Anushka Kishor", nav Shop/Commission/Wall murals/The Artist/Contact, cart icon → /order), footer, menu (adds Wearables `/#wearables`), progress ring; gentle (curtain-free) home opening (`handle.gentle`).
- **Data:** 10 new works, `PHOTOS`, `REELS` in `works.js`; real email/Instagram/YouTube in `site.js`. 25 new images in `src/assets/images/`.
- **Pages:** Home rebuilt (8 sections); new `/walls`; Shop, Collections, Archive new layouts; Artwork, Collection, Artist, Commission, Contact, Order updated.
- **Shared components:** `PageTop`, `SectionHead`/`ArrowLink`/`Chips`, `CtaBand`, `Mat`, `ShopCard`, `CartButton`, `FlowerGlyph`.
- **Removed:** films/videos (not in new canvas), `Film.jsx`, `FILMS`, old artist portrait, `PageIntro`, `CommissionBand`, old home sections.
- README rewritten (theming table, routes, structure).

## Open / Next up

- Push the redesign commits (user hasn't asked yet).
- Forms (commission, contact, order) validate but aren't wired to any backend.
- Placeholder content (`[Medium]`, `[Size]`, `[Location]`, reel titles/links, bios) — needs real values from the artist.
- Record the Vercel production URL.

## Decisions & gotchas

- "Flute and Veena" and "Radha and Krishna in Blue" look alike but are different paintings (confirmed by user) — keep both.
- Faithful to the canvas; keep motion data attributes (`data-reveal`, `data-words`, `data-spin`…). Page choreography via `usePageMotion(fn)`.
- Colours/fonts: change only in the THEME block of `src/styles/index.css`; use role classes (`bg-primary`, `text-secondary`…), never raw hex in JSX.
- Box with `aspect-ratio` + flex-centred img needs `min-h-0 overflow-hidden` (else it grows) — use `Mat`.
- Tailwind conflicting utilities on one element (e.g. `text-primary` + `text-on-primary`) → unpredictable; put colour in one place. Arbitrary `calc()` needs `_` for spaces.
- Visual check: `npx vite preview --port 4173`, then Edge headless screenshot with `?still` (freezes motion; GSAP doesn't advance under headless virtual time). Edge min window ≈500px → for phone, load page in a 390px iframe.
- Canvas files: Artifact read with `path` = `project/X.dc.html`; images: `path` = bare 32-hex blob id, one per call.
- Windows PowerShell 5.1: no `&&`; `Get-Content` shows UTF-8 as mojibake (files are fine).

## Session log

<!-- Newest first. One entry per session: date — what changed — where things were left. -->
- 2026-11-01 — Ported the whole beige redesign page by page, centralised theme tokens, removed films. All committed locally, not pushed.
- 2026-11-01 — Set up MEMORY.md, CLAUDE.md and /wrap-up for session continuity.
- 2026-10-29 — Built and committed the full React port.
