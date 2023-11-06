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
import Consts from '../../../Helpers/Consts';
import DropdownComponent from '../../../Helpers/Dropdown';

const ReviewCreditCardForm = () => {
  const {addCreditCard, newCreditCard} = React.useContext(
    Context,
  ) as AppContext;
  const {bankOptions, typeOptions, CreditCardForms, setCreditCardForms} =
    React.useContext(Context) as AppContext;
  const closeModal = () =>
    setCreditCardForms({
      ...CreditCardForms,
      Review: false,
    });
  const ModalMode = Consts.DropdownListModes.MODAL;

  const handleSubmit = () => {
    addCreditCard();
    closeModal();
    //Check if db has card
  };

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
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={CreditCardForms.Review}
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
        {newCreditCard && (
          <AddCCFormOverlayView>
            <Title>Review Credit Card</Title>

            <AuthInputBox
              defaultValue={newCreditCard.cardName}
              placeholder="Name of Card"
              placeholderTextColor={'black'}
              onChange={event =>
                (newCreditCard.cardName = event.nativeEvent.text)
              }
            />
            <AuthInputBox
              defaultValue={newCreditCard.nickname}
              placeholder="Nickname"
              placeholderTextColor={'black'}
              onChange={event =>
                (newCreditCard.nickname = event.nativeEvent.text)
              }
            />
            <AuthInputBox
              defaultValue={newCreditCard.cardNumber}
              placeholder="Card Number"
              placeholderTextColor={'black'}
              onChange={event =>
                (newCreditCard.cardNumber = event.nativeEvent.text)
              }
            />
            <DropdownComponent
              options={bankOptions.filter(b => b !== 'Add New Bank')} //Test if this works
              placeholder={bankOptions[0]}
              onDropdownChange={event => {
                newCreditCard.bankName = event;
              }}
              mode={ModalMode}
              style="m-2 h-auto w-1/2 z-50"
            />
            <DropdownComponent
              options={typeOptions.filter(t => t !== 'Add New Type')}
              placeholder={typeOptions[0]}
              onDropdownChange={event => {
                newCreditCard.cardType = event;
              }}
              mode={ModalMode}
              style="m-2 h-auto w-1/2 z-40"
            />
            <AuthInputBox
              defaultValue={newCreditCard.expirationDate}
              placeholder="Expiration Date"
              placeholderTextColor={'black'}
              onChange={event =>
                (newCreditCard.expirationDate = event.nativeEvent.text)
              }
            />
            <AuthButton onPress={handleSubmit} className="mt-1 z-0">
              <AuthButtonText>Submit</AuthButtonText>
            </AuthButton>
            <AuthButton onPress={closeModal} className="z-0">
              <AuthButtonText>Cancel</AuthButtonText>
            </AuthButton>
          </AddCCFormOverlayView>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ReviewCreditCardForm;
