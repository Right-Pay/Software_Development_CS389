import React, { PropsWithChildren, useContext, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import context from '../../Context/context';
import { KeyboardAvoidingScroll } from '../../Helpers/StylizedComponents';
import { AppContext } from '../../types/AppContextType';

const KeyboardAvoidingViewScroll = ({ children }: PropsWithChildren) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const { isKeyboardVisible } = useContext(context) as AppContext;

  useEffect(() => {
    setTimeout(() => {
      // scrollViewRef.current?.scrollToEnd();
    }, 100);
  }, [isKeyboardVisible]);

  return (
    <KeyboardAvoidingScroll
      keyboardShouldPersistTaps="always"
      ref={scrollViewRef}
      // contentContainerStyle={styles.keyboardAvoidingScroll}>
    >
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
