import { NavigatorScreenParams } from '@react-navigation/native';

export type WelcomeNavigationRoutesType = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  VerifyEmail: undefined;
};

export type NavigationRoutesType = {
  HomeStack: NavigatorScreenParams<HomeNavigationRoutesType>;
  ProfileStack: NavigatorScreenParams<ProfileNavigationRoutesType>;
  WalletStack: NavigatorScreenParams<WalletNavigationRoutesType>;
  LocationStack: NavigatorScreenParams<LocationNavigationRoutesType>;
};

export type MainNavigationRoutesType = {
  BottomTabNavigator: NavigatorScreenParams<NavigationRoutesType>;
  SettingsStack: NavigatorScreenParams<SettingsNavigationRoutesType>;
};

export type HomeNavigationRoutesType = {
  HomeScreen: undefined;
  // ie: Profile: { userId: string };
  // for more info: https://reactnavigation.org/docs/typescript/
};

export type ProfileNavigationRoutesType = {
  ProfileScreen: undefined;
};

export type SettingsNavigationRoutesType = {
  SettingsScreen: undefined;
  ProfileSettings: undefined;
  GeneralSettings: undefined;
  CardSettings: undefined;
};

export type WalletNavigationRoutesType = {
  WalletScreen: undefined;
};

export type LocationNavigationRoutesType = {
  LocationScreen: undefined;
};

export enum MainNavigationRoutesEnum {
  HomeScreen = 'HomeScreen',
  ProfileScreen = 'ProfileScreen',
  WalletScreen = 'WalletScreen',
  LocationScreen = 'LocationScreen',
}
