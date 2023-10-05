import React from 'react';
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
  const {signIn} = React.useContext(AuthContext) as AuthContextType;
  const {signInError, isLoggedIn} = React.useContext(
    AuthContext,
  ) as AuthContextType;
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  return (
    <View style={styles.logInScreenView}>
      <Text style={styles.title}>Log In to RightPay</Text>
      <Text style={styles.text}>Username</Text>
      <StylizedInput
        className="flex h-9 w-1/2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Username"
        onChange={event => setUsername(event.nativeEvent.text)}
      />
      <Text style={styles.text}>Password</Text>
      <StylizedInput
        className="flex h-9 w-1/2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Password"
        secureTextEntry={true}
        onChange={event => setPassword(event.nativeEvent.text)}
      />
      <Button title="Log In" onPress={() => signIn(username, password)} />
      <Button
        title="Forgot Password"
        onPress={() => navigation.navigate('ForgotPassword')}
      />
      <Text style={styles.text}>
        {!isLoggedIn && typeof signInError === 'string' && signInError + ''}
      </Text>
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
