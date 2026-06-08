import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './features/catalog/HomePage';
import CategoryPage from './features/catalog/CategoryPage';
import ProductDetailPage from './features/catalog/ProductDetailPage';
import SearchPage from './features/catalog/SearchPage';
import CartPage from './features/cart/CartPage';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import AccountPage from './features/auth/AccountPage';
import RequireAuth from './features/auth/RequireAuth';
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
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        path: 'account',
        element: (
          <RequireAuth>
            <AccountPage />
          </RequireAuth>
        ),
      },
      { path: 'health', element: <HealthPage /> },
    ],
  },
]);
