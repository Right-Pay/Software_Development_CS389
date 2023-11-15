import React from 'react';
import type {PropsWithChildren} from 'react';
import type {
  ProfileNavigationRoutesType,
  NavigationRoutesType,
} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import {
  MainButtonText,
  MainButton,
  Title,
  WrapperView,
} from '../../../Helpers/StylizedComponents';

type ProfileScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileNavigationRoutesType, 'ProfileScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const ProfileScreen: React.FC<ProfileScreenProps> = ({navigation}) => {
  return (
    <WrapperView>
      <Title className="mt-20">Profile Screen</Title>
      <MainButton
        onPress={() =>
          navigation.navigate('HomeStack', {screen: 'HomeScreen'})
        }>
        <MainButtonText>Go Home</MainButtonText>
      </MainButton>
      <MainButton onPress={() => navigation.navigate('ProfileSettings')}>
        <MainButtonText>Settings</MainButtonText>
      </MainButton>
    </WrapperView>
  );
};

export default ProfileScreen;
