import React, {PropsWithChildren} from 'react';
import HomeScreen from '../Components/Screens/Home/Home';
import ProfileScreen from '../Components/Screens/Profile/Profile';
import CompanyScreen from '../Components/Screens/Company/Company';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {
  HomeNavigationRoutesType,
  ProfileNavigationRoutesType,
  CompanyNavigationRoutesType,
  SearchNavigationRoutesType,
  LocationNavigationRoutesType,
  NavigationRoutesType,
} from '../types/NavigationRoutesType';
import SearchScreen from '../Components/Screens/Search/Search';
import SearchSettingsScreen from '../Components/Screens/Search/SearchSettings';
import LocationScreen from '../Components/Screens/Location/Location';
import ProfileSettings from '../Components/Screens/Profile/ProfileSettings';
import Context from '../Context/context';
import {AppContext} from '../types/AppContextType';
import {
  getFocusedRouteNameFromRoute,
  RouteProp,
} from '@react-navigation/native';
import type {
  BottomTabNavigationProp,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import LocationSettings from '../Components/Screens/Location/LocationSettings';

const HomeStack = createNativeStackNavigator<HomeNavigationRoutesType>();
const ProfileStack = createNativeStackNavigator<ProfileNavigationRoutesType>();
const CompanyStack = createNativeStackNavigator<CompanyNavigationRoutesType>();
const SearchStack = createNativeStackNavigator<SearchNavigationRoutesType>();
const LocationStack =
  createNativeStackNavigator<LocationNavigationRoutesType>();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: '#4d654e',
  },
  headerTintColor: '#e6ffe3',
  headerBackTitle: 'Back',
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

const HomeStackNavigator: React.FC<StackProps> = ({navigation, route}) => {
  const {address} = React.useContext(Context) as AppContext;
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
  const {address} = React.useContext(Context) as AppContext;
  React.useLayoutEffect(
    () => hideTabBar(navigation, route, 'ProfileScreen'),
    [navigation, route],
  );
  return (
    <ProfileStack.Navigator
      initialRouteName="ProfileScreen"
      screenOptions={{
        ...screenOptionStyle,
        headerTitle: address ? address.displayName.text : '',
      }}>
      <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
      <ProfileStack.Screen name="ProfileSettings" component={ProfileSettings} />
    </ProfileStack.Navigator>
  );
};

const CompanyStackNavigator: React.FC<StackProps> = ({navigation, route}) => {
  const {address} = React.useContext(Context) as AppContext;
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

const SearchStackNavigator: React.FC<StackProps> = ({navigation, route}) => {
  const {address} = React.useContext(Context) as AppContext;
  React.useLayoutEffect(
    () => hideTabBar(navigation, route, 'SearchScreen'),
    [navigation, route],
  );
  return (
    <SearchStack.Navigator
      screenOptions={{
        ...screenOptionStyle,
        headerTitle: address ? address.displayName.text : '',
      }}>
      <SearchStack.Screen name="SearchScreen" component={SearchScreen} />
      <SearchStack.Screen
        name="SearchSettingsScreen"
        component={SearchSettingsScreen}
      />
    </SearchStack.Navigator>
  );
};

const LocationStackNavigator: React.FC<StackProps> = ({navigation, route}) => {
  const {address} = React.useContext(Context) as AppContext;
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
      <LocationStack.Screen
        name="LocationSettings"
        component={LocationSettings}
      />
    </LocationStack.Navigator>
  );
};

export {
  HomeStackNavigator,
  ProfileStackNavigator,
  CompanyStackNavigator,
  SearchStackNavigator,
  LocationStackNavigator,
};
