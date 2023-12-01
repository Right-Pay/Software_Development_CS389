/* eslint-disable react/no-unstable-nested-components */
import { Text, View } from 'react-native';
import {
  CardButton,
  CardText,
  CardView,
  DeleteCardButton,
} from '../Helpers/StylizedComponents';
import React from 'react';
import { CardProps } from '../types/CardType';

const CardComponent: React.FC<CardProps> = props => {
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

  const CardName = (
    <View className="text-center">
      <CardText className="text-left font-bold truncate px-2" numberOfLines={2}>
        {props.card_name}
      </CardText>
    </View>
  );

  const CardMiddle = (
    <View className="absolute bottom-0 left-2 flex-1 flex-col">
      <Text className="text-lg text-white">
        {formatBin(props.card_bin.toString())}
      </Text>
      <Text className="text-xs text-white text-left">
        {formatExpirationDate(props?.exp_date || '')}
      </Text>
    </View>
  );

  const CardBottom = (
    <View className="absolute bottom-0 right-2 flex-1 flex-col">
      <Text className="text-lg text-white">{props.card_brand_name}</Text>
      <Text className="text-xs text-white text-right">{props.card_type}</Text>
    </View>
  );

  const DeleteCard = () => {
    return (
      <DeleteCardButton
        onLongPress={props.handleDelete}
        onPress={() =>
          props.setDeleteCard !== undefined && props.setDeleteCard(false)
        }>
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
