import type {
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import {
  RouteProp,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';
import CompanyScreen from '../Components/Screens/Company/Company';
import HomeScreen from '../Components/Screens/Home/Home';
import LocationScreen from '../Components/Screens/Location/Location';
import ProfileScreen from '../Components/Screens/Profile/Profile';
import CardSettings from '../Components/Screens/Profile/Settings/CardSettings';
import GeneralSettings from '../Components/Screens/Profile/Settings/GeneralSettings';
import ProfileSettings from '../Components/Screens/Profile/Settings/ProfileSettings';
import SettingsScreen from '../Components/Screens/Profile/Settings/Settings';
import WalletScreen from '../Components/Screens/Wallet/Wallet';
import locationContext from '../Context/locationContext';
import { darkColors, lightColors } from '../Helpers/Colors';
import { LocationContext } from '../types/LocationContextType';
import type {
  CompanyNavigationRoutesType,
  HomeNavigationRoutesType,
  LocationNavigationRoutesType,
  NavigationRoutesType,
  ProfileNavigationRoutesType,
  WalletNavigationRoutesType,
} from '../types/NavigationRoutesType';

const HomeStack = createNativeStackNavigator<HomeNavigationRoutesType>();
const ProfileStack = createNativeStackNavigator<ProfileNavigationRoutesType>();
const CompanyStack = createNativeStackNavigator<CompanyNavigationRoutesType>();
const WalletStack = createNativeStackNavigator<WalletNavigationRoutesType>();
const LocationStack =
  createNativeStackNavigator<LocationNavigationRoutesType>();

const hideTabBar = (
  navigation: BottomTabNavigationProp<NavigationRoutesType>,
  route: RouteProp<NavigationRoutesType>,
  screenToNotHide: string | undefined,
): void => {
  const routeName = getFocusedRouteNameFromRoute(route);
  if (routeName === screenToNotHide || routeName === undefined) {
    navigation.setOptions({tabBarStyle: {display: 'flex'}});
  } else {
    navigation.setOptions({tabBarStyle: {display: 'none'}});
  }
};

type StackProps = BottomTabScreenProps<NavigationRoutesType> &
  PropsWithChildren;

const HomeStackNavigator: React.FC<StackProps> = ({navigation, route}) => {
  const {address} = React.useContext(locationContext) as LocationContext;
  const theme = useColorScheme();
  const isDarkTheme = theme === 'dark';
  const colors = isDarkTheme ? darkColors : lightColors;

  const screenOptionStyle = {
    headerStyle: {
      backgroundColor: colors.secondary,
    },
    headerTintColor: colors.primary,
    headerBackTitle: 'Back',
  };

  React.useLayoutEffect(
    () => hideTabBar(navigation, route, 'HomeScreen'),
    [navigation, route],
  );

  return (
    <HomeStack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        ...screenOptionStyle,
        headerTitle: address ? address.displayName.text : '',
      }}>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{title: 'Home Screen'}}
      />
    </HomeStack.Navigator>
  );
};

const ProfileStackNavigator: React.FC<StackProps> = ({navigation, route}) => {
  const {address} = React.useContext(locationContext) as LocationContext;
  const theme = useColorScheme();
  const isDarkTheme = theme === 'dark';
  const colors = isDarkTheme ? darkColors : lightColors;

  const screenOptionStyle = {
    headerStyle: {
      backgroundColor: colors.secondary,
    },
    headerTintColor: colors.primary,
    headerBackTitle: 'Back',
  };
  React.useLayoutEffect(
    () => hideTabBar(navigation, route, 'ProfileScreen'),
    [navigation, route],
  );

  return (
    <ProfileStack.Navigator
      initialRouteName="ProfileScreen"
      screenOptions={{
        ...screenOptionStyle,
        headerTitle: 'Settings',
      }}>
      <ProfileStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{headerTitle: address ? address.displayName.text : ''}}
      />
      <ProfileStack.Screen name="ProfileSettings" component={ProfileSettings} />
      <ProfileStack.Screen name="SettingsScreen" component={SettingsScreen} />
      <ProfileStack.Screen name="GeneralSettings" component={GeneralSettings} />
      <ProfileStack.Screen name="CardSettings" component={CardSettings} />
    </ProfileStack.Navigator>
  );
};

const CompanyStackNavigator: React.FC<StackProps> = ({navigation, route}) => {
  const {address} = React.useContext(locationContext) as LocationContext;
  const theme = useColorScheme();
  const isDarkTheme = theme === 'dark';
  const colors = isDarkTheme ? darkColors : lightColors;

  const screenOptionStyle = {
    headerStyle: {
      backgroundColor: colors.secondary,
    },
    headerTintColor: colors.primary,
    headerBackTitle: 'Back',
  };
  React.useLayoutEffect(
    () => hideTabBar(navigation, route, 'CompanyScreen'),
    [navigation, route],
  );
  return (
    <CompanyStack.Navigator
      screenOptions={{
        ...screenOptionStyle,
        headerTitle: address ? address.displayName.text : '',
      }}>
      <CompanyStack.Screen name="CompanyScreen" component={CompanyScreen} />
    </CompanyStack.Navigator>
  );
};

const WalletStackNavigator: React.FC<StackProps> = ({navigation, route}) => {
  const {address} = React.useContext(locationContext) as LocationContext;
  const theme = useColorScheme();
  const isDarkTheme = theme === 'dark';
  const colors = isDarkTheme ? darkColors : lightColors;

  const screenOptionStyle = {
    headerStyle: {
      backgroundColor: colors.secondary,
    },
    headerTintColor: colors.primary,
    headerBackTitle: 'Back',
  };
  React.useLayoutEffect(
    () => hideTabBar(navigation, route, 'ProfileScreen'),
    [navigation, route],
  );
  return (
    <WalletStack.Navigator
      screenOptions={{
        ...screenOptionStyle,
        headerTitle: address ? address.displayName.text : '',
      }}>
      <WalletStack.Screen name="WalletScreen" component={WalletScreen} />
    </WalletStack.Navigator>
  );
};

const LocationStackNavigator: React.FC<StackProps> = ({navigation, route}) => {
  const {address} = React.useContext(locationContext) as LocationContext;
  const theme = useColorScheme();
  const isDarkTheme = theme === 'dark';
  const colors = isDarkTheme ? darkColors : lightColors;

  const screenOptionStyle = {
    headerStyle: {
      backgroundColor: colors.secondary,
    },
    headerTintColor: colors.primary,
    headerBackTitle: 'Back',
  };
  React.useLayoutEffect(
    () => hideTabBar(navigation, route, 'LocationScreen'),
    [navigation, route],
  );
  return (
    <LocationStack.Navigator
      screenOptions={{
        ...screenOptionStyle,
        headerTitle: address ? address.displayName.text : '',
      }}>
      <LocationStack.Screen name="LocationScreen" component={LocationScreen} />
    </LocationStack.Navigator>
  );
};

export {
  CompanyStackNavigator,
  HomeStackNavigator,
  LocationStackNavigator,
  ProfileStackNavigator,
  WalletStackNavigator
};

