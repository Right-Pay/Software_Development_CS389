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
import PrimaryButton from '../../Common/PrimaryButton';
import PrimaryText from '../../Common/PrimaryText';
import TitleText from '../../Common/TitleText';
import WrapperView from '../../Common/WrapperView';
import i18n from '../../../Localization/i18n';

type LogInScreenProps = NativeStackScreenProps<
  WelcomeNavigationRoutesType,
  'Login'
> &
  PropsWithChildren;

const LogInScreen: React.FC<LogInScreenProps> = ({ navigation }) => {
  const {
    clearAuthErrors,
    AuthErrorComponent,
    signIn,
    needsUsername,
    retrieveVerifiedEmail,
  } = React.useContext(AuthContext) as AuthContextType;

  useEffect(() => {
    clearAuthErrors();
  }, [clearAuthErrors]);
  const { colors } = useColorsMode();
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [username, setUsername] = React.useState<string>('');

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
  }, [colors.primary, navigation]);

  return (
    <WrapperView className="pb-0">
      {/* <KeyboardAvoidingViewScroll> */}
      <View className="flex-1 flex-col w-full h-screen justify-start items-center mb-0 pb-0">
        <TitleText className="mt-20 mb-4">{i18n.t('Welcome.Login')}</TitleText>
        <InputBox
          placeholder={i18n.t('Welcome.Email')}
          className="mb-2"
          onChange={event => setEmail(event.nativeEvent.text)}
        />
        <InputBox
          placeholder={i18n.t('Welcome.Password')}
          secureTextEntry={true}
          className="mb-2"
          onChange={event => setPassword(event.nativeEvent.text)}
        />
        {needsUsername && (
          <InputBox
            placeholder={i18n.t('Welcome.Username')}
            className="mb-2"
            onChange={event => setUsername(event.nativeEvent.text)}
          />
        )}
        <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
          <PrimaryText className="text-sm">
            {i18n.t('Welcome.Forgot')}
          </PrimaryText>
        </Pressable>
        <PrimaryButton
          onPress={async () => {
            needsUsername
              ? await signIn(email, password, username)
              : await signIn(email, password);
            await retrieveVerifiedEmail().then(ret => {
              if (!ret) {
                navigation.navigate('VerifyEmailScreen');
              }
            });
          }}>
          <PrimaryText type="secondary" className="text-xl">
            {i18n.t('Welcome.Login')}
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
