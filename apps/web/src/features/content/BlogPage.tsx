interface Post {
  title: string;
  excerpt: string;
  tag: string;
}

const POSTS: Post[] = [
  { tag: 'Къмпинг', title: 'Как да изберем палатка за лятото', excerpt: 'Съвети за избор на палатка според броя места, сезона и теглото.' },
  { tag: 'Бягане', title: '5 съвета за начинаещи бегачи', excerpt: 'От подходящите обувки до плана за тренировки през първия месец.' },
  { tag: 'Колоездене', title: 'Поддръжка на велосипеда у дома', excerpt: 'Основни стъпки за смазване на веригата и проверка на спирачките.' },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold">DECATHLON Блог</h1>
      <div className="grid gap-6 sm:grid-cols-3">
        {POSTS.map((p) => (
          <article key={p.title} className="rounded-lg border border-gray-200 p-4">
            <span className="text-xs font-semibold uppercase text-brand">{p.tag}</span>
            <h2 className="mb-1 mt-1 font-semibold">{p.title}</h2>
            <p className="text-sm text-gray-600">{p.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
