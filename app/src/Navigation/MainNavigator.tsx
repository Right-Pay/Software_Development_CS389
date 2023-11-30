import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {PropsWithChildren} from 'react';
import TopBar from '../Components/Header';
import CardSettings from '../Components/Screens/Settings/CardSettings';
import GeneralSettings from '../Components/Screens/Settings/GeneralSettings';
import ProfileSettings from '../Components/Screens/Settings/ProfileSettings';
import SettingsScreen from '../Components/Screens/Settings/Settings';
import ForgotPasswordScreen from '../Components/Screens/Welcome/ForgotPassword';
import LogInScreen from '../Components/Screens/Welcome/LogIn';
import SignUpScreen from '../Components/Screens/Welcome/SignUp';
import WelcomeScreen from '../Components/Screens/Welcome/Welcome';
import SplashScreen from '../Components/SplashScreen';
import AuthContext from '../Context/authContext';
import useColorsMode from '../Helpers/Colors';
import {AuthContextType} from '../types/AuthContextType';
import {
  MainNavigationRoutesType,
  SettingsNavigationRoutesType,
  WelcomeNavigationRoutesType,
} from '../types/NavigationRoutesType';
import BottomTabNavigator from './TabNavigator';

const WelcomeStack = createNativeStackNavigator<WelcomeNavigationRoutesType>();
const MainNavigatorStack =
  createNativeStackNavigator<MainNavigationRoutesType>();
const SettingsStack =
  createNativeStackNavigator<SettingsNavigationRoutesType>();

const screenOptionStyle = {
  headerShown: false,
};

const WelcomeNavigator: React.FC<PropsWithChildren> = () => {
  return (
    <WelcomeStack.Navigator
      initialRouteName="Welcome"
      screenOptions={screenOptionStyle}>
      <WelcomeStack.Screen name="Welcome" component={WelcomeScreen} />
      <WelcomeStack.Screen name="Login" component={LogInScreen} />
      <WelcomeStack.Screen name="Register" component={SignUpScreen} />
      <WelcomeStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
    </WelcomeStack.Navigator>
  );
};

const SettingsStackNavigator: React.FC<PropsWithChildren> = () => {
  const {colors} = useColorsMode();

  return (
    <SettingsStack.Navigator
      initialRouteName="SettingsScreen"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.secondary,
        },
        headerTintColor: colors.primary,
        headerBackTitle: 'Back',
        header: headerProps => TopBar(headerProps),
      }}>
      <SettingsStack.Screen name="SettingsScreen" component={SettingsScreen} />
      <SettingsStack.Screen
        name="ProfileSettings"
        component={ProfileSettings}
      />
      <SettingsStack.Screen
        name="GeneralSettings"
        component={GeneralSettings}
      />
      <SettingsStack.Screen name="CardSettings" component={CardSettings} />
    </SettingsStack.Navigator>
  );
};

const MainNavigator: React.FC<PropsWithChildren> = () => {
  const {isLoading, userToken} = React.useContext(
    AuthContext,
  ) as AuthContextType;
  if (isLoading) {
    return <SplashScreen />;
  }

  return userToken ? (
    <MainNavigatorStack.Navigator>
      <MainNavigatorStack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
        options={screenOptionStyle}
      />
      <MainNavigatorStack.Screen
        name="SettingsStack"
        component={SettingsStackNavigator}
        options={screenOptionStyle}
      />
    </MainNavigatorStack.Navigator>
  ) : (
    <WelcomeNavigator />
  );
};

export default MainNavigator;
