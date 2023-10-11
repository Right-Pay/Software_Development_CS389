import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {
  HomeNavigationRoutesType,
  NavigationRoutesType,
} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import AuthContext from '../../../Context/authContext';
import {AuthContextType} from '../../../types/AuthContextType';
import {styled} from 'nativewind';

type HomeScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeNavigationRoutesType, 'HomeScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const StyledText = styled(Text);
const StyledTouch = styled(TouchableOpacity);
const StylizedView = styled(View);

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const {signOut, userProfile} = React.useContext(
    AuthContext,
  ) as AuthContextType;

  return (
    <StylizedView className="flex items-center">
      <StyledText className="mt-8 text-3xl">Home Screen</StyledText>
      <StyledText className="py-8 text-xl">Hello {userProfile.name}</StyledText>
      <StyledTouch
        className="text-3xl p-2 border-2 border-gray-600 rounded-xl"
        onPress={() =>
          navigation.navigate('ProfileStack', {screen: 'ProfileScreen'})
        }>
        <StyledText className="font-medium text-gray-600">
          Go to Profile
        </StyledText>
      </StyledTouch>
      <StyledTouch
        className="mt-8 text-3xl p-2 border-2 border-gray-600 rounded-xl"
        onPress={() => signOut()}>
        <StyledText className="font-medium text-gray-600">Logout</StyledText>
      </StyledTouch>
    </StylizedView>
  );
};

export default HomeScreen;
