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

type CreditCardSettingsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileNavigationRoutesType, 'CreditCardSettings'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const CreditCardSettings: React.FC<CreditCardSettingsScreenProps> = ({
  navigation,
}) => {
  return (
    <>
      <WrapperView />
    </>
  );
};

export default CreditCardSettings;
