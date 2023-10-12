import React from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {WelcomeNavigationRoutesType} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {styled} from 'nativewind';

type WelcomeScreenProps = NativeStackScreenProps<
  WelcomeNavigationRoutesType,
  'Welcome'
> &
  PropsWithChildren;

const StylizedText = styled(Text);
const StylizedPress = styled(Pressable);
const StylizedView = styled(View);

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({navigation}) => {
  return (
    <StylizedView className="flex items-center">
      <StylizedText className="mt-20 text-3xl">
        Welcome to RightPay
      </StylizedText>
      <StylizedPress
        onPress={() => navigation.navigate('Login')}
        className="flex color items-center justify-center m-2 text-xl text-black flex h-9 w-5/12 rounded-xl border-2 bg-green-500 shadow-sm transition-colors">
        <StylizedText className="text-xl">Log In</StylizedText>
      </StylizedPress>
      <StylizedPress
        onPress={() => navigation.navigate('Register')}
        className="flex color items-center justify-center m-2 text-xl text-black flex h-9 w-5/12 rounded-xl border-2 bg-green-500 shadow-sm transition-colors">
        <StylizedText className="text-xl">Sign Up</StylizedText>
      </StylizedPress>
    </StylizedView>
  );
};

export default WelcomeScreen;
