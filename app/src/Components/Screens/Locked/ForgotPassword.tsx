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

type ForgotPasswordScreenProps = NativeStackScreenProps<
  WelcomeNavigationRoutesType,
  'ForgotPassword'
> &
  PropsWithChildren;

const StylizedInput = styled(TextInput);

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const {addSignInError, clearSignInErrors} = React.useContext(
    AuthContext,
  ) as AuthContextType;
  const [email, setEmail] = React.useState<string>('');
  useEffect(() => {
    clearSignInErrors();
  }, []);

  return (
    <View style={styles.forgotPasswordScreenView}>
      <Text style={styles.titleTop}>Forgot your Password for RightPay?</Text>
      <StylizedInput
        className="flex h-9 w-1/2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Email Address"
        style={styles.credentialsText}
        placeholderTextColor="#AFAEAE"
        onChange={event => setEmail(event.nativeEvent.text)}
      />
      <Button
        title="Reset Password"
        onPress={() => {
          if (accountAuthFunctions.checkValidEmail(email)) {
            navigation.navigate('VerifyEmail');
          } else {
            addSignInError('1');
          }
        }}
      />
      {SignInError()}
    </View>
  );
};
const styles = StyleSheet.create({
  forgotPasswordScreenView: {
    flex: 1,
    alignItems: 'center',
  },
  titleTop: {
    marginTop: 100,
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
});

export default ForgotPasswordScreen;
