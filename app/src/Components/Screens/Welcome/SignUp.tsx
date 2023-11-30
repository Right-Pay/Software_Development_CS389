import React, {useCallback, useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import type {WelcomeNavigationRoutesType} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import AuthContext from '../../../Context/authContext';
import {AuthContextType} from '../../../types/AuthContextType';
import {
  AuthButton,
  AuthButtonText,
  AuthInputBox,
  Logo,
  LogoContainer,
  Subtitle,
  Title,
  WrapperView,
} from '../../../Helpers/StylizedComponents';
import KeyboardAvoidingViewScroll from '../../../Helpers/KeyboardAvoidingViewScroll';
import {Pressable, View} from 'react-native';
import Icon from 'react-native-ionicons';

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
          {backButton()}
        </View>
      </KeyboardAvoidingViewScroll>
    </WrapperView>
  );
};

export default SignUpScreen;
