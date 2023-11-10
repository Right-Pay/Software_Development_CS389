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
  Title,
  FormInputBox,
  ProfileView,
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

  const renderProfileField = (field: string, index: number) => {
    return (
      <FormInputBox
        className="w-2/3 text-center ml-auto mr-auto"
        placeholder={field}
        key={index}
      />
    );
  };

  return (
    <WrapperView>
      <Title className="top-0">Settings</Title>
      {userProfile && (
        <ProfileView className="border-t-2 w-full flex flex-col mt-4 p-5">
          {Object.keys(userProfile)
            .filter(key => key !== 'id' && key !== 'subscribed')
            .map((key, index) => renderProfileField(key, index))}
        </ProfileView>
      )}
      <MainButton onPress={() => navigation.goBack()}>
        <MainButtonText>Go Back</MainButtonText>
      </MainButton>
    </WrapperView>
  );
};

export default ProfileSettings;
