import React, {useContext, useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {Linking} from 'react-native';
import type {
  NavigationRoutesType,
  ProfileNavigationRoutesType,
} from '../../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import {
  Title,
  WrapperView,
  SettingsView,
  Subtitle,
  MainButton,
  MainButtonText,
} from '../../../../Helpers/StylizedComponents';
import KeyboardAvoidingViewScroll from '../../../../Helpers/KeyboardAvoidingViewScroll';
import {Switch} from 'react-native-switch';
import context from '../../../../Context/context';
import {AppContext} from '../../../../types/AppContextType';
import locationContext from '../../../../Context/locationContext';
import {LocationContext} from '../../../../types/LocationContextType';

type GeneralSettingsProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileNavigationRoutesType, 'GeneralSettings'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const GeneralSettings: React.FC<GeneralSettingsProps> = () => {
  const {appStateVisible} = useContext(context) as AppContext;
  const {requestLocationPermission, locationGrantType} = useContext(
    locationContext,
  ) as LocationContext;

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
        <Title className="mt-10">General Settings</Title>
        <SettingsView>
          <Subtitle className="mb-3">
            Your location is used to determine nearby companies and which card
            to suggest you use
          </Subtitle>
          <Switch
            value={locationServicesOn}
            onValueChange={navigateToSettings}
            circleSize={30}
            barHeight={40}
            backgroundActive={'#4d654e'}
            backgroundInactive={'#e6ffe3'}
            // eslint-disable-next-line react-native/no-inline-styles
            containerStyle={{
              borderWidth: 2,
              borderColor: '#4d654e',
              margin: 10,
            }}
            circleActiveColor={'#e6ffe3'}
            circleInActiveColor={'#4d654e'}
            // eslint-disable-next-line react-native/no-inline-styles
            innerCircleStyle={{alignItems: 'center', justifyContent: 'center'}} // style for inner animated circle for what you (may) be rendering inside the circle
            renderActiveText={false}
            renderInActiveText={false}
            switchLeftPx={0.8} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
            switchRightPx={0.8} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
            switchWidthMultiplier={4} // multiplied by the `circleSize` prop to calculate total width of the Switch
            switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
          />
          <Subtitle className="mb-3">
            {locationServicesOn
              ? 'Location Services On'
              : 'Location Services Off'}
          </Subtitle>
          <MainButton onPress={() => navigateToSettings()}>
            <MainButtonText>More Settings</MainButtonText>
          </MainButton>
        </SettingsView>
      </KeyboardAvoidingViewScroll>
    </WrapperView>
  );
};

export default GeneralSettings;
