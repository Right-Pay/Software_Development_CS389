import React, {useEffect} from 'react';
import {View, Text, Pressable, TextInput} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {WelcomeNavigationRoutesType} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthContextType} from '../../../types/AuthContextType';
import AuthContext from '../../../Context/authContext';
import {styled} from 'nativewind';

type ResetPasswordScreenProps = NativeStackScreenProps<
  WelcomeNavigationRoutesType,
  'ResetPassword'
> &
  PropsWithChildren;

const StylizedInput = styled(TextInput);
const StylizedText = styled(Text);
const StylizedPress = styled(Pressable);
const StylizedView = styled(View);

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  navigation,
}) => {
  const {clearAuthErrors, checkEqualPasswords, AuthErrorComponent} =
    React.useContext(AuthContext) as AuthContextType;

  const [password, setPassword] = React.useState<string>('');
  const [confirmPassword, setConfirmPassword] = React.useState<string>('');
  const headingClassName = 'text-3xl font-bold';
  const inputClassName =
    'px-3 py-1 m-1 text-xl text-black flex h-9 w-1/2 rounded-md border bg-transparent shadow-sm transition-colors';

  useEffect(() => {
    clearAuthErrors();
  }, []);
  return (
    <StylizedView className="flex-1 items-center">
      <StylizedText className={`${headingClassName} mt-20`}>
        Reset your Password for
      </StylizedText>
      <StylizedText className={headingClassName}>RightPay</StylizedText>
      <StylizedInput
        className={inputClassName}
        placeholder="New Password"
        placeholderTextColor="#AFAEAE"
        secureTextEntry={true}
        onChange={event => {
          setPassword(event.nativeEvent.text);
        }}
      />
      <StylizedInput
        className={inputClassName}
        placeholder="Confirm Password"
        placeholderTextColor="#AFAEAE"
        secureTextEntry={true}
        onChange={event => {
          setConfirmPassword(event.nativeEvent.text);
        }}
      />
      {AuthErrorComponent && <AuthErrorComponent />}
      <StylizedPress
        className="flex color items-center justify-center m-2 text-xl text-black flex h-9 w-5/12 rounded-xl border-2 bg-green-500 shadow-sm transition-colors"
        onPress={() => {
          clearAuthErrors();
          checkEqualPasswords(password, confirmPassword) &&
            navigation.navigate('Login');
        }}>
        <StylizedText className="text-xl">Reset</StylizedText>
      </StylizedPress>
    </StylizedView>
  );
};

export default ResetPasswordScreen;
