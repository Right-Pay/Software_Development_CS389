import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PropsWithChildren } from 'react';
import React from 'react';
import {
  Logo,
  LogoContainer
} from '../../../Helpers/StylizedComponents';
import type { WelcomeNavigationRoutesType } from '../../../types/NavigationRoutesType';
import PrimaryButton from '../../Common/PrimaryButton';
import PrimaryText from '../../Common/PrimaryText';
import TitleText from '../../Common/TitleText';
import WrapperView from '../../Common/WrapperView';

type WelcomeScreenProps = NativeStackScreenProps<
  WelcomeNavigationRoutesType,
  'Welcome'
> &
  PropsWithChildren;

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <WrapperView>
      <TitleText className="mt-20">Welcome to RightPay</TitleText>
      <LogoContainer>
        <Logo
          source={require('../../../Assets/RightPay-logo-light-transparent.png')}
        />
      </LogoContainer>
      <PrimaryButton onPress={() => navigation.navigate('Login')}>
        <PrimaryText type="secondary" className="text-xl">
          Log In
        </PrimaryText>
      </PrimaryButton>
      <PrimaryButton onPress={() => navigation.navigate('Register')}>
        <PrimaryText type="secondary" className="text-xl">
          Sign Up
        </PrimaryText>
      </PrimaryButton>
    </WrapperView>
  );
};

export default WelcomeScreen;
