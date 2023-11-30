import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PropsWithChildren } from 'react';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import AuthContext from '../../../Context/authContext';
import {
  AuthInputBox,
  FinePrint,
  FinePrintButton,
  Logo,
  LogoContainer,
} from '../../../Helpers/StylizedComponents';
import { AuthContextType } from '../../../types/AuthContextType';
import type { WelcomeNavigationRoutesType } from '../../../types/NavigationRoutesType';
import KeyboardAvoidingViewScroll from '../../Common/KeyboardAvoidingViewScroll';
import PrimaryButton from '../../Common/PrimaryButton';
import PrimaryText from '../../Common/PrimaryText';
import TitleText from '../../Common/TitleText';
import WrapperView from '../../Common/WrapperView';

type LogInScreenProps = NativeStackScreenProps<
  WelcomeNavigationRoutesType,
  'Login'
> &
  PropsWithChildren;

const LogInScreen: React.FC<LogInScreenProps> = ({ navigation }) => {
  const { clearAuthErrors, AuthErrorComponent, signIn } = React.useContext(
    AuthContext,
  ) as AuthContextType;
  useEffect(() => {
    clearAuthErrors();
  }, [clearAuthErrors]);
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  return (
    <WrapperView className="pb-0">
      <KeyboardAvoidingViewScroll>
        <View className="flex-1 flex-col w-full h-screen justify-center items-center mb-0 pb-0">
          <TitleText className="mt-20">
            Log In to Your RightPay Account
          </TitleText>
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
          <FinePrintButton
            onPress={() => navigation.navigate('ForgotPassword')}>
            <FinePrint>Forgot Password?</FinePrint>
          </FinePrintButton>
          <PrimaryButton
            onPress={() => {
              signIn(email, password);
            }}>
            <PrimaryText type="secondary" className="text-xl">
              Log In
            </PrimaryText>
          </PrimaryButton>
          {AuthErrorComponent && <AuthErrorComponent />}
        </View>
      </KeyboardAvoidingViewScroll>
    </WrapperView>
  );
};

export default LogInScreen;
