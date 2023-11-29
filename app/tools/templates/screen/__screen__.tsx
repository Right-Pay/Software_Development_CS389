import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PropsWithChildren } from 'react';
import React from 'react';
import WrapperView from '../../../src/Helpers/WrapperView';
import type {
  __stack__NavigationRoutesType,
  NavigationRoutesType,
} from '../../../types/NavigationRoutesType';
import __componentName__ from './__componentName__';

type __screen__ScreenProps = CompositeScreenProps<
  NativeStackScreenProps<__stack__NavigationRoutesType, '__screen__Screen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const __screen__Screen: React.FC<__screen__ScreenProps> = ({navigation}) => {
  return (
    <>
      <WrapperView>
        <__componentName__ navigation={navigation} />
      </WrapperView>
    </>
  );
};

export default __screen__Screen;
