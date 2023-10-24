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
  CreditCardList,
  CreditCardText,
  CreditCardView,
  Title,
  WrapperView,
} from '../../../Helpers/StylizedComponents';
import {Text} from 'react-native';
import {AppContext} from '../../../types/AppContextType';
import Context from '../../../Context/context';
import {CreditCard} from '../../../types/CreditCardType';

type WalletScreenProps = CompositeScreenProps<
  NativeStackScreenProps<WalletNavigationRoutesType, 'WalletScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const WalletScreen: React.FC<WalletScreenProps> = ({navigation}) => {
  const {creditCards} = React.useContext(Context) as AppContext;

  const renderCard = (item: CreditCard) => {
    return (
      <CreditCardView
        style={{
          margin: 10,
        }}>
        <CreditCardText>Card Number: {item.cardNumber}</CreditCardText>
        <CreditCardText>Card Type: {item.cardType}</CreditCardText>
      </CreditCardView>
    );
  };

  return (
    <WrapperView>
      <Title className="mt-10">Wallet</Title>
      <CreditCardList
        data={creditCards}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => renderCard(item as CreditCard)}
      />
    </WrapperView>
  );
};

export default WalletScreen;
