import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { BagProvider } from '@/context/BagContext';
import { applyLiveStatus } from '@/data/liveStatus';
import { createRouter } from './router';
import { reloadOnceForUpdate } from '@/components/layout/RouteError';
import './styles/index.css';

/* a page file from an older deploy is gone (tab left open across a deploy): reload into the new build */
window.addEventListener('vite:preloadError', (e) => {
  if (reloadOnceForUpdate()) e.preventDefault();
});

/* load the live catalogue (prices, new paintings, sold ones) before the router starts loading any page
   (gives up after 1.5 s and keeps the build's copy) */
applyLiveStatus().finally(() => {
  const router = createRouter();
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BagProvider>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
      </BagProvider>
    </StrictMode>
  );
});
