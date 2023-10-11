import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import type {PropsWithChildren} from 'react';
import type {WelcomeNavigationRoutesType} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {styled} from 'nativewind';
import AuthContext from '../../../Context/authContext';
import {AuthContextType} from '../../../types/AuthContextType';

type SignUpScreenProps = NativeStackScreenProps<
  WelcomeNavigationRoutesType,
  'Register'
> &
  PropsWithChildren;

const StylizedInput = styled(TextInput);
const StylizedText = styled(Text);
const StylizedTouch = styled(TouchableOpacity);
const StylizedView = styled(View);

const SignUpScreen: React.FC<SignUpScreenProps> = ({navigation}) => {
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [repeatedPassword, setRepeatedPassword] = React.useState<string>('');
  const headingClassName = 'text-3xl font-bold';
  const inputClassName =
    'px-3 py-1 m-1 text-xl text-black flex h-9 w-1/2 rounded-md border bg-transparent shadow-sm transition-colors';

  const {signUp, clearAuthErrors, signedUp, AuthErrorComponent} =
    React.useContext(AuthContext) as AuthContextType;
  useEffect(() => {
    clearAuthErrors();
  }, []);
  return (
    <StylizedView className="flex-1 items-center">
      <StylizedText className={`${headingClassName} mt-20`}>
        Sign Up for RightPay
      </StylizedText>
      <StylizedInput
        className={inputClassName}
        placeholder="Email"
        onChange={event => setEmail(event.nativeEvent.text)}
      />
      <StylizedInput
        className={inputClassName}
        placeholder="Password"
        secureTextEntry={true}
        onChange={event => setPassword(event.nativeEvent.text)}
      />
      <StylizedInput
        className={inputClassName}
        placeholder="Repeat Password"
        secureTextEntry={true}
        onChange={event => setRepeatedPassword(event.nativeEvent.text)}
      />
      {AuthErrorComponent && <AuthErrorComponent />}
      <StylizedText className={headingClassName}>
        {signedUp && 'You have successfully signed up\nRedirecting to login'}
      </StylizedText>
      <StylizedTouch
        onPress={async () => {
          await signUp(email, password, repeatedPassword);
          if (signedUp) {
            navigation.navigate('Login');
          }
        }}>
        <StylizedText>SignUp</StylizedText>
      </StylizedTouch>
    </StylizedView>
  );
};

export default SignUpScreen;
