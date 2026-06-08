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
import CheckoutPage from './features/checkout/CheckoutPage';
import OrderConfirmationPage from './features/checkout/OrderConfirmationPage';
import OrdersPage from './features/checkout/OrdersPage';
import WishlistPage from './features/wishlist/WishlistPage';
import StoreLocatorPage from './features/content/StoreLocatorPage';
import BlogPage from './features/content/BlogPage';
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
      { path: 'wishlist', element: <WishlistPage /> },
      { path: 'stores', element: <StoreLocatorPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'orders/:id', element: <OrderConfirmationPage /> },
      {
        path: 'orders',
        element: (
          <RequireAuth>
            <OrdersPage />
          </RequireAuth>
        ),
      },
      { path: 'health', element: <HealthPage /> },
    ],
  },
]);
