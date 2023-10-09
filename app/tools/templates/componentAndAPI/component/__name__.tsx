/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {
  /*__screen__NavigationRoutesType,*/
  NavigationRoutesType,
} from '../../..__src__(camelCase)/types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';

type __screen__ScreenProps = /*CompositeScreenProps<
NativeStackScreenProps<__screen__NavigationRoutesType, '__screen__Screen'>,*/
BottomTabScreenProps<NavigationRoutesType>
/*>*/ &
PropsWithChildren;

const __name__: React.FC<__screen__ScreenProps> = () => {
  return (
    <View style={styles.center}>
      <Text>This is the __name__ component</Text>
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

export default __name__;
