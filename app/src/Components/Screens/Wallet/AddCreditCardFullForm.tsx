import React, {useEffect, useState} from 'react';
import {Keyboard, KeyboardAvoidingView, Modal, Platform} from 'react-native';
import {
  AddCCFormOverlayView,
  AuthButton,
  AuthButtonText,
  AuthInputBox,
  FormDateView,
  Title,
} from '../../../Helpers/StylizedComponents';
import {CreditCard} from '../../../types/CreditCardType';
import {AppContext} from '../../../types/AppContextType';
import Context from '../../../Context/context';
import DropdownComponent from '../../../Helpers/Dropdown';
import authContext from '../../../Context/authContext';
import {AuthContextType} from '../../../types/AuthContextType';
import Consts from '../../../Helpers/Consts';

const AddCreditCardFullForm = () => {
  const {addAuthError, clearAuthErrors, AuthErrorComponent} = React.useContext(
    authContext,
  ) as AuthContextType;
  const {cardForm, setCardForm, reviewCreditCard} = React.useContext(
    Context,
  ) as AppContext;
  const closeModal = () => {
    setCardForm(null);
    setCardName('');
    setNickName('');
    setBankName('');
    setCardNumber('');
    setExpirationDate('');
    setExpirationYear('');
    setExpirationMonth('');
    clearAuthErrors();
  };
  const [cardName, setCardName] = React.useState<string>('');
  const [nickName, setNickName] = React.useState<string>('');
  const [bankName, setBankName] = React.useState<string>('');
  const [cardNumber, setCardNumber] = React.useState<string>('');
  const [cardType, setCardType] = React.useState<string>('visa');
  const [expirationMonth, setExpirationMonth] = React.useState<string>('1');
  const currentYear = new Date().getFullYear().toString().split('20')[1];
  const [expirationYear, setExpirationYear] =
    React.useState<string>(currentYear);
  const [expirationDate, setExpirationDate] = React.useState<string>(
    `${expirationMonth}/${expirationYear}`,
  );
  const ErrorMessages = Consts.authErrorMessages;

  const years = Array.from(Array(6).keys()).map(i =>
    (i + parseInt(currentYear, 10)).toString(),
  );

  const onCardTypeDropdownChange = (item: string) => setCardType(item);

  const onExpirationMonthDropdownChange = (item: string) =>
    setExpirationMonth(item);

  const onExpirationYearDropdownChange = (item: string) =>
    setExpirationYear(item);

  useEffect(() => {
    setExpirationDate(`${expirationMonth}/${expirationYear}`);
  }, [expirationMonth, expirationYear]);

  const handleSubmit = () => {
    clearAuthErrors();
    const errors = validateForm();
    if (errors.length > 0) {
      errors.forEach(error => addAuthError(error));
      return;
    }
    const newCard: CreditCard = {
      id: 1,
      cardName: cardName,
      cardNumber: `${cardNumber.slice(0, 4)} ${cardNumber.slice(4, 7)}`,
      expirationDate: expirationDate,
      nickName: nickName,
      bankName: bankName,
      cardType: cardType,
    };
    reviewCreditCard(newCard);
  };

  const handleCCNumChange = (event: any) => {
    setCardNumber(event.nativeEvent.text);
  };

  function validateForm() {
    const errors: string[] = [];
    const cardNumberRegex = /^[0-9]{6}$/;
    const cardNameRegex = /^[a-zA-Z ]{1,}$/;
    if (cardName.length <= 10 || !cardNameRegex.test(cardName)) {
      errors.push(ErrorMessages.invalidCreditCardName);
    }
    if (nickName.length <= 3 || !cardNameRegex.test(nickName)) {
      errors.push(ErrorMessages.invalidCreditCardNickName);
    }
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
    setCardName('');
    setCardNumber('');
    setExpirationDate('');
    setExpirationYear('');
    setExpirationMonth('');
  }, [cardForm]);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={cardForm === 'Full'}
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
          <AuthInputBox
            placeholder="Name of Card"
            placeholderTextColor="#AFAEAE"
            onChange={event => setCardName(event.nativeEvent.text)}
          />
          <AuthInputBox
            placeholder="Nick Name"
            placeholderTextColor="#AFAEAE"
            onChange={event => setNickName(event.nativeEvent.text)}
          />
          <AuthInputBox
            placeholder="Bank Name"
            placeholderTextColor="#AFAEAE"
            onChange={event => setBankName(event.nativeEvent.text)}
          />
          <AuthInputBox
            placeholder="First Six Digits"
            placeholderTextColor="#AFAEAE"
            onChange={event => handleCCNumChange(event)}
          />
          <FormDateView className="z-50">
            {DropdownComponent({
              options: [
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
              ],
              placeholder: '1',
              onDropdownChange: onExpirationMonthDropdownChange,
              style: 'w-1/3',
            })}
            {DropdownComponent({
              options: years,
              placeholder: currentYear,
              onDropdownChange: onExpirationYearDropdownChange,
              style: 'w-1/3',
            })}
          </FormDateView>
          {DropdownComponent({
            options: ['Visa', 'MasterCard', 'Discover', 'American Express'],
            placeholder: 'Visa',
            onDropdownChange: onCardTypeDropdownChange,
            style: 'm-2 w-1/2 z-40',
          })}
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

export default AddCreditCardFullForm;
