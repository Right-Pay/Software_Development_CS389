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
  MainButtonText,
  FinePrint,
  FinePrintButton,
  AuthButton,
  LogoContainer,
  Logo,
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
      <LogoContainer>
        <Logo
          source={require('../../../Assets/RightPay-logo-light-transparent.png')}
        />
      </LogoContainer>
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
        <MainButtonText>Log In</MainButtonText>
      </AuthButton>
    </WrapperView>
  );
};

export default LogInScreen;
