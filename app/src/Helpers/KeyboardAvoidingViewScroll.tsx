import {PropsWithChildren, useContext, useEffect, useRef} from 'react';
import {ScrollView, View} from 'react-native';
import context from '../Context/context';
import {AppContext} from '../types/AppContextType';
import {KeyboardAvoidingScroll} from './StylizedComponents';
import React from 'react';

const KeyboardAvoidingViewScroll = ({children}: PropsWithChildren) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const {isKeyboardVisible} = useContext(context) as AppContext;

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd();
    }, 100),
      [isKeyboardVisible];
  });
  return (
    <KeyboardAvoidingScroll
      keyboardShouldPersistTaps="always"
      ref={scrollViewRef}
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {children}
    </KeyboardAvoidingScroll>
  );
};

export default KeyboardAvoidingViewScroll;
