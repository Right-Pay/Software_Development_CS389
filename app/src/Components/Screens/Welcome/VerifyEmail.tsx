import React, {useEffect} from 'react';
import {View, Text, TextInput, Pressable} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {WelcomeNavigationRoutesType} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthContextType} from '../../../types/AuthContextType';
import AuthContext from '../../../Context/authContext';
import {styled} from 'nativewind';

type ForgotPasswordScreenProps = NativeStackScreenProps<
  WelcomeNavigationRoutesType,
  'VerifyEmail'
> &
  PropsWithChildren;

const StylizedInput = styled(TextInput);
const StylizedText = styled(Text);
const StylizedPress = styled(Pressable);
const StylizedView = styled(View);

const VerifyEmailScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const {clearAuthErrors, AuthErrorComponent, verifyCode} = React.useContext(
    AuthContext,
  ) as AuthContextType;
  const [code, setCode] = React.useState<string>('');
  useEffect(() => {
    clearAuthErrors();
  }, []);

  const headingClassName = 'text-3xl font-bold';
  const inputClassName =
    'px-3 py-1 m-1 text-xl text-black flex h-9 w-1/2 rounded-md border bg-transparent shadow-sm transition-colors';

  return (
    <StylizedView className="flex-1 items-center">
      <StylizedText className={`${headingClassName} mt-20`}>
        Enter Code Sent to Your Email
      </StylizedText>
      <StylizedInput
        className={inputClassName}
        placeholder="Code"
        placeholderTextColor="#AFAEAE"
        onChange={event => setCode(event.nativeEvent.text)}
      />
      {AuthErrorComponent && <AuthErrorComponent />}
      <StylizedPress
        className="flex color items-center justify-center m-2 text-xl text-black flex h-9 w-5/12 rounded-xl border-2 bg-green-500 shadow-sm transition-colors"
        onPress={() => {
          clearAuthErrors();
          verifyCode(code) && navigation.navigate('ResetPassword');
        }}>
        <StylizedText className="text-xl">Reset Password</StylizedText>
      </StylizedPress>
    </StylizedView>
  );
};

export default VerifyEmailScreen;
