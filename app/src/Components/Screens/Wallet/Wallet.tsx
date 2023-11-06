import React, {useEffect, useRef} from 'react';
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
  CreditCardButton,
  CreditCardItemSeperator,
  CreditCardList,
  CreditCardListView,
  CreditCardText,
  CreditCardView,
  DeleteCreditCardButton,
  RewardsView,
  SecondaryAddCreditCardView,
  SecondaryCreditCardView,
  Subtitle,
  Title,
  WrapperView,
} from '../../../Helpers/StylizedComponents';
import {AppContext} from '../../../types/AppContextType';
import Context from '../../../Context/context';
import {CreditCard, CreditCardReward} from '../../../types/CreditCardType';
import {Dimensions} from 'react-native';
import AddCreditCardFullForm from './AddCreditCardFullForm';
import AddCreditCardSearchForm from './AddCreditCardSearchForm';
import ReviewCreditCardForm from './ReviewCreditCardForm';

type WalletScreenProps = CompositeScreenProps<
  NativeStackScreenProps<WalletNavigationRoutesType, 'WalletScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const WalletScreen: React.FC<WalletScreenProps> = () => {
  const {
    creditCards,
    rewards,
    removeCreditCard,
    setCreditCardForms,
    CreditCardForms,
  } = React.useContext(Context) as AppContext;
  const [currentViewedCard, setCurrentViewedCard] = React.useState<
    CreditCard[]
  >([creditCards[0]]);
  const [deleteCard, setDeleteCard] = React.useState<boolean>(false);

  //helpers
  const getCreditCardRewards = (creditCardId: number) =>
    rewards.filter(r => r.creditCardId === creditCardId) || [];

  //components
  const addNewCreditCardComponent = () => (
    <AddCreditCardView>
      <SecondaryAddCreditCardView>
        <CreditCardText className="text-center">
          Add New Credit Card
        </CreditCardText>
        <AddCreditCardButton onPress={handleAddPress}>
          <AddCreditCardIcon source={require('../../../Assets/AddSign.png')} />
        </AddCreditCardButton>
      </SecondaryAddCreditCardView>
    </AddCreditCardView>
  );
  const renderCard = (item: CreditCard) => {
    if (item.nickname === 'Add') {
      return addNewCreditCardComponent();
    }
    return (
      <CreditCardView>
        <SecondaryCreditCardView>
          <CreditCardButton
            onLongPress={() => handleCreditCardPress()}
            className={deleteCard ? 'opacity-50 ' : 'opacity-100'}>
            <CreditCardText className="text-center">
              {item.nickname}
            </CreditCardText>
            <CreditCardText>{`Card Name: ${item.cardName}`}</CreditCardText>
            <CreditCardText>{`Card Type: ${item.cardType}`}</CreditCardText>
            <CreditCardText>{`Bank Name: ${item.bankName}`}</CreditCardText>
          </CreditCardButton>
          {deleteCard && (
            <DeleteCreditCardButton
              onLongPress={handleDelete}
              onPress={() => setDeleteCard(false)}>
              <CreditCardText className="opacity-100 text-4xl text-center">
                Delete Card?
              </CreditCardText>
              <CreditCardText className="opacity-100 text-3xl text-center">
                Long Press Again to Confirm
              </CreditCardText>
              <CreditCardText className="opacity-100 text-2xl text-center">
                Tap to Exist
              </CreditCardText>
            </DeleteCreditCardButton>
          )}
        </SecondaryCreditCardView>
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

  //handlers
  const handleCreditCardPress = () => {
    setDeleteCard(!deleteCard);
  };

  const handleDelete = () => {
    setDeleteCard(false);
    removeCreditCard(currentViewedCard[0]);
  };

  const handleAddPress = () => {
    setCreditCardForms({...CreditCardForms, Search: true});
  };

  const onViewRef = useRef((viewableItems: any) => {
    const check: CreditCard[] = viewableItems.viewableItems.map(
      (item: any) => item.item as CreditCard,
    );
    setCurrentViewedCard(check);
  });

  useEffect(() => {
    setDeleteCard(false);
  }, [currentViewedCard]);

  return (
    <WrapperView>
      {AddCreditCardFullForm()}
      {AddCreditCardSearchForm()}
      {ReviewCreditCardForm()}
      <Title className="mt-10">Wallet</Title>
      <CreditCardListView>
        <CreditCardList
          data={[
            ...creditCards,
            {
              nickname: 'Add',
              id: -1,
            } as CreditCard,
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
      <CreditCardListView className="h-2/6 justify-center items-center">
        <CreditCardList
          className=" text-center w-3/4 p-2"
          data={getCreditCardRewards(
            currentViewedCard[currentViewedCard.length - 1].id,
          )}
          ListHeaderComponent={
            currentViewedCard.filter(i => i.id === -1).length === 0 ? (
              <Title>Rewards</Title>
            ) : null
          }
          showsVerticalScrollIndicator={true}
          keyExtractor={item => (item as CreditCardReward).id.toString()}
          renderItem={({item}) => renderReward(item as CreditCardReward)}
          ItemSeparatorComponent={itemSeparatorComponent}
        />
      </CreditCardListView>
    </WrapperView>
  );
};

export default WalletScreen;
