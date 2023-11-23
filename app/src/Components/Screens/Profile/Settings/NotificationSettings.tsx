import React from 'react';
import type {PropsWithChildren} from 'react';
import type {
  ProfileNavigationRoutesType,
  NavigationRoutesType,
} from '../../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import {
  SettingsSubtitle,
  SettingsView,
  Title,
  WrapperView,
} from '../../../../Helpers/StylizedComponents';
import KeyboardAvoidingViewScroll from '../../../../Helpers/KeyboardAvoidingViewScroll';

type NotificationSettingsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileNavigationRoutesType, 'NotificationSettings'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const NotificationSettings: React.FC<NotificationSettingsScreenProps> = ({
  navigation,
}) => {
  return (
    <WrapperView className="pb-0">
      <KeyboardAvoidingViewScroll>
        <Title className="mt-10 mb-3">Notification Settings</Title>
        <SettingsView>
          <SettingsSubtitle>
            As of now we do not send any notifications
          </SettingsSubtitle>
        </SettingsView>
      </KeyboardAvoidingViewScroll>
    </WrapperView>
  );
};

export default NotificationSettings;
