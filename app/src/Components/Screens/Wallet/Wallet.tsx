import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {styled} from 'nativewind';
import type {PropsWithChildren} from 'react';
import React, {useEffect, useRef} from 'react';
import {Dimensions, FlatList, Text, View, ViewToken} from 'react-native';
import authContext from '../../../Context/authContext';
import Context from '../../../Context/context';
import Consts from '../../../Helpers/Consts';
import {
  AddCardButton,
  AddCardIcon,
  CardButton,
  CardItemSeperator,
  CardText,
  CardView,
  DeleteCardButton,
  RewardsView,
} from '../../../Helpers/StylizedComponents';
import {AppContext} from '../../../types/AppContextType';
import {AuthContextType} from '../../../types/AuthContextType';
import {Card, Reward} from '../../../types/CardType';
import type {
  NavigationRoutesType,
  WalletNavigationRoutesType,
} from '../../../types/NavigationRoutesType';
import PrimaryText from '../../Common/PrimaryText';
import TitleText from '../../Common/TitleText';
import WrapperView from '../../Common/WrapperView';
import AddCardFullForm from './AddCardFullForm';

type WalletScreenProps = CompositeScreenProps<
  NativeStackScreenProps<WalletNavigationRoutesType, 'WalletScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const StyledView = styled(View);
const StyledList = styled(FlatList);

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

  const formatBin = (bin: string) => {
    return (
      bin
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim() + '** **** ****'
    );
  };

  const formatExpirationDate = (expDate: string) => {
    // exp date is in YYYY-MM-DDT00:00:00 format
    expDate = expDate.split('T')[0].replace(/-/g, '');
    return expDate.slice(4, 6) + '/' + expDate.slice(2, 4);
  };

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
            <StyledView className="relative flex-1 flex-col h-full">
              <StyledView className="text-center">
                <CardText
                  className="text-left font-bold truncate px-2"
                  numberOfLines={2}>
                  {item.card_name}
                </CardText>
              </StyledView>
              <StyledView className="absolute bottom-0 left-2 flex-1 flex-col">
                <Text className="text-lg text-white">
                  {formatBin(item?.card_bin.toString())}
                </Text>
                <Text className="text-xs text-white text-left">
                  {formatExpirationDate(item?.exp_date || '')}
                </Text>
              </StyledView>
              <StyledView className="absolute bottom-0 right-2 flex-1 flex-col">
                <Text className="text-lg text-white">
                  {item.card_brand_name}
                </Text>
                <Text className="text-xs text-white text-right">
                  {item.card_type}
                </Text>
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
    setCardForms({...CardForms, Full: true});
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
              <TitleText>Rewards</TitleText>
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
