import type { PropsWithChildren } from 'react';
import React from 'react';
import TitleText from './Common/TitleText';
import WrapperView from './Common/WrapperView';
import i18n from '../Localization/i18n';

const SplashScreen: React.FC<PropsWithChildren> = () => {
  return (
    <WrapperView>
      <TitleText className="mt-20">{i18n.t('Welcome.Welcome')}</TitleText>
      <TitleText className="mt-20">{i18n.t('Common.Loading')}...</TitleText>
    </WrapperView>
  );
};

export default SplashScreen;
