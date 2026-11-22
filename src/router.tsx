import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home/Home'
import NotFound from './pages/NotFound/NotFound'

export const router = createBrowserRouter([
  {
    // Layout renders the header and footer once; pages render inside <Outlet />.
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      {
        // Loaded on demand, so Home does not download the tracker code (axios,
        // the form, the result card) until someone opens this page.
        path: 'tracking',
        lazy: async () => {
          const { default: Tracking } = await import('./pages/Tracking/Tracking')
          return { Component: Tracking }
        },
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])