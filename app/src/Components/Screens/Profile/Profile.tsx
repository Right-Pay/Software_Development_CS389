import React from 'react';
import {View, StyleSheet, FlatList, Text, Button} from 'react-native';
import Context from '../../../Context/context';
import type {AppContext} from '../../../types/AppContextType';
import type {PropsWithChildren} from 'react';
import type {
  ProfileNavigationRoutesType,
  NavigationRoutesType,
} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';

type ProfileScreenProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileNavigationRoutesType, 'ProfileScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const ProfileScreen: React.FC<ProfileScreenProps> = ({navigation}) => {
  const {creditCards} = React.useContext(Context) as AppContext;

  return (
    <View style={styles.homeScreenView}>
      <Text style={styles.title}>Profile Screen</Text>
      <FlatList
        data={creditCards}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => {
          return (
            <View style={styles.rowcontainer}>
              <Text style={styles.text}>Credit Card {index}:</Text>
              <Text style={styles.text}>Card Number: {item.cardNumber}</Text>
              <Text style={styles.text}>Card Type: {item.cardType}</Text>
            </View>
          );
        }}
      />
      <Button
        title="Go Home"
        onPress={() => navigation.navigate('HomeStack', {screen: 'HomeScreen'})}
      />
      <Button
        title="Settings"
        onPress={() => navigation.navigate('ProfileSettings')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  homeScreenView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

export default ProfileScreen;
