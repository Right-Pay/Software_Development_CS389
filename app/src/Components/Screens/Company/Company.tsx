import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {CompanyNavigationRoutesType} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

type CompanyScreenProps = NativeStackScreenProps<
  CompanyNavigationRoutesType,
  'CompanyScreen'
> &
  PropsWithChildren;

const CompanyScreen: React.FC<CompanyScreenProps> = () => {
  return (
    <View style={styles.center}>
      <Text>This is the company screen... what this for????</Text>
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

export default CompanyScreen;
