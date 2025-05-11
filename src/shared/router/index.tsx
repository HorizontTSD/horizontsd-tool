import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainPage } from '@/pages/main';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
