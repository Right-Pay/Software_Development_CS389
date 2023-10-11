import React from 'react';
import type {PropsWithChildren} from 'react';
import type {
  SearchNavigationRoutesType,
  NavigationRoutesType,
} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import {styled} from 'nativewind';
import {View} from 'react-native';
import SearchText from './SearchText';

type SearchSettingsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SearchNavigationRoutesType, 'SearchSettingsScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const StylizedView = styled(View);

const SearchSettingsScreen: React.FC<SearchSettingsScreenProps> = ({
  navigation,
}) => {
  return (
    <>
      <StylizedView>
        <SearchText navigation={navigation} />
      </StylizedView>
    </>
  );
};

export default SearchSettingsScreen;
