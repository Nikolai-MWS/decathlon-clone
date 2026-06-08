import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Button } from '../../ui/Button';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await register(form);
      navigate('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Грешка при регистрация');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-2xl font-bold">Регистрация</h1>
      <form onSubmit={submit} className="space-y-4">
        <div className="flex gap-2">
          <input
            required
            placeholder="Име"
            value={form.firstName}
            onChange={set('firstName')}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
          <input
            required
            placeholder="Фамилия"
            value={form.lastName}
            onChange={set('lastName')}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <input
          type="email"
          required
          placeholder="Имейл"
          value={form.email}
          onChange={set('email')}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
        <input
          type="password"
          required
          minLength={8}
          placeholder="Парола (мин. 8 символа)"
          value={form.password}
          onChange={set('password')}
          className="w-full rounded border border-gray-300 px-3 py-2"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? 'Създаване…' : 'Създай профил'}
        </Button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Вече имаш профил?{' '}
        <Link to="/login" className="text-brand underline">
          Вход
        </Link>
      </p>
    </div>
  );
}
