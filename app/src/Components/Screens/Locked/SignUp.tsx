import React, {useEffect} from 'react';
import {View, StyleSheet, Text, Button, TextInput} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {WelcomeNavigationRoutesType} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {styled} from 'nativewind';
import AuthContext from '../../../Context/authContext';
import {AuthContextType} from '../../../types/AuthContextType';

type SignUpScreenProps = NativeStackScreenProps<
  WelcomeNavigationRoutesType,
  'Register'
> &
  PropsWithChildren;

const StylizedInput = styled(TextInput);

const SignUpScreen: React.FC<SignUpScreenProps> = ({navigation}) => {
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [repeatedPassword, setRepeatedPassword] = React.useState<string>('');
  const {signUp, clearAuthErrors, signedUp, AuthErrorComponent} =
    React.useContext(AuthContext) as AuthContextType;
  useEffect(() => {
    clearAuthErrors();
  }, []);
  return (
    <View style={styles.signUpScreenView}>
      <Text style={styles.title}>Sign Up for RightPay</Text>
      <StylizedInput
        className="flex h-9 w-1/2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Email"
        onChange={event => setEmail(event.nativeEvent.text)}
      />
      <StylizedInput
        className="flex h-9 w-1/2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Password"
        secureTextEntry={true}
        onChange={event => setPassword(event.nativeEvent.text)}
      />
      <StylizedInput
        className="flex h-9 w-1/2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Repeat Password"
        secureTextEntry={true}
        onChange={event => setRepeatedPassword(event.nativeEvent.text)}
      />
      {AuthErrorComponent && <AuthErrorComponent />}
      <Text style={styles.text}>
        {signedUp && 'You have successfully signed up\nRedirecting to login'}
      </Text>
      <Button
        title="Sign Up"
        onPress={async () => {
          await signUp(email, password, repeatedPassword);
          if (signedUp) {
            navigation.navigate('Login');
          }
        }}
      />
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
