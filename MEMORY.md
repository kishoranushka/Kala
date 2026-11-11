# KALA — Project Memory

> Running log of work done, current state, and what's next. Read at the start of every session (auto-loaded via `CLAUDE.md`); update at the end of every session. Keep it short — this is a handoff note, not documentation (structure/how-to lives in `README.md`).

## Snapshot (last updated 2026-11-01)

- **What:** KALA by Anushka Kishor — paintings, mandalas, wall murals, painted wearables. Faithful React port of the artist's own design canvas.
- **Design source of truth:** Claude Design canvas https://claude.ai/artifact/H27WqPukwCvbTamhj7wZ6J. Live design = beige "Homepage 2" (`project/Home2.dc.html` + `home.css`, `home-beige.css`, `site.css`) and the inner `*.dc.html` pages. `Main.dc.html` (indigo/Fraunces) is an unused alternate. Re-read the canvas when design questions come up — don't guess.
- **Stack:** Vite 6 + React 18 (JSX) + Tailwind CSS v4 + React Router 6 + GSAP 3 / ScrollTrigger.
- **Deploy:** Vercel project `kala` (`.vercel/` gitignored); pushing `main` to github.com/kishoranushka/Kala likely auto-deploys.
- **Status:** All 11 pages on the beige redesign, committed and pushed (`origin/main` = `170cdde`, in sync). Builds clean. No backend. Vercel deploy not yet verified.

## Done

### 2026-10-29 — Initial port (`55fd81d`)
- Vite/React/Tailwind v4 project, all pages, full GSAP motion system (data-attribute hooks), cart (was "bag") context, Vercel config.

### 2026-11-01 — Session continuity
- `MEMORY.md`, `CLAUDE.md` (auto-loads memory), `/wrap-up` command. Pushed.

### 2026-11-01 — Beige redesign port (`4ac1db2` … `85483e1`, pushed)
- **Theme:** role-named tokens at top of `src/styles/index.css` (primary, secondary, page, surface, mat, soft, muted, link…, `--radius-ui` 6px, fonts). Palette classes codemodded across src. Remaining hex only in illustration paint constants (HomeMandalas, FlowerGlyph tints) + shadows.
- **Chrome:** header (wordmark + "by Anushka Kishor", nav Shop/Commission/Wall murals/The Artist/Contact, cart icon → /order), footer, menu (adds Wearables `/#wearables`), progress ring; gentle (curtain-free) home opening (`handle.gentle`).
- **Data:** 10 new works, `PHOTOS`, `REELS` in `works.js`; real email/Instagram/YouTube in `site.js`. 25 new images in `src/assets/images/`.
- **Pages:** Home rebuilt (8 sections); new `/walls`; Shop, Collections, Archive new layouts; Artwork, Collection, Artist, Commission, Contact, Order updated.
- **Shared components:** `PageTop`, `SectionHead`/`ArrowLink`/`Chips`, `CtaBand`, `Mat`, `ShopCard`, `CartButton`, `FlowerGlyph`.
- **Removed:** films/videos (not in new canvas), `Film.jsx`, `FILMS`, old artist portrait, `PageIntro`, `CommissionBand`, old home sections.
- README rewritten (theming table, routes, structure).

### 2026-11-02 — Mobile motion + image loading (uncommitted)
- **Images:** all 40 JPGs → WebP (≤1400px, q72) via `scripts/optimize-images.mjs` (sharp devDep); 9.9 MB → 4.4 MB. Imports in `works.js` now `.webp`; JPGs deleted (still in git history). `loading="lazy"` everywhere except above-the-fold (hero piece has `fetchpriority="high"`).
- **Motion (`createMotion.js`):** small screens (<1024px) get ~0.7× durations, smaller offsets, reveals start at `top 97%`, softer inner zoom (1.1), arrival timeline ×1.25, curtain ×1.35 (`quick`). `data-spin` tweens pause off-screen (skipped for fixed layers, e.g. menu) and, on touch, during scroll. Marquee: no skew + lower speed-up on touch. ScrollTrigger re-measures after lazy image loads.

### 2026-11-10 — Forms emailed via Web3Forms (uncommitted)
- `src/utils/sendForm.js` posts to api.web3forms.com; key = `FORM_ACCESS_KEY` in `src/data/site.js` (or `VITE_WEB3FORMS_KEY`). `useFormFlow(validate, send)` is now async (sending/failed/done). Commission, Contact, Order send real emails (reply-to = visitor); honeypot `botcheck`; error Notice on failure. "Not connected" notices removed from `FormSuccess`. Reference images aren't uploaded (Web3Forms free plan) — UI says they'll be requested by email.

### 2026-11-11 — Local painting editor (uncommitted)
- Paintings + collections moved from `works.js` into `src/data/works.json` (images by file name, resolved via `import.meta.glob`; status normalised so "Sold"/"Inquiry Only" work). PHOTOS/REELS/STUDIO stay in `works.js`.
- `npm run admin` → `/__admin`: Vite dev-only plugin `scripts/admin/plugin.mjs` + page `scripts/admin/index.html`. Edit/add paintings, upload photos (sharp → WebP ≤1400px), click-to-place close-ups. Server validates; blocks deleting ids referenced in `src/` or collection leads. Not in `dist`.

### 2026-11-11 — Company logo (uncommitted)
- `brand/`: logo set built from the curtain (transition) mandala in `Curtain.jsx` + "KALA" wordmark: dark/beige squares, 1920×1080 banner, stacked & horizontal (transparent), mark PNG/SVG, profile pic. Rendered via Edge headless (squares laid out ≥512 css px, since Edge's min window is ~500). Older favicon-mandala set in `brand/old-favicon-mandala/`.

### 2026-11-11 — Shiprocket (uncommitted, untested with real credentials)
- `api/order.js` (Vercel function) + `api/_lib/shiprocket.js`: validates, re-prices from `works.json` (only `available` works), creates Shiprocket adhoc order (Prepaid, pickup = env, channel looked up by name "Kala" via `/channels`). Parcel from per-work `ship` {weight,length,breadth,height} or default 1 kg 50×40×6. Order ref `KALA-<base36>`.
- Order page: ship → `/api/order` then Web3Forms email (always; includes Shiprocket result or "add by hand"). Phone (10-digit) + state required for shipping. Collect/international skip Shiprocket.
- `scripts/dev-api.mjs` runs `/api/*` under `vite` dev (loads `.env.local`). `vercel.json` rewrite now excludes `/api/`. Editor has "Shipping box" fields.
- Env (Vercel + `.env.local`): SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD (API user), SHIPROCKET_PICKUP_LOCATION; optional SHIPROCKET_CHANNEL_NAME/ID.

## Open / Next up

- **Shiprocket:** create API user, set env vars in Vercel + `.env.local`, place a test order, then cancel it in Shiprocket.

- **Paste the Web3Forms access key** (from web3forms.com, made with kishoranushka96@gmail.com) into `FORM_ACCESS_KEY` in `src/data/site.js`, then test each form once. Without it, forms show the "couldn't be sent" error.
- Placeholder content (`[Medium]`, `[Size]`, `[Location]`, reel titles/links, bios) — needs real values from the artist.
- Check the Vercel deploy of the redesign went live, and record the production URL.

## Decisions & gotchas

- "Flute and Veena" and "Radha and Krishna in Blue" look alike but are different paintings (confirmed by user) — keep both.
- Faithful to the canvas; keep motion data attributes (`data-reveal`, `data-words`, `data-spin`…). Page choreography via `usePageMotion(fn)`.
- Colours/fonts: change only in the THEME block of `src/styles/index.css`; use role classes (`bg-primary`, `text-secondary`…), never raw hex in JSX.
- Box with `aspect-ratio` + flex-centred img needs `min-h-0 overflow-hidden` (else it grows) — use `Mat`.
- Tailwind conflicting utilities on one element (e.g. `text-primary` + `text-on-primary`) → unpredictable; put colour in one place. Arbitrary `calc()` needs `_` for spaces.
- Visual check: `npx vite preview --port 4173`, then Edge headless screenshot with `?still` (freezes motion; GSAP doesn't advance under headless virtual time). Edge min window ≈500px → for phone, load page in a 390px iframe.
- Canvas files: Artifact read with `path` = `project/X.dc.html`; images: `path` = bare 32-hex blob id, one per call.
- Windows PowerShell 5.1: no `&&`; `Get-Content` shows UTF-8 as mojibake (files are fine). Don't rewrite files via `Get-Content | Set-Content` — it corrupts UTF-8; use Edit/Write. Start the preview with `Start-Process cmd.exe -ArgumentList '/c','npx vite preview …'`.
- New paintings: use the editor (`npm run admin`). Other photos: drop JPG in `src/assets/images/`, run `node scripts/optimize-images.mjs`, reference the `.webp` via `img('name.webp')` in `works.js`, delete the JPG.

## Session log

- 2026-11-11 — Painting data → works.json + local editor at /__admin (npm run admin). Builds clean; uncommitted.
- 2026-11-10 — Wired commission/contact/order forms to email via Web3Forms. Builds clean; uncommitted. Next: paste access key, test, commit/push.
<!-- Newest first. One entry per session: date — what changed — where things were left. -->
- 2026-11-02 — Mobile-friendly motion, WebP + lazy images. Builds clean; uncommitted. Next: commit/push, pick a form-to-email service.
- 2026-11-01 — Ported the whole beige redesign page by page, centralised theme tokens, removed films. All pushed; origin/main in sync at 170cdde. Next: verify Vercel deploy, then forms backend / real content.
- 2026-11-01 — Set up MEMORY.md, CLAUDE.md and /wrap-up for session continuity.
- 2026-10-29 — Built and committed the full React port.

