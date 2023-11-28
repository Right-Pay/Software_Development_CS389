import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {header} from '../types/header';
import locationContext from '../Context/locationContext';
import {LocationContext} from '../types/LocationContextType';
import {AppContext} from '../types/AppContextType';
import context from '../Context/context';
import SettingsPopup from './Screens/Profile/Settings/Settings';

const TopBar = (props: any, stackName?: string): header => {
  const {address} = React.useContext(locationContext) as LocationContext;
  const {setShowMoreSettings, showMoreSettings} = React.useContext(
    context,
  ) as AppContext;

  const showMoreButton = () => {
    return (
      <Pressable
        className="flex-1 flex-col justify-center items-center text-center"
        onPress={() => {
          setShowMoreSettings(!showMoreSettings);
        }}>
        <Text className="text-5xl text-light-green p-0">...</Text>
      </Pressable>
    );
  };

  const backButton = () => {
    return (
      <Pressable
        className="flex-1 flex-col justify-center items-center text-center"
        onPress={
          () =>
            props.navigation.goBack() /*I have not figured out how to go back to last page. It only goes to HomeStack*/
        }>
        <Text className="text-xl text-light-green p-0">Back</Text>
      </Pressable>
    );
  };

  return {
    header: () => {
      return (
        <View className="flex flex-row justify-between items-center w-screen h-24 bg-dark-green pl-8 pr-8 pt-6 border-b-3 border-slate-600">
          <Text
            className="text-xl font-bold text-light-green w-5/6"
            numberOfLines={1}>
            {address ? address.displayName.text : ''}
          </Text>
          {stackName === 'SettingsStack' ? backButton() : showMoreButton()}
          {SettingsPopup(props, props.route.key)}
        </View>
      );
    },
  };
};

export default TopBar;
