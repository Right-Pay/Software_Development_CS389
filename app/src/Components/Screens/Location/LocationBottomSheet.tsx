import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { NavigationTabProp } from 'react-navigation-tabs';
import locationContext from '../../../Context/locationContext';
import useColorsMode from '../../../Helpers/Colors';
import { Card, Reward } from '../../../types/CardType';
import { LocationContext } from '../../../types/LocationContextType';
import PrimaryText from '../../Common/PrimaryText';
import TitleText from '../../Common/TitleText';

const LocationBottomSheet: React.FC<PropsWithChildren> = () => {
  const { selectedLocation, fetchCardById } = React.useContext(
    locationContext,
  ) as LocationContext;

  // use this to dismiss bottom sheet
  const { dismiss } = useBottomSheetModal();
  // use this to access colors and color theme (themeMode)
  const { colors, themeMode } = useColorsMode();
  // use this to navigate off the screen if needed (maybe in the future we need to navigate to the card screen)
  const navigation =
    useNavigation<NavigationTabProp<ReactNavigation.RootParamList>>();

  const renderReward = (reward: Reward) => {
    return (
      <View key={reward.id}>
        <PrimaryText className="ml-2 text-lg">
          Cashback Percent: {reward.initial_percentage}
        </PrimaryText>
      </View>
    );
  };

  const renderCard = (card: Card) => {
    return (
      card.rewards &&
      card.rewards.length > 0 && (
        <View key={card.id}>
          <PrimaryText className="ml-2 text-lg">{card.card_bin}</PrimaryText>
          {card.rewards && card.rewards.map(reward => renderReward(reward))}
        </View>
      )
    );
  };

  return (
    <View className="flex-1 w-full h-full pb-6">
      <TitleText className="text-center text-3xl">
        {selectedLocation?.displayName.text || ''}
      </TitleText>
      <PrimaryText className="text-center text-xl">
        {selectedLocation?.formattedAddress}
      </PrimaryText>
      {selectedLocation?.cardRewards &&
        selectedLocation?.cardRewards.map(card =>
          renderCard(fetchCardById(card.cardId)),
        )}
    </View>
  );
};

export default LocationBottomSheet;
