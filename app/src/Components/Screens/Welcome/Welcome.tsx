import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PropsWithChildren } from 'react';
import React from 'react';
import {
  AuthButton,
  AuthButtonText,
  Logo,
  LogoContainer,
  Title,
} from '../../../Helpers/StylizedComponents';
import WrapperView from '../../../Helpers/WrapperView';
import type { WelcomeNavigationRoutesType } from '../../../types/NavigationRoutesType';

type WelcomeScreenProps = NativeStackScreenProps<
  WelcomeNavigationRoutesType,
  'Welcome'
> &
  PropsWithChildren;

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({navigation}) => {
  return (
    <WrapperView>
      <Title className="mt-20">Welcome to RightPay</Title>
      <LogoContainer>
        <Logo
          source={require('../../../Assets/RightPay-logo-light-transparent.png')}
        />
      </LogoContainer>
      <AuthButton onPress={() => navigation.navigate('Login')}>
        <AuthButtonText>Log In</AuthButtonText>
      </AuthButton>
      <AuthButton onPress={() => navigation.navigate('Register')}>
        <AuthButtonText>Sign Up</AuthButtonText>
      </AuthButton>
    </WrapperView>
  );
};

export default WelcomeScreen;
