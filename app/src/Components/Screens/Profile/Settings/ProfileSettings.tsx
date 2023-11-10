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
  MainButtonText,
  MainButton,
  WrapperView,
} from '../../../../Helpers/StylizedComponents';
import authContext from '../../../../Context/authContext';
import {AuthContextType} from '../../../../types/AuthContextType';

type ProfileSettingsProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileNavigationRoutesType, 'ProfileSettings'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const ProfileSettings: React.FC<ProfileSettingsProps> = ({navigation}) => {
  const {userProfile} = React.useContext(authContext) as AuthContextType;

  return (
    <WrapperView>
      <MainButton onPress={() => navigation.goBack()}>
        <MainButtonText>Go Back</MainButtonText>
      </MainButton>
    </WrapperView>
  );
};

export default ProfileSettings;
