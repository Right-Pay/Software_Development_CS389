import React from 'react';
import type {PropsWithChildren} from 'react';
import type {
  ProfileNavigationRoutesType,
  NavigationRoutesType,
} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import {
  MainButtonText,
  MainButton,
  Title,
  WrapperView,
  ProfileList,
  ProfileView,
  Subtitle,
} from '../../../Helpers/StylizedComponents';

type ProfileScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileNavigationRoutesType, 'ProfileScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const ProfileScreen: React.FC<ProfileScreenProps> = ({navigation}) => {
  return (
    <WrapperView>
      <Title className="mt-20">Profile Screen</Title>
      <ProfileList
        data={creditCards}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => {
          return (
            <ProfileView>
              <Subtitle>Credit Card {index}:</Subtitle>
              <Subtitle>Card Number: {item.cardNumber}</Subtitle>
              <Subtitle>Card Type: {item.cardType}</Subtitle>
            </ProfileView>
          );
        }}
      />
      <MainButton
        onPress={() =>
          navigation.navigate('HomeStack', {screen: 'HomeScreen'})
        }>
        <MainButtonText>Go Home</MainButtonText>
      </MainButton>
      <MainButton onPress={() => navigation.navigate('ProfileSettings')}>
        <MainButtonText>Settings</MainButtonText>
      </MainButton>
    </WrapperView>
  );
};

export default ProfileScreen;
