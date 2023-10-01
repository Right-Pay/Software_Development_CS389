import React from 'react';
import {View, StyleSheet, Text, Button} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {
  LocationNavigationRoutesType,
  NavigationRoutesType,
} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';

type LocationSettingsProps = CompositeScreenProps<
  NativeStackScreenProps<LocationNavigationRoutesType, 'LocationSettings'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const LocationSettings: React.FC<LocationSettingsProps> = ({navigation}) => {
  return (
    <View style={styles.center}>
      <Text>This is the location setttings</Text>
      <Text>You will be able to turn off and on your location here.</Text>

      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
});

export default LocationSettings;
