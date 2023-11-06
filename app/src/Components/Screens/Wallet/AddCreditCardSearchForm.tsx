import React, {useEffect, useState} from 'react';
import {Keyboard, KeyboardAvoidingView, Modal, Platform} from 'react-native';
import {
  AddCCFormOverlayView,
  AuthButton,
  AuthButtonText,
  AuthInputBox,
  Title,
} from '../../../Helpers/StylizedComponents';
import {AppContext} from '../../../types/AppContextType';
import Context from '../../../Context/context';
import authContext from '../../../Context/authContext';
import {AuthContextType} from '../../../types/AuthContextType';
import Consts from '../../../Helpers/Consts';

const AddCreditCardSearchForm = () => {
  const {findCreditCard} = React.useContext(Context) as AppContext;
  const {addAuthError, clearAuthErrors, AuthErrorComponent} = React.useContext(
    authContext,
  ) as AuthContextType;
  const {CreditCardForms, setCreditCardForms} = React.useContext(
    Context,
  ) as AppContext;
  const closeModal = () => {
    setCardNumber('');
    clearAuthErrors();
  };
  const [cardNumber, setCardNumber] = React.useState<string>('');
  const ErrorMessages = Consts.authErrorMessages;

  const handleSubmit = () => {
    clearAuthErrors();
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach(error => addAuthError(error));
      return;
    }
    findCreditCard(+cardNumber as number);
    //Check if db has card
  };

  const handleCCNumChange = (event: any) => {
    setCardNumber(event.nativeEvent.text);
  };

  function validateForm() {
    const errors: string[] = [];
    const cardNumberRegex = /^[0-9]{6}$/;
    if (cardNumber.length !== 6 || !cardNumberRegex.test(cardNumber)) {
      errors.push(ErrorMessages.invalidCreditCardNumber);
    }
    return errors;
  }

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

  useEffect(() => {
    clearAuthErrors();
    setCardNumber('');
  }, [CreditCardForms.Search]);

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
        <AddCCFormOverlayView>
          <Title>Enter First Six Digits of your Credit Card Number</Title>
          <AuthInputBox
            placeholder="First Six Digits"
            placeholderTextColor="#AFAEAE"
            onChange={event => handleCCNumChange(event)}
          />
          <AuthButton onPress={handleSubmit} className="mt-1 z-0">
            <AuthButtonText>Submit</AuthButtonText>
          </AuthButton>
          <AuthButton onPress={closeModal} className="z-0">
            <AuthButtonText>Close</AuthButtonText>
          </AuthButton>
          {AuthErrorComponent && <AuthErrorComponent />}
        </AddCCFormOverlayView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddCreditCardSearchForm;
