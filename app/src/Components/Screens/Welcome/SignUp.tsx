import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import type {WelcomeNavigationRoutesType} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import AuthContext from '../../../Context/authContext';
import {AuthContextType} from '../../../types/AuthContextType';
import {
  AuthButton,
  AuthInputBox,
  ButtonText,
  Title,
  WrapperView,
} from '../../../Helpers/StylizedComponents';

type SignUpScreenProps = NativeStackScreenProps<
  WelcomeNavigationRoutesType,
  'Register'
> &
  PropsWithChildren;

const SignUpScreen: React.FC<SignUpScreenProps> = ({navigation}) => {
  const [email, setEmail] = React.useState<string>('');
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [repeatedPassword, setRepeatedPassword] = React.useState<string>('');

  const {signUp, clearAuthErrors, signedUp, AuthErrorComponent} =
    React.useContext(AuthContext) as AuthContextType;
  useEffect(() => {
    clearAuthErrors();
  }, []);
  return (
    <WrapperView className="flex-1 items-center">
      <Title>Sign Up for RightPay</Title>
      <WrapperView className="justify-center h-full w-full">
        <AuthInputBox
          placeholder="Email"
          placeholderTextColor="#AFAEAE"
          onChange={event => setEmail(event.nativeEvent.text)}
        />
        <AuthInputBox
          placeholder="Username"
          placeholderTextColor="#AFAEAE"
          onChange={event => setUsername(event.nativeEvent.text)}
        />
        <AuthInputBox
          placeholder="Password"
          placeholderTextColor="#AFAEAE"
          secureTextEntry={true}
          onChange={event => setPassword(event.nativeEvent.text)}
        />
        <AuthInputBox
          placeholder="Repeat Password"
          placeholderTextColor="#AFAEAE"
          secureTextEntry={true}
          onChange={event => setRepeatedPassword(event.nativeEvent.text)}
        />
        {AuthErrorComponent && <AuthErrorComponent />}
        <AuthButton
          className="flex color items-center justify-center m-2 text-xl text-black flex h-9 w-5/12 rounded-xl bg-green-500 shadow-sm transition-colors"
          onPress={async () => {
            await signUp(email, username, password, repeatedPassword);
            signedUp && navigation.navigate('Login');
          }}>
          <ButtonText className="text-xl">Sign Up</ButtonText>
        </AuthButton>
        <Title>
          {signedUp && 'You have successfully signed up\nRedirecting to login'}
        </Title>
      </WrapperView>
    </WrapperView>
  );
};

export default SignUpScreen;
