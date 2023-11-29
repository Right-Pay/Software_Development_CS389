import React, {useCallback, useMemo, useRef} from 'react';
import {
  SettingsSubtitle,
  SettingsView,
} from '../../../../Helpers/StylizedComponents';
import {navSettingType} from '../../../../types/SettingsType';
import {TouchableWithoutFeedback, View} from 'react-native';
import context from '../../../../Context/context';
import {AppContext} from '../../../../types/AppContextType';
import authContext from '../../../../Context/authContext';
import {AuthContextType} from '../../../../types/AuthContextType';
import Icon from 'react-native-ionicons';
import BottomSheet from '@gorhom/bottom-sheet';

const SettingsPopup = (props: any, name: string) => {
  const {setShowMoreSettings, showMoreSettings} = React.useContext(
    context,
  ) as AppContext;

  const {signOut} = React.useContext(authContext) as AuthContextType;

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
    setShowMoreSettings(!showMoreSettings);
    switch (route) {
      case 'ProfileSettings':
        props.navigation.navigate('ProfileStack', {screen: 'ProfileSettings'});
        break;
      case 'GeneralSettings':
        props.navigation.navigate('ProfileStack', {screen: 'GeneralSettings'});
        break;
      case 'CardSettings':
        props.navigation.navigate('ProfileStack', {screen: 'CardSettings'});
        break;
      case 'SignOut':
        setShowMoreSettings(!showMoreSettings);
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
        <Icon name={getIcon(setting.name).toString()} color="#4d654e" />
        <SettingsSubtitle
          onPress={() => handleSettingsNavPress(setting.route)}
          className="text-left text-lg text-dark-green">
          {setting.name}
        </SettingsSubtitle>
      </View>
    );
  };

  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['25%', '50%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}>
      <TouchableWithoutFeedback onPress={() => handleSheetChanges(1)}>
        <View className="flex-1 w-full h-2/3">
          <View className="mt-auto h-1/3 w-full rounded-t-2xl bg-white pt-2 items-center opacity-100">
            <SettingsView className="left-0 height-full pt-0 w-screen border-0">
              {settingsPages.map((setting, index) =>
                renderSettingsNav(setting, index),
              )}
            </SettingsView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </BottomSheet>
  );
};

export default SettingsPopup;
//setShowMoreSettings(false)
