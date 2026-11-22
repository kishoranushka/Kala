# KALA

Original paintings, mandalas, wall murals and painted wearables by Anushka Kishor.

The KALA website, built with React, Tailwind CSS v4 and GSAP from the KALA Website design canvas (the beige "Homepage 2" design). It has eleven pages and the canvas's motion system: a gentle opening on the home page, the curtain between pages, scroll reveals, turning mandalas, the gallery cursor, magnetic controls and the circular menu.

## Scripts

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/ (+ SEO pre-render, see below)
npm run preview   # serve the production build
npm run og        # re-render social cards + app icons into public/ (needs Edge/Chrome)
```

Add `?still` to any URL to see the page in its final, motionless state (handy for screenshots).

## SEO

- **Copy:** every page's, collection's and painting's title + description lives in `src/seo/copy.json`. A painting's description ends with a line generated from its status/price (e.g. "₹2,000, free delivery in India."), so it stays right when the price or status changes. A painting with no entry still gets a generated title and description.
- **Logic:** `src/seo/meta.js` (titles, canonical, Open Graph/Twitter, robots, JSON-LD: Organization, Person, WebSite, Product + VisualArtwork with Offer, BreadcrumbList, CollectionPage/ItemList, Service). Used by the browser (`src/seo/useSeo.js`, updates `<head>` on navigation) and by the build.
- **Build:** `scripts/seo/build.mjs` runs after `vite build` and writes `dist/<route>.html` for every route with its own head and the page text in a hidden `#seo-static` block (for crawlers that don't run JavaScript; React replaces it), plus `sitemap.xml` (with images), `llms.txt` and `llms-full.txt`. Vercel serves them via `cleanUrls`.
- **Static:** `public/robots.txt` (AI crawlers allowed), `public/site.webmanifest`, icons, `public/og/*.jpg` (1200×630 cards: one per painting, collection and main page).
- **After adding a painting:** add its copy to `src/seo/copy.json` (optional), run `npm run og -- <id>`, commit `public/og/<id>.jpg`, push.

## Changing colours and fonts

Every colour, font and corner radius is defined once, at the top of `src/styles/index.css`, under **KALA THEME**. Colours are named by role, not paint:

| Token | Used for |
| --- | --- |
| `primary` | headlines, body text, dark buttons, dark sections, footer |
| `on-primary`, `on-primary-muted`, `on-primary-soft` | text on a primary fill |
| `secondary`, `secondary-on-dark` | section labels, accent words, button hover |
| `page`, `surface`, `surface-alt`, `mat` | page background, raised panels, sand band, mounts behind art |
| `soft`, `muted`, `divider`, `line` | secondary copy, captions, hairlines, control borders |
| `link`, `success`, `warning`, `error` | links and focus, status colours |

Each token becomes Tailwind classes (`--color-primary` gives `bg-primary`, `text-primary`, `border-primary`…), so changing a value there restyles the whole site. Fonts are `--font-display` (Cormorant Garamond) and `--font-sans` (Manrope); load a replacement in `index.html`. `--radius-ui` sets the 6px corners (`rounded-ui`). Pastel illustration colours (the home mandala and small flower glyphs) are named constants in `pages/home/HomeMandalas.jsx` and `components/mandala/Mandala.jsx`.

## Pages

| Route | Page |
| --- | --- |
| `/` | Home: hero with the pastel mandala, five ways in, shop strip, wall murals, wearables, Instagram reels, meet the artist, closing band |
| `/shop` | All paintings, with collection chips and an available-only switch; add to cart from each card |
| `/artwork/:id` | Viewing room: views and details, cart, full-screen viewer, story, related works |
| `/collections` | The five chapters |
| `/collections/:id` | One chapter with its works and neighbouring chapters |
| `/archive` | Sold, archived and inquiry-only works, plus available ones |
| `/walls` | Wall murals: painted walls, how a wall comes together |
| `/artist` | The artist: photo collage, studio landscape, method, two practices, milestones |
| `/commission` | Commission enquiry form |
| `/contact` | Contact links, message form and FAQ |
| `/order` | Three-step order request (choose, then details, then review) |

## Structure

```
src/
  main.jsx                 app entry (router + cart provider)
  router.jsx               routes; each route's `handle` configures the page chrome
  styles/index.css         THEME tokens (@theme), base styles, type presets (eyebrow, heading-*, lead…)
  data/
    works.json             build snapshot of the paintings + collections (source: database, edit at /admin)
    works.js               loads works.json; photos, reels, studio images + helpers
    site.js                navigation, menu, footer links, contact details
  assets/images            artwork and studio photographs
  motion/                  shared GSAP choreography (data-attribute hooks), per-route mounting
  context/BagContext.jsx   the cart (originals set aside), kept for the visit
  hooks/                   useFormFlow, useDialogKeys, useScrollLock
  components/
    layout/                SiteLayout, Header, Footer, MenuOverlay, Curtain, Cursor, ProgressMandala, Wordmark
    ui/                    Button, TextLink, Icon, StatusBadge, Breadcrumbs, Disclosure, Notice, Toast, Typography
    art/                   ShopCard, CartButton, Mat, ArtLink, ArtworkCard
    form/                  Fields (Input, Select, ChoiceCard, Checkbox…), FormSuccess
    mandala/               PageMandala (line mandala), RingMandala, FlowerGlyph, Petals
    sections/              PageTop, SectionHead (+ ArrowLink, Chips), CtaBand, InverseSection
  pages/
    home/                  HomePage + sections/, HeroDome mandala, home motion
    artwork/               ArtworkPage, BagDrawer, FullscreenViewer
    order/                 OrderPage, steps, OrderSummary
    ShopPage, CollectionsPage, CollectionPage, ArchivePage, WallsPage, ArtistPage, CommissionPage, ContactPage
```

## How the pieces fit

- **Breakpoints** are desktop-first, used as `max-lg:`, `max-sm:` and so on. Named text sizes (`text-sm`) set only the size; line height is inherited unless given (`text-sm/[22px]`).
- **Motion** is driven by data attributes in the markup: `data-reveal`, `data-words`, `data-cap`, `data-stagger`, `data-spin`, `data-cursor`, `data-magnetic` and others. Add one to an element and the shared choreography picks it up. A page with its own choreography registers it with `usePageMotion(fn)`; see `pages/home/homeMotion.js`. Visitors who prefer reduced motion get a quiet fade instead.
- **Content** comes from the database (paintings + collections), `data/works.js` (photos, reels, helpers) and `data/site.js`. Bracketed text such as `[Medium]` or `[Location]` is a placeholder for the artist to replace.
- **Admin panel** at **/admin** (live site, or `npm run admin` locally): password login (`ADMIN_PASSWORD`). Works on a phone. Add and edit paintings: tag (Available / Inquiry only / Sold / Archived), price, details, close-up points, shipping box, second photo. A new photo goes through the **photo fixer** first (`src/admin/photo.js`): it finds the painting's 4 corners (OpenCV.js, loaded from jsDelivr on first use), you drag any that are off, rotate in 90° steps, then it straightens the perspective and trims a plain paper/table border. The server (`api/admin.js`) turns it into a ≤1400px WebP in Supabase Storage.
  - Where things live: paintings and collections are rows in the Supabase tables `works` / `collections` (`data` = the same object as a works.json entry); photos are in the public Storage bucket `paintings`. `src/data/works.json` is now a **build snapshot**: `npm run build` first runs `scripts/catalog/pull.mjs`, which rewrites it from the database and downloads new photos into `src/assets/images/` (so they're served by Vercel). If the database can't be reached, the committed copy is used.
  - Going live: the site fetches `/api/catalog` before its first render, so a saved change shows within ~10 s. Each save also calls the Vercel deploy hook (`VERCEL_DEPLOY_HOOK_URL`) to rebuild the pre-rendered SEO pages, sitemap and llms.txt (~2 min). A painting sold online is set to Sold in the database automatically.
  - Paintings the site shows by ID (home hero, shop strip…; `PINNED` in `api/_lib/catalog.js`), collection covers and paintings with online orders can't be deleted; mark them Sold or Archived instead.
  - One-time setup: run `supabase/schema.sql`, then `node scripts/catalog/migrate.mjs` (copies works.json + its photos into Supabase; refuses if the tables already have paintings unless `--force`).
- **Forms** (commission, contact, order) are emailed to the artist via Web3Forms; the access key is `FORM_ACCESS_KEY` in `data/site.js`.
- **Orders and payment** (Vercel functions in `api/`; `npm run dev` runs them too, reading `.env.local`):
  1. `POST /api/order` checks the details, prices the paintings from the database (falls back to the bundled `works.json`), holds them for 20 minutes in Supabase and creates a Razorpay order.
  2. The buyer pays in Razorpay Checkout (UPI QR code first, then cards and netbanking).
  3. `POST /api/verify` (from the browser) or `POST /api/razorpay-webhook` (from Razorpay) checks the signature and finalises the order once: paid → paintings sold → Shiprocket order (channel "Kala") → emails.
  4. `GET /api/catalog` returns the live catalogue + paintings sold online; the site applies it on load (`GET /api/availability` still answers for old tabs).
  5. `GET /api/track` powers `/track` (order reference + email, no login).
  - Database tables: `supabase/schema.sql`. Only works marked Available **with a price** can be bought online. Delivery within India is free from ₹1,499 (paintings + framing), else ₹50 per order; orders from abroad go through Contact. Unframed paintings offer an optional frame (₹120 small / ₹400 large; "Framing option for buyers" in the admin panel). All of these numbers live in `src/data/shipping.js`, shared by the site, `/api/order` and the SEO build.
  - Env vars (Vercel → Settings → Environment Variables, and `.env.local`): `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `SHIPROCKET_EMAIL`, `SHIPROCKET_PASSWORD`, `SHIPROCKET_PICKUP_LOCATION`, `ADMIN_PASSWORD` (admin panel), `VERCEL_DEPLOY_HOOK_URL` (Vercel → Settings → Git → Deploy Hooks, branch `main`). Optional: `ADMIN_SESSION_SECRET` (else derived from the password; changing either logs everyone out), `RESEND_API_KEY` (server emails the artist), `MAIL_FROM` (verified-domain sender, which also emails customers), `ORDER_EMAIL_TO`. Without Resend, the browser sends the artist alert via Web3Forms.
  - Parcel size per painting: "Shipping box" in the admin panel.
