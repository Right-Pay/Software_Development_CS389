export interface LanguageContextType {
  lang: string;
  changeLanguage: (_lang: string) => void;
  retrieveLang: () => Promise<void>;
}

export const supportedLanguages = ['en', 'es', 'fr'];

export enum supportedLanguagesEnum {
  english = 'en',
  spanish = 'es',
  french = 'fr',
}
