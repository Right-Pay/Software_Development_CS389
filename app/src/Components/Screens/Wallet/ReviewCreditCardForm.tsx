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
                defaultValue={newCreditCard.cardName}
                placeholder="Name of Card"
                placeholderTextColor={'black'}
                onChange={event =>
                  (newCreditCard.cardName = event.nativeEvent.text)
                }
              />
              <AuthInputBox
                defaultValue={newCreditCard.nickName}
                placeholder="Nick Name"
                placeholderTextColor={'black'}
                onChange={event =>
                  (newCreditCard.nickName = event.nativeEvent.text)
                }
              />
              <AuthInputBox
                defaultValue={newCreditCard.bankName}
                placeholder="Bank Name"
                placeholderTextColor={'black'}
                onChange={event =>
                  (newCreditCard.bankName = event.nativeEvent.text)
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
              <AuthInputBox
                defaultValue={newCreditCard.cardType}
                placeholder="Card Type"
                placeholderTextColor={'black'}
                onChange={event =>
                  (newCreditCard.cardType = event.nativeEvent.text)
                }
              />
              <AuthInputBox
                defaultValue={newCreditCard.expirationDate}
                placeholder="Expiration Date"
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
