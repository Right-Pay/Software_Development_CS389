import React, {PropsWithChildren} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  HomeStackNavigator,
  CompanyStackNavigator,
  ProfileStackNavigator,
  LocationStackNavigator,
  WalletStackNavigator,
} from './StackNavigator';
import {NavigationRoutesType} from '../types/NavigationRoutesType';

const Tab = createBottomTabNavigator<NavigationRoutesType>();

const BottomTabNavigator: React.FC<PropsWithChildren> = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name="HomeStack" component={HomeStackNavigator} />
      <Tab.Screen name="CompanyStack" component={CompanyStackNavigator} />
      <Tab.Screen name="WalletStack" component={WalletStackNavigator} />
      <Tab.Screen name="LocationStack" component={LocationStackNavigator} />
      <Tab.Screen name="ProfileStack" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
