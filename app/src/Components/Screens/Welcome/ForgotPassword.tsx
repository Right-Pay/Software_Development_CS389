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
  'ForgotPassword'
> &
  PropsWithChildren;

const StylizedInput = styled(TextInput);
const StylizedText = styled(Text);
const StylizedPress = styled(Pressable);
const StylizedView = styled(View);

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const {clearAuthErrors, checkValidEmail, AuthErrorComponent} =
    React.useContext(AuthContext) as AuthContextType;
  const [email, setEmail] = React.useState<string>('');
  useEffect(() => {
    clearAuthErrors();
  }, []);

  const headingClassName =
    'mt-20 text-3xl text-center font-bold text-green-500';
  const inputClassName =
    'px-3 py-1 m-1 text-xl text-black flex h-9 w-1/2 rounded-xl border border-green-500 bg-transparent shadow-sm transition-colors';

  return (
    <StylizedView className="flex-1 items-center">
      <StylizedText className={headingClassName}>
        Forgot your Password for RightPay?
      </StylizedText>
      <StylizedView className="flex items-center justify-center h-full w-full">
        <StylizedInput
          className={inputClassName}
          placeholder="Email Address"
          placeholderTextColor="#AFAEAE"
          onChange={event => setEmail(event.nativeEvent.text)}
        />
        {AuthErrorComponent && <AuthErrorComponent />}
        <StylizedPress
          className="flex color items-center justify-center m-2 text-xl text-black flex h-9 w-5/12 rounded-xl bg-green-500 shadow-sm transition-colors"
          onPress={() =>
            checkValidEmail(email) && navigation.navigate('VerifyEmail')
          }>
          <StylizedText className="text-xl">Reset Password</StylizedText>
        </StylizedPress>
      </StylizedView>
    </StylizedView>
  );
};

export default ForgotPasswordScreen;
