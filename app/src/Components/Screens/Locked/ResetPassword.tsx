import React, {useEffect} from 'react';
import {View, StyleSheet, Text, Button, TextInput} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {WelcomeNavigationRoutesType} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthContextType} from '../../../types/AuthContextType';
import AuthContext from '../../../Context/authContext';
import {styled} from 'nativewind';

type ResetPasswordScreenProps = NativeStackScreenProps<
  WelcomeNavigationRoutesType,
  'ResetPassword'
> &
  PropsWithChildren;

const StylizedInput = styled(TextInput);

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  navigation,
}) => {
  const {
    clearAuthErrors,
    addAuthError,
    checkEqualPasswords,
    AuthErrorComponent,
  } = React.useContext(AuthContext) as AuthContextType;

  const [password, setPassword] = React.useState<string>('');
  const [confirmPassword, setConfirmPassword] = React.useState<string>('');
  useEffect(() => {
    clearAuthErrors();
  }, []);
  return (
    <View style={styles.resetPasswordScreenView}>
      <Text style={styles.titleTop}>Reset your Password for</Text>
      <Text style={styles.titleBottom}>RightPay</Text>
      <StylizedInput
        className="flex h-9 w-1/2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="New Password"
        style={styles.credentialsText}
        placeholderTextColor="#AFAEAE"
        secureTextEntry={true}
        onChange={event => {
          setPassword(event.nativeEvent.text);
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
        }}
      />
      {AuthErrorComponent && <AuthErrorComponent />}
      <Button
        title="Reset"
        onPress={() => {
          clearAuthErrors();
          checkEqualPasswords(password, confirmPassword)
            ? navigation.navigate('Login')
            : addAuthError('3');
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
  titleTop: {
    marginTop: 100,
    fontSize: 30,
  },
  titleBottom: {
    marginTop: 0,
    marginLeft: 20,
    fontSize: 30,
  },
  credentialsText: {
    padding: 10,
    fontSize: 20,
    color: 'black',
  },
  text: {
    color: 'black',
    padding: 10,
    fontSize: 20,
  },
});

export default ResetPasswordScreen;
