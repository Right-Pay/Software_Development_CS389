import React from 'react';
import {View, Text} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {
  /*__screen__NavigationRoutesType,*/
  NavigationRoutesType,
} from '../../..__src__(camelCase)/types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import {styled} from 'nativewind';

type __screen__ScreenProps = CompositeScreenProps<
  NativeStackScreenProps<__screen__NavigationRoutesType, '__screen__Screen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const StylizedView = styled(View);
const StylizedText = styled(Text);

const __name__: React.FC<__screen__ScreenProps> = () => {
  return (
    <StylizedView className="flex-1 justify-center items-center text-center">
      <StylizedText>This is the __name__ component</StylizedText>
    </StylizedView>
  );
};

export default __name__;
