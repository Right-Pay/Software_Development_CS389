import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {header} from '../types/header';
import locationContext from '../Context/locationContext';
import {LocationContext} from '../types/LocationContextType';

const TopBar = (props: any, stackName?: string): header => {
  const {address} = React.useContext(locationContext) as LocationContext;
  return {
    header: () => {
      return (
        <View className="flex flex-row justify-between items-center w-screen h-24 bg-dark-green pl-8 pr-8 pt-6 border-b-3 border-slate-600">
          <Text
            className="text-xl font-bold text-light-green w-5/6"
            numberOfLines={1}>
            {address ? address.displayName.text : ''}
          </Text>
          {props.route.name !== 'ProfileStack' && (
            <Pressable
              className="flex-1 flex-col justify-center items-center text-center pb-6"
              onPress={() =>
                props.navigation.navigate('ProfileStack', {
                  screen: 'ProfileScreen',
                })
              }>
              <Text className="text-5xl text-light-green p-0">...</Text>
            </Pressable>
          )}
          {props.route.name === 'ProfileStack' && (
            <Pressable
              className="justify-center items-center text-center"
              onPress={() =>
                stackName === 'ProfileStack'
                  ? props.navigation.goBack()
                  : props.navigation.navigate('ProfileScreen')
              }>
              <Text className="text-xl text-light-green items-center">
                {'Back'}
              </Text>
            </Pressable>
          )}
        </View>
      );
    },
  };
};

export default TopBar;
