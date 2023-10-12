import 'react-native-dotenv';
import 'react-native-config';
import React from 'react';
// import {SafeAreaView, ScrollView, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigator from './src/Navigation/MainNavigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AuthState from './src/Context/AuthState';

const RightPayApp = () => {
  return (
    <AuthState>
      <SafeAreaProvider>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthState>
  );
};

export default RightPayApp;
