import React from 'react';
import {View, StyleSheet, Text, Button} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {WelcomeNavigationRoutesType} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import AuthContext from '../../../Context/authContext';
import {AuthContextType} from '../../../types/AuthContextType';
import {Input} from '../../../../@/components/ui/input';

type LogInScreenProps = NativeStackScreenProps<
  WelcomeNavigationRoutesType,
  'Login'
> &
  PropsWithChildren;

const LogInScreen: React.FC<LogInScreenProps> = ({navigation}) => {
  const {signIn} = React.useContext(AuthContext) as AuthContextType;
  return (
    <View style={styles.logInScreenView}>
      <Text style={styles.title}>Log In to RightPay</Text>
      <Text style={styles.text}>Username</Text>
      <Input />
      <Text style={styles.text}>Password</Text>
      <Button
        title="Log In"
        onPress={() => signIn('johndoe@gmail.com', 'password')}
      />
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
