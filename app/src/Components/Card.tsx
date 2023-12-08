/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { Text, View } from 'react-native';
import {
  CardButton,
  CardView,
  DeleteCardButton,
} from '../Helpers/StylizedComponents';
import { CardProps } from '../types/CardType';
import { LanguageContextType } from '../types/LanguageContextType';
import LanguageContext from '../Context/languageContext';

const CardComponent: React.FC<CardProps> = props => {
  const { translate } = React.useContext(
    LanguageContext,
  ) as LanguageContextType;

  const formatBin = (bin: string) => {
    return (
      bin
        ?.replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim() + '** **** ****'
    );
  };

  const formatExpirationDate = (expDate: string) => {
    // exp date is in YYYY-MM-DDT00:00:00 format
    expDate = expDate.split('T')[0].replace(/-/g, '');
    return expDate.slice(4, 6) + '/' + expDate.slice(2, 4);
  };

  const CardName = (
    <View className="text-center">
      <Text
        className="text-2xl text-white text-left font-bold truncate px-2"
        numberOfLines={1}>
        {props.card?.card_bank_name}
      </Text>
      <Text
        className="text-lg text-white text-left truncate px-2"
        numberOfLines={2}>
        {props.card?.card_level}
      </Text>
    </View>
  );

  const CardMiddle = (
    <View className="absolute bottom-0 left-2 flex-1 flex-col">
      <Text className="text-lg text-white font-bold">
        {formatBin(props.card?.card_bin.toString())}
      </Text>
      <Text className="text-xs text-white text-left">
        {formatExpirationDate(props.card?.exp_date || '')}
      </Text>
    </View>
  );

  const CardBottom = (
    <View className="absolute bottom-0 right-2 flex-1 flex-col">
      <Text className="text-lg text-white font-bold">
        {props.card?.card_brand_name}
      </Text>
      <Text className="text-xs text-white text-right">
        {props.card?.card_type}
      </Text>
    </View>
  );

  const DeleteCard = () => {
    return (
      <DeleteCardButton
        onLongPress={props.handleDelete}
        onPress={() =>
          props.setDeleteCard !== undefined && props.setDeleteCard(false)
        }>
        <Text className="text-2xl text-white text-left opacity-100 text-4xl text-center">
          {translate('Wallet', 'Delete')}
        </Text>
        <Text className="text-2xl text-white text-left opacity-100 text-3xl text-center">
          {translate('Wallet', 'Longpress')}
        </Text>
        <Text className="text-2xl text-white text-left opacity-100 text-2xl text-center">
          {translate('Wallet', 'Tap')}
        </Text>
      </DeleteCardButton>
    );
  };

  return (
    <CardView className={props.classNameProp as string}>
      <View className="flex-1 flex-col w-11/12 h-full justify-center items-center bg-dark-green rounded-xl">
        <CardButton
          onLongPress={() => props.handleCardPress && props.handleCardPress()}
          className={props.deleteCard ? 'opacity-50' : 'opacity-100'}>
          <View className="relative flex-1 flex-col h-full">
            {CardName}
            {CardMiddle}
            {CardBottom}
          </View>
        </CardButton>
        {props.deleteCard ? props.deleteCard && <DeleteCard /> : null}
      </View>
    </CardView>
  );
};

export default CardComponent;
