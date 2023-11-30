import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PropsWithChildren } from 'react';
import {
  HomeNavigationRoutesType,
  NavigationRoutesType,
} from './NavigationRoutesType';

type ComponentPropType = CompositeScreenProps<
  NativeStackScreenProps<HomeNavigationRoutesType, 'HomeScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

export default ComponentPropType;
