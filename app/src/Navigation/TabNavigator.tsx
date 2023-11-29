import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {RouteProp} from '@react-navigation/native';
import React, {
  PropsWithChildren,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import {useColorScheme, StyleSheet} from 'react-native';
import Icon from 'react-native-ionicons';
import {NavigationRoutesType} from '../types/NavigationRoutesType';
import {
  HomeStackNavigator,
  LocationStackNavigator,
  ProfileStackNavigator,
  WalletStackNavigator,
} from './StackNavigator';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import context from '../Context/context';
import {AppContext} from '../types/AppContextType';

const Tab = createBottomTabNavigator<NavigationRoutesType>();

const tabOptions = (label: string) => {
  const options: BottomTabNavigationOptions = {
    tabBarLabel: label,
    tabBarIconStyle: {color: 'green'},
  };

  return options;
};

type TabBarType = {
  color: string;
  size: number;
};

const tabBarIconFilter = (
  {color, size}: TabBarType,
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
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const {bottomSheetModal, showBottomSheetModal, setShowBottomSheetModal} =
    React.useContext(context) as AppContext;
  const theme = useColorScheme();
  const isDarkTheme = theme === 'dark';

  const lightColor = '#Ffffff';
  const darkColor = '#272727';

  const snapPoints = useMemo(() => ['25%'], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
    bottomSheetModalRef.current?.snapToIndex(0);
  }, [bottomSheetModalRef]);

  const handleModalClose = useCallback(() => {
    setShowBottomSheetModal(false);
  }, [setShowBottomSheetModal]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        bottomSheetModalRef.current?.close();
        setShowBottomSheetModal(false);
      }
      console.log('handleSheetChanges', index);
    },
    [setShowBottomSheetModal],
  );

  useEffect(() => {
    if (showBottomSheetModal) {
      handlePresentModalPress();
      console.log('showBottomSheetModal');
    } else if (!showBottomSheetModal) {
      bottomSheetModalRef.current?.close();
      console.log('showBottomSheetModal');
    }
  }, [handlePresentModalPress, handleModalClose, showBottomSheetModal]);

  return (
    <>
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveBackgroundColor: isDarkTheme ? '#e6ffe3' : '#4d654e',
          tabBarActiveTintColor: isDarkTheme ? darkColor : lightColor,
          tabBarInactiveBackgroundColor: isDarkTheme ? darkColor : lightColor,
          tabBarInactiveTintColor: isDarkTheme ? '#e6ffe3' : '#4d654e',
          tabBarIcon: ({color, size}) => tabBarIconFilter({color, size}, route),
          tabBarAccessibilityLabel: route.name,
          tabBarHideOnKeyboard: true,
        })}>
        <Tab.Screen
          name="HomeStack"
          component={HomeStackNavigator}
          options={tabOptions('Home')}
        />
        {/* {<Tab.Screen
          name="CompanyStack"
          component={CompanyStackNavigator}
          options={tabOptions('Company')}
        />} */}
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
        onDismiss={handleModalClose}
        backgroundStyle={styles.modalBackground}>
        {bottomSheetModal}
      </BottomSheetModal>
    </>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    opacity: 0.5,
  },
});

export default BottomTabNavigator;
