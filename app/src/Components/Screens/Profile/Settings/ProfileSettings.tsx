import React, {useContext, useState} from 'react';
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
  SettingsView,
  ProfileSubtitle,
  SettingsInputBox,
} from '../../../../Helpers/StylizedComponents';
import authContext from '../../../../Context/authContext';
import {AuthContextType} from '../../../../types/AuthContextType';

type ProfileSettingsProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileNavigationRoutesType, 'ProfileSettings'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const ProfileSettings: React.FC<ProfileSettingsProps> = ({navigation}) => {
  const {userProfile, setUserProfile} = useContext(
    authContext,
  ) as AuthContextType;
  const fieldsToRender = ['username', 'email', 'phone'];
  const [formData, setFormData] = useState({
    username: userProfile.username,
    email: userProfile.email,
    phone: userProfile.phone,
  });

  const [saved, setSaved] = useState(false);

  const renderProfileField = (field: string, index: number) => {
    const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1);
    return (
      <SettingsInputBox
        className="w-2/3 text-left ml-auto mr-auto mt-3 mb-3"
        placeholder={capitalizedField}
        placeholderTextColor={'grey'}
        value={formData[field as keyof typeof formData]}
        onChange={e =>
          onChange(field as keyof typeof formData, e.nativeEvent.text)
        }
        key={index}
      />
    );
  };

  const onChange = (key: keyof typeof formData, value: string) => {
    if (saved) {
      setSaved(false);
    }
    setFormData({...formData, [key]: value});
  };

  const handleSave = () => {
    fieldsToRender.forEach(field => {
      const key = field as keyof typeof formData;
      if (checkForChanges(key, formData[key])) {
        setUserProfile({...userProfile, [key]: formData[key]});
      }
    });
    setSaved(true);
  };

  const checkForChanges = (key: keyof typeof formData, value: string) => {
    return value !== userProfile[key];
  };

  return (
    userProfile && (
      <WrapperView>
        <Title className="mt-10 mb-3">Profile Settings</Title>
        {saved && <ProfileSubtitle>Saved</ProfileSubtitle>}
        <SettingsView>
          {fieldsToRender.map((key, index) => renderProfileField(key, index))}
        </SettingsView>
        <MainButton className="w-1/3 mb-0" onPress={handleSave}>
          <MainButtonText>Save</MainButtonText>
        </MainButton>
      </WrapperView>
    )
  );
};
//
export default ProfileSettings;
