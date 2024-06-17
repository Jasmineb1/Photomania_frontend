import './index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.tsx';
import CreatePost from './components/CreatePost.tsx';
import Header from './components/Layout.tsx';
import SinglePost from './components/SinglePost.tsx';
import { LoginContextProvider } from './context/LoginContext.tsx';
import { ModalContextProvider } from './context/ModalContext.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Header />,
    children: [
      {
        path: '/',
        element: <App />
      },
      {
        path: '/post/create',
        element: <CreatePost />
      },
      {
        path: '/post/view/:postId',
        element: <SinglePost />
      }
    ]
  }
]);
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LoginContextProvider>
      <ModalContextProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router}></RouterProvider>
        </QueryClientProvider>
      </ModalContextProvider>
    </LoginContextProvider>
  </React.StrictMode>
);
