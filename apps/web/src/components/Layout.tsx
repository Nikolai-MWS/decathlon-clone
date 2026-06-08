import { Outlet, Link } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-brand text-white px-4 py-3 flex items-center gap-4">
        <Link to="/" className="text-xl font-bold tracking-wide">
          DECATHLON
        </Link>
        <LanguageSwitcher />
      </header>
      <main className="flex-1 px-4 py-6">
        <Outlet />
      </main>
      <footer className="bg-gray-100 px-4 py-6 text-sm text-gray-600">
        Decathlon Clone — portfolio project
      </footer>
    </div>
  );
}
