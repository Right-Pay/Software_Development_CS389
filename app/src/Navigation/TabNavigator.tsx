import React, {PropsWithChildren} from 'react';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  HomeStackNavigator,
  CompanyStackNavigator,
  ProfileStackNavigator,
  SearchStackNavigator,
  LocationStackNavigator,
} from './StackNavigator';
import {NavigationRoutesType} from '../types/NavigationRoutesType';

const Tab = createBottomTabNavigator<NavigationRoutesType>();

const tabOptions = (label: string) => {
  const options: BottomTabNavigationOptions = {
    tabBarLabel: label,
    tabBarLabelStyle: {fontSize: 12, fontWeight: 'bold', color: 'green'},
    tabBarIconStyle: {color: 'green'},
  };

  return options;
};

const BottomTabNavigator: React.FC<PropsWithChildren> = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveBackgroundColor: '#c7c7c7',
        tabBarActiveTintColor: 'green',
      }}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={tabOptions('Home')}
      />
      <Tab.Screen
        name="CompanyStack"
        component={CompanyStackNavigator}
        options={tabOptions('Company')}
      />
      <Tab.Screen
        name="SearchStack"
        component={SearchStackNavigator}
        options={tabOptions('Search')}
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
