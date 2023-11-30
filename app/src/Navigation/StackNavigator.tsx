import type {
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import {
  RouteProp,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {PropsWithChildren} from 'react';
import TopBar from '../Components/Header';
import CompanyScreen from '../Components/Screens/Company/Company';
import HomeScreen from '../Components/Screens/Home/Home';
import LocationScreen from '../Components/Screens/Location/Location';
import ProfileScreen from '../Components/Screens/Profile/Profile';
import CardSettings from '../Components/Screens/Profile/Settings/CardSettings';
import GeneralSettings from '../Components/Screens/Profile/Settings/GeneralSettings';
import ProfileSettings from '../Components/Screens/Profile/Settings/ProfileSettings';
import WalletScreen from '../Components/Screens/Wallet/Wallet';
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
      screenOptions={{
        ...screenOptionStyle,
        header: headerProps => TopBar(headerProps),
      }}>
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
      <ProfileStack.Group
        screenOptions={{
          ...screenOptionStyle,
          header: headerProps => TopBar(headerProps),
        }}>
        <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
      </ProfileStack.Group>
      <ProfileStack.Group
        screenOptions={{
          ...screenOptionStyle,
          header: headerProps => TopBar(headerProps),
        }}>
        <ProfileStack.Screen
          name="ProfileSettings"
          component={ProfileSettings}
        />
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
      screenOptions={{
        ...screenOptionStyle,
        header: headerProps => TopBar(headerProps),
      }}>
      <CompanyStack.Screen name="CompanyScreen" component={CompanyScreen} />
    </CompanyStack.Navigator>
  );
};

const WalletStackNavigator: React.FC<StackProps> = props => {
  const {navigation, route} = props;

  React.useLayoutEffect(
    () => hideTabBar(navigation, route, 'WalletScreen'),
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

const LocationStackNavigator: React.FC<StackProps> = props => {
  const {navigation, route} = props;

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
  CompanyStackNavigator,
  HomeStackNavigator,
  LocationStackNavigator,
  ProfileStackNavigator,
  WalletStackNavigator,
};
