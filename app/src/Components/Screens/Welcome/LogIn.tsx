import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import type {WelcomeNavigationRoutesType} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import AuthContext from '../../../Context/authContext';
import {AuthContextType} from '../../../types/AuthContextType';
import {
  Title,
  AuthInputBox,
  WrapperView,
  ButtonText,
  FinePrint,
  FinePrintButton,
  AuthButton,
} from '../../../Helpers/StylizedComponents';

type LogInScreenProps = NativeStackScreenProps<
  WelcomeNavigationRoutesType,
  'Login'
> &
  PropsWithChildren;

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
    <WrapperView>
      <Title>Log In to Your RightPay Account</Title>
      <WrapperView className="justify-center h-full w-full">
        <AuthInputBox
          placeholder="Email Address"
          placeholderTextColor="#AFAEAE"
          onChange={event => setEmail(event.nativeEvent.text)}
        />
        <AuthInputBox
          placeholder="Password"
          placeholderTextColor="#AFAEAE"
          secureTextEntry={true}
          onChange={event => setPassword(event.nativeEvent.text)}
        />
        <FinePrintButton
          className="flex pb-1"
          onPress={() => navigation.navigate('ForgotPassword')}>
          <FinePrint className="text-sm text-black">Forgot Password?</FinePrint>
        </FinePrintButton>
        {AuthErrorComponent && <AuthErrorComponent />}
        <AuthButton
          onPress={() => {
            signIn(email, password);
          }}>
          <ButtonText className="text-xl">Log In</ButtonText>
        </AuthButton>
      </WrapperView>
    </WrapperView>
  );
};

export default LogInScreen;
