import { createBrowserRouter, Navigate } from 'react-router-dom';
import SiteLayout from '@/components/layout/SiteLayout';
import { getCollection } from '@/data/works';

/* pages load on demand; the router waits for them before the curtain lifts */
const page = (load) => async () => ({ Component: (await load()).default });

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <SiteLayout />,
      children: [
        {
          index: true,
          lazy: page(() => import('@/pages/home/HomePage')),
          handle: { title: 'Home', curtain: 'Home', isHome: true, gentle: true },
        },
        {
          path: 'shop',
          lazy: page(() => import('@/pages/ShopPage')),
          handle: { title: 'Shop', curtain: 'The shop · All works', nav: 'shop' },
        },
        { path: 'artwork', element: <Navigate to="/artwork/krishna" replace /> },
        {
          path: 'artwork/:id',
          lazy: page(() => import('@/pages/artwork/ArtworkPage')),
          handle: { title: 'Artwork', curtain: 'The viewing room', raisedProgress: true },
        },
        {
          path: 'collections',
          lazy: page(() => import('@/pages/CollectionsPage')),
          handle: { title: 'Collections', curtain: 'The Collector’s Index', nav: 'collections' },
        },
        {
          path: 'collections/:id',
          lazy: page(() => import('@/pages/CollectionPage')),
          handle: {
            title: 'Collection',
            curtain: ({ id }) => {
              const c = getCollection(id);
              return c ? `Chapter ${c.num} · ${c.title}` : '';
            },
            nav: 'collections',
          },
        },
        {
          path: 'archive',
          lazy: page(() => import('@/pages/ArchivePage')),
          handle: { title: 'Archive', curtain: 'The uncollectable collection', nav: 'archive' },
        },
        {
          path: 'artist',
          lazy: page(() => import('@/pages/ArtistPage')),
          handle: { title: 'The Artist', curtain: 'The artist', nav: 'artist' },
        },
        {
          path: 'commission',
          lazy: page(() => import('@/pages/CommissionPage')),
          handle: { title: 'Commission', curtain: 'Begin with an idea', nav: 'commission' },
        },
        {
          path: 'contact',
          lazy: page(() => import('@/pages/ContactPage')),
          handle: { title: 'Contact', curtain: 'Say hello', nav: 'contact' },
        },
        {
          path: 'order',
          lazy: page(() => import('@/pages/order/OrderPage')),
          handle: { title: 'Order', curtain: 'Order an original' },
        },
        { path: '*', element: <Navigate to="/" replace /> },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);
