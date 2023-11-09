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
import {optionsPropsType} from '../../../types/DropdownProps';
import {CreditCardFormTypes} from '../../../types/CreditCardType';

const AddNewBankOption = (props: optionsPropsType) => {
  //Context
  const {addAuthError, clearAuthErrors, AuthErrorComponent} = React.useContext(
    authContext,
  ) as AuthContextType;
  const {
    setUpdatingDropdown,
    validateCreditCardForm,
    setCreditCardForms,
    CreditCardForms,
  } = React.useContext(Context) as AppContext;

  //options state
  const [newOption, setNewOption] = useState<string>('');

  //handlers
  const handleSubmit = () => {
    clearAuthErrors();
    const errors = validateCreditCardForm(
      {bankName: newOption},
      CreditCardFormTypes.AddBank,
    );
    if (errors.length > 0) {
      errors.forEach(error => addAuthError(error));
      return;
    } else {
      setUpdatingDropdown(true);
      props.setOption(newOption);
    }
  };

  const closeModal = () => {
    setUpdatingDropdown(true);
    setCreditCardForms({...CreditCardForms, AddBankOption: false});
    clearAuthErrors();
  };

  //keyboard
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
  }, [props.show]);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.show}
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
        <AddCCFormOverlayView className="flex-auto ">
          <Title>{'Enter a New Option for bank'}</Title>
          <FormInputBox
            placeholder="Name of Option"
            placeholderTextColor="#AFAEAE"
            onChange={event => setNewOption(event.nativeEvent.text)}
          />
          <FormButton onPress={handleSubmit} className="mt-1 z-0">
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

export default AddNewBankOption;
