import React from 'react';
import type {PropsWithChildren} from 'react';
import type {
  ProfileNavigationRoutesType,
  NavigationRoutesType,
} from '../../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import {SettingsList, Title, WrapperView} from '../../../../Helpers/StylizedComponents';
import { navSettingType } from '../../../../types/SettingsType';

type SettingsScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileNavigationRoutesType, 'SettingsScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const SettingsScreen: React.FC<SettingsScreenProps> = ({navigation}) => {
  const settingsPages: navSettingType[] = [
    {
      name: 'Profile Settings',
      route: 'ProfileSettings',
    },
    {
      name: 'Location Settings',
      route: 'LocationSettings',
    },
  ];

  const handleSettingsNavPress = (route: string) => {
    switch (route) {
      case 'ProfileSettings':
        navigation.navigate('ProfileSettings');
        break;
      case 'LocationSettings':
        //navigation.navigate('LocationSettings');
        break;
      default:
        break;
    }
  };
  const renderSettingsNav = (item: navSettingType) => {
    return (
      <Title onPress={() => handleSettingsNavPress(item.route)}>
        {item.name}
      </Title>
    );
  }

  return (
    <WrapperView>
      <Title>Settings</Title>
      <SettingsList
        data={settingsPages}
        renderItem={({item}) => renderSettingsNav(item as navSettingType)}
        keyExtractor={item => (item as navSettingType).name}
      />
    </WrapperView>
  );
};

export default SettingsScreen;
