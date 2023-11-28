import React, { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Modal, Platform } from 'react-native';
import {
  AddCFormOverlayView,
  FormButton,
  FormButtonText,
  FormInputBox,
  Title,
} from '../../../Helpers/StylizedComponents';
import { AppContext } from '../../../types/AppContextType';
import Context from '../../../Context/context';
import authContext from '../../../Context/authContext';
import { AuthContextType } from '../../../types/AuthContextType';
import { OptionsPropsType } from '../../../Helpers/Dropdown';

const AddNewBankOption = (props: OptionsPropsType) => {
  //Context
  const { addAuthError, clearAuthErrors, AuthErrorComponent } =
    React.useContext(authContext) as AuthContextType;
  const { setUpdatingDropdown, validateCardForm, setCardForms, CardForms } =
    React.useContext(Context) as AppContext;

  //options state
  const [newOption, setNewOption] = useState<string>('');

  //handlers
  const handleSubmit = () => {
    clearAuthErrors();
    const errors = validateCardForm({ bankName: newOption });
    if (errors.length > 0) {
      errors.forEach(error => addAuthError(error));
      return;
    } else {
      setUpdatingDropdown(true);
      setCardForms({ ...CardForms, AddBankOption: false });
      props.setOption(newOption);
    }
  };

  const closeModal = () => {
    setUpdatingDropdown(true);
    setCardForms({ ...CardForms, AddBankOption: false });
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
        <AddCFormOverlayView className="flex-auto ">
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
        </AddCFormOverlayView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddNewBankOption;
