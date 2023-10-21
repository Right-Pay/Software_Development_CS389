import React from 'react';
import {View, Text, Pressable, Image, StyleSheet} from 'react-native';
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
const StylizedImage = styled(Image);


const WelcomeScreen: React.FC<WelcomeScreenProps> = ({navigation}) => {
  return (
    <StylizedView className="flex items-center bg-light-green dark:bg-dark-gray">
      <StylizedText className="mt-20 text-3xl font-bold text-dark-green dark:text-light-green">
        Welcome to RightPay
      </StylizedText>
      <StylizedView className="mt-20 items-center justify-center h-full w-full">
        <StylizedImage 
          style={{
            resizeMode: 'center',
            height: 200,
            width: 200,
          }}
          source={require('../../../Assets/RightPay-logo-light-transparent.png')} />
        <StylizedView className="pb-20 items-center justify-center h-full w-full">
          <StylizedPress
            onPress={() => navigation.navigate('Login')}
            className="flex color items-center justify-center m-2 text-xl text-black flex h-9 w-5/12 rounded-xl bg-dark-green shadow-sm transition-colors">
            <StylizedText className="text-xl text-white">Log In</StylizedText>
          </StylizedPress>
          <StylizedPress
            onPress={() => navigation.navigate('Register')}
            className="flex color items-center justify-center m-2 text-xl text-black flex h-9 w-5/12 rounded-xl bg-dark-green shadow-sm transition-colors">
            <StylizedText className="text-xl text-white">Sign Up</StylizedText>
          </StylizedPress>
        </StylizedView>
      </StylizedView>
    </StylizedView>
  );
};

export default WelcomeScreen;
