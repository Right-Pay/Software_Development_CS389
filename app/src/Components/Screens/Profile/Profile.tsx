import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PropsWithChildren } from 'react';
import React from 'react';
// import {
//   Title,
//   ProfileView,
//   ProfileSubtitle,
// } from '../../../Helpers/StylizedComponents';
import authContext from '../../../Context/authContext';
import { ProfileView } from '../../../Helpers/StylizedComponents';
import { AuthContextType } from '../../../types/AuthContextType';
import type {
  NavigationRoutesType,
  ProfileNavigationRoutesType,
} from '../../../types/NavigationRoutesType';
import PrimaryText from '../../Common/PrimaryText';
import TitleText from '../../Common/TitleText';
import WrapperView from '../../Common/WrapperView';

type ProfileScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileNavigationRoutesType, 'ProfileScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const { userProfile } = React.useContext(authContext) as AuthContextType;

  const cardCount = userProfile.cards.length;
  const rewardCount =
    userProfile.cards
      .map(card => card.rewards?.length)
      .reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 0;

  return (
    <WrapperView>
      <TitleText className="top-10 mb-10">Profile</TitleText>
      <ProfileView className="justify-start">
        <PrimaryText
          className="text-2xl font-bold mb-2 mt-10"
          numberOfLines={1}>
          Username: {userProfile.username}
        </PrimaryText>
        <PrimaryText className="text-2xl font-bold mb-2" numberOfLines={1}>
          Email: {userProfile.email}
        </PrimaryText>
        {userProfile.phone && userProfile.phone.length > 0 ? (
          <PrimaryText className="text-2xl font-bold mb-2">{`Phone: ${userProfile.phone}`}</PrimaryText>
        ) : null}
        <PrimaryText className="text-2xl font-bold mt-20">
          You have {cardCount} card
          {cardCount > 1 ? 's' : ''}
        </PrimaryText>
        <PrimaryText className="text-2xl font-bold">
          {`You have ${rewardCount} reward${rewardCount !== 1 ? 's' : ''}`}
        </PrimaryText>
      </ProfileView>
    </WrapperView>
  );
};

export default ProfileScreen;
