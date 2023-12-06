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
  useRef,
} from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
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
import PointPopUp from '../Components/PointPopUp';

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
  switch (route.name) {
    case 'HomeStack':
      return <Icon name="home" size={size} color={color} />;
    case 'ProfileStack':
      return <Icon name="person" size={size} color={color} />;
    case 'WalletStack':
      return <Icon name="wallet" size={size} color={color} />;
    case 'LocationStack':
      return <Icon name="pin" size={size} color={color} />;
    default:
      return <Icon name="home" size={size} color={color} />;
  }
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

  const snapPoints = useMemo(
    () => bottomSheetModal.snapPoints,
    [bottomSheetModal.snapPoints],
  );

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
        return (
          <View className="w-full h-full">
            <SettingsBottomSheet />
          </View>
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  }, [bottomSheetModal]);

  const backdropComponent = useCallback(() => {
    return (
      <TouchableWithoutFeedback onPress={() => handleModalDismiss()}>
        <View className="absolute top-0 left-0 opacity-50 bg-black h-screen w-screen" />
      </TouchableWithoutFeedback>
    );
  }, [handleModalDismiss]);

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
        backdropComponent={backdropComponent}
        backgroundStyle={backgroundStyles}>
        {getBottomSheetModal()}
      </BottomSheetModal>
      <PointPopUp />
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
