import React from 'react';
import type { PropsWithChildren } from 'react';
import type {
  __stack__NavigationRoutesType,
  NavigationRoutesType,
} from '../../../types/NavigationRoutesType';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import __componentName__ from './__componentName__';
import { WrapperView } from '../../../src/Helpers/StylizedComponents';

type __screen__ScreenProps = CompositeScreenProps<
  NativeStackScreenProps<__stack__NavigationRoutesType, '__screen__Screen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const __screen__Screen: React.FC<__screen__ScreenProps> = ({ navigation }) => {
  return (
    <>
      <WrapperView>
        <__componentName__ navigation={navigation} />
      </WrapperView>
    </>
  );
};

export default __screen__Screen;
