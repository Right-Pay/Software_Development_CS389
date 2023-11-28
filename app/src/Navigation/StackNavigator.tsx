import React, {PropsWithChildren} from 'react';
import HomeScreen from '../Components/Screens/Home/Home';
import ProfileScreen from '../Components/Screens/Profile/Profile';
import CompanyScreen from '../Components/Screens/Company/Company';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {
  HomeNavigationRoutesType,
  ProfileNavigationRoutesType,
  CompanyNavigationRoutesType,
  LocationNavigationRoutesType,
  NavigationRoutesType,
  WalletNavigationRoutesType,
} from '../types/NavigationRoutesType';
import SettingsScreen from '../Components/Screens/Profile/Settings/Settings';
import LocationScreen from '../Components/Screens/Location/Location';
import ProfileSettings from '../Components/Screens/Profile/Settings/ProfileSettings';
import {
  getFocusedRouteNameFromRoute,
  RouteProp,
} from '@react-navigation/native';
import type {
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import GeneralSettings from '../Components/Screens/Profile/Settings/GeneralSettings';
import WalletScreen from '../Components/Screens/Wallet/Wallet';
import CardSettings from '../Components/Screens/Profile/Settings/CardSettings';
import TopBar from '../Components/Header';

const HomeStack = createNativeStackNavigator<HomeNavigationRoutesType>();
const ProfileStack = createNativeStackNavigator<ProfileNavigationRoutesType>();
const CompanyStack = createNativeStackNavigator<CompanyNavigationRoutesType>();
const WalletStack = createNativeStackNavigator<WalletNavigationRoutesType>();
const LocationStack =
  createNativeStackNavigator<LocationNavigationRoutesType>();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: '#4d654e',
  },
  headerTintColor: '#e6ffe3',
};

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

const HomeStackNavigator: React.FC<StackProps> = props => {
  const {navigation, route} = props;
  React.useLayoutEffect(
    () => hideTabBar(navigation, route, 'HomeScreen'),
    [navigation, route],
  );

  return (
    <HomeStack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{...screenOptionStyle, header: TopBar(props).header}}>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{title: 'Home Screen'}}
      />
    </HomeStack.Navigator>
  );
};

const ProfileStackNavigator: React.FC<StackProps> = props => {
  const {navigation, route} = props;

  React.useLayoutEffect(
    () => hideTabBar(navigation, route, ''),
    [navigation, route],
  );

  return (
    <ProfileStack.Navigator
      initialRouteName="ProfileScreen"
      screenOptions={{...screenOptionStyle, header: TopBar(props).header}}>
      <ProfileStack.Group
        screenOptions={{
          ...screenOptionStyle,
          header: TopBar(props, 'ProfileStack').header,
        }}>
        <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
      </ProfileStack.Group>
      <ProfileStack.Group
        screenOptions={{
          ...screenOptionStyle,
          header: TopBar(props, 'SettingsStack').header,
        }}>
        <ProfileStack.Screen
          name="ProfileSettings"
          component={ProfileSettings}
        />
        <ProfileStack.Screen name="SettingsScreen" component={SettingsScreen} />
        <ProfileStack.Screen
          name="GeneralSettings"
          component={GeneralSettings}
        />
        <ProfileStack.Screen name="CardSettings" component={CardSettings} />
      </ProfileStack.Group>
    </ProfileStack.Navigator>
  );
};

const CompanyStackNavigator: React.FC<StackProps> = props => {
  const {navigation, route} = props;

  React.useLayoutEffect(
    () => hideTabBar(navigation, route, 'CompanyScreen'),
    [navigation, route],
  );
  return (
    <CompanyStack.Navigator
      initialRouteName="CompanyScreen"
      screenOptions={{...screenOptionStyle, header: TopBar(props).header}}>
      <CompanyStack.Screen name="CompanyScreen" component={CompanyScreen} />
    </CompanyStack.Navigator>
  );
};

const WalletStackNavigator: React.FC<StackProps> = props => {
  const {navigation, route} = props;

  React.useLayoutEffect(
    () => hideTabBar(navigation, route, 'ProfileScreen'),
    [navigation, route],
  );
  return (
    <WalletStack.Navigator
      initialRouteName="WalletScreen"
      screenOptions={{...screenOptionStyle, header: TopBar(props).header}}>
      <WalletStack.Screen name="WalletScreen" component={WalletScreen} />
    </WalletStack.Navigator>
  );
};

const LocationStackNavigator: React.FC<StackProps> = props => {
  const {navigation, route} = props;

  React.useLayoutEffect(
    () => hideTabBar(navigation, route, 'LocationScreen'),
    [navigation, route],
  );
  return (
    <LocationStack.Navigator
      initialRouteName="LocationScreen"
      screenOptions={{...screenOptionStyle, header: TopBar(props).header}}>
      <LocationStack.Screen name="LocationScreen" component={LocationScreen} />
    </LocationStack.Navigator>
  );
};

export {
  HomeStackNavigator,
  ProfileStackNavigator,
  CompanyStackNavigator,
  WalletStackNavigator,
  LocationStackNavigator,
};
