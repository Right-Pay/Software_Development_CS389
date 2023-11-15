import React, {useEffect, useRef} from 'react';
import type {PropsWithChildren} from 'react';
import type {
  WalletNavigationRoutesType,
  NavigationRoutesType,
} from '../../../types/NavigationRoutesType';
import {View, Text, FlatList} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import {
  AddCardButton,
  AddCardIcon,
  AddCardView,
  CardButton,
  CardItemSeperator,
  CardText,
  CardView,
  DeleteCardButton,
  RewardsView,
  SecondaryAddCardView,
  Subtitle,
  Title,
  WrapperView,
} from '../../../Helpers/StylizedComponents';
import {AppContext} from '../../../types/AppContextType';
import Context from '../../../Context/context';
import {Card, Reward} from '../../../types/CardType';
import {Dimensions} from 'react-native';
import AddCardFullForm from './AddCardFullForm';
import Consts from '../../../Helpers/Consts';
import authContext from '../../../Context/authContext';
import {AuthContextType} from '../../../types/AuthContextType';
import {styled} from 'nativewind';

type WalletScreenProps = CompositeScreenProps<
  NativeStackScreenProps<WalletNavigationRoutesType, 'WalletScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const StyledView = styled(View);
const StyledList = styled(FlatList);
// const StyledText = styled(Text, 'text-lg text-dark-green');

const WalletScreen: React.FC<WalletScreenProps> = () => {
  const {unlinkCard, setCardForms, CardForms} = React.useContext(
    Context,
  ) as AppContext;
  const {userProfile} = React.useContext(authContext) as AuthContextType;

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
    <AddCardView>
      <SecondaryAddCardView>
        <CardText className="text-center opacity-100">Add New Card</CardText>
        <AddCardButton onPress={handleAddPress}>
          <AddCardIcon source={require('../../../Assets/AddSign.png')} />
        </AddCardButton>
      </SecondaryAddCardView>
    </AddCardView>
  );
  const renderCard = (item: Card) => {
    if (item.card_name === 'Add') {
      return addNewCardComponent();
    }
    return (
      <CardView>
        <StyledView className="flex-1 flex-col w-11/12 h-full justify-center items-center bg-dark-green rounded-xl">
          <CardButton
            onLongPress={() => handleCardPress()}
            className={deleteCard ? 'opacity-50' : 'opacity-100'}>
            <StyledView className="flex-1 flex-col">
              <StyledView className="text-center">
                <CardText className="text-center font-bold truncate">
                  {item.card_name}
                </CardText>
              </StyledView>
              <StyledView className="flex-1 flex-row justify-start">
                <CardText>{`${item.card_bin}`}</CardText>
                {/* <CardText>{`Card Type: ${item.card_type}`}</CardText>
                <CardText>{`Card Brand: ${item.card_brand_name}`}</CardText> */}
              </StyledView>
            </StyledView>
          </CardButton>
          {deleteCard && (
            <DeleteCardButton
              onLongPress={handleDelete}
              onPress={() => setDeleteCard(false)}>
              <CardText className="opacity-100 text-4xl text-center">
                Delete Card?
              </CardText>
              <CardText className="opacity-100 text-3xl text-center">
                Long Press Again to Confirm
              </CardText>
              <CardText className="opacity-100 text-2xl text-center">
                Tap to Exit
              </CardText>
            </DeleteCardButton>
          )}
        </StyledView>
      </CardView>
    );
  };

  const renderReward = (item: Reward) => {
    return (
      <RewardsView>
        <Subtitle className="text-left">{item.reward_name}</Subtitle>
        <Subtitle>{item.reward_description}</Subtitle>
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
    setCardForms({...CardForms, Full: true});
  };

  const onViewRef = useRef((viewableItems: any) => {
    const check: Card[] = viewableItems.viewableItems.map(
      (item: any) => item.item as Card,
    );
    setCurrentViewedCard(check);
  });

  useEffect(() => {
    setDeleteCard(false);
  }, [currentViewedCard]);

  return (
    <WrapperView>
      {AddCardFullForm()}
      <Title className="mt-10">Wallet</Title>
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
          renderItem={({item}) => renderCard(item as Card)}
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
              <Title>Rewards</Title>
            ) : null
          }
          showsVerticalScrollIndicator={true}
          keyExtractor={item => (item as Reward).reward_name.toString()}
          renderItem={({item}) => renderReward(item as Reward)}
          ItemSeparatorComponent={itemSeparatorComponent}
        />
      </View>
    </WrapperView>
  );
};

export default WalletScreen;
