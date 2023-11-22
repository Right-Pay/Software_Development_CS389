import React, {useContext, useEffect, useRef, useState} from 'react';
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
  ProfileSubtitle,
  SettingsInputBox,
  SettingsView,
} from '../../../../Helpers/StylizedComponents';
import authContext from '../../../../Context/authContext';
import {AuthContextType} from '../../../../types/AuthContextType';
import AuthErrorComponent from '../../../../Helpers/AuthErrorComponent';
import KeyboardAvoidingViewScroll from '../../../../Helpers/KeyboardAvoidingViewScroll';

type ProfileSettingsProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileNavigationRoutesType, 'ProfileSettings'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const ProfileSettings: React.FC<ProfileSettingsProps> = ({navigation}) => {
  const {
    userProfile,
    setUserProfile,
    checkValidEmail,
    checkValidPhone,
    checkValidUsername,
    clearAuthErrors,
  } = useContext(authContext) as AuthContextType;

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
        className="w-2/3 text-left ml-auto mr-auto mt-3 mb-3 h-12"
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
    clearAuthErrors();
    setFormData({...formData, [key]: value});
  };

  const handleSave = () => {
    fieldsToRender.forEach(field => {
      const key = field as keyof typeof formData;
      if (formData[key] !== userProfile[key]) {
        if (validate(key)) {
          console.log('Invalid');
          //Update db here
          setUserProfile({...userProfile, [key]: formData[key]});
          setSaved(true);
        } else {
          setSaved(false);
        }
      }
    });
  };

  const validate = (key: keyof typeof formData) => {
    switch (key) {
      case 'username':
        return checkValidUsername(formData[key]);
      case 'email':
        return checkValidEmail(formData[key]);
      case 'phone':
        return checkValidPhone(formData[key]);
      default:
        return false;
    }
  };

  return (
    userProfile && (
      <WrapperView className="pb-0">
        <KeyboardAvoidingViewScroll>
          <Title className="mt-10 mb-3">Profile Settings</Title>
          {saved && <ProfileSubtitle>Saved</ProfileSubtitle>}
          <SettingsView>
            {fieldsToRender.map((key, index) => renderProfileField(key, index))}
          </SettingsView>
          <MainButton className="w-1/3 mb-3" onPress={handleSave}>
            <MainButtonText>Save</MainButtonText>
          </MainButton>
          {AuthErrorComponent && <AuthErrorComponent />}
        </KeyboardAvoidingViewScroll>
      </WrapperView>
    )
  );
};
//
export default ProfileSettings;
