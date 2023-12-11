import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { styled } from 'nativewind';
import type { PropsWithChildren } from 'react';
import React, { useEffect, useRef } from 'react';
import { Dimensions, FlatList, Text, View, ViewToken } from 'react-native';
import authContext from '../../../Context/authContext';
import Context from '../../../Context/context';
import Consts from '../../../Helpers/Consts';
import {
  AddCardButton,
  AddCardIcon,
  CardItemSeperator,
  CardView,
} from '../../../Helpers/StylizedComponents';
import { AppContext } from '../../../types/AppContextType';
import { AuthContextType } from '../../../types/AuthContextType';
import { Card, Reward } from '../../../types/CardType';
import type {
  NavigationRoutesType,
  WalletNavigationRoutesType,
} from '../../../types/NavigationRoutesType';
import CardComponent from '../../Card';
import PrimaryText from '../../Common/PrimaryText';
import TitleText from '../../Common/TitleText';
import WrapperView from '../../Common/WrapperView';
import AddCardFullForm from './AddCardFullForm';
import AddRewardForm from './AddRewardForm';
import i18n from '../../../Localization/i18n';

type WalletScreenProps = CompositeScreenProps<
  NativeStackScreenProps<WalletNavigationRoutesType, 'WalletScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const StyledView = styled(View);
const StyledList = styled(FlatList);

const WalletScreen: React.FC<WalletScreenProps> = () => {
  const { unlinkCard, setCardForms, CardForms } = React.useContext(
    Context,
  ) as AppContext;

  const { userProfile } = React.useContext(authContext) as AuthContextType;

  const [currentViewedCard, setCurrentViewedCard] = React.useState<Card[]>(
    userProfile.cards && userProfile.cards.length > 0
      ? [userProfile.cards[0]]
      : [Consts.addCard],
  );
  const [currentRewards, setCurrentRewards] = React.useState<Reward[]>([]);

  const [showRewardHeader, setShowRewardHeader] =
    React.useState<boolean>(false);

  const [deleteCard, setDeleteCard] = React.useState<boolean>(false);

  //helpers
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getCardRewards = (CardId: number) => [];

  //components
  const addNewCardComponent = () => (
    <CardView>
      <StyledView className="flex-1 flex-col w-11/12 h-full items-center justify-center bg-dark-green rounded-xl">
        <Text className="text-3xl text-white text-center font-bold pb-8">
          {i18n.t('Wallet.Add')}
        </Text>
        <StyledView>
          <AddCardButton onPress={handleAddPress}>
            <AddCardIcon source={require('../../../Assets/AddSign.png')} />
          </AddCardButton>
        </StyledView>
      </StyledView>
    </CardView>
  );

  const renderCard = (item: Card) => {
    if (item.card_name === 'Add') {
      return addNewCardComponent();
    }

    return (
      <CardComponent
        card={item}
        handleCardPress={handleCardPress}
        deleteCard={deleteCard}
        setDeleteCard={setDeleteCard}
        handleDelete={handleDelete}
      />
    );
  };

  const renderReward = (item: Reward) => {
    return (
      <View className="flex-1 flex-col mb-2 mt-5 w-full">
        <PrimaryText className="text-left">
          {`${i18n.t('Wallet.Category')}: ${item.category?.category_name}`}
        </PrimaryText>
        {item.category?.specific_places && (
          <PrimaryText className="text-left">
            {`${i18n.t(
              'Wallet',
              'Specific Places',
            )}: ${item.category?.specific_places.join(', ')}`}
          </PrimaryText>
        )}
        <PrimaryText className="text-left">
          {`${i18n.t('Wallet.Initial')} ${i18n.t('Wallet.Percentage')}: ${
            item.initial_percentage
          }`}
        </PrimaryText>
        <PrimaryText>{`${i18n.t('Wallet.Initial')} ${i18n.t(
          'Wallet',
          'Limit',
        )}: ${item.initial_limit}`}</PrimaryText>
        <PrimaryText>
          {`${i18n.t('Wallet.Term')}: ${item.term_length_months} ${
            item.term_length_months > 0 ? i18n.t('Wallet.Month') : ''
          }${item.term_length_months > 1 ? i18n.t('Wallet.S') : ''}`}
        </PrimaryText>
        <PrimaryText>
          {`${i18n.t('Wallet.Fallback')} ${item.fallback_percentage}`}
        </PrimaryText>
      </View>
    );
  };

  const itemSeparatorComponent = () => <CardItemSeperator />;

  //handlers
  const handleCardPress = () => {
    setDeleteCard(!deleteCard);
  };

  const handleDelete = () => {
    setDeleteCard(false);
    unlinkCard(currentViewedCard[0]);
  };

  const handleAddPress = () => {
    setCardForms({ ...CardForms, Full: true });
  };

  type Info = {
    viewableItems: ViewToken[];
    changed: ViewToken[];
  };

  const onViewRef = useRef((info: Info) => {
    const check: Card[] = info.viewableItems.map(item => item.item as Card);
    setCurrentViewedCard(check);
  });

  useEffect(() => {
    if (currentViewedCard.length === 1 && currentViewedCard[0].id !== -1) {
      setShowRewardHeader(true);
      setCurrentRewards(currentViewedCard[0].rewards || []);
    }
  }, [currentViewedCard]);

  return (
    <WrapperView>
      <AddCardFullForm />
      <AddRewardForm />
      <TitleText className="mt-10">{i18n.t('Wallet.Wallet')}</TitleText>
      <View className="aspect-video mt-10 w-full">
        <StyledList
          className="w-full"
          data={
            userProfile.cards
              ? [...userProfile.cards, Consts.addCard]
              : [Consts.addCard]
          }
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => (item as Card).id?.toString() || '0'}
          renderItem={({ item }) => renderCard(item as Card)}
          horizontal={true}
          ItemSeparatorComponent={itemSeparatorComponent}
          onViewableItemsChanged={onViewRef.current} // To get the current viewed card. Can't add method here. Throws error.
          snapToInterval={
            Dimensions.get('window').width + Consts.cardItemSeparatorWidth
          } //Change 48 based on width of CardItemSeperator width
          onScrollBeginDrag={() => {
            setDeleteCard(false);
            setCurrentRewards([]);
            setShowRewardHeader(false);
          }}
          onScrollEndDrag={() => {
            if (
              currentViewedCard.length === 1 &&
              currentViewedCard[0].id !== -1
            ) {
              setShowRewardHeader(true);
              setCurrentRewards(currentViewedCard[0].rewards || []);
            }
          }}
        />
      </View>
      <View className="aspect-video mt-10 w-full justify-center items-center">
        <FlatList
          className="w-full text-center w-3/4 p-2"
          data={currentRewards} //This will need to be done
          ListHeaderComponent={
            showRewardHeader ? (
              <TitleText>{i18n.t('Wallet.Rewards')}</TitleText>
            ) : null
          }
          showsVerticalScrollIndicator={true}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => renderReward(item)}
          showsHorizontalScrollIndicator={true}
          ItemSeparatorComponent={itemSeparatorComponent}
          refreshing={!showRewardHeader && currentViewedCard[0].id !== -1}
          onRefresh={() => {
            console.log('refreshing');
          }}
        />
      </View>
    </WrapperView>
  );
};

export default WalletScreen;
