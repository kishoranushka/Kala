# KALA — Project Memory

> Running log of work done, current state, and what's next. Read at the start of every session (auto-loaded via `CLAUDE.md`); update at the end of every session. Keep it short — this is a handoff note, not documentation (structure/how-to lives in `README.md`).

## Snapshot (last updated 2026-11-11)

- **What:** KALA by Anushka Kishor — paintings, mandalas, wall murals, painted wearables. Faithful React port of the artist's own design canvas.
- **Design source of truth:** Claude Design canvas https://claude.ai/artifact/H27WqPukwCvbTamhj7wZ6J. Live design = beige "Homepage 2" (`project/Home2.dc.html` + `home.css`, `home-beige.css`, `site.css`) and the inner `*.dc.html` pages. `Main.dc.html` (indigo/Fraunces) is an unused alternate. Re-read the canvas when design questions come up — don't guess.
- **Stack:** Vite 6 + React 18 (JSX) + Tailwind CSS v4 + React Router 6 + GSAP 3 / ScrollTrigger.
- **Deploy:** Vercel project `kala` (`.vercel/` gitignored); pushing `main` to github.com/kishoranushka/Kala auto-deploys. Production: https://kala.anushkakishor.in
- **Status:** Everything through Shiprocket committed and pushed (2026-11-11), live and verified (pages 200, `/api/order` responds). Shiprocket env vars set in Vercel (Production). Web3Forms key still empty → forms error until it's added.

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

### 2026-11-11 — Razorpay + Supabase checkout, order tracking, no studio (uncommitted, NOT deployed)
- Order flow is now pay-online: `/api/order` (validate, price from works.json, hold works 20 min via Supabase rpc `hold_works`, Razorpay order) → Razorpay Checkout (UPI QR first) → `/api/verify` or `/api/razorpay-webhook` → `_lib/finalize.js` (claim pending→paid once, `sell_works`, Shiprocket, Resend emails). `replaces` lets a buyer restart their own checkout; late payment on an abandoned checkout is honoured + flagged (no 2nd Shiprocket order if all works clashed).
- `/api/availability` → `src/data/liveStatus.js` marks online-sold works Sold before first render (1.5 s timeout). `/track` page + `/api/track` (ref + email). Footer link "Track an order".
- Schema in `supabase/schema.sql` (orders, holds, RLS on, no policies). DB via REST, no SDK. Emails: Resend optional; without it the browser sends the artist alert via Web3Forms.
- Buyable = available AND price ≥ ₹1 (Ganesha, Vitthal, Happy Cat have no real price → hidden from order page). Shipping free, India only (abroad → Contact).
- Studio removed: no "collect from studio"; "Studio" labels → "Based in"; "studio updates" → "updates on new work"; Artist page eyebrow "The work as a landscape"; shop "works in all". Client spaces ("schools, studios" for murals) kept.
- Tested with a mocked Supabase/Razorpay/Shiprocket/Resend (scratchpad paytest.mjs): all flows OK. SQL itself not run yet.

### 2026-11-11 — SEO + LLM files (uncommitted)
- `src/seo/copy.json` (hand-written titles/descriptions for all pages, 5 collections, 21 paintings), `src/seo/meta.js` (shared browser/Node: meta, canonical, OG/Twitter, robots, JSON-LD graph), `src/seo/useSeo.js` (replaces the old `document.title` effect in SiteLayout).
- `npm run build` = vite build + `scripts/seo/build.mjs`: `dist/<route>.html` per route (36) with head + hidden `#seo-static` text, `sitemap.xml`, `llms.txt`, `llms-full.txt`. `vercel.json`: `cleanUrls`, `trailingSlash:false`, noindex header on /order, /track.
- `npm run og` (`scripts/seo/og.mjs`): Edge-rendered 1200×630 cards → `public/og/` (36: every route has its own) + icons (favicon-32, 192, 512, maskable, apple-touch). `public/robots.txt`, `site.webmanifest`. README has an SEO section.

### 2026-11-11 — Security / cart / error-handling audit (uncommitted)
- **API:** all outbound calls time out (`timedFetch`, 8 s); JSON answers `no-store`; body cap 64 KB; order ids use crypto random; `/api/order` rate-limited (8 checkouts/15 min per hashed IP stored as `customer.client`, 6 per email → 429); empty/unknown/sold/unpriced works → 409 with `taken` ids; holds released on any failure after insert; `/api/verify` + `/api/track` return `lost` (works another order sold first) via `db.lostWorks`; `/api/track` is POST (GET kept for old links); Shiprocket `track_url` only http(s); webhook 503 (Razorpay retries) when DB not configured, flags underpayment. Customer email names lost works; its track link no longer carries the email.
- **Cart:** `BagContext` → localStorage + cross-tab `storage` sync, every change sanitised (known + `isBuyable` only), `dropped` titles shown in drawer / order page. Unpriced "available" works (Ganesha…) can't be added to cart → "Price on request" + Ask About This Work.
- **Order page:** guards empty cart on every step; 409 removes taken works and keeps going; 422 maps to fields on step 2; checkout reuse capped at 15 min; verify retried 3×; Web3Forms fallback alert not awaited (keepalive) and flagged "check payment in Razorpay" when unconfirmed; edit/ack disabled while paying; done screen explains lost works; track link passes email in router state.
- **Forms:** `sendForm` 20 s timeout + error codes; `useFormFlow` returns `failMessage` (says "form isn't connected yet" when the Web3Forms key is missing). EMAIL_PATTERN = server rule.
- **Other:** `SmartLink` never renders `javascript:`/`data:` links; `vercel.json` security headers (nosniff, DENY framing, HSTS, referrer, permissions); dev editor `/__admin` POSTs require same-origin localhost + JSON (was CSRF-able).
- Mocked API test (20 checks) in that session's scratchpad `apitest.mjs`: all pass.

### 2026-11-11 — Policy pages (uncommitted)
- `/shipping`, `/returns`, `/terms`, `/privacy`, `/cookies`: one `PolicyPage.jsx`, text in `src/data/policies.js` (plain JS, also read by the SEO build → full text in `#seo-static`; `UPDATED` date). Footer legal links live (`LEGAL_LINKS` objects) + "Cookies"; footer year now dynamic.
- Policy decisions (user, 2026-11-11): all sales final from confirmation (payment success): no cancellation/return/refund. Refund only for duplicate charge, painting can't be sent (sold at same moment / damaged before dispatch), clear pricing error, started within 7 working days. Transit damage: report within 48 h with unboxing video → repair or replacement, no refund. Dispatch within 7 working days. Location = "India" only (courts in India); `CONTACT.location` = 'India'. Grievance officer = Anushka, email.
- Checkout ack checkbox now agrees to Terms + Returns (links open new tab). Artwork page Shipping/Returns disclosures filled. Offer JSON-LD has `MerchantReturnNotPermitted`.
- If data handling changes (new service, analytics, storage), update `policies.js` (privacy/cookies) and `UPDATED`.

### 2026-11-12 — Placeholder copy replaced (uncommitted)
- Every `[…]` placeholder replaced with first-person copy built only from facts already on the site: 21 painting notes + 5 collection intros (`works.json`), Artist page (bio, method, two practices, milestones 2019/2020/2022/2026, personal note), home Meet/Walls/Wearables, Walls page, Contact FAQ, artwork "Framing & care", reel titles, commission budgets (Under ₹5k / 5–15k / 15–40k / 40k+).
- `₹ 00,000` prices → empty (shows "Price on request"); mural sizes → "Site-specific". Krishna and Radha still priced `₹ 2` (test price).
- **Artist to check:** budget ranges, "I travel for walls across India" (Walls pages, FAQ, travel in quote), "usually over a few days" per wall, milestone years, invented reel titles.

### 2026-11-12 — Launch sale, switched by env (uncommitted)
- `src/data/sale.js` (shared by browser, API, SEO build): `VITE_SALE_ON` (true = on; anything else = no sale anywhere), `VITE_SALE_PERCENT` (default 50), optional `VITE_SALE_ENDS` (ISO; turns itself off after), `VITE_SALE_NAME` ("Launch sale"). In `.env.local`; must also be set in Vercel + redeploy.
- `payValue(w)` / `onSale(w)` in works.js; `/api/order` charges `discounted()` and stores `full` on order lines → emails show struck-out full price. Shiprocket gets the sale price.
- UI: `components/art/Price.jsx` (`SalePrice` = sale price in `text-sale` + struck full price + "50% off" pill; `SaleTag` corner pill), used on ShopCard, ArtworkCard/ArtLink, artwork page (+ savings note), cart drawer (now shows real subtotal + saving), order choose step + summary (Subtotal struck / discount line / Total), archive. `SaleBar` above header on all pages; home `SaleSection` after hero; hero pill → sale link; shop callout + `/shop?available` opens filtered; buyable works sort first. Theme tokens `sale`, `sale-on-dark`, `sale-wash`. JSON-LD Offer uses sale price + `StrikethroughPrice`; Terms mention sale prices.
- User asked to inflate only the displayed "original" price (×1.5) before discounting — declined (fake reference price = misleading under Indian consumer law / Google policy). Instead, at the user's request, the real prices in works.json were raised ×1.5 (₹2,000 → ₹3,000 etc., all "₹ x,xxx" format). This is only honest if those prices are actually charged after the sale, so set `VITE_SALE_ENDS`.
- Cart page (/order step 1) = `CartStep`: only works in the cart (rows with SalePrice + Remove), phone-only `Totals` under it, summary card hidden on phones/without item list on step 1; `Recommendations` (4 buyable ShopCards) after the section, last on every screen size. Shorter intro on phones. ShopCard status + sale pills share one wrapping row (no overlap at 360px).

### 2026-11-12 — Responsive forms (uncommitted)
- Cause of the phone overflow on /order and /artwork: `grid grid-cols-12 gap-x-8` = 11×32px of gaps (352px), wider than a phone → now `max-lg:grid-cols-1` (artwork-page 360px overflow fixed by this).
- `Fields.jsx`: all grids use `minmax(0,…)`; Field/inputs `min-w-0`; form Select is `w-full` and 16px on phones (no iOS zoom); FieldRow three → city full width, then state + PIN on phones; compact ChoiceCards on phones; new `SUBMIT_ROW` (full-width button on phones). Order NAV_ROW: full-width next button with back link under it on phones. Long emails wrap (Notice, FormSuccess, review `dl`). Styled file input. Form panels `px-5` on phones. Header gap shrinks on phones (overflowed at 320px).
- Verified in headless Edge at 320/360/390/768/1024 (commission, contact, order details with errors, track, artwork, home): no element past the viewport edge.
- "Track order" (/track) added as 6th `NAV_LINKS` item (header + menu, `MENU_LINKS` uses `NAV_LINKS[5]`); route handle `nav: 'track'`. Nav links `whitespace-nowrap`; gaps shrink at ≤1000/≤960px so 6 links fit from 901px (measured 901–1440).
- "Archived" no longer shown: `statusLabel(w)` → murals "Painted on a wall", others "Private collection", or a per-work `badge` in works.json. `StatusBadge` takes `work`. User wanted archived works to look bought for social proof — declined labelling unsold work "Sold"/"Collected"; only truthful labels (Om, Flute and Veena are the real Sold ones).

### 2026-11-12 — Shop page mobile: paintings first (uncommitted)
- User asked for this change: on phones (<640px) the Shop intro is just breadcrumbs, title (38px) and a compact sale line. Eyebrow, lead and stats are hidden there, and the 3 "featured" thumbnails are hidden below 1024px. Less padding above the grid. Paintings show on the first screen at 390px. Desktop is unchanged.
- Artwork page mobile (<1024px): `MobileBar` in ArtworkPage.jsx is now shown for every work with its main action (Add to Cart / View Cart / Ask About It / Commission Similar / Enquire / Commission a Wall). `body.has-action-bar` pads the footer. ProgressMandala `raised` was being overridden by `max-sm:bottom-4` (it covered the bar's button); it now sits at bottom 88px.
- Phone overflow check (390px iframe, all routes): no page scrolls sideways. To re-run, put a helper iframe page in `dist/` and point Edge `--dump-dom` at it.

### 2026-11-12 — Mobile motion fixed + sticky sale bar (uncommitted)
- **Root cause, phones had no motion at all:** `gsap.matchMedia().add({desktop, reduce, fine}, fn)` only runs `fn` when at least one condition matches; on a phone none did. Added `any: 'all'` condition in `createMotion.js`. Verified via CDP-driven Edge (iPhone UA, touch, 390px): intro, reveals, words, staggers all animate.
- Cards with CSS `transition` on transform (PathCard) got stuck at `translateY(20px)`: `ScrollTrigger.refresh()` read the half-done CSS transition as the end state. `hush()` turns CSS transitions off until the entrance ends; cap/stagger/reveal-art tweens now `clearProps` (incl. `translate`, which GSAP set to none and killed Tailwind hover lifts).
- Crawler regex no longer matches in-app browsers (Pinterest app, DuckDuckGo browser…); real bots still caught by `bot`.
- Sale bar + header share one sticky wrapper in `SiteLayout` (bar pinned; header still hides on scroll-down, behind the bar). `SaleBar` sets `--sale-h` on `<html>`; shop filter bar, artwork/order/policy sticky asides offset by it.
- Sweep (all main routes, 390px + 1440px): nothing left hidden/clipped/shifted after scrolling. Probe scripts were in that session's scratchpad (`mobtest.mjs*`).

## Open / Next up

- **SEO after deploy:** add the site to Google Search Console + Bing Webmaster Tools, submit `/sitemap.xml`, test a painting URL in Rich Results Test. Pre-rendered Product schema reflects works.json at build time — a painting sold online still shows InStock until the next deploy (update status in the editor + push).

- **Payment flow:** Supabase project set up, schema run, `SUPABASE_URL`/`SUPABASE_SECRET_KEY` in `.env.local` + Vercel (verified 2026-11-11: insert, hold_works, update and delete all work). Code committed + pushed (`5f875a8`…`71c1e0b`), live: `/api/availability` 200 from production Supabase, `/track` 200. Still to do: Razorpay webhook + `RAZORPAY_WEBHOOK_SECRET`, confirm Razorpay keys in Vercel, one test purchase (cancel the Shiprocket order after). Test with Razorpay test keys first, then switch to live keys.
- Set real prices for Ganesha, Vitthal, Happy Cat (and any "₹ 00,000" placeholders) in the editor.

- **Shiprocket:** env vars are set (Vercel + `.env.local`); place one real test order, confirm it shows under the Kala channel, then cancel it.

- **Paste the Web3Forms access key** (from web3forms.com, made with kishoranushka96@gmail.com) into `FORM_ACCESS_KEY` in `src/data/site.js`, then test each form once. Without it, forms show the "couldn't be sent" error.
- Copy is filled (2026-11-12) but the artist should review the assumptions listed under that date. Reel links still all point to the reels page, not to individual reels.

## Decisions & gotchas

- Shiprocket API login must be a separate **API user** (Settings → API → Configure → Create API user) with an email different from the main account (kishoranushka96@gmail.com). Main-account login → 403 "login detail incorrect" (cause of the first paid order KALA-MWCEBLHA2PS not reaching Shiprocket, 2026-11-11). Env values are trimmed in code. Fixed with a new API user; KALA-MWCEBLHA2PS re-pushed by hand (Shiprocket order 1722298468, test — cancel it). Shiprocket's `/channels` only lists "CUSTOM" (id 12903893, shown in the panel as "KALA (CUSTOM)") — that's the Kala channel; set `SHIPROCKET_CHANNEL_ID=12903893` to skip the name lookup.
- Customer confirmation email is HTML (`api/_lib/email-html.js`: tables + inline styles, 600px fluid, one phone media query, bulletproof/VML button). Logo embedded as CID attachment from `api/_lib/email-logo.js` (generated by `node scripts/email-logo.mjs`). Test-sent via Resend 2026-11-12. Real customers only get it once `MAIL_FROM` (verified domain in Resend) is set — the test sender can only mail the Resend account's own address.
- "Flute and Veena" and "Radha and Krishna in Blue" look alike but are different paintings (confirmed by user) — keep both.
- Faithful to the canvas; keep motion data attributes (`data-reveal`, `data-words`, `data-spin`…). Page choreography via `usePageMotion(fn)`.
- Colours/fonts: change only in the THEME block of `src/styles/index.css`; use role classes (`bg-primary`, `text-secondary`…), never raw hex in JSX.
- Box with `aspect-ratio` + flex-centred img needs `min-h-0 overflow-hidden` (else it grows) — use `Mat`.
- Tailwind conflicting utilities on one element (e.g. `text-primary` + `text-on-primary`) → unpredictable; put colour in one place. Arbitrary `calc()` needs `_` for spaces.
- Visual check: `npx vite preview --port 4173`, then Edge headless screenshot with `?still` (freezes motion; GSAP doesn't advance under headless virtual time). Edge min window ≈500px → for phone, load page in a 390px iframe.
- Canvas files: Artifact read with `path` = `project/X.dc.html`; images: `path` = bare 32-hex blob id, one per call.
- Windows PowerShell 5.1: no `&&`; `Get-Content` shows UTF-8 as mojibake (files are fine). Don't rewrite files via `Get-Content | Set-Content` — it corrupts UTF-8; use Edit/Write. Start the preview with `Start-Process cmd.exe -ArgumentList '/c','npx vite preview …'`.
- **Soft 404 (GSC, 2026-11-11):** Google's renderer doesn't advance GSAP frames → entrance animations left every page blank → homepage "Soft 404". Fix in `src/motion/gsap.js`: crawlers/headless/`navigator.webdriver` (UA regex `CRAWLER`) get `stillFrames` (same as `?still`): final state, no motion. Real browsers unaffected. Never let content depend on an animation finishing to become visible for bots.
- SEO copy is in `src/seo/copy.json`, not works.json; new painting → optional copy entry + `npm run og -- <id>`. Don't remove the `<!--seo:head-->`/`<!--seo:body-->` markers in `index.html` (build fails without them).
- New paintings: use the editor (`npm run admin`). Other photos: drop JPG in `src/assets/images/`, run `node scripts/optimize-images.mjs`, reference the `.webp` via `img('name.webp')` in `works.js`, delete the JPG.

## Session log

- 2026-11-12 — Phones had zero motion (gsap.matchMedia needs one matching condition) → fixed; stuck-card/refresh fix; sticky sale bar. Verified with emulated iPhone; uncommitted.

- 2026-11-11 — Audit: API hardening (timeouts, rate limit, lost-race handling), cart sanitise + cross-tab sync, order-page error recovery, form error messages, security headers, editor CSRF. Builds clean; mocked API tests pass; uncommitted.
- 2026-11-11 — SEO: per-route pre-rendered HTML, JSON-LD, sitemap, robots, llms.txt/llms-full.txt, 34 OG cards, icons, manifest. Builds clean, verified in preview; uncommitted.
- 2026-11-11 — Razorpay + Supabase checkout, /track page, studio text removed. Builds clean; mocked tests pass; uncommitted, not deployed (needs env + schema first).
- 2026-11-11 — Editor, logo, Shiprocket; committed in 6 commits, pushed, deployed to kala.anushkakishor.in. Next: Web3Forms key, Shiprocket test order.
- 2026-11-11 — Painting data → works.json + local editor at /__admin (npm run admin). Builds clean.
- 2026-11-10 — Wired commission/contact/order forms to email via Web3Forms. Builds clean; uncommitted. Next: paste access key, test, commit/push.
<!-- Newest first. One entry per session: date — what changed — where things were left. -->
- 2026-11-02 — Mobile-friendly motion, WebP + lazy images. Builds clean; uncommitted. Next: commit/push, pick a form-to-email service.
- 2026-11-01 — Ported the whole beige redesign page by page, centralised theme tokens, removed films. All pushed; origin/main in sync at 170cdde. Next: verify Vercel deploy, then forms backend / real content.
- 2026-11-01 — Set up MEMORY.md, CLAUDE.md and /wrap-up for session continuity.
- 2026-10-29 — Built and committed the full React port.

