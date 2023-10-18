import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {PropsWithChildren} from 'react';
import ForgotPasswordScreen from '../Components/Screens/Welcome/ForgotPassword';
import LogInScreen from '../Components/Screens/Welcome/LogIn';
import ResetPasswordScreen from '../Components/Screens/Welcome/ResetPassword';
import SignUpScreen from '../Components/Screens/Welcome/SignUp';
import SplashScreen from '../Components/SplashScreen';
import WelcomeScreen from '../Components/Screens/Welcome/Welcome';
import VerifyEmailScreen from '../Components/Screens/Welcome/VerifyEmail';
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
      <WelcomeStack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
    </WelcomeStack.Navigator>
  );
};

const MainNavigator: React.FC<PropsWithChildren> = () => {
  const {isLoading, isSignedIn} = React.useContext(
    AuthContext,
  ) as AuthContextType;

  if (isLoading) {
    return <SplashScreen />;
  }
  return isSignedIn ? <BottomTabNavigator /> : <WelcomeNavigator />;
};

export default MainNavigator;
