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
import {optionsPropsType} from '../../../types/DropdownProps';
import Consts from '../../../Helpers/Consts';

const AddNewDropdownOption = (props: optionsPropsType) => {
  //Context
  const {addAuthError, clearAuthErrors, AuthErrorComponent} = React.useContext(
    authContext,
  ) as AuthContextType;
  const {cardForm, setUpdatingDropdown} = React.useContext(
    Context,
  ) as AppContext;

  //consts
  const ErrorMessages = Consts.authErrorMessages;

  //options state
  const [newOption, setNewOption] = useState<string>('');

  //handlers
  const handleSubmit = () => {
    clearAuthErrors();
    const errors = validateForm();
    console.log(errors);
    if (errors.length > 0) {
      errors.forEach(error => addAuthError(error));
      return;
    } else {
      setUpdatingDropdown(true);
      props.setOption(newOption);
      closeModal();
    }
  };

  const closeModal = () => {
    props.setShow(false);
    clearAuthErrors();
  };

  //validation
  function validateForm() {
    const errors: string[] = [];
    switch (props.name) {
      case 'Type':
        errors.push(...validateType());
        break;
      case 'Bank':
        errors.push(...validateBank());
        break;

      default:
        errors.push(ErrorMessages.invalidDropdownOption);
        break;
    }
    return errors;
  }

  function validateBank() {
    const errors: string[] = [];
    const regex = /^[A-Za-z ]*$/;
    if (newOption.length < 3) {
      errors.push(ErrorMessages.invalidBankName);
    }
    if (!regex.test(newOption)) {
      errors.push(ErrorMessages.invalidBankName);
    }
    return errors;
  }

  function validateType() {
    const errors: string[] = [];
    const regex = /^[A-Za-z ]*$/;
    if (newOption.length < 3) {
      errors.push(ErrorMessages.invalidCardType);
    }
    if (!regex.test(newOption)) {
      errors.push(ErrorMessages.invalidCardType);
    }
    return errors;
  }

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
  }, [cardForm]);

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
        <AddCCFormOverlayView>
          <Title>{`Enter a New Option for ${props.name}`}</Title>
          <AuthInputBox
            placeholder="Name of Option"
            placeholderTextColor="#AFAEAE"
            onChange={event => setNewOption(event.nativeEvent.text)}
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

export default AddNewDropdownOption;
