import React, {useEffect, useState} from 'react';
import {Keyboard, KeyboardAvoidingView, Modal, Platform} from 'react-native';
import {
  AddCCFormOverlayView,
  FormButton,
  FormButtonText,
  FormDateView,
  FormInputBox,
  Title,
} from '../../../Helpers/StylizedComponents';
import {AppContext} from '../../../types/AppContextType';
import Context from '../../../Context/context';
import Consts from '../../../Helpers/Consts';
import DropdownComponent from '../../../Helpers/Dropdown';
import AuthErrorComponent from '../../../Helpers/AuthErrorComponent';
import {CreditCardFormTypes} from '../../../types/CreditCardType';
import authContext from '../../../Context/authContext';
import {AuthContextType} from '../../../types/AuthContextType';

const ReviewCreditCardForm = () => {
  //Context
  const {addAuthError} = React.useContext(authContext) as AuthContextType;

  const {
    addCreditCard,
    newCreditCard,
    bankOptions,
    typeOptions,
    CreditCardForms,
    setCreditCardForms,
    setNewCreditCard,
    validateCreditCardForm,
  } = React.useContext(Context) as AppContext;

  //Constants
  const ModalMode = Consts.DropdownListModes.MODAL;

  const currentYear = new Date().getFullYear().toString().split('20')[1];
  const years = Array.from(Array(6).keys()).map(i =>
    (i + parseInt(currentYear, 10)).toString(),
  );

  //Functions
  const closeModal = () =>
    setCreditCardForms({
      ...CreditCardForms,
      Review: false,
    });

  const handleExpirationMonthChange = (month: string) => {
    const currentExpirationDate = newCreditCard?.expirationDate;
    const year = currentExpirationDate?.split('/')[1];
    if (currentExpirationDate) {
      setNewCreditCard({...newCreditCard, expirationDate: `${month}/${year}`});
    }
  };

  const handleExpirationYearChange = (year: string) => {
    const currentExpirationDate = newCreditCard?.expirationDate;
    const month = currentExpirationDate?.split('/')[0];
    if (currentExpirationDate) {
      setNewCreditCard({...newCreditCard, expirationDate: `${month}/${year}`});
    }
  };

  const handleSubmit = () => {
    if (!newCreditCard) {
      return;
    }
    const errors = validateCreditCardForm(
      {
        cardName: newCreditCard.cardName,
        nickname: newCreditCard.nickname,
        cardBin: newCreditCard.cardBin,
        bankName: newCreditCard.bankName,
      },
      CreditCardFormTypes.Review,
    );
    if (errors.length > 0) {
      errors.forEach(error => addAuthError(error));
      return;
    }
    addCreditCard();
    closeModal();
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
          <AddCCFormOverlayView className="flex-auto ">
            <Title>Review Credit Card</Title>
            <FormInputBox
              defaultValue={newCreditCard.cardName}
              placeholder="Name of Card"
              placeholderTextColor={'grey'}
              onChange={event =>
                (newCreditCard.cardName = event.nativeEvent.text)
              }
            />
            <FormInputBox
              defaultValue={newCreditCard.nickname}
              placeholder="Nickname"
              placeholderTextColor={'grey'}
              onChange={event =>
                (newCreditCard.nickname = event.nativeEvent.text)
              }
            />
            <FormInputBox
              defaultValue={newCreditCard.cardBin}
              placeholder="Card Number"
              placeholderTextColor={'grey'}
              onChange={event =>
                (newCreditCard.cardBin = event.nativeEvent.text)
              }
            />
            <DropdownComponent
              options={bankOptions.filter(b => b !== 'Add New Bank')}
              placeholder={bankOptions[0]}
              onDropdownChange={event => {
                newCreditCard.bankName = event;
              }}
              mode={ModalMode}
              dropdownStyle="m-2 h-auto w-2/3"
            />
            <DropdownComponent
              options={typeOptions}
              placeholder={typeOptions[0]}
              onDropdownChange={event => {
                newCreditCard.cardType = event;
              }}
              mode={ModalMode}
              dropdownStyle="m-2 h-auto w-2/3"
            />
            <FormDateView>
              <DropdownComponent
                options={[
                  '1',
                  '2',
                  '3',
                  '4',
                  '5',
                  '6',
                  '7',
                  '8',
                  '9',
                  '10',
                  '11',
                  '12',
                ]}
                placeholder={
                  newCreditCard?.expirationDate?.split('/')[0] ?? '1'
                }
                onDropdownChange={handleExpirationMonthChange}
                mode={ModalMode}
                dropdownStyle="w-1/3 mr-4"
              />
              <DropdownComponent
                options={years}
                placeholder={currentYear}
                onDropdownChange={handleExpirationYearChange}
                mode={ModalMode}
                dropdownStyle="w-1/3 ml-4"
              />
            </FormDateView>
            <FormButton onPress={handleSubmit} className="mt-1 z-0">
              <FormButtonText>Submit</FormButtonText>
            </FormButton>
            <FormButton onPress={closeModal} className="z-0">
              <FormButtonText>Cancel</FormButtonText>
            </FormButton>
            {AuthErrorComponent && <AuthErrorComponent />}
          </AddCCFormOverlayView>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ReviewCreditCardForm;
