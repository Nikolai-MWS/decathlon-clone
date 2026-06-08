import { type AttributeSection, type ProductAttributeDto } from '@decathlon/shared';

const SECTION_TITLES: { key: AttributeSection; title: string }[] = [
  { key: 'advantages', title: 'Предимства' },
  { key: 'specs', title: 'Характеристики' },
  { key: 'care', title: 'Съвети за употреба и поддръжка' },
  { key: 'environment', title: 'Въздействие върху околната среда' },
];

export default function ProductInfoSections({
  attributes,
}: {
  attributes: ProductAttributeDto[];
}) {
  if (!attributes || attributes.length === 0) return null;

  return (
    <section className="mt-10 border-t border-gray-200 pt-6">
      {SECTION_TITLES.map(({ key, title }) => {
        const rows = attributes.filter((a) => a.section === key);
        if (rows.length === 0) return null;
        return (
          <details key={key} className="border-b border-gray-200 py-3">
            <summary className="cursor-pointer list-none font-medium [&::-webkit-details-marker]:hidden">
              {title}
            </summary>
            <div className="mt-3 text-sm text-gray-700">
              {key === 'specs' ? (
                <dl className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {rows.map((r, i) => (
                    <div key={i} className="contents">
                      <dt className="text-gray-500">{r.label}</dt>
                      <dd>{r.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <ul className="list-inside list-disc space-y-1">
                  {rows.map((r, i) => (
                    <li key={i}>{r.value}</li>
                  ))}
                </ul>
              )}
            </div>
          </details>
        );
      })}
    </section>
  );
}
