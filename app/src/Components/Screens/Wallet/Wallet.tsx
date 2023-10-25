import React, {useRef} from 'react';
import type {PropsWithChildren} from 'react';
import type {
  WalletNavigationRoutesType,
  NavigationRoutesType,
} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import {
  AddCreditCardButton,
  AddCreditCardIcon,
  AddCreditCardView,
  CreditCardItemSeperator,
  CreditCardList,
  CreditCardListView,
  CreditCardText,
  CreditCardView,
  RewardsView,
  Subtitle,
  Title,
  WrapperView,
} from '../../../Helpers/StylizedComponents';
import {AppContext} from '../../../types/AppContextType';
import Context from '../../../Context/context';
import {CreditCard, CreditCardReward} from '../../../types/CreditCardType';
import {Dimensions} from 'react-native';
import AddCreditCardForm from './AddCreditCardForm';

type WalletScreenProps = CompositeScreenProps<
  NativeStackScreenProps<WalletNavigationRoutesType, 'WalletScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const WalletScreen: React.FC<WalletScreenProps> = () => {
  const {
    creditCards,
    rewards /*, addNewReward, removeCreditCard, removeReward*/,
  } = React.useContext(Context) as AppContext;
  const [currentViewedCard, setCurrentViewedCard] = React.useState<
    CreditCard[]
  >([creditCards[0]]);
  const [showAddForm, setShowAddForm] = React.useState<boolean>(false);

  const getCreditCardRewards = (creditCardId: number) =>
    rewards.filter(r => r.creditCardId === creditCardId) || [];

  const addNewCreditCardComponent = () => (
    <AddCreditCardView>
      <CreditCardText className="text-center">
        Add New Credit Card
      </CreditCardText>
      <AddCreditCardButton onPress={handleAddPress}>
        <AddCreditCardIcon source={require('../../../Assets/AddSign.png')} />
      </AddCreditCardButton>
    </AddCreditCardView>
  );

  const renderCard = (item: CreditCard) => {
    if (item.name === 'Add') {
      return addNewCreditCardComponent();
    }
    return (
      <CreditCardView>
        <CreditCardText>{`Name: ${item.name}`}</CreditCardText>
        <CreditCardText>{`Card Number: ${item.cardNumber}`}</CreditCardText>
        <CreditCardText>{`Card Type: ${item.cardType}`}</CreditCardText>
        <CreditCardText>{`Expiration Date: ${item.expirationDate}`}</CreditCardText>
      </CreditCardView>
    );
  };

  const renderReward = (item: CreditCardReward) => {
    return (
      <RewardsView>
        <Subtitle className="text-left">{item.name}</Subtitle>
        <Subtitle>{item.description}</Subtitle>
        <Subtitle>{item.amount}</Subtitle>
      </RewardsView>
    );
  };

  const itemSeparatorComponent = () => <CreditCardItemSeperator />;

  const handleAddPress = () => setShowAddForm(true);

  const onViewRef = useRef((viewableItems: any) => {
    const check: CreditCard[] = viewableItems.viewableItems.map(
      (item: any) => item.item as CreditCard,
    );
    setCurrentViewedCard(check);
  });

  return (
    <WrapperView>
      {AddCreditCardForm({
        isVisible: showAddForm,
        setIsVisible: setShowAddForm,
      })}

      <Title className="mt-10">Wallet</Title>
      <CreditCardListView>
        <CreditCardList
          data={[
            ...creditCards,
            {
              name: 'Add',
              id: -1,
            },
          ]}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => (item as CreditCard).id.toString()}
          renderItem={({item}) => renderCard(item as CreditCard)}
          horizontal={true}
          ItemSeparatorComponent={itemSeparatorComponent}
          onViewableItemsChanged={onViewRef.current} // To get the current viewed card. Can't add method here. Throws error.
          snapToInterval={Dimensions.get('window').width + 48} //Change 48 based on width of CreditCardItemSeperator width
        />
      </CreditCardListView>
      <CreditCardListView className="h-2/5">
        <CreditCardList
          data={getCreditCardRewards(
            currentViewedCard[currentViewedCard.length - 1].id,
          )}
          ListHeaderComponent={
            currentViewedCard.filter(i => i.id === -1).length === 0 ? (
              <Title>Rewards</Title>
            ) : null
          }
          keyExtractor={item => (item as CreditCardReward).id.toString()}
          renderItem={({item}) => renderReward(item as CreditCardReward)}
          ItemSeparatorComponent={itemSeparatorComponent}
        />
      </CreditCardListView>
    </WrapperView>
  );
};

export default WalletScreen;
