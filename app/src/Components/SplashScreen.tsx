import React from 'react';
import type {PropsWithChildren} from 'react';
import {Title, WrapperView} from '../Helpers/StylizedComponents';

const SplashScreen: React.FC<PropsWithChildren> = () => {
  return (
    <WrapperView>
      <Title>Welcome to RightPay</Title>
      <Title>Loading...</Title>
    </WrapperView>
  );
};

export default SplashScreen;
