import React, {useCallback, useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import type {WelcomeNavigationRoutesType} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import AuthContext from '../../../Context/authContext';
import {AuthContextType} from '../../../types/AuthContextType';
import {
  Title,
  AuthInputBox,
  WrapperView,
  FinePrint,
  FinePrintButton,
  AuthButton,
  LogoContainer,
  Logo,
  AuthButtonText,
  Subtitle,
} from '../../../Helpers/StylizedComponents';
import KeyboardAvoidingViewScroll from '../../../Helpers/KeyboardAvoidingViewScroll';
import {Pressable, View} from 'react-native';
import Icon from 'react-native-ionicons';

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
  }, [clearAuthErrors]);
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');

  const backButton = useCallback(() => {
    return (
      <Pressable
        className="flex-1 flex-row pl-4 h-10 justify-start items-center text-center top-10 left-0 absolute"
        onPress={() => {
          navigation.goBack();
        }}>
        <Icon name="arrow-back" color="#4d654e" />
        <Subtitle className="ml-2 font-bold text-dark-green">Back</Subtitle>
      </Pressable>
    );
  }, [navigation]);

  return (
    <WrapperView className="pb-0">
      <KeyboardAvoidingViewScroll>
        <View className="flex-1 flex-col w-full h-screen justify-center items-center mb-0 pb-0">
          <Title className="mt-20">Log In to Your RightPay Account</Title>
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
          <AuthButton
            onPress={() => {
              signIn(email, password);
            }}>
            <AuthButtonText>Log In</AuthButtonText>
          </AuthButton>
          {AuthErrorComponent && <AuthErrorComponent />}
          {backButton()}
        </View>
      </KeyboardAvoidingViewScroll>
    </WrapperView>
  );
};

export default LogInScreen;
