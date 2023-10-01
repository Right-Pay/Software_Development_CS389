import 'react-native-dotenv';
import 'react-native-config';
import React from 'react';
// import {SafeAreaView, ScrollView, StatusBar} from 'react-native';
import GlobalState from './src/Context/GlobalState';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigator from './src/Navigation/MainNavigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const RightPayApp = () => {
  return (
    <GlobalState>
      <SafeAreaProvider>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GlobalState>
  );
};

export default RightPayApp;
