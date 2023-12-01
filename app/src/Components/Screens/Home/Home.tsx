import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PropsWithChildren } from 'react';
import React from 'react';
import AuthContext from '../../../Context/authContext';
import { AuthContextType } from '../../../types/AuthContextType';
import type {
  HomeNavigationRoutesType,
  NavigationRoutesType,
} from '../../../types/NavigationRoutesType';
import TitleText from '../../Common/TitleText';
import WrapperView from '../../Common/WrapperView';
import CardComponent from '../../Card';
import { View } from 'react-native';
import PrimaryText from '../../Common/PrimaryText';
import { LocationContext } from '../../../types/LocationContextType';
import locationContext from '../../../Context/locationContext';

type HomeScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeNavigationRoutesType, 'HomeScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const { userProfile } = React.useContext(AuthContext) as AuthContextType;
  const { address } = React.useContext(locationContext) as LocationContext;

  /*
   * This will eventually done in the card context we just don't have any rewards yet
   * What should happen is we get the top card to use and display it
   * For now we will just display the first card in the list
   * const cardIndexToUse = getTopCard(userProfile.cards);
   */
  const topCard =
    userProfile.cards && userProfile.cards.length > 0
      ? userProfile.cards[0]
      : undefined;

  return (
    <WrapperView className="justify-start">
      <TitleText className="mt-10 mb-10">
        Hello {userProfile.username}
      </TitleText>
      {topCard ? (
        <View className="w-full justify-center items-center h-1/3 mt-10">
          <PrimaryText className="text-center text-xl mt-10">{`You're at ${address?.displayName.text}. We suggest you use the following card.`}</PrimaryText>
          <CardComponent
            card_name={topCard?.card_name as string}
            card_bin={topCard?.card_bin as number}
            exp_date={topCard?.exp_date as string}
            card_brand_name={topCard?.card_brand_name as string}
            card_type={topCard?.card_type as string}
            classNameProp="w-auto h-auto mt-5"
          />
          <PrimaryText className="text-center text-xl mt-4">Reason</PrimaryText>
          <PrimaryText className="text-center text-xl mt-4">
            Rewards here
          </PrimaryText>
        </View>
      ) : (
        <PrimaryText className="text-center text-xl mt-10">
          You don't have any cards yet. Please add a card to get started.
        </PrimaryText>
      )}
    </WrapperView>
  );
};

export default HomeScreen;
