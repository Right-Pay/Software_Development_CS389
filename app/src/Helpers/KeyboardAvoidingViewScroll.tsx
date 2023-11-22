import {PropsWithChildren, useContext, useEffect, useRef} from 'react';
import {ScrollView} from 'react-native';
import context from '../Context/context';
import {AppContext} from '../types/AppContextType';
import {SettingsScroll} from './StylizedComponents';
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
    <SettingsScroll
      keyboardShouldPersistTaps="always"
      ref={scrollViewRef}
      contentContainerStyle={{alignItems: 'center'}}>
      {children}
    </SettingsScroll>
  );
};

export default KeyboardAvoidingViewScroll;
