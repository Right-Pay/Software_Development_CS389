import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { RouteProp } from '@react-navigation/native';
import React, { PropsWithChildren } from 'react';
import Icon from 'react-native-ionicons';
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
    tabBarIconStyle: {color: 'green'},
  };

  return options;
};

type TabBarType = {
  focused: boolean;
  color: string;
  size: number;
};

const tabBarIconFilter = (
  {focused, color, size}: TabBarType,
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
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarLabelStyle: {fontSize: 12, fontWeight: 'bold'},
        tabBarActiveBackgroundColor: '#e6ffe3',
        tabBarActiveTintColor: '#4d654e',
        tabBarInactiveBackgroundColor: '#4d654e',
        tabBarInactiveTintColor: '#e6ffe3',
        tabBarIcon: ({focused, color, size}) =>
          tabBarIconFilter({focused, color, size}, route),
        //tabBarStyle: {shadowColor: 'red'},
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
  );
};

export default BottomTabNavigator;
