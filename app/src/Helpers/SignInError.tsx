import React from 'react';
import {AuthContextType} from '../types/AuthContextType';
import AuthContext from '../Context/authContext';
import {StyleSheet, Text} from 'react-native';

const SignInError = () => {
  const {signInError} = React.useContext(AuthContext) as AuthContextType;
  return signInError.map((error, index) => (
    <Text style={styles.text} key={index}>
      {error}
    </Text>
  ));
};

const styles = StyleSheet.create({
  text: {
    color: 'black',
  },
});

export default SignInError;
