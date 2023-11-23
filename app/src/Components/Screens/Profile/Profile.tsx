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
  ProfileView,
  ProfileSubtitle,
} from '../../../Helpers/StylizedComponents';
import authContext from '../../../Context/authContext';
import {AuthContextType} from '../../../types/AuthContextType';

type ProfileScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileNavigationRoutesType, 'ProfileScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const ProfileScreen: React.FC<ProfileScreenProps> = ({navigation}) => {
  const {userProfile} = React.useContext(authContext) as AuthContextType;

  return (
    <WrapperView>
      <Title className="top-10 mb-10">Profile Screen</Title>
      <ProfileView className="justify-start">
        <ProfileSubtitle>Username: {userProfile.username}</ProfileSubtitle>
        <ProfileSubtitle>Email: {userProfile.email}</ProfileSubtitle>
        <ProfileSubtitle>Phone: {userProfile.phone}</ProfileSubtitle>
      </ProfileView>

      <MainButton onPress={() => navigation.navigate('SettingsScreen')}>
        <MainButtonText>Settings</MainButtonText>
      </MainButton>
    </WrapperView>
  );
};

export default ProfileScreen;
