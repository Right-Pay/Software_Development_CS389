import React from 'react';
import type {PropsWithChildren} from 'react';
import type {
  ProfileNavigationRoutesType,
  NavigationRoutesType,
} from '../../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import {WrapperView} from '../../../../Helpers/StylizedComponents';

type NotificationSettingsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileNavigationRoutesType, 'NotificationSettings'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const NotificationSettings: React.FC<NotificationSettingsScreenProps> = ({
  navigation,
}) => {
  return (
    <>
      <WrapperView />
    </>
  );
};

export default NotificationSettings;
