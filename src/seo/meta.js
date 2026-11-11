/* KALA SEO — one source for every page's title, description, social card, robots and structured data.
   Shared by the browser (src/seo/useSeo.js, keeps <head> right on client navigation) and the build
   (scripts/seo/build.mjs, writes a pre-rendered HTML file per route + sitemap + llms.txt).
   Keep it plain JS: no Vite-only imports, no JSX, no DOM.

   Copy lives in src/seo/copy.json. A painting without an entry there still gets a sensible
   title/description generated from works.json, so new works added in the editor are covered. */

const STATUS = ['available', 'inquiry', 'sold', 'archived'];
export const normalizeStatus = (s) => {
  const key = String(s ?? '').trim().toLowerCase().replace(/\s*only$/, '');
  return STATUS.includes(key) ? key : 'inquiry';
};
export const priceValue = (w) => Number(String(w?.price ?? '').replace(/[^\d.]/g, '')) || 0;
export const isBuyable = (w) => w.status === 'available' && priceValue(w) >= 1;
const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

/* ISO paper sizes in cm (short side, long side) — orientation comes from the photo */
const PAPER = { A3: [29.7, 42], A4: [21, 29.7], A5: [14.8, 21] };

const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const isPlaceholder = (s) => !s || /^\[.*\]$/.test(clean(s));

export function createSeo({ data, copy, imageUrl = () => null, ogImage = (key) => `/og/${key}.jpg` }) {
  const S = copy.site;
  const BASE = S.url.replace(/\/$/, '');
  const abs = (p) => (!p ? null : /^https?:/.test(p) ? p : BASE + (p.startsWith('/') ? p : `/${p}`));
  /* Google shows ~60 characters: the full brand when it fits, else just KALA */
  const withBrand = (t) => (`${t} | ${S.brand}`.length <= 62 ? `${t} | ${S.brand}` : `${t} | ${S.name}`);

  const works = data.works.map((w) => ({ ...w, status: normalizeStatus(w.status) }));
  const collections = data.collections;
  const workById = new Map(works.map((w) => [w.id, w]));
  const collById = new Map(collections.map((c) => [c.id, c]));
  const worksIn = (id) => works.filter((w) => w.collection === id);

  const ID = { org: `${BASE}/#organization`, artist: `${BASE}/artist#anushka-kishor`, site: `${BASE}/#website` };

  /* ------------------------------------------------------------- per-painting copy */
  function workCopy(w) {
    const c = copy.works?.[w.id] ?? {};
    const coll = collById.get(w.collection);
    const kind = /watercolour/i.test(w.medium) ? 'Watercolour Painting' : w.collection === 'murals' ? 'Wall Mural' : 'Original Painting';
    const title = c.title || `${w.title}, ${kind}`;
    const facts = [w.medium, isPlaceholder(w.size) ? null : w.size, w.year].filter(Boolean).join(', ');
    const lead = c.lead || `${w.title} by ${S.artist}${facts ? `: ${facts}` : ''}${coll ? `, from the ${coll.title} chapter` : ''}.`;
    let tail;
    if (isBuyable(w)) tail = `${inr(priceValue(w))}, free shipping in India.`;
    else if (w.status === 'available') tail = 'Original, available: enquire for the price.';
    else if (w.status === 'sold') tail = 'Sold. Commission something similar.';
    else if (w.status === 'inquiry') tail = 'One of a kind: enquire about this original.';
    else tail = w.collection === 'murals' ? 'Commission a wall mural like it.' : 'In the archive. Commission something similar.';
    return { title, description: `${lead} ${tail}` };
  }

  function statusLine(w) {
    if (isBuyable(w)) return `Available · ${inr(priceValue(w))}`;
    return { available: 'Available · enquire for price', inquiry: 'Enquire about this work', sold: 'Sold', archived: 'Archive' }[w.status];
  }

  /* ------------------------------------------------------------- structured data */
  const ORG = {
    '@type': ['Organization', 'OnlineStore'],
    '@id': ID.org,
    name: S.name,
    alternateName: S.brand,
    url: `${BASE}/`,
    logo: { '@type': 'ImageObject', url: abs('/icon-512.png'), width: 512, height: 512 },
    image: abs(ogImage('default')),
    description: S.summary,
    email: S.email,
    founder: { '@id': ID.artist },
    sameAs: S.sameAs,
    areaServed: { '@type': 'Country', name: 'India' },
    contactPoint: { '@type': 'ContactPoint', contactType: 'customer support', email: S.email, availableLanguage: ['English', 'Hindi'] },
  };
  const PERSON = {
    '@type': 'Person',
    '@id': ID.artist,
    name: S.artist,
    url: abs('/artist'),
    image: abs(ogImage('artist')),
    jobTitle: 'Artist',
    description: `${S.artist} is an India-based painter and mural artist, the artist behind KALA.`,
    knowsAbout: S.knowsAbout,
    worksFor: { '@id': ID.org },
    sameAs: S.sameAs,
  };
  const WEBSITE = {
    '@type': 'WebSite',
    '@id': ID.site,
    url: `${BASE}/`,
    name: S.brand,
    alternateName: S.name,
    description: S.summary,
    inLanguage: 'en-IN',
    publisher: { '@id': ID.org },
  };

  const crumbs = (list) => ({
    '@type': 'BreadcrumbList',
    itemListElement: list.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(path) })),
  });
  const itemList = (items) => ({
    '@type': 'ItemList',
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(it.path), name: it.name })),
  });

  function artworkNode(w, meta) {
    const url = abs(`/artwork/${w.id}`);
    const images = [imageUrl(w.image), w.room?.image ? imageUrl(w.room.image) : null, ogImage(w.id)].filter(Boolean).map(abs);
    const node = {
      '@type': isBuyable(w) ? ['Product', 'VisualArtwork'] : 'VisualArtwork',
      '@id': `${url}#artwork`,
      name: w.title,
      description: meta.description,
      url,
      image: images,
      creator: { '@id': ID.artist },
      artform: w.collection === 'murals' ? 'Mural' : 'Painting',
      artMedium: w.medium,
      genre: collById.get(w.collection)?.title,
      inLanguage: 'en',
    };
    if (w.alt) node.abstract = w.alt;
    if (w.year) node.dateCreated = String(w.year);
    if (/canvas/i.test(w.medium) || /canvas/i.test(w.framing)) node.artworkSurface = 'Canvas';
    else if (/wood/i.test(w.medium)) node.artworkSurface = 'Wood';
    else if (/paper|sketchbook/i.test(w.medium)) node.artworkSurface = 'Paper';
    else if (w.collection === 'murals') node.artworkSurface = 'Wall';
    const paper = PAPER[String(w.size).trim().toUpperCase()];
    if (paper) {
      const [a, b] = w.w > w.h ? [paper[1], paper[0]] : paper;
      node.width = { '@type': 'QuantitativeValue', value: a, unitCode: 'CMT' };
      node.height = { '@type': 'QuantitativeValue', value: b, unitCode: 'CMT' };
    }
    if (isBuyable(w)) {
      Object.assign(node, {
        sku: `KALA-${w.plate || w.id}`,
        brand: { '@type': 'Brand', name: S.name },
        category: 'Arts & Entertainment > Hobbies & Creative Arts > Artwork > Paintings',
        itemCondition: 'https://schema.org/NewCondition',
        offers: {
          '@type': 'Offer',
          url,
          price: priceValue(w),
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: { '@id': ID.org },
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingRate: { '@type': 'MonetaryAmount', value: 0, currency: 'INR' },
            shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'IN' },
          },
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: 'IN',
            returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
            merchantReturnLink: abs('/returns'),
          },
        },
      });
    }
    return node;
  }

  function webPage(m, type = 'WebPage', extra = {}) {
    return {
      '@type': type,
      '@id': `${m.canonical}#webpage`,
      url: m.canonical,
      name: m.title,
      description: m.description,
      isPartOf: { '@id': ID.site },
      inLanguage: 'en-IN',
      primaryImageOfPage: m.image ? { '@type': 'ImageObject', url: m.image } : undefined,
      ...extra,
    };
  }

  /* ------------------------------------------------------------- page builders */
  function base({ path, title, description, og, imageAlt, noindex, ogType = 'website', h1, intro = [], links = [] }) {
    const image = abs(ogImage(og) || ogImage('default'));
    return {
      path,
      canonical: path === '/' ? `${BASE}/` : BASE + path,
      title: path === '/' ? `${S.brand} · ${title}` : withBrand(title),
      shortTitle: title,
      description,
      robots: noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large',
      noindex: Boolean(noindex),
      image,
      imageAlt: imageAlt || `${S.brand}: ${title}`,
      ogType,
      h1: h1 || title,
      intro,
      links,
      graph: [],
    };
  }

  const workLink = (w) => ({ href: `/artwork/${w.id}`, text: w.title, note: `${[w.medium, isPlaceholder(w.size) ? '' : w.size, w.year].filter(Boolean).join(' · ')} — ${statusLine(w)}` });
  const collLink = (c) => ({ href: `/collections/${c.id}`, text: `${c.num}. ${c.title}`, note: copy.collections?.[c.id]?.description || '' });

  function staticPage(path) {
    const p = copy.pages[path];
    const m = base({ path, ...p, og: p.og });
    const graph = [];
    const page = (type, extra) => graph.push(webPage(m, type, extra));
    if (path === '/') {
      m.intro = [S.summary, 'Take a painting home, have one made for you, or bring colour to a whole wall.'];
      m.links = [
        { href: '/shop', text: 'Shop original paintings' },
        { href: '/collections', text: 'Browse the collections' },
        { href: '/commission', text: 'Commission a painting or portrait' },
        { href: '/walls', text: 'Hand-painted wall murals' },
        { href: '/artist', text: 'About the artist' },
        ...works.filter(isBuyable).map(workLink),
      ];
      page('WebPage', { about: { '@id': ID.org } });
    } else if (path === '/shop') {
      m.intro = ['Every painting here is an original, so there is only ever one. Shipping is free within India; pay with UPI, card or netbanking.'];
      m.links = [...works].sort((a, b) => STATUS.indexOf(a.status) - STATUS.indexOf(b.status)).map(workLink);
      page('CollectionPage', { mainEntity: itemList(m.links.map((l) => ({ path: l.href, name: l.text }))) });
      graph.push(crumbs([['Home', '/'], ['Shop', '/shop']]));
    } else if (path === '/collections') {
      m.intro = ['Devotional figures, mandalas, portraits, walls and small joyful pieces. Open a chapter to see every work in it, available or not.'];
      m.links = collections.map(collLink);
      page('CollectionPage', { mainEntity: itemList(collections.map((c) => ({ path: `/collections/${c.id}`, name: c.title }))) });
      graph.push(crumbs([['Home', '/'], ['Collections', '/collections']]));
    } else if (path === '/archive') {
      const items = works.filter((w) => w.status !== 'available');
      m.intro = ['Some works have already found their walls, and murals stay where they were painted. They live here as part of the story.'];
      m.links = items.map(workLink);
      page('CollectionPage', { mainEntity: itemList(items.map((w) => ({ path: `/artwork/${w.id}`, name: w.title }))) });
      graph.push(crumbs([['Home', '/'], ['Archive', '/archive']]));
    } else if (path === '/walls') {
      m.intro = ['Hire Anushka Kishor to paint a mural for your home, office, café, school or studio. Tell her about the space and send a photo to start.'];
      m.links = [...worksIn('murals').map(workLink), { href: '/commission', text: 'Start a wall enquiry' }];
      page('WebPage');
      graph.push({
        '@type': 'Service',
        '@id': `${m.canonical}#service`,
        name: 'Hand-painted wall murals',
        serviceType: 'Wall mural painting',
        description: m.description,
        provider: { '@id': ID.org },
        areaServed: { '@type': 'Country', name: 'India' },
        url: m.canonical,
      });
      graph.push(crumbs([['Home', '/'], ['Wall murals', '/walls']]));
    } else if (path === '/artist') {
      m.ogType = 'profile';
      m.intro = [`${S.artist} paints devotional figures, dot-work mandalas, portraits, small joyful canvases, wall murals and wearable art.`];
      m.links = [{ href: S.sameAs[0], text: 'Instagram' }, { href: S.sameAs[1], text: 'YouTube' }, { href: '/shop', text: 'Shop her paintings' }];
      page('ProfilePage', { mainEntity: { '@id': ID.artist } });
      graph.push(crumbs([['Home', '/'], ['The Artist', '/artist']]));
    } else if (path === '/commission') {
      m.intro = ['A painting for a room, a portrait of someone you love, a wall waiting for a story, or a question about a work in the shop.'];
      m.links = [{ href: '/walls', text: 'Wall murals' }, { href: '/collections/portraits', text: 'Portraits' }, { href: '/shop', text: 'The shop' }];
      page('WebPage');
      graph.push({
        '@type': 'Service',
        '@id': `${m.canonical}#service`,
        name: 'Custom painting commissions',
        serviceType: 'Commissioned artwork',
        description: m.description,
        provider: { '@id': ID.org },
        areaServed: { '@type': 'Country', name: 'India' },
        url: m.canonical,
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Commissions',
          itemListElement: ['Custom painting', 'Portrait painting', 'Wall mural', 'Hand-painted wearable'].map((n) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: n } })),
        },
      });
      graph.push(crumbs([['Home', '/'], ['Commission', '/commission']]));
    } else if (path === '/contact') {
      m.intro = ['A question about a painting, shipping, a collaboration, or simply a hello.'];
      m.links = [{ href: `mailto:${S.email}`, text: S.email }, ...S.sameAs.map((u) => ({ href: u, text: u.replace(/^https:\/\/(www\.)?/, '') }))];
      page('ContactPage', { mainEntity: { '@id': ID.org } });
      graph.push(crumbs([['Home', '/'], ['Contact', '/contact']]));
    } else {
      page('WebPage');
    }
    m.graph = graph;
    return m;
  }

  function collectionPage(c) {
    const cc = copy.collections?.[c.id] ?? {};
    const lead = workById.get(c.lead);
    const items = worksIn(c.id);
    const path = `/collections/${c.id}`;
    const m = base({
      path,
      title: cc.title || `${c.title}: Original Paintings`,
      description: cc.description || `The ${c.title} chapter of KALA: ${items.length} original works by ${S.artist}.`,
      og: `collection-${c.id}`,
      imageAlt: lead?.alt,
      h1: c.title,
      intro: [isPlaceholder(c.intro) ? cc.description || '' : c.intro].filter(Boolean),
      links: items.map(workLink),
    });
    m.graph = [
      webPage(m, 'CollectionPage', { mainEntity: itemList(items.map((w) => ({ path: `/artwork/${w.id}`, name: w.title }))) }),
      crumbs([['Home', '/'], ['Collections', '/collections'], [c.title, path]]),
    ];
    return m;
  }

  function artworkPage(w) {
    const c = collById.get(w.collection);
    const wc = workCopy(w);
    const path = `/artwork/${w.id}`;
    const m = base({ path, title: wc.title, description: wc.description, og: w.id, imageAlt: w.alt, ogType: isBuyable(w) ? 'product' : 'article', h1: w.title });
    m.intro = [w.alt, isPlaceholder(w.note) ? '' : w.note].filter(Boolean);
    m.facts = [
      ['Collection', c ? `${c.num}. ${c.title}` : ''],
      ['Medium', w.medium],
      ['Size', isPlaceholder(w.size) ? '' : w.size],
      ['Year', w.year],
      [w.status === 'archived' ? 'Site' : 'Framing', w.framing],
      ['Status', statusLine(w)],
    ].filter(([, v]) => v);
    m.links = [
      isBuyable(w) ? { href: '/order', text: `Buy ${w.title}` } : { href: '/commission', text: w.status === 'inquiry' ? 'Enquire about this work' : 'Commission something similar' },
      ...(c ? [{ href: `/collections/${c.id}`, text: `More from ${c.title}` }] : []),
    ];
    if (isBuyable(w)) m.product = { price: priceValue(w), currency: 'INR', availability: 'instock' };
    const node = artworkNode(w, m);
    m.graph = [
      webPage(m, isBuyable(w) ? 'ItemPage' : 'WebPage', { mainEntity: { '@id': node['@id'] } }),
      node,
      crumbs([['Home', '/'], ['Collections', '/collections'], ...(c ? [[c.title, `/collections/${c.id}`]] : []), [w.title, path]]),
    ];
    return m;
  }

  /* ------------------------------------------------------------- public API */
  const STATIC_PATHS = Object.keys(copy.pages);

  function meta(pathname = '/') {
    const path = `/${String(pathname).split(/[?#]/)[0].replace(/^\/+|\/+$/g, '')}`;
    let m;
    const art = path.match(/^\/artwork\/([^/]+)$/);
    const col = path.match(/^\/collections\/([^/]+)$/);
    if (art && workById.has(art[1])) m = artworkPage(workById.get(art[1]));
    else if (col && collById.has(col[1])) m = collectionPage(collById.get(col[1]));
    else if (copy.pages[path]) m = staticPage(path);
    else m = staticPage('/');
    m.jsonLd = { '@context': 'https://schema.org', '@graph': [ORG, PERSON, WEBSITE, ...m.graph] };
    return m;
  }

  const paths = () => [...STATIC_PATHS, ...collections.map((c) => `/collections/${c.id}`), ...works.map((w) => `/artwork/${w.id}`)];

  return { meta, paths, works, collections, workCopy, statusLine, isBuyable, priceValue, inr, abs, site: S, isPlaceholder };
}
