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
  RewardsView,
} from '../../../Helpers/StylizedComponents';
import { AppContext } from '../../../types/AppContextType';
import { AuthContextType } from '../../../types/AuthContextType';
import { Card, Reward } from '../../../types/CardType';
import type {
  NavigationRoutesType,
  WalletNavigationRoutesType,
} from '../../../types/NavigationRoutesType';
import PrimaryText from '../../Common/PrimaryText';
import TitleText from '../../Common/TitleText';
import WrapperView from '../../Common/WrapperView';
import AddCardFullForm from './AddCardFullForm';
import CardComponent from '../../Card';

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
  const [deleteCard, setDeleteCard] = React.useState<boolean>(false);

  //helpers
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getCardRewards = (CardId: number) => [];

  //components
  const addNewCardComponent = () => (
    <CardView>
      <StyledView className="flex-1 flex-col w-11/12 h-full items-center justify-center bg-dark-green rounded-xl">
        <Text className="text-3xl text-white text-center font-bold pb-8">
          Add New Card
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
        card_name={item.card_name as string}
        card_bin={item.card_bin ?? ''}
        exp_date={item.exp_date as string}
        card_brand_name={item.card_brand_name as string}
        card_type={item.card_type as string}
        handleCardPress={handleCardPress}
        deleteCard={deleteCard}
        setDeleteCard={setDeleteCard}
        handleDelete={handleDelete}
      />
    );
  };

  const renderReward = (item: Reward) => {
    return (
      <RewardsView>
        <PrimaryText className="text-left">{item.reward_name}</PrimaryText>
        <PrimaryText>{item.reward_description}</PrimaryText>
      </RewardsView>
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
    setDeleteCard(false);
  }, [currentViewedCard]);

  return (
    <WrapperView>
      {AddCardFullForm()}
      <TitleText className="mt-10">Wallet</TitleText>
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
        />
      </View>
      <View className="aspect-video mt-10 w-full justify-center items-center">
        <FlatList
          className="w-full text-center w-3/4 p-2"
          data={[]} //This will need to be done
          ListHeaderComponent={
            currentViewedCard.filter(i => i.id === -1).length === 0 ? (
              <TitleText>Rewards</TitleText>
            ) : null
          }
          showsVerticalScrollIndicator={true}
          keyExtractor={item => (item as Reward).reward_name.toString()}
          renderItem={({ item }) => renderReward(item as Reward)}
          ItemSeparatorComponent={itemSeparatorComponent}
        />
      </View>
    </WrapperView>
  );
};

export default WalletScreen;
