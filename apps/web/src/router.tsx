import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './features/catalog/HomePage';
import CategoryPage from './features/catalog/CategoryPage';
import ProductDetailPage from './features/catalog/ProductDetailPage';
import SearchPage from './features/catalog/SearchPage';
import CartPage from './features/cart/CartPage';
import HealthPage from './features/health/HealthPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'c/:slug', element: <CategoryPage /> },
      { path: 'p/:slug', element: <ProductDetailPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'health', element: <HealthPage /> },
    ],
  },
]);
