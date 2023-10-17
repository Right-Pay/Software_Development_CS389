import React from 'react';
import {View, StyleSheet, Text, Button} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {
  ProfileNavigationRoutesType,
  NavigationRoutesType,
} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import type {AuthContextType} from '../../../types/AuthContextType';
import AuthContext from '../../../Context/authContext';

type ProfileSettingsProps = CompositeScreenProps<
  NativeStackScreenProps<ProfileNavigationRoutesType, 'ProfileSettings'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const ProfileSettings: React.FC<ProfileSettingsProps> = ({navigation}) => {
  const {userProfile} = React.useContext(AuthContext) as AuthContextType;

  return (
    <View style={styles.homeScreenView}>
      <Text style={styles.title}>Profile Screen</Text>
      <Text style={styles.textPadding}>
        Hello, you will soon be able to edit theese!
      </Text>
      <Text style={styles.text}>Username: {userProfile.username}</Text>
      <Text style={styles.text}>Email: {userProfile.email}</Text>
      <Text style={styles.text}>Phone: {userProfile.phone}</Text>
      <Text style={styles.text}>Address: {userProfile.address}</Text>
      <Text style={styles.text}>City: {userProfile.city}</Text>
      <Text style={styles.text}>State: {userProfile.state}</Text>
      <Text style={styles.text}>Zip: {userProfile.zip}</Text>
      <Button title="Edit Credit Cards" />

      <Button title="Go Back" onPress={() => navigation.goBack()} />
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
  textPadding: {
    paddingTop: 30,
    padding: 10,
    fontSize: 20,
  },
});

export default ProfileSettings;
