import React from 'react';
import type {PropsWithChildren} from 'react';
import type {
  __screen__NavigationRoutesType,
  NavigationRoutesType,
} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import {styled} from 'nativewind';
import {View} from 'react-native';
import __componentName__ from './__componentName__';

type __screen__ScreenProps = CompositeScreenProps<
  NativeStackScreenProps<__screen__NavigationRoutesType, '__screen__Screen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const StylizedView = styled(View);

const __screen__Screen: React.FC<__screen__ScreenProps> = ({navigation}) => {
  return (
    <>
      <StylizedView>
        <__componentName__ navigation={navigation} />
      </StylizedView>
    </>
  );
};

export default __screen__Screen;
