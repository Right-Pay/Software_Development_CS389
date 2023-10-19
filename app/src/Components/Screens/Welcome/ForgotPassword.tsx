import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import type {WelcomeNavigationRoutesType} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthContextType} from '../../../types/AuthContextType';
import AuthContext from '../../../Context/authContext';
import {
  AuthButton,
  AuthInputBox,
  ButtonText,
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
  const {clearAuthErrors, resetPassword, AuthErrorComponent, resetVariables} =
    React.useContext(AuthContext) as AuthContextType;
  const [email, setEmail] = React.useState<string>('');
  useEffect(() => {
    clearAuthErrors();
  }, []);

  return (
    <WrapperView>
      <Title>Forgot your Password for RightPay?</Title>
      <WrapperView className="justify-center h-full w-full">
        <AuthInputBox
          placeholder="Email Address"
          onChange={event => setEmail(event.nativeEvent.text)}
        />
        {AuthErrorComponent && <AuthErrorComponent />}
        <AuthButton
          onPress={() => {
            resetPassword(email);
            setTimeout(() => {
              resetVariables();
              navigation.navigate('Login');
            }, 3000);
          }}>
          <ButtonText>Reset Password</ButtonText>
        </AuthButton>
      </WrapperView>
    </WrapperView>
  );
};

export default ForgotPasswordScreen;
