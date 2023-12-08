import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PropsWithChildren } from 'react';
import React from 'react';
import { FlatList, View } from 'react-native';
import AuthContext from '../../../Context/authContext';
import locationContext from '../../../Context/locationContext';
import { CardItemSeperator } from '../../../Helpers/StylizedComponents';
import { AuthContextType } from '../../../types/AuthContextType';
import { LocationContext } from '../../../types/LocationContextType';
import type {
  HomeNavigationRoutesType,
  NavigationRoutesType,
} from '../../../types/NavigationRoutesType';
import CardComponent from '../../Card';
import PrimaryText from '../../Common/PrimaryText';
import TitleText from '../../Common/TitleText';
import WrapperView from '../../Common/WrapperView';
import { Reward } from '../../../types/CardType';
import { LanguageContextType } from '../../../types/LanguageContextType';
import languageContext from '../../../Context/languageContext';

type HomeScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeNavigationRoutesType, 'HomeScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const { userProfile } = React.useContext(AuthContext) as AuthContextType;
  const { address } = React.useContext(locationContext) as LocationContext;
  const { translate } = React.useContext(
    languageContext,
  ) as LanguageContextType;

  const renderReward = (item: Reward) => {
    return (
      <View className="flex-1 flex-col mb-2 mt-10 w-full">
        <PrimaryText className="text-left">
          {`${translate('Wallet', 'Category')}: ${
            item.category?.category_name
          }`}
        </PrimaryText>
        {item.category?.specific_places && (
          <PrimaryText className="text-left">
            {`${translate(
              'Wallet',
              'Specific',
            )}: ${item.category?.specific_places.join(', ')}`}
          </PrimaryText>
        )}
        <PrimaryText className="text-left">
          {`${translate('Wallet', 'Initial')} ${translate(
            'Wallet',
            'Percentage',
          )}: 
          ${item.initial_percentage}`}
        </PrimaryText>
        <PrimaryText>{`${translate('Wallet', 'Initial')} ${translate(
          'Wallet',
          'Limit',
        )}: 
          ${item.initial_limit}`}</PrimaryText>
        <PrimaryText>
          {`${translate('Wallet', 'Term')}: ${item.term_length_months} ${
            item.term_length_months > 0 ? translate('Wallet', 'Month') : ''
          }${item.term_length_months > 1 ? translate('Wallet', 'S') : ''}`}
        </PrimaryText>
        <PrimaryText>
          {`${translate('Wallet', 'Fallback')}:${item.fallback_percentage}`}
        </PrimaryText>
      </View>
    );
  };

  const itemSeparatorComponent = () => <CardItemSeperator />;

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
        {`${translate('Common', 'Hello')} ${userProfile.username}`}
      </TitleText>
      {topCard ? (
        <>
          <View className="w-full justify-center items-center h-1/3">
            <PrimaryText className="text-center text-xl mt-10">{`${translate(
              'Home',
              'At',
            )} ${address?.displayName.text}\n ${translate(
              'Home',
              'Suggest',
            )}`}</PrimaryText>
            <CardComponent card={topCard} classNameProp="w-auto h-auto mt-5" />
          </View>
          <View className="w-full justify-center mt-20 items-center">
            <FlatList
              className="w-full text-center w-3/4 p-2"
              data={topCard.rewards} //This will need to be done
              ListHeaderComponent={<TitleText>Rewards</TitleText>}
              showsVerticalScrollIndicator={true}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => renderReward(item)}
              ItemSeparatorComponent={itemSeparatorComponent}
            />
          </View>
        </>
      ) : (
        <PrimaryText className="text-center text-xl mt-10">
          {translate('Home', 'Nocards')}
        </PrimaryText>
      )}
    </WrapperView>
  );
};

export default HomeScreen;
