import i18next from 'i18next';
import fsBackend from 'i18next-fs-backend';

i18next
  .use(fsBackend)
  .init({
    backend: {
      loadPath: './src/locales/{{lng}}/{{ns}}.json',
    },
    lng: 'en',
    fallbackLng: 'en',
    debug: false,
    ns: ['userLocales'],
    defaultNS: 'userLocales',
  });


export default i18next;
