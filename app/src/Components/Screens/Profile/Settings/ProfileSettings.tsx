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
  ProfileSubtitle,
  SettingsInputBox,
  SettingsView,
  SettingsSubtitle,
} from '../../../../Helpers/StylizedComponents';
import authContext from '../../../../Context/authContext';
import {AuthContextType} from '../../../../types/AuthContextType';
import AuthErrorComponent from '../../../../Helpers/AuthErrorComponent';
import KeyboardAvoidingViewScroll from '../../../../Helpers/KeyboardAvoidingViewScroll';
import Consts from '../../../../Helpers/Consts';

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
    addAuthError,
  } = useContext(authContext) as AuthContextType;

  const text = Consts.settingsText;
  const ErrorMessages = Consts.authErrorMessages;

  const fieldsToRender = ['username', 'email', 'phone'];
  const [formData, setFormData] = useState({
    username: userProfile.username,
    email: userProfile.email,
    phone: userProfile.phone,
  });

  const [saved, setSaved] = useState(false); //Check if the form has been saved

  const [editing, setEditing] = useState(false); //See if the user is editing the form

  //Render the input box for each field
  const renderProfileField = (field: string, index: number) => {
    const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1);
    //field is the key of the object from userProfile which will be extracted
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

  //Update the form data when the user types
  const onChange = (key: keyof typeof formData, value: string) => {
    setEditing(true);
    if (saved) {
      setSaved(false);
    }
    clearAuthErrors();
    setFormData({...formData, [key]: value});
  };

  //Save the form data when the user clicks save
  const handleSave = () => {
    fieldsToRender.forEach(field => {
      const key = field as keyof typeof formData;
      //Check if the field has been changed and is not empty
      if (
        formData[key] !== userProfile[key] &&
        formData[key] !== '' &&
        editing
      ) {
        if (validate(key)) {
          if (key === 'phone') {
            const formattedNumber = formatPhoneNumber(formData[key]);
            if (formattedNumber) {
              formData[key] = formattedNumber;
            } else {
              addAuthError(ErrorMessages.invalidPhone);
              formData[key] = userProfile[key];
            }
          }
          //Update user profile in db
          setUserProfile({...userProfile, [key]: formData[key]});
          setSaved(true);
          setEditing(false);
        } else {
          setSaved(false);
        }
      }
    });
  };

  //Format the phone number to be (xxx)xxx-xxxx
  const formatPhoneNumber = (phoneNumber: string): string | null => {
    const regex: RegExp =
      /^\+?(\d{1,3})?[- .]?\(?\d{3}\)?[- .]?\d{3}[- .]?\d{4}$/;
    const match: RegExpExecArray | null = regex.exec(phoneNumber);
    if (match) {
      const digits = match[0].replace(/\D/g, '');
      return `(${digits.slice(0, 3)})${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return null;
  };

  //Validate the form data
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
          <Title className="mt-10 mb-3">{text.title}</Title>
          {saved && <ProfileSubtitle>{text.saved}</ProfileSubtitle>}
          <SettingsView>
            {fieldsToRender.map((key, index) => renderProfileField(key, index))}
          </SettingsView>
          {editing ? (
            <MainButton className="w-1/3 mb-3" onPress={handleSave}>
              <MainButtonText>{text.save}</MainButtonText>
            </MainButton>
          ) : (
            <SettingsSubtitle className="mb-3">
              {text.noChanges}
            </SettingsSubtitle>
          )}
          {AuthErrorComponent && <AuthErrorComponent />}
        </KeyboardAvoidingViewScroll>
      </WrapperView>
    )
  );
};
//
export default ProfileSettings;
