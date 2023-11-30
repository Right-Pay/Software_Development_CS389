import type { PropsWithChildren } from 'react';
import React from 'react';
import TitleText from './Common/TitleText';
import WrapperView from './Common/WrapperView';

const SplashScreen: React.FC<PropsWithChildren> = () => {
  return (
    <WrapperView>
      <TitleText className="mt-20">Welcome to RightPay</TitleText>
      <TitleText className="mt-20">Loading...</TitleText>
    </WrapperView>
  );
};

export default SplashScreen;
