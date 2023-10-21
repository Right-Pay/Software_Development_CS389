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

  const {signUp, clearAuthErrors, userToken, AuthErrorComponent} =
    React.useContext(AuthContext) as AuthContextType;
  useEffect(() => {
    clearAuthErrors();
  }, []);
  return (
    <WrapperView>
      <Title>Sign Up for RightPay</Title>
      <WrapperView className="justify-center h-full w-full">
        <AuthInputBox
          placeholder="Email"
          placeholderTextColor={'black'}
          onChange={event => setEmail(event.nativeEvent.text)}
        />
        <AuthInputBox
          placeholder="Username"
          placeholderTextColor={'black'}
          onChange={event => setUsername(event.nativeEvent.text)}
        />
        <AuthInputBox
          placeholder="Password"
          placeholderTextColor={'black'}
          secureTextEntry={true}
          onChange={event => setPassword(event.nativeEvent.text)}
        />
        <AuthInputBox
          placeholder="Repeat Password"
          placeholderTextColor={'black'}
          secureTextEntry={true}
          onChange={event => setRepeatedPassword(event.nativeEvent.text)}
        />
        {AuthErrorComponent && <AuthErrorComponent />}
        <AuthButton
          onPress={async () => {
            await signUp(email, username, password, repeatedPassword);
            userToken && navigation.navigate('Login');
          }}>
          <ButtonText>Sign Up</ButtonText>
        </AuthButton>
        <Title>
          {userToken && 'You have successfully signed up\nRedirecting to login'}
        </Title>
      </WrapperView>
    </WrapperView>
  );
};

export default SignUpScreen;
