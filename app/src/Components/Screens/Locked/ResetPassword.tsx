import React, {useEffect} from 'react';
import {View, StyleSheet, Text, Button, TextInput} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {WelcomeNavigationRoutesType} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthContextType} from '../../../types/AuthContextType';
import AuthContext from '../../../Context/authContext';
import {styled} from 'nativewind';
import accountAuthFunctions from '../../../Helpers/accountAuthFunctions';
import SignInError from '../../../Helpers/SignInError';

type ResetPasswordScreenProps = NativeStackScreenProps<
  WelcomeNavigationRoutesType,
  'ResetPassword'
> &
  PropsWithChildren;

const StylizedInput = styled(TextInput);

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  navigation,
}) => {
  const {clearSignInErrors, addSignInError} = React.useContext(
    AuthContext,
  ) as AuthContextType;

  const [password, setPassword] = React.useState<string>('');
  const [confirmPassword, setConfirmPassword] = React.useState<string>('');
  useEffect(() => {
    clearSignInErrors();
  }, []);
  return (
    <View style={styles.resetPasswordScreenView}>
      <Text style={styles.title}>Reset your Password for RightPay</Text>
      <StylizedInput
        className="flex h-9 w-1/2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="New Password"
        style={styles.credentialsText}
        placeholderTextColor="#AFAEAE"
        secureTextEntry={true}
        onChange={event => {
          setPassword(event.nativeEvent.text);
          clearSignInErrors();
        }}
      />
      <StylizedInput
        className="flex h-9 w-1/2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Confirm Password"
        style={styles.credentialsText}
        placeholderTextColor="#AFAEAE"
        secureTextEntry={true}
        onChange={event => {
          setConfirmPassword(event.nativeEvent.text);
          clearSignInErrors();
        }}
      />
      {SignInError()}
      <Button
        title="Reset"
        onPress={() => {
          password === confirmPassword &&
          accountAuthFunctions.checkValidPassword(password)
            ? navigation.navigate('Login')
            : addSignInError('3');
        }}
      />
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
  credentialsText: {
    padding: 10,
    fontSize: 20,
    color: 'black',
  },
});

export default ResetPasswordScreen;
