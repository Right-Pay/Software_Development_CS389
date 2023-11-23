import React, {useCallback, useContext, useEffect} from 'react';
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
  MainButtonText,
  MainButton,
  Title,
  WrapperView,
  SettingsView,
  SettingsSubtitle,
  Subtitle,
} from '../../../../Helpers/StylizedComponents';
import KeyboardAvoidingViewScroll from '../../../../Helpers/KeyboardAvoidingViewScroll';
import {Switch} from 'react-native-switch';
import context from '../../../../Context/context';
import {AppContext} from '../../../../types/AppContextType';

type LocationSettingsProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileNavigationRoutesType, 'LocationSettings'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const LocationSettings: React.FC<LocationSettingsProps> = ({navigation}) => {
  const {requestLocationPermission, appStateVisible, updateLocation} =
    useContext(context) as AppContext;
  const [on, setOn] = React.useState<boolean>(false);

  const toggleSwitch = async () => {
    await Linking.openSettings();
  };

  const checkLocationPermission = useCallback(async () => {
    const permission = await requestLocationPermission();
    setOn(permission);
    await updateLocation();
  }, [requestLocationPermission, updateLocation]);

  useEffect(() => {
    //if (appStateVisible === 'active') {
    checkLocationPermission();
    //}
  }, [appStateVisible, checkLocationPermission]);

  return (
    <WrapperView className="pb-0">
      <KeyboardAvoidingViewScroll>
        <Title className="mt-10">Location Settings</Title>
        <SettingsView>
          <SettingsSubtitle className="mb-6">
            Your location is used to determine nearby companies and which card
            to suggest you use
          </SettingsSubtitle>
          <Switch
            value={on}
            onValueChange={toggleSwitch}
            circleSize={30}
            barHeight={40}
            backgroundActive={'#4d654e'}
            backgroundInactive={'#e6ffe3'}
            containerStyle={{borderWidth: 2, borderColor: '#4d654e'}}
            circleActiveColor={'#e6ffe3'}
            circleInActiveColor={'#4d654e'}
            innerCircleStyle={{alignItems: 'center', justifyContent: 'center'}} // style for inner animated circle for what you (may) be rendering inside the circle
            renderActiveText={false}
            renderInActiveText={false}
            switchLeftPx={0.8} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
            switchRightPx={0.8} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
            switchWidthMultiplier={4} // multiplied by the `circleSize` prop to calculate total width of the Switch
            switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
          />
          <Subtitle className="mb-3">
            {on ? 'Location Services On' : 'Location Services Off'}
          </Subtitle>
        </SettingsView>
      </KeyboardAvoidingViewScroll>
    </WrapperView>
  );
};

export default LocationSettings;
