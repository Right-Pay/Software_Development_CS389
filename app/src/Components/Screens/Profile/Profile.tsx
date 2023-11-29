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
  const {userProfile, signOut} = React.useContext(
    authContext,
  ) as AuthContextType;

  const cardCount = userProfile.cards.length;
  const rewardCount =
    userProfile.cards
      .map(card => card.rewards?.length)
      .reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 0;

  return (
    <WrapperView>
      <Title className="top-10 mb-10">Profile</Title>
      <ProfileView className="justify-start">
        <ProfileSubtitle numberOfLines={1}>
          Username: {userProfile.username}
        </ProfileSubtitle>
        <ProfileSubtitle numberOfLines={1}>
          Email: {userProfile.email}
        </ProfileSubtitle>
        {userProfile.phone && userProfile.phone.length > 0 ? (
          <ProfileSubtitle>{`Phone: ${userProfile.phone}`}</ProfileSubtitle>
        ) : null}
        <ProfileSubtitle className="mt-20">
          You have {cardCount} card
          {cardCount > 1 ? 's' : ''}
        </ProfileSubtitle>
        <ProfileSubtitle>
          {`You have ${rewardCount} reward${rewardCount !== 1 ? 's' : ''}`}
        </ProfileSubtitle>
      </ProfileView>
      <MainButton
        onPress={() => navigation.navigate('SettingsScreen')}
        className="absolute top-0 right-0">
        <MainButtonText>Settings</MainButtonText>
      </MainButton>
      <MainButton className="absolute top-0 left-0" onPress={() => signOut()}>
        <MainButtonText>Logout</MainButtonText>
      </MainButton>
    </WrapperView>
  );
};

export default ProfileScreen;
