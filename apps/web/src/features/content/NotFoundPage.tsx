import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <h1 className="mb-2 text-4xl font-extrabold">404</h1>
      <p className="mb-6 text-gray-600">Страницата не е намерена.</p>
      <Link to="/" className="text-brand underline">
        Към началната страница
      </Link>
    </div>
  );
}
