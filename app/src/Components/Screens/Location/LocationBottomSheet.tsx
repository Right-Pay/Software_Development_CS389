import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { NavigationTabProp } from 'react-navigation-tabs';
import locationContext from '../../../Context/locationContext';
import useColorsMode from '../../../Helpers/Colors';
import { LocationContext } from '../../../types/LocationContextType';
import PrimaryText from '../../Common/PrimaryText';
import TitleText from '../../Common/TitleText';

const LocationBottomSheet: React.FC<PropsWithChildren> = () => {
  const { selectedLocation } = React.useContext(
    locationContext,
  ) as LocationContext;
  // use this to dismiss bottom sheet
  const { dismiss } = useBottomSheetModal();
  // use this to access colors and color theme (themeMode)
  const { colors, themeMode } = useColorsMode();
  // use this to navigate off the screen if needed (maybe in the future we need to navigate to the card screen)
  const navigation =
    useNavigation<NavigationTabProp<ReactNavigation.RootParamList>>();
  return (
    <View className="flex-1 w-full h-full pb-6">
      <TitleText className="text-center text-3xl">
        {selectedLocation?.displayName.text || ''}
      </TitleText>
      <PrimaryText className="text-center text-xl">
        {selectedLocation?.formattedAddress}
      </PrimaryText>
    </View>
  );
};

export default LocationBottomSheet;
