/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {
  /*__name__NavigationRoutesType,*/
  NavigationRoutesType,
} from '../../..__src__(camelCase)/types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';

type __name__ScreenProps = /*CompositeScreenProps<
NativeStackScreenProps<__name__NavigationRoutesType, '__name__Screen'>,*/
BottomTabScreenProps<NavigationRoutesType>
/*>*/ &
PropsWithChildren;

const __name__Screen: React.FC<__name__ScreenProps> = () => {
  return (
    <View style={styles.center}>
      <Text>This is the __name__ screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
});

export default __name__Screen;
