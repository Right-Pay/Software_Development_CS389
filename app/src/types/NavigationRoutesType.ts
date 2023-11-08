import {NavigatorScreenParams} from '@react-navigation/native';

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
  CompanyStack: NavigatorScreenParams<CompanyNavigationRoutesType>;
  SearchStack: NavigatorScreenParams<SearchNavigationRoutesType>;
  LocationStack: NavigatorScreenParams<LocationNavigationRoutesType>;
};

export type HomeNavigationRoutesType = {
  HomeScreen: undefined;
  // ie: Profile: { userId: string };
  // for more info: https://reactnavigation.org/docs/typescript/
};

export type ProfileNavigationRoutesType = {
  ProfileScreen: undefined;
  ProfileSettings: undefined;
  SettingsScreen: undefined;
  LocationSettings: undefined;
  NotificationSettings: undefined;
  CreditCardSettings: undefined;
};

export type CompanyNavigationRoutesType = {
  CompanyScreen: undefined;
};

export type SearchNavigationRoutesType = {
  SearchScreen: undefined;
};

export type LocationNavigationRoutesType = {
  LocationScreen: undefined;
};
