import 'react-native-dotenv';
import 'react-native-config';
import React, {useEffect, useState} from 'react';
// import {SafeAreaView, ScrollView, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigator from './src/Navigation/MainNavigator';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import AuthState from './src/Context/AuthState';
import {KeyboardAvoidingView, Platform} from 'react-native';
import {Keyboard} from 'react-native';

const RightPayApp = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  return (
    <AuthState>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <NavigationContainer>
          <KeyboardAvoidingView
            style={{
              flex: 1,
              justifyContent: 'center',
              flexDirection: 'column',
            }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            enabled={isKeyboardVisible}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 10}>
            <MainNavigator />
          </KeyboardAvoidingView>
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthState>
  );
};

export default RightPayApp;
