import React, { PropsWithChildren, useContext, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { KeyboardAvoidingScroll } from '../../Helpers/StylizedComponents';
import authContext from '../../Context/authContext';
import { AuthContextType } from '../../types/AuthContextType';

const KeyboardAvoidingViewScroll = ({ children }: PropsWithChildren) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const { isKeyboardVisible } = useContext(authContext) as AuthContextType;

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd();
    }, 100);
  }, [isKeyboardVisible]);

  return (
    <KeyboardAvoidingScroll
      keyboardShouldPersistTaps="always"
      ref={scrollViewRef}
      contentContainerStyle={styles.keyboardAvoidingScroll}>
      {children}
    </KeyboardAvoidingScroll>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingScroll: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default KeyboardAvoidingViewScroll;
