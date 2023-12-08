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
import { LanguageContextType } from '../../../types/LanguageContextType';
import LanguageContext from '../../../Context/languageContext';

type ForgotPasswordScreenProps = NativeStackScreenProps<
  WelcomeNavigationRoutesType,
  'ForgotPassword'
> &
  PropsWithChildren;

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const { clearAuthErrors, resetPassword, AuthErrorComponent } =
    React.useContext(AuthContext) as AuthContextType;
  const { translate } = React.useContext(
    LanguageContext,
  ) as LanguageContextType;

  const { colors } = useColorsMode();
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
        <Icon name="arrow-back" color={colors.primary} />
        <PrimaryText className="ml-2 text-xl text-center font-bold">
          {translate('Common', 'Back')}
        </PrimaryText>
      </Pressable>
    );
  }, [colors.primary, navigation, translate]);

  return (
    <WrapperView className="pb-0">
      <View className="flex-1 flex-col w-full h-screen items-center mb-0">
        <TitleText className="mt-24 w-10/12 mb-10">
          {translate('Welcome', 'Forgot')}
        </TitleText>
        <InputBox
          placeholder={translate('Welcome', 'Email')}
          className="mb-4"
          onChange={event => setEmail(event.nativeEvent.text)}
        />
        <PrimaryButton
          onPress={() => {
            resetPassword(email);
            setTimeout(() => {
              navigation.navigate('Login');
            }, 3000);
          }}>
          <PrimaryText type="secondary" className="text-xl">
            {translate('Welcome', 'Reset')}
          </PrimaryText>
        </PrimaryButton>
        {AuthErrorComponent && <AuthErrorComponent />}
        {backButton()}
      </View>
    </WrapperView>
  );
};

export default ForgotPasswordScreen;
