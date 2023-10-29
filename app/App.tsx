import 'react-native-dotenv';
import 'react-native-config';
import React from 'react';
// import {SafeAreaView, ScrollView, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigator from './src/Navigation/MainNavigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AuthState from './src/Context/AuthState';
import {KeyboardAvoidingView, Platform} from 'react-native';
import Config from 'react-native-config';

const RightPayApp = () => {
  const REACT_APP_API_BYPASS = Config.REACT_APP_API_BYPASS;
  console.log(REACT_APP_API_BYPASS);
  return (
    <AuthState>
      <SafeAreaProvider>
        <NavigationContainer>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}
            keyboardVerticalOffset={0}>
            <MainNavigator />
          </KeyboardAvoidingView>
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthState>
  );
};

export default RightPayApp;
