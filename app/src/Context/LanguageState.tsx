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
import { NativeModules, Platform } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';

const LanguageState: React.FC<PropsWithChildren> = ({ children }) => {
  const [lang, setLang] = useState('en');

  const storeLang = useCallback(async (language: string) => {
    try {
      await EncryptedStorage.setItem('rp_lang', language);
    } catch (error) {
      return false;
    }
  }, []);

  const deviceLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale
      : NativeModules.I18nManager.localeIdentifier;

  const retrieveLang = useCallback(async () => {
    try {
      const value = await EncryptedStorage.getItem('rp_lang');
      if (value !== null) {
        setLang(value);
      } else {
        setLang(deviceLanguage.split('_')[0]);
      }
    } catch (error) {
      setLang(deviceLanguage.split('_')[0]);
      return;
    }
  }, [deviceLanguage]);

  const checkLanguage = (language: string) => {
    if (supportedLanguages.includes(language)) {
      return true;
    } else {
      return false;
    }
  };

  const changeLanguage = useCallback(
    (language: string) => {
      if (checkLanguage(language)) {
        storeLang(language);
        setLang(language);
        i18n.changeLanguage(language);
        i18n.reloadResources();
      } else i18n.changeLanguage('en');
    },
    [storeLang],
  );

  const setLanguage = useCallback(async () => {
    try {
      const value = await EncryptedStorage.getItem('rp_lang');
      if (value !== null) {
        changeLanguage(value);
      } else {
        changeLanguage(deviceLanguage.split('_')[0]);
      }
    } catch (error) {
      changeLanguage(deviceLanguage.split('_')[0]);
      return;
    }
  }, [changeLanguage, deviceLanguage]);

  const translate = (section: string, key: string) => {
    return i18n.t(`${section}.${key}`);
  };

  useEffect(() => {
    setLanguage();
  }, [setLanguage]);

  return (
    <LanguageContext.Provider
      value={{ lang, changeLanguage, translate, retrieveLang }}>
      <AuthState>{children}</AuthState>
    </LanguageContext.Provider>
  );
};

export default LanguageState;
