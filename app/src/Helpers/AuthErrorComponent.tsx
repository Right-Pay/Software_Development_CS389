import React from 'react';
import { AuthContextType } from '../types/AuthContextType';
import AuthContext from '../Context/authContext';
import { Subtitle } from './StylizedComponents';

const AuthErrorComponent = () => {
  const { authError } = React.useContext(AuthContext) as AuthContextType; // Use the useContext hook directly with types

  // Check if signInError exists and is not empty
  if (!authError || authError.length === 0) {
    return null; // No errors to display
  }

  return (
    <>
      {authError.map((error, index) => (
        <Subtitle key={index}>{error}</Subtitle>
      ))}
    </>
  );
};

export default AuthErrorComponent;
