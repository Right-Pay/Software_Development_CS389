import React from 'react';
import {
  SettingsSubtitle,
  SettingsView,
  Title,
} from '../../../../Helpers/StylizedComponents';
import {navSettingType} from '../../../../types/SettingsType';
import {Modal, TouchableWithoutFeedback, View} from 'react-native';
import context from '../../../../Context/context';
import {AppContext} from '../../../../types/AppContextType';
import authContext from '../../../../Context/authContext';
import {AuthContextType} from '../../../../types/AuthContextType';

const SettingsPopup = (props: any, name: string) => {
  const {setShowMoreSettings, showMoreSettings} = React.useContext(
    context,
  ) as AppContext;

  const {signOut} = React.useContext(authContext) as AuthContextType;

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
  const renderSettingsNav = (setting: navSettingType, key: number) => {
    return (
      <View key={key} className={'w-screen pl-4 justify-center h-1/4'}>
        <SettingsSubtitle
          onPress={() => handleSettingsNavPress(setting.route)}
          className="text-left text-light-green">
          {setting.name}
        </SettingsSubtitle>
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      visible={
        name === props.navigation.getState().history.slice(-1)[0].key &&
        showMoreSettings
      }
      onRequestClose={() => setShowMoreSettings(false)}
      transparent={true}
      style={{
        margin: 0,
      }}>
      <TouchableWithoutFeedback onPress={() => setShowMoreSettings(false)}>
        <View className="flex-1 flex-col justify-end items-center w-full h-1/2">
          <View className="h-1/2 w-full border-2 rounded-t-3xl bg-dark-green p-6 items-center">
            <Title className="text-center text-light-green">Settings</Title>
            <SettingsView className="left-0 height-full pt-0 w-screen border-0">
              {settingsPages.map((setting, index) =>
                renderSettingsNav(setting, index),
              )}
            </SettingsView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SettingsPopup;
