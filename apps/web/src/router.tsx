import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import HealthPage from './features/health/HealthPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <div>Home</div> },
      { path: 'health', element: <HealthPage /> },
    ],
  },
]);
