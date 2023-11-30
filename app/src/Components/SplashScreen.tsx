import type { PropsWithChildren } from 'react';
import React from 'react';
import { Title } from '../Helpers/StylizedComponents';
import WrapperView from './Common/WrapperView';

const SplashScreen: React.FC<PropsWithChildren> = () => {
  return (
    <WrapperView>
      <Title className="mt-20">Welcome to RightPay</Title>
      <Title className="mt-20">Loading...</Title>
    </WrapperView>
  );
};

export default SplashScreen;
