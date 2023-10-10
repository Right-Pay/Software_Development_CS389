import React, {useEffect} from 'react';
import {View, StyleSheet, Text, Button, TextInput} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {WelcomeNavigationRoutesType} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthContextType} from '../../../types/AuthContextType';
import AuthContext from '../../../Context/authContext';
import {styled} from 'nativewind';

type ForgotPasswordScreenProps = NativeStackScreenProps<
  WelcomeNavigationRoutesType,
  'VerifyEmail'
> &
  PropsWithChildren;

const StylizedInput = styled(TextInput);

const VerifyEmailScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const {addAuthError, clearAuthErrors, AuthErrorComponent} = React.useContext(
    AuthContext,
  ) as AuthContextType;
  const [code, setCode] = React.useState<string>('');
  useEffect(() => {
    clearAuthErrors();
  }, []);
  const verifyCode = () => {
    //will need to make this an api call at some point
    console.log('code: ' + code);
    return true;
  };

  return (
    <View style={styles.VerifyEmailScreen}>
      <Text style={styles.titleTop}>Enter Code Sent to Your Email</Text>
      <StylizedInput
        className="flex h-9 w-1/2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Code"
        style={styles.credentialsText}
        placeholderTextColor="#AFAEAE"
        onChange={event => setCode(event.nativeEvent.text)}
      />
      {AuthErrorComponent && <AuthErrorComponent />}
      <Button
        title="Reset Password"
        onPress={() =>
          verifyCode()
            ? navigation.navigate('ResetPassword')
            : addAuthError('invalidCode')
        }
      />
    </View>
  );
};
const styles = StyleSheet.create({
  VerifyEmailScreen: {
    flex: 1,
    alignItems: 'center',
  },
  titleTop: {
    marginTop: 100,
    fontSize: 30,
  },
  titleBottom: {
    marginBottom: 10,
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

export default VerifyEmailScreen;
