import React from 'react';
import {View, StyleSheet, Text, Button} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {WelcomeNavigationRoutesType} from '../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

type SignUpScreenProps = NativeStackScreenProps<
  WelcomeNavigationRoutesType,
  'Register'
> &
  PropsWithChildren;

const SignUpScreen: React.FC<SignUpScreenProps> = ({navigation}) => {
  return (
    <View style={styles.signUpScreenView}>
      <Text style={styles.title}>Sign Up for RightPay</Text>
      <Text style={styles.text}>Email</Text>
      <Text style={styles.text}>Username</Text>
      <Text style={styles.text}>Password</Text>
      <Text style={styles.text}>Repeat Password</Text>
      <Button title="Log In" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

const styles = StyleSheet.create({
  signUpScreenView: {
    flex: 1,
    alignItems: 'center',
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

export default SignUpScreen;
