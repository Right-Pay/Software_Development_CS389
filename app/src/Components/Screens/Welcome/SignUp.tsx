import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PropsWithChildren } from 'react';
import React, { useCallback, useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Icon from 'react-native-ionicons';
import AuthContext from '../../../Context/authContext';
import useColorsMode from '../../../Helpers/Colors';
import { AuthContextType } from '../../../types/AuthContextType';
import type { WelcomeNavigationRoutesType } from '../../../types/NavigationRoutesType';
import InputBox from '../../Common/InputBox';
import KeyboardAvoidingViewScroll from '../../Common/KeyboardAvoidingViewScroll';
import PrimaryButton from '../../Common/PrimaryButton';
import PrimaryText from '../../Common/PrimaryText';
import TitleText from '../../Common/TitleText';
import WrapperView from '../../Common/WrapperView';

type SignUpScreenProps = NativeStackScreenProps<
  WelcomeNavigationRoutesType,
  'Register'
> &
  PropsWithChildren;

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [email, setEmail] = React.useState<string>('');
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [repeatedPassword, setRepeatedPassword] = React.useState<string>('');
  const { colors } = useColorsMode();

  const { signUp, clearAuthErrors, AuthErrorComponent, userToken } =
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
        <Icon name="arrow-back" color={colors.primary} />
        <PrimaryText className="ml-2 text-xl text-center font-bold">
          Back
        </PrimaryText>
      </Pressable>
    );
  }, [colors.primary, navigation]);

  return (
    <WrapperView className="pb-0">
      <KeyboardAvoidingViewScroll>
        <View className="flex-1 flex-col w-full h-screen items-center mb-0">
          <TitleText className="mt-24 mb-10">Sign Up</TitleText>
          <InputBox
            placeholder="Email"
            className="mb-2"
            onChange={event => setEmail(event.nativeEvent.text)}
          />
          <InputBox
            placeholder="Username"
            className="mb-2"
            onChange={event => setUsername(event.nativeEvent.text)}
          />
          <InputBox
            placeholder="Password"
            className="mb-2"
            secureTextEntry={true}
            onChange={event => setPassword(event.nativeEvent.text)}
          />
          <InputBox
            placeholder="Repeat Password"
            className="mb-10"
            secureTextEntry={true}
            onChange={event => setRepeatedPassword(event.nativeEvent.text)}
          />
          <PrimaryButton
            onPress={async () => {
              await signUp(email, username, password, repeatedPassword);
              navigation.navigate('VerifyEmailScreen');
            }}>
            <PrimaryText type="secondary" className="text-xl">
              Sign Up
            </PrimaryText>
          </PrimaryButton>
          {userToken && (
            <TitleText>'You have successfully signed up'</TitleText>
          )}
          {AuthErrorComponent && <AuthErrorComponent />}
          {backButton()}
        </View>
      </KeyboardAvoidingViewScroll>
    </WrapperView>
  );
};

export default SignUpScreen;
