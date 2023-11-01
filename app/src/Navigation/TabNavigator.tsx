import React, {PropsWithChildren} from 'react';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  HomeStackNavigator,
  ProfileStackNavigator,
  LocationStackNavigator,
  WalletStackNavigator,
} from './StackNavigator';
import {NavigationRoutesType} from '../types/NavigationRoutesType';

const Tab = createBottomTabNavigator<NavigationRoutesType>();

const tabOptions = (label: string) => {
  const options: BottomTabNavigationOptions = {
    tabBarLabel: label,
    tabBarIconStyle: {color: 'green'},
  };

  return options;
};

const BottomTabNavigator: React.FC<PropsWithChildren> = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {fontSize: 12, fontWeight: 'bold'},
        tabBarActiveBackgroundColor: '#e6ffe3',
        tabBarActiveTintColor: '#4d654e',
        tabBarInactiveBackgroundColor: '#4d654e',
        tabBarInactiveTintColor: '#e6ffe3',
        //tabBarStyle: {shadowColor: 'red'},
      }}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={tabOptions('Home')}
      />
      <Tab.Screen
        name="WalletStack"
        component={WalletStackNavigator}
        options={tabOptions('Home')}
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
