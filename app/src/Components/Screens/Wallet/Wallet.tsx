import React from 'react';
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

  const getCreditCardRewards = (creditCardId: number) => {
    const ret = rewards.filter(r => r.creditCardId === creditCardId);
    return ret ? ret : [];
  };

  const renderCard = (item: CreditCard) => {
    if (item.name === 'Add') {
      return addNewCreditCardComponent();
    }
    return (
      <CreditCardView>
        <CreditCardText>{`Name: ${item.name}`}</CreditCardText>
        <CreditCardText>{`Card Number: ${item.cardNumber}`}</CreditCardText>
        <CreditCardText>{`Card Type: ${item.cardType}`}</CreditCardText>
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

  const itemSeparatorComponent = () => {
    return <CreditCardItemSeperator />;
  };

  const handleAddPress = () => {
    setShowAddForm(true);
  };

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

  const onViewRef = React.useRef((viewableItems: any) => {
    let Check: CreditCard[] = [];
    for (var i = 0; i < viewableItems.viewableItems.length; i++) {
      Check.push(viewableItems.viewableItems[i].item as CreditCard);
    }
    setCurrentViewedCard(Check);
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
      <CreditCardListView>
        {(currentViewedCard[0].id !== -1 ||
          (currentViewedCard[1] !== undefined &&
            currentViewedCard[1].id !== 1)) && <Title>Rewards</Title>}
        <CreditCardList
          data={getCreditCardRewards(
            currentViewedCard[currentViewedCard.length - 1].id,
          )}
          keyExtractor={item => (item as CreditCardReward).id.toString()}
          renderItem={({item}) => renderReward(item as CreditCardReward)}
          ItemSeparatorComponent={itemSeparatorComponent}
        />
      </CreditCardListView>
    </WrapperView>
  );
};

export default WalletScreen;
