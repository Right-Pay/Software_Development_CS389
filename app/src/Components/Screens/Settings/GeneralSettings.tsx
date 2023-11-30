import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PropsWithChildren } from 'react';
import React, { useContext, useEffect } from 'react';
import { Linking } from 'react-native';
import { Switch } from 'react-native-switch';
import context from '../../../Context/context';
import locationContext from '../../../Context/locationContext';
import useColorsMode from '../../../Helpers/Colors';
import { AppContext } from '../../../types/AppContextType';
import { LocationContext } from '../../../types/LocationContextType';
import type {
  NavigationRoutesType,
  SettingsNavigationRoutesType,
} from '../../../types/NavigationRoutesType';
import InnerWrapperView from '../../Common/InnerWrapperView';
import KeyboardAvoidingViewScroll from '../../Common/KeyboardAvoidingViewScroll';
import OutlineButton from '../../Common/OutlineButton';
import PrimaryText from '../../Common/PrimaryText';
import TitleText from '../../Common/TitleText';
import WrapperView from '../../Common/WrapperView';

type GeneralSettingsProps = CompositeScreenProps<
  NativeStackScreenProps<SettingsNavigationRoutesType, 'GeneralSettings'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const GeneralSettings: React.FC<GeneralSettingsProps> = () => {
  const { appStateVisible } = useContext(context) as AppContext;
  const { requestLocationPermission, locationGrantType } = useContext(
    locationContext,
  ) as LocationContext;
  const { colors } = useColorsMode();

  const [locationServicesOn, setLocationServicesOn] =
    React.useState<boolean>(locationGrantType);

  const navigateToSettings = async () => {
    await Linking.openSettings();
  };

  useEffect(() => {
    if (appStateVisible === 'active') {
      requestLocationPermission().then(permission => {
        setLocationServicesOn(permission);
      });
    }
  }, [appStateVisible, requestLocationPermission]);

  return (
    <WrapperView className="pb-0">
      <KeyboardAvoidingViewScroll>
        <TitleText className="mt-10 mb-4">General Settings</TitleText>
        <InnerWrapperView className="border-t-2">
          <PrimaryText className="mb-3">
            Your location is used to determine nearby companies and which card
            to suggest you use
          </PrimaryText>
          <Switch
            value={locationServicesOn}
            onValueChange={navigateToSettings}
            circleSize={30}
            barHeight={40}
            backgroundActive={colors.primary}
            backgroundInactive={colors.secondary}
            // eslint-disable-next-line react-native/no-inline-styles
            containerStyle={{
              borderWidth: 2,
              borderColor: colors.primary,
              margin: 10,
            }}
            circleActiveColor={colors.secondary}
            circleInActiveColor={colors.primary}
            // eslint-disable-next-line react-native/no-inline-styles
            innerCircleStyle={{
              alignItems: 'center',
              justifyContent: 'center',
            }} // style for inner animated circle for what you (may) be rendering inside the circle
            renderActiveText={false}
            renderInActiveText={false}
            switchLeftPx={0.8} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
            switchRightPx={0.8} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
            switchWidthMultiplier={4} // multiplied by the `circleSize` prop to calculate total width of the Switch
            switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
          />
          <PrimaryText className="mb-3">
            {locationServicesOn
              ? 'Location Services On'
              : 'Location Services Off'}
          </PrimaryText>
          <OutlineButton type="primary" onPress={() => navigateToSettings()}>
            <PrimaryText className="text-center text-xl">
              More Settings
            </PrimaryText>
          </OutlineButton>
        </InnerWrapperView>
      </KeyboardAvoidingViewScroll>
    </WrapperView>
  );
};

export default GeneralSettings;
