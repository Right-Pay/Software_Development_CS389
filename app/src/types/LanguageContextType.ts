export interface LanguageContextType {
  lang: string;
  setLang: (_lang: string) => void;
  changeLanguage: (_lang: string) => void;
  translate: (_section: string, _key: string) => string;
}

export const supportedLanguages = ['en', 'es'];
