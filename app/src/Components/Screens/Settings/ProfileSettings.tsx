import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PropsWithChildren } from 'react';
import React, { useContext, useState } from 'react';
import { View } from 'react-native';
import authContext from '../../../Context/authContext';
import Consts from '../../../Helpers/Consts';
import { AuthContextType } from '../../../types/AuthContextType';
import type {
  NavigationRoutesType,
  SettingsNavigationRoutesType,
} from '../../../types/NavigationRoutesType';
import { Profile } from '../../../types/ProfileType';
import AuthErrorComponent from '../../Common/AuthErrorComponent';
import InnerWrapperView from '../../Common/InnerWrapperView';
import InputBox from '../../Common/InputBox';
import KeyboardAvoidingViewScroll from '../../Common/KeyboardAvoidingViewScroll';
import OutlineButton from '../../Common/OutlineButton';
import PrimaryText from '../../Common/PrimaryText';
import TitleText from '../../Common/TitleText';
import WrapperView from '../../Common/WrapperView';
import i18n from '../../../Localization/i18n';

type ProfileSettingsProps = CompositeScreenProps<
  NativeStackScreenProps<SettingsNavigationRoutesType, 'ProfileSettings'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const ProfileSettings: React.FC<ProfileSettingsProps> = () => {
  const {
    userProfile,
    //checkValidEmail,
    checkValidPhone,
    checkValidUsername,
    clearAuthErrors,
    addAuthError,
    updateUserProfile,
  } = useContext(authContext) as AuthContextType;

  const ErrorMessages = Consts.authErrorMessages();

  const fieldsToRender = ['username', /*'email',*/ 'phone'];

  enum sectionEnum {
    username = 0,
    //email = 1,
    phone = 1, //2,
  }

  const [updateSection] = useState([
    userProfile.username,
    //userProfile.email,
    userProfile.phone ?? '',
  ]); //Check if the section has been updated array

  const [saved, setSaved] = useState(false); //Check if the form has been saved

  const [editing, setEditing] = useState(false); //See if the user is editing the form

  //Render the input box for each field
  const renderProfileField = (field: string, index: number) => {
    const value =
      updateSection[index] && updateSection[index].length > 0
        ? updateSection[index]
        : '';
    const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1);
    //field is the key of the object from userProfile which will be extracted
    return (
      <InputBox
        className="my-3"
        placeholder={i18n.t('Settings', capitalizedField)}
        value={value}
        onChange={e => onChange(index, e.nativeEvent.text)}
        key={index}
      />
    );
  };

  //Update the form data when the user types
  const onChange = (index: number, value: string) => {
    setEditing(true);
    if (saved) {
      setSaved(false);
    }
    clearAuthErrors();
    updateSection[index] = value;
  };

  const resetUpdateSection = (newProfile: Profile) => {
    //The reason I am doing this is to reflect the changes in the form since userProfile won't update fast enough in the db
    //This is a temporary solution and will probably be removed in the future and changed when the full backend is finished
    updateSection[sectionEnum.username] = newProfile.username;
    //updateSection[sectionEnum.email] = newProfile.email; Reason is Auth0 and we are lazy
    updateSection[sectionEnum.phone] = newProfile.phone ?? '';
  };

  //Save the form data when the user clicks save
  const handleSave = () => {
    let updated = false;
    if (editing) {
      updateSection.forEach((section: string, index: number) => {
        if (section.length > 0 && validate(index)) {
          if (index === sectionEnum.phone) {
            const formattedNumber = formatPhoneNumber(updateSection[index]);
            if (formattedNumber) {
              updateSection[index] = formattedNumber;
            } else {
              addAuthError(ErrorMessages.invalidPhone);
              setSaved(false);
              return;
            }
          }
          if (index === sectionEnum.username) {
            if (updateSection[index].length < 3) {
              addAuthError(ErrorMessages.invalidUsername);
              setSaved(false);
              return;
            }
          }
          updated = true;
        } else {
          setSaved(false);
        }
      });
      if (updated) {
        const newUserProfile = {
          ...userProfile,
          username: updateSection[sectionEnum.username],
          //email: updateSection[sectionEnum.email],  Reason is Auth0 and we are lazy
          phone: updateSection[sectionEnum.phone],
        };
        updateUserProfile(newUserProfile);
        resetUpdateSection(newUserProfile);
        setSaved(true);
      }
      setEditing(false);
    }
  };

  //Format the phone number to be (xxx)xxx-xxxx
  const formatPhoneNumber = (phoneNumber: string): string | null => {
    const regex = /^\+?(\d{1,3})?[- .]?\(?\d{3}\)?[- .]?\d{3}[- .]?\d{4}$/;
    const match: RegExpExecArray | null = regex.exec(phoneNumber);
    if (match) {
      const digits = match[0].replace(/\D/g, '');
      return `(${digits.slice(0, 3)})${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return null;
  };

  //Validate the form data
  const validate = (index: number) => {
    switch (index) {
      case sectionEnum.username:
        return checkValidUsername(updateSection[sectionEnum.username]);
      /*case sectionEnum.email:
        return checkValidEmail(updateSection[sectionEnum.email]); Reason is Auth0 and we are lazy */
      case sectionEnum.phone:
        return checkValidPhone(updateSection[sectionEnum.phone]);
      default:
        return false;
    }
  };

  return (
    userProfile && (
      <WrapperView>
        <KeyboardAvoidingViewScroll>
          <TitleText className="mt-10 mb-3">{`${i18n.t(
            'Settings.Profile',
          )} ${i18n.t('Settings.Settings')}`}</TitleText>
          {saved && (
            <PrimaryText className="text-2xl font-bold">
              {i18n.t('Settings.Profileupdated')}
            </PrimaryText>
          )}
          <InnerWrapperView className="border-t-2">
            {fieldsToRender.map((key, index) => renderProfileField(key, index))}
          </InnerWrapperView>
          <View className="flex-1 items-center">
            {editing ? (
              <OutlineButton
                className="justify-center items-center w-1/3 mb-3"
                onPress={handleSave}>
                <PrimaryText className="text-center text-xl">
                  {i18n.t('Common.Save')}
                </PrimaryText>
              </OutlineButton>
            ) : (
              <PrimaryText className="text-2xl text-center font-bold mb-3">
                {i18n.t('Settings.Nochanges')}
              </PrimaryText>
            )}
          </View>
          {AuthErrorComponent && <AuthErrorComponent />}
        </KeyboardAvoidingViewScroll>
      </WrapperView>
    )
  );
};
//
export default ProfileSettings;
