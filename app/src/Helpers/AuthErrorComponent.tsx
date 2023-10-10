import React from 'react';
import {AuthContextType} from '../types/AuthContextType';
import AuthContext from '../Context/authContext';
import {StyleSheet, Text} from 'react-native';
import {AuthErrorMessages} from './Consts';

const AuthErrorComponent = () => {
  const {authError} = React.useContext(AuthContext) as AuthContextType; // Use the useContext hook directly with types
  const ErrorMessages = AuthErrorMessages;

  // Check if signInError exists and is not empty
  if (!authError || authError.length === 0) {
    return null; // No errors to display
  }

  return (
    <>
      {authError.map((error, index) => (
        <Text style={styles.text} key={index}>
          {ErrorMessages[error]}
        </Text>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'black',
  },
});

export default AuthErrorComponent;
