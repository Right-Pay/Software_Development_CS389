import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PropsWithChildren } from 'react';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import AuthContext from '../../../Context/authContext';
import KeyboardAvoidingViewScroll from '../../../Helpers/KeyboardAvoidingViewScroll';
import {
  AuthButton,
  AuthButtonText,
  AuthInputBox,
  Logo,
  LogoContainer,
  Title,
} from '../../../Helpers/StylizedComponents';
import WrapperView from '../../../Helpers/WrapperView';
import { AuthContextType } from '../../../types/AuthContextType';
import type { WelcomeNavigationRoutesType } from '../../../types/NavigationRoutesType';

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

  const {signUp, clearAuthErrors, AuthErrorComponent, userToken} =
    React.useContext(AuthContext) as AuthContextType;
  useEffect(() => {
    clearAuthErrors();
  }, [clearAuthErrors]);
  return (
    <WrapperView className="pb-0">
      <KeyboardAvoidingViewScroll>
        <View className="flex-1 flex-col w-full justify-center h-screen items-center mb-0">
          <Title className="mt-20">Sign Up for RightPay</Title>
          <LogoContainer>
            <Logo
              source={require('../../../Assets/RightPay-logo-light-transparent.png')}
            />
          </LogoContainer>
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
          <AuthButton
            onPress={async () => {
              await signUp(email, username, password, repeatedPassword);
              userToken && navigation.navigate('Login');
            }}>
            <AuthButtonText>Sign Up</AuthButtonText>
          </AuthButton>
          {userToken && <Title>'You have successfully signed up'</Title>}
          {AuthErrorComponent && <AuthErrorComponent />}
        </View>
      </KeyboardAvoidingViewScroll>
    </WrapperView>
  );
};

export default SignUpScreen;
