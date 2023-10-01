import React from 'react';
import {View, StyleSheet, Text, Button} from 'react-native';
import Context from '../../Context/context';
import type {AppContext} from '../../types/AppContextType';
import type {PropsWithChildren} from 'react';
import type {
  HomeNavigationRoutesType,
  NavigationRoutesType,
} from '../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';

type HomeScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeNavigationRoutesType, 'HomeScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const {userProfile} = React.useContext(Context) as AppContext;

  return (
    <View style={styles.homeScreenView}>
      <Text style={styles.title}>Home Screen</Text>
      <Text style={styles.text}>Hello {userProfile.name}</Text>
      <Button
        title="Go to Profile"
        onPress={() =>
          navigation.navigate('ProfileStack', {screen: 'ProfileScreen'})
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  homeScreenView: {
    flex: 1,
    alignItems: 'center',
  },
  rowcontainer: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 20,
    marginRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  title: {
    marginTop: 20,
    marginLeft: 20,
    fontSize: 30,
  },
  text: {
    padding: 10,
    fontSize: 20,
  },
});

export default HomeScreen;
