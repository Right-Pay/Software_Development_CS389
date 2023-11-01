import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {PropsWithChildren} from 'react';
import ForgotPasswordScreen from '../Components/Screens/Welcome/ForgotPassword';
import LogInScreen from '../Components/Screens/Welcome/LogIn';
import SignUpScreen from '../Components/Screens/Welcome/SignUp';
import SplashScreen from '../Components/SplashScreen';
import WelcomeScreen from '../Components/Screens/Welcome/Welcome';
import AuthContext from '../Context/authContext';
import {AuthContextType} from '../types/AuthContextType';
import {WelcomeNavigationRoutesType} from '../types/NavigationRoutesType';
import BottomTabNavigator from './TabNavigator';
import Config from 'react-native-config';
import Consts from '../Helpers/Consts';

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
    </WelcomeStack.Navigator>
  );
};

const MainNavigator: React.FC<PropsWithChildren> = () => {
  const apiBypass = Config.REACT_APP_API_BYPASS;
  const {isLoading, setIsLoading, userToken, setUserToken, setUserProfile} =
    React.useContext(AuthContext) as AuthContextType;
  if (true) {
    setIsLoading(false);
    setUserToken('testToken');
    setUserProfile(Consts.dummyProfile);
  }
  if (isLoading) {
    return <SplashScreen />;
  }
  return userToken ? <BottomTabNavigator /> : <WelcomeNavigator />;
};

export default MainNavigator;
