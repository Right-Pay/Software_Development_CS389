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
import i18n from '../../../Localization/i18n';

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
          {i18n.t('Common.Back')}
        </PrimaryText>
      </Pressable>
    );
  }, [colors.primary, navigation, i18n.t]);

  return (
    <WrapperView className="pb-0">
      <KeyboardAvoidingViewScroll>
        <View className="flex-1 flex-col w-full h-screen items-center mb-0">
          <TitleText className="mt-24 mb-10">
            {i18n.t('Welcome.Signup')}
          </TitleText>
          <InputBox
            placeholder={i18n.t('Welcome.Email')}
            className="mb-2"
            onChange={event => setEmail(event.nativeEvent.text)}
          />
          <InputBox
            placeholder={i18n.t('Welcome.Username')}
            className="mb-2"
            onChange={event => setUsername(event.nativeEvent.text)}
          />
          <InputBox
            placeholder={i18n.t('Welcome.Password')}
            className="mb-2"
            secureTextEntry={true}
            onChange={event => setPassword(event.nativeEvent.text)}
          />
          <InputBox
            placeholder={i18n.t('Welcome.Confirm')}
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
              {i18n.t('Welcome.Signup')}
            </PrimaryText>
          </PrimaryButton>
          {userToken && <TitleText>{i18n.t('Welcome.Success')}</TitleText>}
          {AuthErrorComponent && <AuthErrorComponent />}
          {backButton()}
        </View>
      </KeyboardAvoidingViewScroll>
    </WrapperView>
  );
};

export default SignUpScreen;
