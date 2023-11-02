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

const ReviewCreditCardForm = () => {
  const {addCreditCard, newCreditCard} = React.useContext(
    Context,
  ) as AppContext;
  const {cardForm, setCardForm} = React.useContext(Context) as AppContext;
  const closeModal = () => setCardForm(null);

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
      visible={cardForm === 'Review'}
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
          <Title>Add New Credit Card</Title>
          {newCreditCard && (
            <>
              <AuthInputBox
                defaultValue={newCreditCard.name}
                onChange={event =>
                  (newCreditCard.name = event.nativeEvent.text)
                }
              />
              <AuthInputBox
                defaultValue={newCreditCard.cardNumber}
                onChange={event =>
                  (newCreditCard.cardNumber = event.nativeEvent.text)
                }
              />
              <AuthInputBox
                defaultValue={newCreditCard.cardType}
                placeholderTextColor={'black'}
                onChange={event =>
                  (newCreditCard.cardType = event.nativeEvent.text)
                }
              />
              <AuthInputBox
                defaultValue={newCreditCard.expirationDate}
                placeholderTextColor={'black'}
                onChange={event =>
                  (newCreditCard.expirationDate = event.nativeEvent.text)
                }
              />
            </>
          )}
          <AuthButton onPress={handleSubmit} className="mt-1 z-0">
            <AuthButtonText>Submit</AuthButtonText>
          </AuthButton>
          <AuthButton onPress={closeModal} className="z-0">
            <AuthButtonText>Cancel</AuthButtonText>
          </AuthButton>
        </AddCCFormOverlayView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ReviewCreditCardForm;
