import React, { useEffect, useState } from 'react';
import 'react-native-config';
import 'react-native-dotenv';
// import {SafeAreaView, ScrollView, StatusBar} from 'react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  useColorScheme as useNativeColorScheme,
} from 'react-native';
import 'react-native-config';
import 'react-native-dotenv';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import MainNavigator from './src/Navigation/MainNavigator';
import LanguageState from './src/Context/LanguageState';

const RightPayApp = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const { setColorScheme } = useColorScheme();
  const theme = useNativeColorScheme();

  useEffect(() => {
    if (theme === 'dark') {
      setColorScheme('dark');
    } else {
      setColorScheme('light');
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
    <LanguageState>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <GestureHandlerRootView style={styles.gestureHandlerRootView}>
          <NavigationContainer>
            <BottomSheetModalProvider>
              <MainNavigator />
            </BottomSheetModalProvider>
          </NavigationContainer>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </LanguageState>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    zIndex: 0,
  },
  gestureHandlerRootView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default RightPayApp;
