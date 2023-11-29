import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PropsWithChildren } from 'react';
import React from 'react';
import AuthContext from '../../../Context/authContext';
import { Subtitle, Title } from '../../../Helpers/StylizedComponents';
import WrapperView from '../../../Helpers/WrapperView';
import { AuthContextType } from '../../../types/AuthContextType';
import type {
  HomeNavigationRoutesType,
  NavigationRoutesType,
} from '../../../types/NavigationRoutesType';

type HomeScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeNavigationRoutesType, 'HomeScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const {userProfile} = React.useContext(AuthContext) as AuthContextType;

  return (
    <WrapperView>
      <Title className="mt-20">Home Screen</Title>
      <Subtitle>Hello {userProfile.username}</Subtitle>
    </WrapperView>
  );
};

export default HomeScreen;
