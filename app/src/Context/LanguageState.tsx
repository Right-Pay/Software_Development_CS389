import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import AuthState from './AuthState';
import i18n from '../Localization/i18n';
import { supportedLanguages } from '../types/LanguageContextType';
import LanguageContext from './languageContext';

const LanguageState: React.FC<PropsWithChildren> = ({ children }) => {
  const [lang, setLang] = useState('en');

  const checkLanguage = (language: string) => {
    if (supportedLanguages.includes(language)) {
      return true;
    } else {
      return false;
    }
  };

  const changeLanguage = useCallback((language: string) => {
    if (checkLanguage(language)) i18n.changeLanguage(language);
    else i18n.changeLanguage('en');
  }, []);

  const translate = (section: string, key: string) => {
    return i18n.t(`${section}.${key}`);
  };

  useEffect(() => {
    changeLanguage(lang);
  }, [lang, changeLanguage]);

  return (
    <LanguageContext.Provider
      value={{ lang, setLang, changeLanguage, translate }}>
      <AuthState>{children}</AuthState>
    </LanguageContext.Provider>
  );
};

export default LanguageState;
