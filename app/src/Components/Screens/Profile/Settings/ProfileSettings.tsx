import React, {useState} from 'react';
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
  SettingsView,
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
  const fieldsToRender = ['username', 'email', 'phone'];

  const [tempUserProfile, setTempUserProfile] = useState(userProfile);

  const renderProfileField = (field: string, index: number) => {
    const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1);
    const key = field as keyof typeof userProfile;
    const value = tempUserProfile[key] as string;
    return (
      <FormInputBox
        className="w-2/3 text-left ml-auto mr-auto mt-3 mb-3"
        placeholder={capitalizedField}
        placeholderTextColor={'grey'}
        value={value}
        onChange={e => {
          setTempUserProfile({...tempUserProfile, [key]: e.nativeEvent.text});
        }}
        key={index}
      />
    );
  };

  const handleSave = () => {
    userProfile.username = tempUserProfile.username;
    userProfile.email = tempUserProfile.email;
    userProfile.phone = tempUserProfile.phone;
    return () => {};
  };

  return (
    <WrapperView>
      <Title className="top-10 mb-10">Profile Settings</Title>
      {userProfile && (
        <SettingsView>
          {Object.keys(userProfile)
            .filter(key => fieldsToRender.includes(key))
            .map((key, index) => renderProfileField(key, index))}
        </SettingsView>
      )}
      <MainButton className="w-1/3" onPress={handleSave()}>
        <MainButtonText>Save</MainButtonText>
      </MainButton>
    </WrapperView>
  );
};
//need to show confirmation
export default ProfileSettings;
