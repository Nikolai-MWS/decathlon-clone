import { Suspense } from 'react';
import { Outlet, Link } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import SearchBar from './SearchBar';
import CartIndicator from './CartIndicator';
import WishlistIndicator from './WishlistIndicator';
import AccountLink from './AccountLink';
import NewsletterForm from './NewsletterForm';
import { useCategories } from '../features/catalog/queries';

export default function Layout() {
  const { data: categories } = useCategories();
  const topNav = (categories ?? []).slice(0, 8);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-brand"
      >
        Към съдържанието
      </a>
      <header className="bg-brand text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <Link to="/" className="text-xl font-extrabold tracking-wide">
            DECATHLON
          </Link>
          <SearchBar />
          <AccountLink />
          <WishlistIndicator />
          <CartIndicator />
          <LanguageSwitcher />
        </div>
        <nav className="border-t border-white/20 bg-brand-dark">
          <ul className="mx-auto flex max-w-7xl flex-wrap gap-x-5 gap-y-1 px-4 py-2 text-sm">
            {topNav.map((c) => (
              <li key={c.id}>
                <Link to={`/c/${c.slug}`} className="hover:underline">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/blog" className="hover:underline">
                Блог
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main id="main" className="flex-1 px-4 py-6">
        <Suspense fallback={<p className="text-center text-gray-500">Зареждане…</p>}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="mt-10 bg-gray-100 px-4 py-8 text-sm text-gray-600">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-3">
          <div>
            <h3 className="mb-2 font-semibold text-gray-800">DECATHLON</h3>
            <ul className="space-y-1">
              <li>
                <Link to="/stores" className="hover:underline">
                  Спортни магазини
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:underline">
                  Блог
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:underline">
                  Любими
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-gray-800">Доставка и плащане</h3>
            <p>Speedy · Econt · Sameday · BoxNow</p>
            <p>VISA · MasterCard · Apple Pay · PayPal</p>
          </div>
          <NewsletterForm />
        </div>
        <div className="mx-auto mt-6 max-w-7xl border-t border-gray-200 pt-4 text-xs text-gray-400">
          Decathlon Clone — portfolio project
        </div>
      </footer>
    </div>
  );
}
