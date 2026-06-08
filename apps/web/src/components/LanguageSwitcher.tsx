import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  return (
    <div className="ml-auto flex gap-2" aria-label="language switcher">
      {(['bg', 'en'] as const).map((lng) => (
        <button
          key={lng}
          type="button"
          onClick={() => void i18n.changeLanguage(lng)}
          className={`uppercase text-sm ${i18n.resolvedLanguage === lng ? 'font-bold underline' : ''}`}
        >
          {lng}
        </button>
      ))}
    </div>
  );
}
