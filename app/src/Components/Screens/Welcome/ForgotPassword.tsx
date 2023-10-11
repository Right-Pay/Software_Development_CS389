import React from 'react';
import {View, StyleSheet, Text, Button} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {WelcomeNavigationRoutesType} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

type ForgotPasswordScreenProps = NativeStackScreenProps<
  WelcomeNavigationRoutesType,
  'ForgotPassword'
> &
  PropsWithChildren;

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  return (
    <View style={styles.forgotPasswordScreenView}>
      <Text style={styles.title}>Forgot your Password for RightPay?</Text>
      <Text style={styles.text}>Email</Text>
      <Button
        title="Reset Password"
        onPress={() => navigation.navigate('ResetPassword')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  forgotPasswordScreenView: {
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

export default ForgotPasswordScreen;
