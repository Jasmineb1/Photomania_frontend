import './index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import { LoginContextProvider } from './context/LoginContext.tsx';
import { ModalContextProvider } from './context/ModalContext.tsx';
import { NavContextProvider } from './context/NavContext.tsx';

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LoginContextProvider>
      <ModalContextProvider>
        <NavContextProvider>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </NavContextProvider>
      </ModalContextProvider>
    </LoginContextProvider>
  </React.StrictMode>
);
