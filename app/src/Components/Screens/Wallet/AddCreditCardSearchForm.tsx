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

const AddCreditCardSearchForm = () => {
  //Context
  const {addAuthError, clearAuthErrors, AuthErrorComponent} = React.useContext(
    authContext,
  ) as AuthContextType;
  const {
    CreditCardForms,
    setCreditCardForms,
    validateCreditCardForm,
    findCreditCard,
  } = React.useContext(Context) as AppContext;

  //State
  const [cardBin, setCardBin] = React.useState<string>('');

  //Functions
  const closeModal = () => {
    setCreditCardForms({...CreditCardForms, Search: false});
    setCardBin('');
    clearAuthErrors();
  };

  const handleSubmit = () => {
    clearAuthErrors();
    const errors = validateCreditCardForm(
      {cardBin},
      CreditCardFormTypes.Search,
    );
    if (errors.length > 0) {
      errors.forEach(error => addAuthError(error));
      return;
    }
    findCreditCard(+cardBin as number);
    //Check if db has card
  };

  const handleCCNumChange = (event: any) => {
    setCardBin(event.nativeEvent.text);
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
    setCardBin('');
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
        <AddCCFormOverlayView className="flex-1">
          <Title className="mb-24">
            Enter First Six Digits of your Credit Card Number
          </Title>
          <FormInputBox
            placeholder="First Six Digits"
            placeholderTextColor="#AFAEAE"
            onChange={event => handleCCNumChange(event)}
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
