import React from 'react';
import {View, StyleSheet, Text, Button} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {WelcomeNavigationRoutesType} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

type LogInScreenProps = NativeStackScreenProps<
  WelcomeNavigationRoutesType,
  'Login'
> &
  PropsWithChildren;

const LogInScreen: React.FC<LogInScreenProps> = ({navigation}) => {
  return (
    <View style={styles.logInScreenView}>
      <Text style={styles.title}>Log In to RightPay</Text>
      <Text style={styles.text}>Username</Text>
      <Text style={styles.text}>Password</Text>
      <Button
        title="Forgot Password"
        onPress={() => navigation.navigate('ForgotPassword')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logInScreenView: {
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

export default LogInScreen;
