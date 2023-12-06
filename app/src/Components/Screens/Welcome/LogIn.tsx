import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PropsWithChildren } from 'react';
import React, { useCallback, useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Icon from 'react-native-ionicons';
import AuthContext from '../../../Context/authContext';
import { AuthContextType } from '../../../types/AuthContextType';
import type { WelcomeNavigationRoutesType } from '../../../types/NavigationRoutesType';
import InputBox from '../../Common/InputBox';
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

  const backButton = useCallback(() => {
    return (
      <Pressable
        className="flex-1 flex-row pl-4 h-10 justify-start items-center text-center top-10 left-0 absolute"
        onPress={() => {
          navigation.goBack();
        }}>
        <Icon name="arrow-back" color="#4d654e" />
        <PrimaryText className="ml-2 text-xl text-center font-bold">
          Back
        </PrimaryText>
      </Pressable>
    );
  }, [navigation]);

  return (
    <WrapperView className="pb-0">
      {/* <KeyboardAvoidingViewScroll> */}
      <View className="flex-1 flex-col w-full h-screen justify-start items-center mb-0 pb-0">
        <TitleText className="mt-20 mb-4">Log In</TitleText>
        <InputBox
          placeholder="Email Address"
          className="mb-2"
          onChange={event => setEmail(event.nativeEvent.text)}
        />
        <InputBox
          placeholder="Password"
          secureTextEntry={true}
          className="mb-2"
          onChange={event => setPassword(event.nativeEvent.text)}
        />
        <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
          <PrimaryText className="text-sm">Forgot Password?</PrimaryText>
        </Pressable>
        <PrimaryButton
          onPress={() => {
            signIn(email, password);
          }}>
          <PrimaryText type="secondary" className="text-xl">
            Log In
          </PrimaryText>
        </PrimaryButton>
        {AuthErrorComponent && <AuthErrorComponent />}
        {backButton()}
      </View>
      {/* </KeyboardAvoidingViewScroll> */}
    </WrapperView>
  );
};

export default LogInScreen;
