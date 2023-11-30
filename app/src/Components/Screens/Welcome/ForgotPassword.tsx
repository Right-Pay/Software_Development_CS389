import React, {useCallback, useEffect} from 'react';
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
  Subtitle,
  Title,
  WrapperView,
} from '../../../Helpers/StylizedComponents';
import KeyboardAvoidingViewScroll from '../../../Helpers/KeyboardAvoidingViewScroll';
import {Pressable, View} from 'react-native';
import Icon from 'react-native-ionicons';

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
          {backButton()}
        </View>
      </KeyboardAvoidingViewScroll>
    </WrapperView>
  );
};

export default ForgotPasswordScreen;
