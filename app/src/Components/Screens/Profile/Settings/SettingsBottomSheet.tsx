import {useBottomSheetModal} from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import React, {PropsWithChildren} from 'react';
import {View} from 'react-native';
import Icon from 'react-native-ionicons';
import authContext from '../../../../Context/authContext';
import {SettingsSubtitle} from '../../../../Helpers/StylizedComponents';
import {AuthContextType} from '../../../../types/AuthContextType';
import {navSettingType} from '../../../../types/SettingsType';

const SettingsBottomSheet: React.FC<PropsWithChildren> = () => {
  const {signOut} = React.useContext(authContext) as AuthContextType;
  const {dismiss} = useBottomSheetModal();
  const navigation = useNavigation();

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
    dismiss();
    switch (route) {
      case 'ProfileSettings':
        navigation.navigate('ProfileStack', {screen: 'ProfileSettings'});
        break;
      case 'GeneralSettings':
        navigation.navigate('ProfileStack', {
          screen: 'GeneralSettings',
        });
        break;
      case 'CardSettings':
        navigation.navigate('ProfileStack', {screen: 'CardSettings'});
        break;
      case 'SignOut':
        signOut();
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
        <View className="w-8 text-center">
          <Icon name={getIcon(setting.name).toString()} color="#4d654e" />
        </View>
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
      {settingsPages.map((setting, index) => renderSettingsNav(setting, index))}
    </View>
  );
};

export default SettingsBottomSheet;
