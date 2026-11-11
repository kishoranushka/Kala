import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { BagProvider } from '@/context/BagContext';
import { applyLiveStatus } from '@/data/liveStatus';
import { router } from './router';
import './styles/index.css';

/* mark paintings sold online before the first render (gives up after 1.5 s) */
applyLiveStatus().finally(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BagProvider>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
      </BagProvider>
    </StrictMode>
  );
});
