import React from 'react';
import {AuthContextType} from '../types/AuthContextType';
import AuthContext from '../Context/authContext';
import {Text} from 'react-native';
import ConstsType from './Consts';
import {styled} from 'nativewind';

const AuthErrorComponent = () => {
  const {authError} = React.useContext(AuthContext) as AuthContextType; // Use the useContext hook directly with types
  const ErrorMessages = ConstsType.authErrorMessages;

  const StylizedText = styled(Text);

  // Check if signInError exists and is not empty
  if (!authError || authError.length === 0) {
    return null; // No errors to display
  }

  return (
    <>
      {authError.map((error, index) => (
        <StylizedText className="text-black text-center mb-0" key={index}>
          {ErrorMessages[error]}
        </StylizedText>
      ))}
    </>
  );
};

export default AuthErrorComponent;
