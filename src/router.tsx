import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home/Home'
import NotFound from './pages/NotFound/NotFound'
import Tracking from './pages/Tracking/Tracking'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'tracking', element: <Tracking /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default router
