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
import i18n from '../../../Localization/i18n';

type HomeScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeNavigationRoutesType, 'HomeScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const { userProfile } = React.useContext(AuthContext) as AuthContextType;
  const { address } = React.useContext(locationContext) as LocationContext;

  const renderReward = (item: Reward) => {
    return (
      <View className="flex-1 flex-col mb-2 mt-10 w-full">
        <PrimaryText className="text-left">
          {`${i18n.t('Wallet.Category')}: ${item.category?.category_name}`}
        </PrimaryText>
        {item.category?.specific_places && (
          <PrimaryText className="text-left">
            {`${i18n.t(
              'Wallet.Specific',
            )}: ${item.category?.specific_places.join(', ')}`}
          </PrimaryText>
        )}
        <PrimaryText className="text-left">
          {`${i18n.t('Wallet.Initial')} ${i18n.t('Wallet.Percentage')}: 
          ${item.initial_percentage}`}
        </PrimaryText>
        <PrimaryText>{`${i18n.t('Wallet.Initial')} ${i18n.t('Wallet.Limit')}: 
          ${item.initial_limit}`}</PrimaryText>
        <PrimaryText>
          {`${i18n.t('Wallet.Term')}: ${item.term_length_months} ${
            item.term_length_months > 0 ? i18n.t('Wallet.Month') : ''
          }${item.term_length_months > 1 ? i18n.t('Wallet.S') : ''}`}
        </PrimaryText>
        <PrimaryText>
          {`${i18n.t('Wallet.Fallback')}:${item.fallback_percentage}`}
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
        {i18n.t('Common.Hello', { username: userProfile.username })}
      </TitleText>
      {topCard ? (
        <>
          <View className="w-full justify-center items-center h-1/3">
            <PrimaryText className="text-center text-xl mt-10">{`${i18n.t(
              'Home.At',
              { address: address?.displayName.text },
            )}\n ${i18n.t('Home.Suggest')}`}</PrimaryText>
            <CardComponent card={topCard} classNameProp="w-auto h-auto mt-5" />
          </View>
          <View className="w-full justify-center mt-20 items-center">
            <FlatList
              className="w-full text-center w-3/4 p-2"
              data={topCard.rewards} //This will need to be done
              ListHeaderComponent={
                <TitleText>{i18n.t('Wallet.Rewards')}</TitleText>
              }
              showsVerticalScrollIndicator={true}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => renderReward(item)}
              ItemSeparatorComponent={itemSeparatorComponent}
            />
          </View>
        </>
      ) : (
        <PrimaryText className="text-center text-xl mt-10">
          {i18n.t('Home.Nocards')}
        </PrimaryText>
      )}
    </WrapperView>
  );
};

export default HomeScreen;
