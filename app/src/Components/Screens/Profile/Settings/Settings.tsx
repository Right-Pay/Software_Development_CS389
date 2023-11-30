import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PropsWithChildren } from 'react';
import React from 'react';
import { View } from 'react-native';
import authContext from '../../../../Context/authContext';
import { AuthContextType } from '../../../../types/AuthContextType';
import type {
  NavigationRoutesType,
  ProfileNavigationRoutesType,
} from '../../../../types/NavigationRoutesType';
import { navSettingType } from '../../../../types/SettingsType';
import InnerWrapperView from '../../../Common/InnerWrapperView';
import PrimaryText from '../../../Common/PrimaryText';
import TitleText from '../../../Common/TitleText';
import WrapperView from '../../../Common/WrapperView';

type SettingsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileNavigationRoutesType, 'SettingsScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { userProfile } = React.useContext(authContext) as AuthContextType;

  const settingsPages: navSettingType[] = [
    {
      name: 'Profile Settings',
      route: 'ProfileSettings',
    },
    {
      name: 'General Settings',
      route: 'GeneralSettings',
    },
    {
      name: 'Card Settings',
      route: 'CardSettings',
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
        <PrimaryText
          onPress={() => handleSettingsNavPress(setting.route)}
          className="text-2xl font-bold text-left">
          {setting.name}
        </PrimaryText>
      </View>
    );
  };

  return (
    <WrapperView>
      <TitleText className="top-10">Settings</TitleText>
      <PrimaryText className="top-10 mb-14 ml-5 mr-5" numberOfLines={1}>
        {userProfile.username}
      </PrimaryText>
      <InnerWrapperView className="border-t-2 left-0 divide-dark-green divide-solid divide-y-2 height-screen pt-0">
        {settingsPages.map((setting, index) =>
          renderSettingsNav(setting, index),
        )}
      </InnerWrapperView>
    </WrapperView>
  );
};

export default SettingsScreen;
