import React, {useEffect} from 'react';
import {View, Text, Pressable, TextInput} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {WelcomeNavigationRoutesType} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import AuthContext from '../../../Context/authContext';
import {AuthContextType} from '../../../types/AuthContextType';
import {styled} from 'nativewind';

type LogInScreenProps = NativeStackScreenProps<
  WelcomeNavigationRoutesType,
  'Login'
> &
  PropsWithChildren;

const StylizedInput = styled(TextInput);
const StylizedText = styled(Text);
const StylizedPress = styled(Pressable);
const StylizedView = styled(View);

const LogInScreen: React.FC<LogInScreenProps> = ({navigation}) => {
  const {clearAuthErrors, AuthErrorComponent, signIn} = React.useContext(
    AuthContext,
  ) as AuthContextType;
  useEffect(() => {
    clearAuthErrors();
  }, []);
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const headingClassName = 'text-3xl font-bold';
  const inputClassName =
    'px-3 py-1 m-1 text-xl text-black flex h-9 w-1/2 rounded-md border bg-transparent shadow-sm transition-colors';

  return (
    <StylizedView className="flex-1 items-center">
      <StylizedText className={`${headingClassName} mt-20`}>
        Log In to Your
      </StylizedText>
      <StylizedText className={headingClassName}>RightPay Account</StylizedText>
      <StylizedInput
        className={inputClassName}
        placeholder="Email Address"
        placeholderTextColor="#AFAEAE"
        onChange={event => setEmail(event.nativeEvent.text)}
      />
      <StylizedInput
        className={inputClassName}
        placeholder="Password"
        placeholderTextColor="#AFAEAE"
        secureTextEntry={true}
        onChange={event => setPassword(event.nativeEvent.text)}
      />
      <StylizedPress
        className="flex pb-1"
        onPress={() => navigation.navigate('ForgotPassword')}>
        <StylizedText className="text-sm">Forgot Password?</StylizedText>
      </StylizedPress>
      {AuthErrorComponent && <AuthErrorComponent />}
      <StylizedPress
        className="flex color items-center justify-center m-2 text-xl text-black flex h-9 w-5/12 rounded-xl border-2 bg-green-500 shadow-sm transition-colors"
        onPress={() => {
          clearAuthErrors();
          signIn(email, password);
        }}>
        <StylizedText className="text-xl">Log In</StylizedText>
      </StylizedPress>
    </StylizedView>
  );
};

export default LogInScreen;
