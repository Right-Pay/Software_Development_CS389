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
import Consts from '../../../Helpers/Consts';

type ProfileScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileNavigationRoutesType, 'ProfileScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const ProfileScreen: React.FC<ProfileScreenProps> = ({navigation}) => {
  const {userProfile, signOut} = React.useContext(
    authContext,
  ) as AuthContextType;

  const text = Consts.settingsText;

  const cardCount = userProfile.cards.length;
  const rewardCount =
    userProfile.cards
      .map(card => card.rewards?.length)
      .reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 0;

  return (
    <WrapperView>
      <Title className="top-10 mb-10">Profile</Title>
      <ProfileView className="justify-start">
        <ProfileSubtitle>
          {text.username}: {userProfile.username}
        </ProfileSubtitle>
        <ProfileSubtitle>
          {text.email}: {userProfile.email}
        </ProfileSubtitle>
        <ProfileSubtitle>
          {text.phone}: {userProfile.phone ?? '(###)###-####'}
        </ProfileSubtitle>
        <ProfileSubtitle className="mt-20">
          {text.youHave} {cardCount} card
          {cardCount > 1 ? text.s : ''}
        </ProfileSubtitle>
        <ProfileSubtitle>
          {`${text.youHave} ${rewardCount} reward${
            rewardCount !== 1 ? text.s : ''
          }`}
        </ProfileSubtitle>
      </ProfileView>
      <MainButton
        onPress={() => navigation.navigate('SettingsScreen')}
        className="absolute top-0 right-0">
        <MainButtonText>{text.settingsTitle}</MainButtonText>
      </MainButton>
      <MainButton className="absolute top-0 left-0" onPress={() => signOut()}>
        <MainButtonText>{text.logout}</MainButtonText>
      </MainButton>
    </WrapperView>
  );
};

export default ProfileScreen;
