import './index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.tsx';
import CreatePost from './components/CreatePost.tsx';
import { LoginContextProvider } from './context/LoginContext.tsx';
import { ModalContextProvider } from './context/ModalContext.tsx';
import { NavContextProvider } from './context/NavContext.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
    // errorElement: <NotFound />
  },
  {
    path: '/post/create',
    element: <CreatePost />
    // errorElement: <NotFound />
  }
]);
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LoginContextProvider>
      <ModalContextProvider>
        <NavContextProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}></RouterProvider>
          </QueryClientProvider>
        </NavContextProvider>
      </ModalContextProvider>
    </LoginContextProvider>
  </React.StrictMode>
);
