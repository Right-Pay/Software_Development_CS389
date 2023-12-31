import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-ionicons';
import context from '../Context/context';
import locationContext from '../Context/locationContext';
import { AppContext, BottomSheetTypes } from '../types/AppContextType';
import { LocationContext } from '../types/LocationContextType';
import { MainNavigationRoutesEnum } from '../types/NavigationRoutesType';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TopBar: React.FC<NativeStackHeaderProps> = ({ navigation, route }) => {
  const { address } = React.useContext(locationContext) as LocationContext;
  const { setBottomSheetModal, setShowBottomSheetModal, showBottomSheetModal } =
    React.useContext(context) as AppContext;

  const insets = useSafeAreaInsets();

  const handlePresentModalPress = useCallback(() => {
    setBottomSheetModal({
      type: BottomSheetTypes.SETTINGS,
      snapPoints: ['30%'],
    });
    setShowBottomSheetModal(!showBottomSheetModal);
  }, [setBottomSheetModal, setShowBottomSheetModal, showBottomSheetModal]);

  const showMoreButton = useCallback(() => {
    return (
      <Pressable
        className="flex-1 flex-col justify-center items-center text-center w-1/6 h-3/4 m-0 overflow-visible"
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
          navigation.goBack();
        }}>
        <Icon name="arrow-back" color="#Ffffff" />
        <Text className="text-xl text-light-green p-0">{screenTitle()}</Text>
      </Pressable>
    );
  }, [navigation, screenTitle]);

  const styles = StyleSheet.create({
    heightStyle: {
      height: insets.top + (Platform.OS === 'ios' ? 40 : 65),
      paddingBottom: 5,
    },
  });

  return (
    <View
      className="flex flex-row items-center w-screen pt-6 bg-dark-green border-b-3 border-slate-600"
      style={styles.heightStyle}>
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
