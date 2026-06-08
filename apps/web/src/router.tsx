import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import RequireAuth from './features/auth/RequireAuth';

// Route-level code splitting: each page is its own lazily-loaded chunk.
const HomePage = lazy(() => import('./features/catalog/HomePage'));
const CategoryPage = lazy(() => import('./features/catalog/CategoryPage'));
const ProductDetailPage = lazy(() => import('./features/catalog/ProductDetailPage'));
const SearchPage = lazy(() => import('./features/catalog/SearchPage'));
const CartPage = lazy(() => import('./features/cart/CartPage'));
const LoginPage = lazy(() => import('./features/auth/LoginPage'));
const RegisterPage = lazy(() => import('./features/auth/RegisterPage'));
const AccountPage = lazy(() => import('./features/auth/AccountPage'));
const CheckoutPage = lazy(() => import('./features/checkout/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('./features/checkout/OrderConfirmationPage'));
const OrdersPage = lazy(() => import('./features/checkout/OrdersPage'));
const WishlistPage = lazy(() => import('./features/wishlist/WishlistPage'));
const StoreLocatorPage = lazy(() => import('./features/content/StoreLocatorPage'));
const BlogPage = lazy(() => import('./features/content/BlogPage'));
const NotFoundPage = lazy(() => import('./features/content/NotFoundPage'));
const HealthPage = lazy(() => import('./features/health/HealthPage'));

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
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
