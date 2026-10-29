import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { BagProvider } from '@/context/BagContext';
import { router } from './router';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BagProvider>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </BagProvider>
  </StrictMode>
);
