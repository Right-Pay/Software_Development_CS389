import React, {useEffect} from 'react';
import {View, StyleSheet, Text, Button, TextInput} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {WelcomeNavigationRoutesType} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import AuthContext from '../../../Context/authContext';
import {AuthContextType} from '../../../types/AuthContextType';
import {styled} from 'nativewind';

type LogInScreenProps = NativeStackScreenProps<
  WelcomeNavigationRoutesType,
  'Login'
> &
  PropsWithChildren;

const StylizedInput = styled(TextInput);

const LogInScreen: React.FC<LogInScreenProps> = ({navigation}) => {
  const {clearAuthErrors, AuthErrorComponent, signIn} = React.useContext(
    AuthContext,
  ) as AuthContextType;
  useEffect(() => {
    clearAuthErrors();
  }, []);
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  return (
    <View style={styles.logInScreenView}>
      <Text style={styles.titleTop}>Log In to Your</Text>
      <Text style={styles.titleBottom}>RightPay Account</Text>
      <StylizedInput
        className="flex h-9 w-1/2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Email Address"
        style={styles.credentialsText}
        placeholderTextColor="#AFAEAE"
        onChange={event => {
          setEmail(event.nativeEvent.text);
        }}
      />
      <StylizedInput
        className="flex h-9 w-1/2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Password"
        secureTextEntry={true}
        style={styles.credentialsText}
        placeholderTextColor="#AFAEAE"
        onChange={event => {
          setPassword(event.nativeEvent.text);
        }}
      />
      <Text
        className="flex h-9 w-1/2 py-1 text-sm transition-colors file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        style={styles.forgotPassword}
        onPress={() => navigation.navigate('ForgotPassword')}>
        Forgot Password?
      </Text>
      {AuthErrorComponent && <AuthErrorComponent />}
      <Button
        title="Log In"
        onPress={() => {
          clearAuthErrors();
          signIn(email, password);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logInScreenView: {
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
  },
  passwordContainer: {
    flexDirection: 'column', // Align children horizontally
    alignItems: 'center', // Center items vertically
  },
  forgotPassword: {
    color: 'grey',
    marginLeft: 10, // Add marginLeft for spacing
  },
});

export default LogInScreen;
