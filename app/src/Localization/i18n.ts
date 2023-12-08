import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en/common.json';
import es from './es/common.json';

const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
};

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  compatibilityJSON: 'v3',
  resources,
});

export default i18n;
