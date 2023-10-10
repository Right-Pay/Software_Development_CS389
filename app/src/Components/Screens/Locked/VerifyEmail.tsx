import React, {useEffect} from 'react';
import {View, Text, Button, TextInput} from 'react-native';
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
const StylizedTouch = styled(Button);
const StylizedView = styled(View);

const VerifyEmailScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const {addAuthError, clearAuthErrors, AuthErrorComponent} = React.useContext(
    AuthContext,
  ) as AuthContextType;
  const [code, setCode] = React.useState<string>('');
  useEffect(() => {
    clearAuthErrors();
  }, []);
  const verifyCode = () => {
    //will need to make this an api call at some point
    console.log('code: ' + code);
    return true;
  };

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
      <StylizedTouch
        title="Reset Password"
        onPress={() =>
          verifyCode()
            ? navigation.navigate('ResetPassword')
            : addAuthError('invalidCode')
        }
      />
    </StylizedView>
  );
};

export default VerifyEmailScreen;
