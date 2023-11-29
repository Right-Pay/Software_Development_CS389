import React, {useCallback} from 'react';
import {Pressable, Text, View} from 'react-native';
import locationContext from '../Context/locationContext';
import {LocationContext} from '../types/LocationContextType';
import SettingsBottomSheet from './Screens/Profile/Settings/SettingsBottomSheet';
import Icon from 'react-native-ionicons';
import context from '../Context/context';
import {AppContext} from '../types/AppContextType';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';

const TopBar: React.FC<NativeStackHeaderProps> = ({
  navigation,
  route,
  ...props
}) => {
  const {address} = React.useContext(locationContext) as LocationContext;
  const {setBottomSheetModal, setShowBottomSheetModal} = React.useContext(
    context,
  ) as AppContext;

  const handlePresentModalPress = useCallback(() => {
    console.log('handlePresentModalPress');
    setBottomSheetModal(SettingsBottomSheet({...props, navigation, route}));
    setShowBottomSheetModal(true);
  }, [navigation, props, route, setBottomSheetModal, setShowBottomSheetModal]);

  const showMoreButton = useCallback(() => {
    return (
      <Pressable
        className="flex-1 flex-col justify-center items-center text-center w-1/6 m-0 overflow-visible"
        onPress={() => {
          handlePresentModalPress();
        }}>
        <Icon name="menu" color="#Ffffff" />
      </Pressable>
    );
  }, [handlePresentModalPress]);

  const backButton = useCallback(() => {
    return (
      <Pressable
        className="flex-1 flex-col justify-center items-center text-center"
        onPress={
          () =>
            navigation.goBack() /*I have not figured out how to go back to last page. It only goes to HomeStack*/
        }>
        <Text className="text-xl text-light-green p-0">Back</Text>
      </Pressable>
    );
  }, [navigation]);

  return (
    <View className="flex flex-row items-center w-screen h-16 bg-dark-green border-b-3 border-slate-600">
      <View className="w-5/6 pl-6">
        <Text
          className="text-xl font-bold text-light-green w-full"
          numberOfLines={1}>
          {address ? address.displayName.text : ''}
        </Text>
      </View>
      {route.name === 'SettingsStack' ? backButton() : showMoreButton()}
    </View>
  );
};

export default TopBar;
