import type { PropsWithChildren } from 'react';
import React from 'react';
import TitleText from './Common/TitleText';
import WrapperView from './Common/WrapperView';
import { LanguageContextType } from '../types/LanguageContextType';
import languageContext from '../Context/languageContext';

const SplashScreen: React.FC<PropsWithChildren> = () => {
  const { translate } = React.useContext(
    languageContext,
  ) as LanguageContextType;

  return (
    <WrapperView>
      <TitleText className="mt-20">{translate('Welcome', 'Welcome')}</TitleText>
      <TitleText className="mt-20">
        {translate('Common', 'Loading')}...
      </TitleText>
    </WrapperView>
  );
};

export default SplashScreen;
