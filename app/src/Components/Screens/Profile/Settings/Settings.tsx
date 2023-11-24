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
  SettingsSubtitle,
  SettingsView,
  Subtitle,
  Title,
  WrapperView,
} from '../../../../Helpers/StylizedComponents';
import {navSettingType} from '../../../../types/SettingsType';
import authContext from '../../../../Context/authContext';
import {AuthContextType} from '../../../../types/AuthContextType';
import {View} from 'react-native';
import Consts from '../../../../Helpers/Consts';
import {hashType} from '../../../../types/ConstsType';

type SettingsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileNavigationRoutesType, 'SettingsScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const SettingsScreen: React.FC<SettingsScreenProps> = ({navigation}) => {
  const {userProfile} = React.useContext(authContext) as AuthContextType;

  const text = Consts.settingsText;

  const routes = text.routes as hashType;

  const settingsPages: navSettingType[] = [
    {
      name: routes.profileSettings,
      route: routes.profileSettings.replaceAll(' ', ''),
    },
    {
      name: routes.generalSettings,
      route: routes.generalSettings.replaceAll(' ', ''),
    },
    {
      name: routes.cardSettings,
      route: routes.cardSettings.replaceAll(' ', ''),
    },
  ];

  const handleSettingsNavPress = (route: string) => {
    switch (route) {
      case 'ProfileSettings':
        navigation.navigate('ProfileSettings');
        break;
      case 'GeneralSettings':
        navigation.navigate('GeneralSettings');
        break;
      case 'CardSettings':
        navigation.navigate('CardSettings');
        break;
      default:
        break;
    }
  };
  const renderSettingsNav = (setting: navSettingType, key: number) => {
    return (
      <View key={key} className={'w-screen pl-4 justify-center h-1/6'}>
        <SettingsSubtitle
          onPress={() => handleSettingsNavPress(setting.route)}
          className="text-left">
          {setting.name}
        </SettingsSubtitle>
      </View>
    );
  };

  return (
    <WrapperView>
      <Title className="top-10">{text.settingsTitle}</Title>
      <Subtitle className="top-10 mb-10">{userProfile.username}</Subtitle>
      <SettingsView className="left-0 divide-dark-green divide-solid divide-y-2 height-screen pt-0">
        {settingsPages.map((setting, index) =>
          renderSettingsNav(setting, index),
        )}
      </SettingsView>
    </WrapperView>
  );
};

export default SettingsScreen;
