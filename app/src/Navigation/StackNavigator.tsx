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
import TopBar from '../Components/Header';
import HomeScreen from '../Components/Screens/Home/Home';
import LocationScreen from '../Components/Screens/Location/Location';
import ProfileScreen from '../Components/Screens/Profile/Profile';
import WalletScreen from '../Components/Screens/Wallet/Wallet';
import useColorsMode, { DarkColors, LightColors } from '../Helpers/Colors';
import type {
  HomeNavigationRoutesType,
  LocationNavigationRoutesType,
  NavigationRoutesType,
  ProfileNavigationRoutesType,
  WalletNavigationRoutesType
} from '../types/NavigationRoutesType';

const HomeStack = createNativeStackNavigator<HomeNavigationRoutesType>();
const ProfileStack = createNativeStackNavigator<ProfileNavigationRoutesType>();
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
    navigation.setOptions({ tabBarStyle: { display: 'flex' } });
  } else {
    navigation.setOptions({ tabBarStyle: { display: 'none' } });
  }
};

const screenOptionStyleLight = {
  headerStyle: {
    backgroundColor: LightColors.secondary,
  },
  headerTintColor: LightColors.primary,
  headerBackTitle: 'Back',
};

const screenOptionStyleDark = {
  headerStyle: {
    backgroundColor: DarkColors.secondary,
  },
  headerTintColor: DarkColors.primary,
  headerBackTitle: 'Back',
};

type StackProps = BottomTabScreenProps<NavigationRoutesType> &
  PropsWithChildren;

const HomeStackNavigator: React.FC<StackProps> = ({ navigation, route }) => {
  const { themeMode } = useColorsMode();

  const screenOptionStyle =
    themeMode === 'dark' ? screenOptionStyleDark : screenOptionStyleLight;

  React.useLayoutEffect(
    () => hideTabBar(navigation, route, 'HomeScreen'),
    [navigation, route],
  );

  return (
    <HomeStack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        ...screenOptionStyle,
        header: headerProps => TopBar(headerProps),
      }}>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: 'Home Screen' }}
      />
    </HomeStack.Navigator>
  );
};

const ProfileStackNavigator: React.FC<StackProps> = ({ navigation, route }) => {
  const { themeMode } = useColorsMode();

  const screenOptionStyle =
    themeMode === 'dark' ? screenOptionStyleDark : screenOptionStyleLight;

  React.useLayoutEffect(
    () => hideTabBar(navigation, route, 'ProfileScreen'),
    [navigation, route],
  );

  return (
    <ProfileStack.Navigator
      initialRouteName="ProfileScreen"
      screenOptions={{
        ...screenOptionStyle,
        header: headerProps => TopBar(headerProps),
      }}>
      <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
};

const WalletStackNavigator: React.FC<StackProps> = ({ navigation, route }) => {
  const { themeMode } = useColorsMode();

  const screenOptionStyle =
    themeMode === 'dark' ? screenOptionStyleDark : screenOptionStyleLight;

  React.useLayoutEffect(
    () => hideTabBar(navigation, route, 'ProfileScreen'),
    [navigation, route],
  );
  return (
    <WalletStack.Navigator
      initialRouteName="WalletScreen"
      screenOptions={{
        ...screenOptionStyle,
        header: headerProps => TopBar(headerProps),
      }}>
      <WalletStack.Screen name="WalletScreen" component={WalletScreen} />
    </WalletStack.Navigator>
  );
};

const LocationStackNavigator: React.FC<StackProps> = ({
  navigation,
  route,
}) => {
  const { themeMode } = useColorsMode();

  const screenOptionStyle =
    themeMode === 'dark' ? screenOptionStyleDark : screenOptionStyleLight;

  React.useLayoutEffect(
    () => hideTabBar(navigation, route, 'LocationScreen'),
    [navigation, route],
  );
  return (
    <LocationStack.Navigator
      initialRouteName="LocationScreen"
      screenOptions={{
        ...screenOptionStyle,
        header: headerProps => TopBar(headerProps),
      }}>
      <LocationStack.Screen name="LocationScreen" component={LocationScreen} />
    </LocationStack.Navigator>
  );
};

export {
  HomeStackNavigator,
  LocationStackNavigator,
  ProfileStackNavigator,
  // eslint-disable-next-line prettier/prettier
  WalletStackNavigator
};
//
