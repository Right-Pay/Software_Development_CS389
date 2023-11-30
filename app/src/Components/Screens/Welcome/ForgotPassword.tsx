import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PropsWithChildren } from 'react';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import AuthContext from '../../../Context/authContext';
import {
  AuthButton,
  AuthButtonText,
  AuthInputBox,
  Logo,
  LogoContainer,
  Title,
} from '../../../Helpers/StylizedComponents';
import { AuthContextType } from '../../../types/AuthContextType';
import type { WelcomeNavigationRoutesType } from '../../../types/NavigationRoutesType';
import KeyboardAvoidingViewScroll from '../../Common/KeyboardAvoidingViewScroll';
import WrapperView from '../../Common/WrapperView';

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
    <WrapperView className="pb-0">
      <KeyboardAvoidingViewScroll>
        <View className="flex-1 flex-col w-full justify-center h-screen items-center mb-0">
          <Title className="mt-20">Forgot your Password for RightPay?</Title>
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
          <AuthButton
            onPress={() => {
              resetPassword(email);
              setTimeout(() => {
                navigation.navigate('Login');
              }, 3000);
            }}>
            <AuthButtonText>Reset Password</AuthButtonText>
          </AuthButton>
          {AuthErrorComponent && <AuthErrorComponent />}
        </View>
      </KeyboardAvoidingViewScroll>
    </WrapperView>
  );
};

export default ForgotPasswordScreen;
