import React from 'react';
import {View, Text} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {
  SearchNavigationRoutesType,
  NavigationRoutesType,
} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import {styled} from 'nativewind';

type SearchScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SearchNavigationRoutesType, 'SearchScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const StylizedView = styled(View);
const StylizedText = styled(Text);

const SearchUi: React.FC<SearchScreenProps> = () => {
  return (
    <StylizedView className="flex-1 justify-center items-center text-center">
      <StylizedText>This is the SearchUi component</StylizedText>
    </StylizedView>
  );
};

export default SearchUi;
