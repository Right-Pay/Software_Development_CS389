import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import type {PropsWithChildren} from 'react';

const SplashScreen: React.FC<PropsWithChildren> = () => {
  return (
    <View style={styles.splashScreenView}>
      <Text style={styles.title}>Welcome to RightPay</Text>
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  splashScreenView: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    marginTop: 20,
    marginLeft: 20,
    fontSize: 30,
  },
  text: {
    padding: 10,
    fontSize: 20,
  },
});

export default SplashScreen;
