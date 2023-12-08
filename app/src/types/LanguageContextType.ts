export interface LanguageContextType {
  lang: string;
  changeLanguage: (_lang: string) => void;
  translate: (_section: string, _key: string) => string;
  retrieveLang: () => Promise<void>;
}

export const supportedLanguages = ['en', 'es'];

export enum supportedLanguagesEnum {
  english = 'en',
  spanish = 'es',
}
