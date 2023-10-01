import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {PropsWithChildren} from 'react';
import ForgotPasswordScreen from '../Components/Screens/ForgotPassword';
import LogInScreen from '../Components/Screens/LogIn';
import ResetPasswordScreen from '../Components/Screens/ResetPassword';
import SignUpScreen from '../Components/Screens/SignUp';
import SplashScreen from '../Components/Screens/SplashScreen';
import WelcomeScreen from '../Components/Screens/Welcome';
import AuthContext from '../Context/authContext';
import {AuthContextType} from '../types/AuthContextType';
import {WelcomeNavigationRoutesType} from '../types/NavigationRoutesType';
import BottomTabNavigator from './TabNavigator';

const WelcomeStack = createNativeStackNavigator<WelcomeNavigationRoutesType>();

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
      <WelcomeStack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
      />
    </WelcomeStack.Navigator>
  );
};

const MainNavigator: React.FC<PropsWithChildren> = () => {
  const {isLoading, userToken} = React.useContext(
    AuthContext,
  ) as AuthContextType;
  if (isLoading) {
    return <SplashScreen />;
  }
  return userToken ? <BottomTabNavigator /> : <WelcomeNavigator />;
};

export default MainNavigator;
