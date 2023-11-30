import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PropsWithChildren } from 'react';
import React from 'react';
import { View } from 'react-native';
import authContext from '../../../../Context/authContext';
import context from '../../../../Context/context';
import {
  MainButton,
  MainButtonText,
  SettingsCardList,
  SettingsCardView,
  SettingsSubtitle,
  SettingsView,
  Title,
} from '../../../../Helpers/StylizedComponents';
import { AppContext } from '../../../../types/AppContextType';
import { AuthContextType } from '../../../../types/AuthContextType';
import { Card } from '../../../../types/CardType';
import type {
  NavigationRoutesType,
  ProfileNavigationRoutesType,
} from '../../../../types/NavigationRoutesType';
import KeyboardAvoidingViewScroll from '../../../Common/KeyboardAvoidingViewScroll';
import WrapperView from '../../../Common/WrapperView';

type CardSettingsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileNavigationRoutesType, 'CardSettings'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const CardSettings: React.FC<CardSettingsScreenProps> = () => {
  const {cards} = (React.useContext(authContext) as AuthContextType)
    .userProfile;
  const {unlinkCard} = React.useContext(context) as AppContext;

  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const renderCard = (card: Card, key: number) => {
    return (
      <SettingsCardView key={key}>
        <SettingsSubtitle className="text-left font-bold overflow-ellipse w-full h-fit">
          {card.card_name}
        </SettingsSubtitle>
        <SettingsSubtitle className="text-left font-bold overflow-ellipse w-full h-fit">
          {card.card_bin}
        </SettingsSubtitle>
        <View className="flex flex-row justify-between w-full">
          {confirmDelete ? (
            <>
              <MainButton
                className="self-start w-fit bg-red-500 border-dark-green pl-6 pr-6"
                onPress={() => {
                  unlinkCard(cards[key]);
                  setConfirmDelete(false);
                }}>
                <MainButtonText className="text-white">
                  Are you sure?
                </MainButtonText>
              </MainButton>
              <MainButton
                className="self-start w-fit bg-dark-green border-dark-green pl-6 pr-6"
                onPress={() => {
                  setConfirmDelete(false);
                }}>
                <MainButtonText className="text-white">Cancel</MainButtonText>
              </MainButton>
            </>
          ) : (
            <>
              <MainButton
                className="self-start w-fit bg-red-500 border-dark-green pl-6 pr-6"
                onPress={() => setConfirmDelete(true)}>
                <MainButtonText className="text-white">Delete</MainButtonText>
              </MainButton>
              <MainButton className="self-end w-fit bg-dark-green border-dark-green pl-6 pr-6 opacity-50">
                <MainButtonText className="text-white">
                  Edit Coming Soon
                </MainButtonText>
              </MainButton>
            </>
          )}
        </View>
      </SettingsCardView>
    );
  };

  return (
    <WrapperView className="pb-0">
      <KeyboardAvoidingViewScroll>
        <Title className="mt-10">Card Settings</Title>
        <SettingsView>
          <SettingsCardList>
            {cards.map((card, index) => renderCard(card, index))}
          </SettingsCardList>
        </SettingsView>
      </KeyboardAvoidingViewScroll>
    </WrapperView>
  );
};

export default CardSettings;
