import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuggestions } from '../features/catalog/queries';

export default function SearchBar() {
  const [term, setTerm] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { data: suggestions } = useSuggestions(term);

  function go(q: string) {
    setOpen(false);
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <div className="relative flex-1 max-w-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go(term);
        }}
      >
        <input
          type="search"
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Търси продукти…"
          aria-label="Търсене"
          className="w-full rounded-full px-4 py-2 text-sm text-gray-900"
        />
      </form>
      {open && suggestions && suggestions.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg bg-white text-gray-900 shadow-lg">
          {suggestions.map((s) => (
            <li key={s.slug}>
              <button
                type="button"
                onMouseDown={() => navigate(`/p/${s.slug}`)}
                className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-gray-100"
              >
                {s.image && (
                  <img src={s.image} alt="" className="h-8 w-8 rounded object-contain" />
                )}
                <span className="line-clamp-1">{s.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
