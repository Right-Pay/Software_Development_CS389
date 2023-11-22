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

type SettingsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileNavigationRoutesType, 'SettingsScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const SettingsScreen: React.FC<SettingsScreenProps> = ({navigation}) => {
  const {userProfile} = React.useContext(authContext) as AuthContextType;

  const settingsPages: navSettingType[] = [
    {
      name: 'Profile Settings',
      route: 'ProfileSettings',
    },
    {
      name: 'Location Settings',
      route: 'LocationSettings',
    },
    {
      name: 'Notification Settings',
      route: 'NotificationSettings',
    },
    {
      name: 'Credit Card Settings',
      route: 'CreditCardSettings',
    },
  ];

  const handleSettingsNavPress = (route: string) => {
    switch (route) {
      case 'ProfileSettings':
        navigation.navigate('ProfileSettings');
        break;
      case 'LocationSettings':
        navigation.navigate('LocationSettings');
        break;
      case 'NotificationSettings':
        navigation.navigate('NotificationSettings');
        break;
      case 'CreditCardSettings':
        navigation.navigate('CreditCardSettings');
        break;
      default:
        break;
    }
  };
  const renderSettingsNav = (item: navSettingType) => {
    return (
      <SettingsSubtitle
        onPress={() => handleSettingsNavPress(item.route)}
        key={item.name}>
        {item.name}
      </SettingsSubtitle>
    );
  };

  return (
    <WrapperView>
      <Title className="top-10">Settings</Title>
      <Subtitle className="top-10 mb-10">{userProfile.username}</Subtitle>
      <SettingsView>
        {settingsPages.map(s => renderSettingsNav(s))}
      </SettingsView>
    </WrapperView>
  );
};

export default SettingsScreen;
