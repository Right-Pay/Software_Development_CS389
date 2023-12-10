import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
} from 'react-native';
import authContext from '../../../Context/authContext';
import Context from '../../../Context/context';
import { FormInputBox } from '../../../Helpers/StylizedComponents';
import { AppContext } from '../../../types/AppContextType';
import { AuthContextType } from '../../../types/AuthContextType';
import { OptionsPropsType } from '../../Common/Dropdown';
import ModalOverlayView from '../../Common/ModalOverlayView';
import PrimaryButton from '../../Common/PrimaryButton';
import PrimaryText from '../../Common/PrimaryText';
import TitleText from '../../Common/TitleText';
import i18n from '../../../Localization/i18n';

const AddNewBankOption = (props: OptionsPropsType) => {
  //Context
  const {
    addAuthError,
    clearAuthErrors,
    AuthErrorComponent,
    isKeyboardVisible,
  } = React.useContext(authContext) as AuthContextType;
  const { validateCardForm, setCardForms, CardForms } = React.useContext(
    Context,
  ) as AppContext;

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
      setCardForms({ ...CardForms, AddBankOption: false });
      props.setOption(newOption);
    }
  };

  const closeModal = () => {
    setCardForms({ ...CardForms, AddBankOption: false });
    clearAuthErrors();
  };

  useEffect(() => {
    clearAuthErrors();
  }, [clearAuthErrors, props.show]);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.show}
      onRequestClose={closeModal}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled={isKeyboardVisible}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 10}>
        <ModalOverlayView className="flex-auto ">
          <TitleText>{i18n.t('Wallet.Enternewbank')}</TitleText>
          <FormInputBox
            placeholder={i18n.t('Wallet.Optionname')}
            placeholderTextColor="#AFAEAE"
            onChange={event => setNewOption(event.nativeEvent.text)}
          />
          <PrimaryButton onPress={handleSubmit} className="mt-1 z-0">
            <PrimaryText type="secondary" className="text-center text-xl">
              {i18n.t('Common.Submit')}
            </PrimaryText>
          </PrimaryButton>
          <PrimaryButton onPress={closeModal} className="z-0">
            <PrimaryText type="secondary" className="text-center text-xl">
              {i18n.t('Common.Close')}
            </PrimaryText>
          </PrimaryButton>
          {AuthErrorComponent && <AuthErrorComponent />}
        </ModalOverlayView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
  },
});

export default AddNewBankOption;
