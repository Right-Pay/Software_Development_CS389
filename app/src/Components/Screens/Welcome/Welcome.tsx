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
        <AuthButton
          onPress={() => navigation.navigate('Login')}
          className="flex color items-center justify-center m-2 text-xl text-black flex h-9 w-5/12 rounded-xl bg-green-500 shadow-sm transition-colors">
          <ButtonText className="text-xl">Log In</ButtonText>
        </AuthButton>
        <AuthButton
          onPress={() => navigation.navigate('Register')}
          className="flex color items-center justify-center m-2 text-xl text-black flex h-9 w-5/12 rounded-xl bg-green-500 shadow-sm transition-colors">
          <ButtonText className="text-xl">Sign Up</ButtonText>
        </AuthButton>
      </WrapperView>
    </WrapperView>
  );
};

export default WelcomeScreen;
