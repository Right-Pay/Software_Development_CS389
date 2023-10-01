import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {
  SearchNavigationRoutesType,
  NavigationRoutesType,
} from '../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';

type SearchScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SearchNavigationRoutesType, 'SearchScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const SearchScreen: React.FC<SearchScreenProps> = () => {
  return (
    <View style={styles.center}>
      <Text>This is the search screen</Text>
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

export default SearchScreen;
