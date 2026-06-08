import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';
import { useAuth } from '../auth/AuthContext';
import { RatingStars } from '../../ui/RatingStars';
import { Button } from '../../ui/Button';

export default function ProductReviews({ slug }: { slug: string }) {
  const { status } = useAuth();
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ['reviews', slug],
    queryFn: () => apiClient.getReviews(slug),
  });

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const submit = useMutation({
    mutationFn: () => apiClient.createReview(slug, { rating, title, body }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['reviews', slug] });
      void qc.invalidateQueries({ queryKey: ['product', slug] });
      setTitle('');
      setBody('');
      setRating(5);
    },
  });

  const summary = data?.summary;
  const max = summary ? Math.max(1, ...Object.values(summary.breakdown)) : 1;

  return (
    <section className="mt-12 border-t border-gray-200 pt-8">
      <h2 className="mb-4 text-xl font-bold">Мнения на клиенти</h2>

      {summary && (
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="text-center">
            <div className="text-4xl font-bold">{summary.average.toFixed(1)}</div>
            <RatingStars value={summary.average} />
            <div className="text-sm text-gray-500">{summary.count} мнения</div>
          </div>
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-6 text-gray-500">{star}★</span>
                <div className="h-2 flex-1 overflow-hidden rounded bg-gray-100">
                  <div
                    className="h-full bg-amber-400"
                    style={{ width: `${((summary.breakdown[star] ?? 0) / max) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right text-gray-400">{summary.breakdown[star] ?? 0}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write a review */}
      {status === 'authenticated' ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit.mutate();
          }}
          className="mb-8 space-y-3 rounded-lg border border-gray-200 p-4"
        >
          <h3 className="font-semibold">Напиши мнение</h3>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl ${star <= rating ? 'text-amber-500' : 'text-gray-300'}`}
                aria-label={`${star} звезди`}
              >
                ★
              </button>
            ))}
          </div>
          <input
            required
            placeholder="Заглавие"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
          <textarea
            required
            placeholder="Вашето мнение"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
            rows={3}
          />
          {submit.isError && (
            <p className="text-sm text-red-600">
              {submit.error instanceof Error ? submit.error.message : 'Грешка'}
            </p>
          )}
          <Button type="submit" disabled={submit.isPending}>
            {submit.isPending ? 'Изпращане…' : 'Публикувай'}
          </Button>
        </form>
      ) : (
        <p className="mb-8 text-sm text-gray-600">
          <Link to="/login" className="text-brand underline">
            Влез
          </Link>{' '}
          в профила си, за да напишеш мнение.
        </p>
      )}

      {/* Reviews list */}
      {data && data.items.length > 0 ? (
        <ul className="space-y-4">
          {data.items.map((r) => (
            <li key={r.id} className="border-b border-gray-100 pb-4">
              <div className="flex items-center justify-between">
                <RatingStars value={r.rating} />
                <span className="text-xs text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString('bg-BG')}
                </span>
              </div>
              <div className="font-medium">{r.title}</div>
              <p className="text-sm text-gray-700">{r.body}</p>
              <div className="mt-1 text-xs text-gray-500">{r.authorName}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">Все още няма публикувани мнения.</p>
      )}
    </section>
  );
}
