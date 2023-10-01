import React from 'react';
import {View, StyleSheet, Text, Button} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {WelcomeNavigationRoutesType} from '../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

type ResetPasswordScreenProps = NativeStackScreenProps<
  WelcomeNavigationRoutesType,
  'ResetPassword'
> &
  PropsWithChildren;

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  navigation,
}) => {
  return (
    <View style={styles.resetPasswordScreenView}>
      <Text style={styles.title}>Reset your Password for RightPay</Text>
      <Text style={styles.text}>Password</Text>
      <Text style={styles.text}>Confirm Password</Text>
      <Button title="Reset" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

const styles = StyleSheet.create({
  resetPasswordScreenView: {
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

export default ResetPasswordScreen;
