import React from 'react';
import Context from '../../../Context/context';
import type {AppContext} from '../../../types/AppContextType';
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
  Subtitle,
  Title,
  WrapperView,
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
      <Title className="absolute inset-x-0 top-0">Profile Screen</Title>
      <Subtitle>Username: {userProfile.username}</Subtitle>
      <Subtitle>Email: {userProfile.email}</Subtitle>
      <Subtitle>Phone: {userProfile.phone}</Subtitle>
      <Subtitle>Address: {userProfile.address}</Subtitle>
      <Subtitle>City: {userProfile.city}</Subtitle>
      <Subtitle>State: {userProfile.state}</Subtitle>
      <Subtitle>Zip: {userProfile.zip}</Subtitle>
      <MainButton
        onPress={() =>
          navigation.navigate('HomeStack', {screen: 'HomeScreen'})
        }>
        <MainButtonText>Go Home</MainButtonText>
      </MainButton>
      <MainButton onPress={() => navigation.navigate('SettingsScreen')}>
        <MainButtonText>Settings</MainButtonText>
      </MainButton>
    </WrapperView>
  );
};

export default ProfileScreen;
