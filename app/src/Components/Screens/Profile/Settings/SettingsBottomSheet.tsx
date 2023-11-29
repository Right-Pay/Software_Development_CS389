import React from 'react';
import {SettingsSubtitle} from '../../../../Helpers/StylizedComponents';
import {navSettingType} from '../../../../types/SettingsType';
import {View} from 'react-native';
import authContext from '../../../../Context/authContext';
import {AuthContextType} from '../../../../types/AuthContextType';
import Icon from 'react-native-ionicons';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';

const SettingsBottomSheet: React.FC<NativeStackHeaderProps> = ({
  navigation,
}) => {
  // const {signOut} = React.useContext(authContext) as AuthContextType;

  const settingsPages: navSettingType[] = [
    {
      name: 'Settings',
      route: 'GeneralSettings',
    },
    {
      name: 'Account Information',
      route: 'ProfileSettings',
    },
    {
      name: 'Cards',
      route: 'CardSettings',
    },
    {
      name: 'Sign Out',
      route: 'SignOut',
    },
  ];

  const handleSettingsNavPress = (route: string) => {
    switch (route) {
      case 'ProfileSettings':
        navigation.navigate('ProfileStack', {screen: 'ProfileSettings'});
        break;
      case 'GeneralSettings':
        navigation.navigate('ProfileStack', {screen: 'GeneralSettings'});
        break;
      case 'CardSettings':
        navigation.navigate('ProfileStack', {screen: 'CardSettings'});
        break;
      case 'SignOut':
        // signOut();
        break;
      default:
        break;
    }
  };

  const getIcon = (settingName: string) => {
    switch (settingName) {
      case 'Account Information':
        return 'person';
      case 'Settings':
        return 'settings';
      case 'Cards':
        return 'card';
      case 'Sign Out':
        return 'log-out';
      default:
        return 'menu';
    }
  };

  const renderSettingsNav = (setting: navSettingType, key: number) => {
    return (
      <View
        key={key}
        className={'flex-1 flex-row w-screen pl-4 items-center h-auto'}>
        <Icon name={getIcon(setting.name).toString()} color="#4d654e" />
        <SettingsSubtitle
          onPress={() => handleSettingsNavPress(setting.route)}
          className="text-left text-lg text-dark-green">
          {setting.name}
        </SettingsSubtitle>
      </View>
    );
  };

  return (
    <View className="flex-1 w-full h-full">
      {/* <View className="flex-1 mt-4 p-5 items-center space-between"> */}
      {settingsPages.map((setting, index) => renderSettingsNav(setting, index))}
      {/* </View> */}
    </View>
  );
};

export default SettingsBottomSheet;
