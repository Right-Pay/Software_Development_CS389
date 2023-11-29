import React, { useEffect, useState } from 'react';
import 'react-native-config';
import 'react-native-dotenv';
// import {SafeAreaView, ScrollView, StatusBar} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  useColorScheme as useNativeColorScheme,
} from 'react-native';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import AuthState from './src/Context/AuthState';
import MainNavigator from './src/Navigation/MainNavigator';

const RightPayApp = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const {colorScheme, setColorScheme} = useColorScheme();
  const theme = useNativeColorScheme();

  useEffect(() => {
    if (theme === 'dark') {
      setColorScheme('dark');
      console.log('dark theme');
    } else {
      setColorScheme('light');
      console.log('light theme');
    }
  }, [theme, setColorScheme]);

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
            style={styles.keyboardAvoidingView}
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

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    zIndex: 0,
  },
});

export default RightPayApp;
