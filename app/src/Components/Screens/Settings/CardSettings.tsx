import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PropsWithChildren } from 'react';
import React from 'react';
import { View } from 'react-native';
import authContext from '../../../Context/authContext';
import context from '../../../Context/context';
import {
  SettingsCardList,
  SettingsCardView,
} from '../../../Helpers/StylizedComponents';
import { AppContext } from '../../../types/AppContextType';
import { AuthContextType } from '../../../types/AuthContextType';
import { Card } from '../../../types/CardType';
import type {
  NavigationRoutesType,
  SettingsNavigationRoutesType,
} from '../../../types/NavigationRoutesType';
import InnerWrapperView from '../../Common/InnerWrapperView';
import KeyboardAvoidingViewScroll from '../../Common/KeyboardAvoidingViewScroll';
import PrimaryButton from '../../Common/PrimaryButton';
import PrimaryText from '../../Common/PrimaryText';
import TitleText from '../../Common/TitleText';
import WrapperView from '../../Common/WrapperView';
import { LanguageContextType } from '../../../types/LanguageContextType';
import languageContext from '../../../Context/languageContext';

type CardSettingsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SettingsNavigationRoutesType, 'CardSettings'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const CardSettings: React.FC<CardSettingsScreenProps> = () => {
  const { cards } = (React.useContext(authContext) as AuthContextType)
    .userProfile;
  const { unlinkCard } = React.useContext(context) as AppContext;
  const { translate } = React.useContext(
    languageContext,
  ) as LanguageContextType;

  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const confirmDeleteCard = (card: Card, key: number) => {
    return (
      <>
        <PrimaryButton
          className="self-start w-fit bg-red-500 border-dark-green pl-6 pr-6"
          onPress={() => {
            unlinkCard(cards[key]);
            setConfirmDelete(false);
          }}>
          <PrimaryText className="text-center text-md text-white">
            {translate('Settings', 'Confirmdelete')}
          </PrimaryText>
        </PrimaryButton>
        <PrimaryButton
          type="tertiary"
          onPress={() => {
            setConfirmDelete(false);
          }}>
          <PrimaryText className="text-center text-xl text-white">
            {translate('Settings', 'Cancel')}
          </PrimaryText>
        </PrimaryButton>
      </>
    );
  };

  const deletePhaseButtons = (card: Card, key: number) => {
    return (
      <>
        <PrimaryButton
          className="bg-red-500"
          onPress={() => setConfirmDelete(true)}>
          <PrimaryText className="text-xl text-white">
            {translate('Settings', 'Delete')}
          </PrimaryText>
        </PrimaryButton>
        <PrimaryButton className="opacity-50">
          <PrimaryText className="text-md text-white">
            {translate('Settings', 'Editsoon')}
          </PrimaryText>
        </PrimaryButton>
      </>
    );
  };

  const renderCard = (card: Card, key: number) => {
    return (
      <SettingsCardView key={key}>
        <PrimaryText className="text-2xl font-bold text-left overflow-ellipse w-full h-fit">
          {card.card_name}
        </PrimaryText>
        <PrimaryText className="text-2xl font-bold text-left overflow-ellipse w-full h-fit">
          {card.card_bin}
        </PrimaryText>
        <View className="flex flex-row justify-between w-full">
          {confirmDelete
            ? confirmDeleteCard(card, key)
            : deletePhaseButtons(card, key)}
        </View>
      </SettingsCardView>
    );
  };

  return (
    <WrapperView className="pb-0">
      <KeyboardAvoidingViewScroll>
        <TitleText className="mt-10 mb-4">{`${translate(
          'Settings',
          'Card',
        )} ${translate('Settings', 'Settings')}`}</TitleText>
        <InnerWrapperView className="border-t-2">
          <SettingsCardList>
            {cards.map((card, index) => renderCard(card, index))}
          </SettingsCardList>
        </InnerWrapperView>
      </KeyboardAvoidingViewScroll>
    </WrapperView>
  );
};

export default CardSettings;
