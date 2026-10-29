# KALA

Original paintings, mandalas and commissions. *Art that lives beyond the canvas.*

The KALA website built with React, Tailwind CSS v4 and GSAP from the KALA Website design canvas. It has ten pages and the canvas's full motion system: the opening curtain, scroll reveals, turning mandalas, the gallery cursor, magnetic controls, the circular menu and page transitions behind the curtain.

## Scripts

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
```

## Pages

| Route | Page |
| --- | --- |
| `/` | Home: hero, art atlas, inside the pattern, the artist's hand, studio film, archive, commissions |
| `/shop` | All works, with collection, availability and sort filters |
| `/artwork/:id` | Viewing room: views and details, bag, full-screen viewer, story, film, related works |
| `/collections` | The Collector's Index and chapter bands |
| `/collections/:id` | One collection (chapter) with its works and neighbouring chapters |
| `/archive` | The uncollectable collection |
| `/artist` | The artist: studio landscape, method, films, two practices, milestones |
| `/commission` | Commission enquiry form |
| `/contact` | Contact form and FAQ |
| `/order` | Three-step order request (choose, then details, then review) |

## Structure

```
src/
  main.jsx                 app entry (router + bag provider)
  router.jsx               routes; each route's `handle` configures the page chrome
  styles/index.css         Tailwind import, KALA design tokens (@theme), base styles, type presets
  data/
    works.js               artworks, collections, films, studio photos + helpers  ← edit content here
    site.js                navigation, contact placeholders
  assets/images, films     artwork photographs and motion studies
  motion/
    createMotion.js        the shared GSAP choreography (data-attribute hooks)
    useSiteMotion.js       mounts it once per route, handles curtain travel between pages
    MotionContext.jsx      usePageMotion() for page-specific choreography
    gsap.js                gsap + ScrollTrigger setup, reduced-motion helpers
  context/BagContext.jsx   the bag (originals set aside), kept for the visit
  hooks/                   useFormFlow, useDialogKeys, useScrollLock
  components/
    layout/                SiteLayout, Header, Footer, MenuOverlay, Curtain, Cursor, ProgressMandala, Wordmark
    ui/                    Button, TextLink, Icon, StatusBadge, Breadcrumbs, Disclosure, Notice, Toast, Typography
    art/                   ArtLink, ArtworkCard, Film
    form/                  Fields (Input, Select, ChoiceCard, Checkbox…), FormSuccess
    mandala/               Petals, PageMandala, RingMandala
    sections/              PageIntro, InverseSection, CommissionBand
  pages/
    home/                  HomePage + sections/, home mandalas, home motion, home content
    artwork/               ArtworkPage, BagDrawer, FullscreenViewer
    order/                 OrderPage, steps, OrderSummary
    ShopPage, CollectionsPage, CollectionPage, ArchivePage, ArtistPage, CommissionPage, ContactPage
```

## How the pieces fit

- **Design tokens** live in `@theme` in `styles/index.css`. They cover colours, fonts, shadows, easings and the desktop-first breakpoints, which are used as `max-lg:`, `max-sm:` and so on. Named text sizes (`text-sm`) set only the size, and line height is inherited unless given (`text-sm/[22px]`), as in the original CSS.
- **Motion** is driven by data attributes in the markup: `data-reveal`, `data-words`, `data-cap`, `data-stagger`, `data-spin`, `data-cursor`, `data-magnetic` and others. Add one to an element and the shared choreography picks it up. A page with its own choreography registers it with `usePageMotion(fn)`; see `pages/home/homeMotion.js`. Visitors who prefer reduced motion get a quiet fade instead.
- **Content** comes from `data/works.js`. Bracketed text such as `[Artist name]` or `[Medium]` is a placeholder for the artist to replace.
- **Forms** (commission, contact, order) validate and confirm, but they aren't connected to a backend yet, and each says so on screen.
