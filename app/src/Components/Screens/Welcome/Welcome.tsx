import React from 'react';
import type {PropsWithChildren} from 'react';
import type {WelcomeNavigationRoutesType} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  AuthButton,
  ButtonText,
  Title,
  WrapperView,
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
      <WrapperView className="justify-center h-full w-full">
        <AuthButton onPress={() => navigation.navigate('Login')}>
          <ButtonText>Log In</ButtonText>
        </AuthButton>
        <AuthButton onPress={() => navigation.navigate('Register')}>
          <ButtonText>Sign Up</ButtonText>
        </AuthButton>
      </WrapperView>
    </WrapperView>
  );
};

export default WelcomeScreen;
