import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import type {WelcomeNavigationRoutesType} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthContextType} from '../../../types/AuthContextType';
import AuthContext from '../../../Context/authContext';
import {
  AuthButton,
  AuthButtonText,
  AuthInputBox,
  Logo,
  LogoContainer,
  Title,
  WrapperView,
} from '../../../Helpers/StylizedComponents';

type ForgotPasswordScreenProps = NativeStackScreenProps<
  WelcomeNavigationRoutesType,
  'ForgotPassword'
> &
  PropsWithChildren;

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const {clearAuthErrors, resetPassword, AuthErrorComponent} = React.useContext(
    AuthContext,
  ) as AuthContextType;
  const [email, setEmail] = React.useState<string>('');
  useEffect(() => {
    clearAuthErrors();
  }, [clearAuthErrors]);

  return (
    <WrapperView>
      <Title>Forgot your Password for RightPay?</Title>
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
      {AuthErrorComponent && <AuthErrorComponent />}
      <AuthButton
        onPress={() => {
          resetPassword(email);
          setTimeout(() => {
            navigation.navigate('Login');
          }, 3000);
        }}>
        <AuthButtonText>Reset Password</AuthButtonText>
      </AuthButton>
    </WrapperView>
  );
};

export default ForgotPasswordScreen;
