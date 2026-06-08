import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const subscribe = useMutation({ mutationFn: () => apiClient.subscribeNewsletter(email) });

  return (
    <div>
      <h3 className="mb-2 font-semibold text-gray-800">Бюлетин</h3>
      {subscribe.isSuccess ? (
        <p className="text-sm text-green-700">Благодарим за абонамента! ✓</p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email) subscribe.mutate();
          }}
          className="flex gap-2"
        >
          <input
            type="email"
            required
            placeholder="Твоят имейл"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={subscribe.isPending}
            className="rounded bg-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Абонирай се
          </button>
        </form>
      )}
    </div>
  );
}
