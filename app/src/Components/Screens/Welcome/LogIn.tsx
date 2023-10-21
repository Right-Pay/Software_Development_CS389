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
          placeholderTextColor={'black'}
          onChange={event => setEmail(event.nativeEvent.text)}
        />
        <AuthInputBox
          placeholder="Password"
          placeholderTextColor={'black'}
          secureTextEntry={true}
          onChange={event => setPassword(event.nativeEvent.text)}
        />
        <FinePrintButton onPress={() => navigation.navigate('ForgotPassword')}>
          <FinePrint>Forgot Password?</FinePrint>
        </FinePrintButton>
        {AuthErrorComponent && <AuthErrorComponent />}
        <AuthButton
          onPress={() => {
            signIn(email, password);
          }}>
          <ButtonText>Log In</ButtonText>
        </AuthButton>
      </WrapperView>
    </WrapperView>
  );
};

export default LogInScreen;
