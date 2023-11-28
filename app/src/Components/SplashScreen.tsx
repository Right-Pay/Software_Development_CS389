import React from 'react';
import type { PropsWithChildren } from 'react';
import { Title, WrapperView } from '../Helpers/StylizedComponents';

const SplashScreen: React.FC<PropsWithChildren> = () => {
  return (
    <WrapperView>
      <Title className="mt-20">Welcome to RightPay</Title>
      <Title className="mt-20">Loading...</Title>
    </WrapperView>
  );
};

export default SplashScreen;
