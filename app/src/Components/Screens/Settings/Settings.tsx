import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {PropsWithChildren} from 'react';
import React from 'react';
import type {
  NavigationRoutesType,
  SettingsNavigationRoutesType,
} from '../../../types/NavigationRoutesType';
import PrimaryText from '../../Common/PrimaryText';
import TitleText from '../../Common/TitleText';
import WrapperView from '../../Common/WrapperView';

type SettingsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<SettingsNavigationRoutesType, 'SettingsScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  return (
    <WrapperView>
      <TitleText className="mt-20">Settings</TitleText>
      <PrimaryText>This is the settings page</PrimaryText>
    </WrapperView>
  );
};

export default SettingsScreen;
