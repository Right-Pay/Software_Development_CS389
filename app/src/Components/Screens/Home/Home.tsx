import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {PropsWithChildren} from 'react';
import React from 'react';
import AuthContext from '../../../Context/authContext';
import {AuthContextType} from '../../../types/AuthContextType';
import type {
  HomeNavigationRoutesType,
  NavigationRoutesType,
} from '../../../types/NavigationRoutesType';
import PrimaryText from '../../Common/PrimaryText';
import TitleText from '../../Common/TitleText';
import WrapperView from '../../Common/WrapperView';

type HomeScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeNavigationRoutesType, 'HomeScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const {userProfile} = React.useContext(AuthContext) as AuthContextType;

  return (
    <WrapperView>
      <TitleText className="mt-20">Home Screen</TitleText>
      <PrimaryText>Hello {userProfile.username}</PrimaryText>
    </WrapperView>
  );
};

export default HomeScreen;
