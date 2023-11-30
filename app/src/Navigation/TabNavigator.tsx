import { BottomSheetModal } from '@gorhom/bottom-sheet';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef
} from 'react';
import { StyleProp, StyleSheet } from 'react-native';
import Icon from 'react-native-ionicons';
import SettingsBottomSheet from '../Components/Screens/Settings/SettingsBottomSheet';
import context from '../Context/context';
import useColorsMode from '../Helpers/Colors';
import { AppContext, BottomSheetTypes } from '../types/AppContextType';
import { NavigationRoutesType } from '../types/NavigationRoutesType';
import {
  HomeStackNavigator,
  LocationStackNavigator,
  ProfileStackNavigator,
  WalletStackNavigator,
} from './StackNavigator';

const Tab = createBottomTabNavigator<NavigationRoutesType>();

const tabOptions = (label: string) => {
  const options: BottomTabNavigationOptions = {
    tabBarLabel: label,
    tabBarIconStyle: { color: 'green' },
  };

  return options;
};

type TabBarType = {
  color: string;
  size: number;
};

const tabBarIconFilter = (
  { color, size }: TabBarType,
  route: RouteProp<NavigationRoutesType, keyof NavigationRoutesType>,
) => {
  let iconName = 'home';

  if (route.name === 'HomeStack') {
    iconName = 'home';
  } else if (route.name === 'ProfileStack') {
    iconName = 'person';
  } else if (route.name === 'WalletStack') {
    iconName = 'wallet';
  } else if (route.name === 'LocationStack') {
    iconName = 'pin';
  }

  // You can return any component that you like here!
  return <Icon name={iconName} size={size} color={color} />;
};

const BottomTabNavigator: React.FC<PropsWithChildren> = () => {
  const { colors } = useColorsMode();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [backgroundStyles, setBackgroundStyles] = React.useState<
    StyleProp<{
      backgroundColor: string;
    }>
  >(
    {} as StyleProp<{
      backgroundColor: string;
    }>,
  );
  const { bottomSheetModal, showBottomSheetModal, setShowBottomSheetModal } =
    React.useContext(context) as AppContext;

  useEffect(() => {
    const style = {
      backgroundColor: colors.secondary,
    };
    setBackgroundStyles(StyleSheet.flatten([styles.modalBackground, style]));
  }, [colors.secondary, setBackgroundStyles]);

  const snapPoints = useMemo(() => ['25%'], []);

  const presentModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
    bottomSheetModalRef.current?.snapToIndex(0);
  }, [bottomSheetModalRef]);

  const handleModalDismiss = useCallback(() => {
    setShowBottomSheetModal(false);
  }, [setShowBottomSheetModal]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        bottomSheetModalRef.current?.close();
        setShowBottomSheetModal(false);
      }
    },
    [setShowBottomSheetModal],
  );

  const getBottomSheetModal = useCallback(() => {
    if (bottomSheetModal) {
      if (bottomSheetModal.type === BottomSheetTypes.SETTINGS) {
        return <SettingsBottomSheet />;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }, [bottomSheetModal]);

  useEffect(() => {
    if (showBottomSheetModal) {
      presentModal();
    } else if (!showBottomSheetModal) {
      bottomSheetModalRef.current?.close();
    }
  }, [presentModal, showBottomSheetModal]);

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveBackgroundColor: colors.primary,
          tabBarActiveTintColor: colors.secondary,
          tabBarInactiveBackgroundColor: colors.secondary,
          tabBarInactiveTintColor: colors.primary,
          tabBarIcon: ({ color, size }) =>
            tabBarIconFilter({ color, size }, route),
          tabBarAccessibilityLabel: route.name,
          tabBarHideOnKeyboard: true,
        })}>
        <Tab.Screen
          name="HomeStack"
          component={HomeStackNavigator}
          options={tabOptions('Home')}
        />
        <Tab.Screen
          name="WalletStack"
          component={WalletStackNavigator}
          options={tabOptions('Wallet')}
        />
        <Tab.Screen
          name="LocationStack"
          component={LocationStackNavigator}
          options={tabOptions('Location')}
        />
        <Tab.Screen
          name="ProfileStack"
          component={ProfileStackNavigator}
          options={tabOptions('Profile')}
        />
      </Tab.Navigator>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        onDismiss={handleModalDismiss}
        backgroundStyle={backgroundStyles}>
        {getBottomSheetModal()}
      </BottomSheetModal>
    </>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    opacity: 1,
    backgroundColor: 'white',
  },
});

export default BottomTabNavigator;
