import React from 'react';
import type {PropsWithChildren} from 'react';
import type {WelcomeNavigationRoutesType} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  AuthButton,
  MainButtonText,
  Title,
  WrapperView,
  Logo,
  LogoContainer,
} from '../../../Helpers/StylizedComponents';

type WelcomeScreenProps = NativeStackScreenProps<
  WelcomeNavigationRoutesType,
  'Welcome'
> &
  PropsWithChildren;

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({navigation}) => {
  return (
    <WrapperView>
      <Title>Welcome to RightPay</Title>
      <LogoContainer>
        <Logo
          source={require('../../../Assets/RightPay-logo-light-transparent.png')}
        />
      </LogoContainer>
      <AuthButton onPress={() => navigation.navigate('Login')}>
        <MainButtonText>Log In</MainButtonText>
      </AuthButton>
      <AuthButton onPress={() => navigation.navigate('Register')}>
        <MainButtonText>Sign Up</MainButtonText>
      </AuthButton>
    </WrapperView>
  );
};

export default WelcomeScreen;
