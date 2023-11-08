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

type LocationSettingsProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileNavigationRoutesType, 'LocationSettings'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const LocationSettings: React.FC<LocationSettingsProps> = ({navigation}) => {
  return (
    <WrapperView>
      <Title>This is the location setttings</Title>
      <Subtitle>
        You will be able to turn off and on your location here.
      </Subtitle>

      <MainButton onPress={() => navigation.goBack()}>
        <MainButtonText>Go back</MainButtonText>
      </MainButton>
    </WrapperView>
  );
};

export default LocationSettings;
