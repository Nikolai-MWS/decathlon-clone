import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import bg from './locales/bg.json';

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    bg: { translation: bg },
  },
  lng: 'bg',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
