import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import React, { PropsWithChildren } from 'react';
import { Pressable, View } from 'react-native';
import Icon from 'react-native-ionicons';
import { NavigationTabProp } from 'react-navigation-tabs';
import authContext from '../../../Context/authContext';
import useColorsMode from '../../../Helpers/Colors';
import { AuthContextType } from '../../../types/AuthContextType';
import { navSettingType } from '../../../types/SettingsType';
import PrimaryText from '../../Common/PrimaryText';
import i18n from '../../../Localization/i18n';

const SettingsBottomSheet: React.FC<PropsWithChildren> = () => {
  const { signOut } = React.useContext(authContext) as AuthContextType;

  const { dismiss } = useBottomSheetModal();
  const { colors } = useColorsMode();
  const navigation =
    useNavigation<NavigationTabProp<ReactNavigation.RootParamList>>();

  const settingsPages: navSettingType[] = [
    {
      name: i18n.t('Settings.Settings'),
      route: 'GeneralSettings',
      iconName: 'settings',
    },
    {
      name: i18n.t('Settings.Account'),
      route: 'ProfileSettings',
      iconName: 'person',
    },
    {
      name: i18n.t('Settings.Cards'),
      route: 'CardSettings',
      iconName: 'card',
    },
    {
      name: i18n.t('Welcome.Logout'),
      route: 'SignOut',
      iconName: 'log-out',
    },
  ];

  const handleSettingsNavPress = (route: string) => {
    dismiss();
    switch (route) {
      case 'ProfileSettings':
        navigation.navigate('SettingsStack', {
          screen: 'ProfileSettings',
        });
        break;
      case 'GeneralSettings':
        navigation.navigate('SettingsStack', {
          screen: 'GeneralSettings',
        });
        break;
      case 'CardSettings':
        navigation.navigate('SettingsStack', { screen: 'CardSettings' });
        break;
      case 'SignOut':
        signOut();
        break;
      default:
        break;
    }
  };

  const renderSettingsNav = (setting: navSettingType, key: number) => {
    return (
      <Pressable
        onPress={() => handleSettingsNavPress(setting.route)}
        key={key}
        className={'flex-1 flex-row w-screen pl-4 items-center h-auto'}>
        <View className="w-8 text-center">
          <Icon name={setting.iconName.toString()} color={colors.primary} />
        </View>
        <PrimaryText className="text-left text-lg">{setting.name}</PrimaryText>
      </Pressable>
    );
  };

  return (
    <View className="flex-1 w-full h-full pb-6">
      {settingsPages.map((setting, index) => renderSettingsNav(setting, index))}
    </View>
  );
};

export default SettingsBottomSheet;
