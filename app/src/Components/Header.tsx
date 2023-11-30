import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';
import {Pressable, Text, View} from 'react-native';
import Icon from 'react-native-ionicons';
import context from '../Context/context';
import locationContext from '../Context/locationContext';
import {AppContext, BottomSheetTypes} from '../types/AppContextType';
import {LocationContext} from '../types/LocationContextType';
import {MainNavigationRoutesEnum} from '../types/NavigationRoutesType';

const TopBar: React.FC<NativeStackHeaderProps> = ({navigation, route}) => {
  const {address} = React.useContext(locationContext) as LocationContext;
  const {setBottomSheetModal, setShowBottomSheetModal, showBottomSheetModal} =
    React.useContext(context) as AppContext;

  const handlePresentModalPress = useCallback(() => {
    setBottomSheetModal({
      type: BottomSheetTypes.SETTINGS,
      snapPoints: ['25%'],
    });
    setShowBottomSheetModal(!showBottomSheetModal);
  }, [setBottomSheetModal, setShowBottomSheetModal, showBottomSheetModal]);

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

  const isMainScreen = useCallback(() => {
    // Using MainNavigationRoutesEnum to determine if it should be a different header or not.
    return route.name in MainNavigationRoutesEnum;
  }, [route]);

  const screenTitle = useCallback(() => {
    if (isMainScreen()) {
      return address ? address.displayName.text : '';
    } else {
      // need a different name here as this does not work
      return getFocusedRouteNameFromRoute(route);
    }
  }, [address, isMainScreen, route]);

  const backButton = useCallback(() => {
    return (
      <Pressable
        className="flex-1 flex-row pl-6 justify-start items-center text-center"
        onPress={() => {
          if (route.name === 'ProfileSettings') {
            navigation.navigate('ProfileStack', {screen: 'ProfileScreen'});
          } else if (route.name === 'GeneralSettings') {
            navigation.navigate('HomeStack', {screen: 'HomeScreen'});
          } else if (route.name === 'CardSettings') {
            navigation.navigate('WalletStack', {screen: 'WalletScreen'});
          } else {
            navigation.navigate('HomeStack', {screen: 'HomeScreen'});
          }
        }}>
        <Icon name="arrow-back" color="#Ffffff" />
        <Text className="text-xl text-light-green p-0">{screenTitle()}</Text>
      </Pressable>
    );
  }, [navigation, route.name, screenTitle]);

  return (
    <View className="flex flex-row items-center w-screen h-16 bg-dark-green border-b-3 border-slate-600">
      {isMainScreen() ? (
        <>
          <View className="w-5/6 pl-6">
            <Text
              className="text-lg font-bold text-light-green w-full"
              numberOfLines={1}>
              {screenTitle()}
            </Text>
          </View>
          {showMoreButton()}
        </>
      ) : (
        backButton()
      )}
    </View>
  );
};

export default TopBar;
