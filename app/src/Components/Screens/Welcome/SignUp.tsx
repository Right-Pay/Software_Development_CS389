import React, {useEffect} from 'react';
import {View, Text, Pressable, TextInput} from 'react-native';
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
const StylizedText = styled(Text);
const StylizedPress = styled(Pressable);
const StylizedView = styled(View);

const SignUpScreen: React.FC<SignUpScreenProps> = ({navigation}) => {
  const [email, setEmail] = React.useState<string>('');
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [repeatedPassword, setRepeatedPassword] = React.useState<string>('');
  const headingClassName =
    'mt-20 text-3xl text-center font-bold text-dark-green';
  const inputClassName =
    'px-3 py-1 m-1 text-xl text-black flex h-9 w-1/2 rounded-xl border border-dark-green bg-light-green shadow-sm transition-colors';

  const {signUp, clearAuthErrors, signedUp, AuthErrorComponent} =
    React.useContext(AuthContext) as AuthContextType;
  useEffect(() => {
    clearAuthErrors();
  }, []);
  return (
    <StylizedView className="flex-1 items-center bg-light-green">
      <StylizedText className={headingClassName}>
        Sign Up for RightPay
      </StylizedText>
      <StylizedView className="flex items-center justify-center h-full w-full">
        <StylizedInput
          className={inputClassName}
          placeholder="Email"
          placeholderTextColor="#AFAEAE"
          onChange={event => setEmail(event.nativeEvent.text)}
        />
        <StylizedInput
          className={inputClassName}
          placeholder="Username"
          placeholderTextColor="#AFAEAE"
          onChange={event => setUsername(event.nativeEvent.text)}
        />
        <StylizedInput
          className={inputClassName}
          placeholder="Password"
          placeholderTextColor="#AFAEAE"
          secureTextEntry={true}
          onChange={event => setPassword(event.nativeEvent.text)}
        />
        <StylizedInput
          className={inputClassName}
          placeholder="Repeat Password"
          placeholderTextColor="#AFAEAE"
          secureTextEntry={true}
          onChange={event => setRepeatedPassword(event.nativeEvent.text)}
        />
        {AuthErrorComponent && <AuthErrorComponent />}
        <StylizedPress
          className="flex color items-center justify-center m-2 text-xl text-black flex h-9 w-5/12 rounded-xl bg-dark-green shadow-sm transition-colors"
          onPress={async () => {
            await signUp(email, username, password, repeatedPassword);
            signedUp && navigation.navigate('Login');
          }}>
          <StylizedText className="text-xl text-white">Sign Up</StylizedText>
        </StylizedPress>
        <StylizedText className={headingClassName}>
          {signedUp && 'You have successfully signed up\nRedirecting to login'}
        </StylizedText>
      </StylizedView>
    </StylizedView>
  );
};

export default SignUpScreen;
