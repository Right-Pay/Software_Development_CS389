import React from 'react';
import type {PropsWithChildren} from 'react';
import type {
  NavigationRoutesType,
  ProfileNavigationRoutesType,
} from '../../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import {
  MainButtonText,
  MainButton,
  Subtitle,
  Title,
  WrapperView,
} from '../../../../Helpers/StylizedComponents';
import KeyboardAvoidingViewScroll from '../../../../Helpers/KeyboardAvoidingViewScroll';

type LocationSettingsProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileNavigationRoutesType, 'LocationSettings'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const LocationSettings: React.FC<LocationSettingsProps> = ({navigation}) => {
  return (
    <WrapperView className="pb-0">
      <KeyboardAvoidingViewScroll>
        <Title className="mt-20">This is the location setttings</Title>

        <MainButton onPress={() => navigation.goBack()}>
          <MainButtonText>Go back</MainButtonText>
        </MainButton>
      </KeyboardAvoidingViewScroll>
    </WrapperView>
  );
};

export default LocationSettings;
