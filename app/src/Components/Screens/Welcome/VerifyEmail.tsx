import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PropsWithChildren } from 'react';
import React, { useCallback, useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Icon from 'react-native-ionicons';
import WrapperView from '../../../../src/Components/Common/WrapperView';
import AuthContext from '../../../Context/authContext';
import useColorsMode from '../../../Helpers/Colors';
import Consts from '../../../Helpers/Consts';
import { Logo, LogoContainer } from '../../../Helpers/StylizedComponents';
import { AuthContextType } from '../../../types/AuthContextType';
import type {
  NavigationRoutesType,
  WelcomeNavigationRoutesType,
} from '../../../types/NavigationRoutesType';
import KeyboardAvoidingViewScroll from '../../Common/KeyboardAvoidingViewScroll';
import PrimaryButton from '../../Common/PrimaryButton';
import PrimaryText from '../../Common/PrimaryText';
import TitleText from '../../Common/TitleText';

type VerifyEmailScreenProps = CompositeScreenProps<
  NativeStackScreenProps<WelcomeNavigationRoutesType, 'VerifyEmailScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = ({
  navigation,
}) => {
  const {
    clearAuthErrors,
    checkVerfiedEmail,
    AuthErrorComponent,
    addAuthError,
    notVerified,
  } = React.useContext(AuthContext) as AuthContextType;
  const AuthErrors = Consts.authErrorMessages;
  const { colors } = useColorsMode();

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
        <View className="flex-1 flex-col w-full justify-center h-screen items-center mb-0">
          <TitleText className="mt-20 ml-3 mr-3">
            Please check your email for a verification link
          </TitleText>
          <LogoContainer>
            <Logo
              source={require('../../../Assets/RightPay-logo-light-transparent.png')}
            />
          </LogoContainer>
          <PrimaryButton
            onPress={async () => {
              await checkVerfiedEmail();
              addAuthError(AuthErrors.notVerified);
            }}>
            <PrimaryText type="secondary" className="text-xl">
              Continue
            </PrimaryText>
          </PrimaryButton>
          {AuthErrorComponent && <AuthErrorComponent />}
          {backButton()}
        </View>
      </KeyboardAvoidingViewScroll>
    </WrapperView>
  );
};
export default VerifyEmailScreen;
