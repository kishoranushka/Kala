# KALA

Original paintings, mandalas, wall murals and painted wearables by Anushka Kishor.

The KALA website, built with React, Tailwind CSS v4 and GSAP from the KALA Website design canvas (the beige "Homepage 2" design). It has eleven pages and the canvas's motion system: a gentle opening on the home page, the curtain between pages, scroll reveals, turning mandalas, the gallery cursor, magnetic controls and the circular menu.

## Scripts

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
```

Add `?still` to any URL to see the page in its final, motionless state (handy for screenshots).

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
    works.json             the paintings + collections  ← edit with the painting editor (npm run admin)
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
- **Content** comes from `data/works.json`, `data/works.js` and `data/site.js`. Bracketed text such as `[Medium]` or `[Location]` is a placeholder for the artist to replace.
- **Painting editor** (local only): `npm run admin` opens http://localhost:5173/__admin. Add paintings, upload photos (auto-converted to WebP), set the tag (Available / Inquiry only / Sold / Archived), price and details, and pick close-up points. It writes `src/data/works.json` and `src/assets/images/`; commit and push to publish. It's a dev-server plugin (`scripts/admin/`), so it never ships with `vite build`. Paintings the site shows by ID (home hero, shop strip…) can't be deleted; mark them Sold or Archived instead.
- **Forms** (commission, contact, order) are emailed to the artist via Web3Forms; the access key is `FORM_ACCESS_KEY` in `data/site.js`.
- **Shiprocket:** orders to be shipped also go to `api/order.js` (a Vercel function), which creates the order in Shiprocket under the "Kala" channel. Set `SHIPROCKET_EMAIL`, `SHIPROCKET_PASSWORD` (a Shiprocket API user) and `SHIPROCKET_PICKUP_LOCATION` in Vercel → Settings → Environment Variables, and in `.env.local` for local testing (`npm run dev` runs `/api` too). Parcel size per painting: "Shipping box" in the painting editor.
