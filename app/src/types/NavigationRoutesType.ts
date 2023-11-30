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
  CompanyStack: NavigatorScreenParams<CompanyNavigationRoutesType>;
  WalletStack: NavigatorScreenParams<WalletNavigationRoutesType>;
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
  GeneralSettings: undefined;
  CardSettings: undefined;
};

export type CompanyNavigationRoutesType = {
  CompanyScreen: undefined;
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
  CompanyScreen = 'CompanyScreen',
  WalletScreen = 'WalletScreen',
  LocationScreen = 'LocationScreen',
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends NavigationRoutesType {}
  }
}
