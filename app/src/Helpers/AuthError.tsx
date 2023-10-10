import React from 'react';
import {AuthContextType} from '../types/AuthContextType';
import AuthContext from '../Context/authContext';
import {StyleSheet, Text} from 'react-native';

const AuthError = () => {
  const {signInError} = React.useContext(AuthContext) as AuthContextType; // Use the useContext hook directly with types
  const signInErrorMessages = new Map<string, string>([
    ['1', 'Invalid Email'],
    ['2', 'Invalid Password'],
    ['3', 'Passwords Do Not Match'],
    ['4', 'Email Already Exists'],
    ['5', 'Error Creating User'],
    [
      '6',
      'The code is not right\nEither your email is not correct or you entered an invalid code',
    ],
  ]);

  // Check if signInError exists and is not empty
  if (!signInError || signInError.length === 0) {
    return null; // No errors to display
  }

  return (
    <>
      {signInError.map((error, index) => (
        <Text style={styles.text} key={index}>
          {signInErrorMessages.get(error) || 'Unknown Error'}
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

export default AuthError;
