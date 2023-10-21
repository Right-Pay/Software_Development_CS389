import React from 'react';
import type {PropsWithChildren} from 'react';
import type {
  SearchNavigationRoutesType,
  NavigationRoutesType,
} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import SearchText from './SearchText';
import {WrapperView} from '../../../Helpers/StylizedComponents';

type SearchScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SearchNavigationRoutesType, 'SearchScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const SearchScreen: React.FC<SearchScreenProps> = ({navigation}) => {
  return (
    <>
      <WrapperView>
        <SearchText navigation={navigation} />
      </WrapperView>
    </>
  );
};

export default SearchScreen;
