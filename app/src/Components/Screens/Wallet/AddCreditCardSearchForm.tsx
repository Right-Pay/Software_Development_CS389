import React, {useEffect, useState} from 'react';
import {Keyboard, KeyboardAvoidingView, Modal, Platform} from 'react-native';
import {
  AddCCFormOverlayView,
  FormButton,
  FormButtonText,
  FormInputBox,
  Title,
} from '../../../Helpers/StylizedComponents';
import {AppContext} from '../../../types/AppContextType';
import Context from '../../../Context/context';
import authContext from '../../../Context/authContext';
import {AuthContextType} from '../../../types/AuthContextType';
import {CreditCardFormTypes} from '../../../types/CreditCardType';
import Consts from '../../../Helpers/Consts';

const AddCreditCardSearchForm = () => {
  //Context
  const {addAuthError, clearAuthErrors, AuthErrorComponent, removeAuthError} =
    React.useContext(authContext) as AuthContextType;
  const {
    CreditCardForms,
    setCreditCardForms,
    validateCreditCardForm,
    findCreditCard,
    newCardBin,
    setNewCardBin,
  } = React.useContext(Context) as AppContext;

  //Functions
  const closeModal = () => {
    setCreditCardForms({...CreditCardForms, Search: false});
    setNewCardBin(0o0);
    clearAuthErrors();
  };

  const handleSubmit = () => {
    clearAuthErrors();
    const errors = validateCreditCardForm({}, CreditCardFormTypes.Search);
    if (errors.length > 0) {
      errors.forEach(error => addAuthError(error));
      return;
    }
    findCreditCard(+newCardBin as number);
    //Check if db has card
  };

  const onBinChange = (bin: number) => {
    if (isNaN(bin)) {
      addAuthError(Consts.authErrorMessages.invalidCreditCardBin);
      return;
    }
    removeAuthError(Consts.authErrorMessages.invalidCreditCardBin);
    setNewCardBin(bin);
  };

  //Keyboard
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  //useEffect
  useEffect(() => {
    clearAuthErrors();
  }, [CreditCardForms.Search]);

  useEffect(() => {
    setNewCardBin(0o0);
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={CreditCardForms.Search}
      onRequestClose={closeModal}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
          justifyContent: 'center',
          flexDirection: 'column',
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled={isKeyboardVisible}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 10}>
        <AddCCFormOverlayView className="flex-1">
          <Title className="mb-24">
            Enter First Six Digits of your Credit Card Number
          </Title>
          <FormInputBox
            placeholder="First Six Digits"
            placeholderTextColor="#AFAEAE"
            maxLength={6}
            onChange={event => onBinChange(+event.nativeEvent.text)}
          />
          <FormButton onPress={handleSubmit} className="m4-2 z-0">
            <FormButtonText>Submit</FormButtonText>
          </FormButton>
          <FormButton onPress={closeModal} className="z-0">
            <FormButtonText>Close</FormButtonText>
          </FormButton>
          {AuthErrorComponent && <AuthErrorComponent />}
        </AddCCFormOverlayView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddCreditCardSearchForm;
