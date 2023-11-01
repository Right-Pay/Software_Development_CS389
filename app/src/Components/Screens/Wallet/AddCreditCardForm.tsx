import React, {useEffect} from 'react';
import {Modal} from 'react-native';
import {
  AddCCFormOverlayView,
  AuthButton,
  AuthButtonText,
  AuthInputBox,
  FormDateView,
  Title,
} from '../../../Helpers/StylizedComponents';
import {CreditCard, CreditCardFormProps} from '../../../types/CreditCardType';
import {AppContext} from '../../../types/AppContextType';
import Context from '../../../Context/context';
import DropdownComponent from '../../../Helpers/Dropdown';
import authContext from '../../../Context/authContext';
import {AuthContextType} from '../../../types/AuthContextType';
import Consts from '../../../Helpers/Consts';

const AddCreditCardForm = (props: CreditCardFormProps) => {
  const {addNewCreditCard} = React.useContext(Context) as AppContext;
  const {addAuthError, clearAuthErrors, AuthErrorComponent} = React.useContext(
    authContext,
  ) as AuthContextType;
  const closeModal = () => props.setIsVisible(false);
  const [name, setName] = React.useState<string>('');
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
      name: name,
      cardNumber: `${cardNumber.slice(0, 4)} ${cardNumber.slice(4, 7)}`,
      expirationDate: expirationDate,
      securityCode: '123',
      cardType: cardType,
    };
    addNewCreditCard(newCard);
    closeModal();
  };

  const handleCCNumChange = (event: any) => {
    setCardNumber(event.nativeEvent.text);
  };

  function validateForm() {
    const errors: string[] = [];
    const cardNumberRegex = /^[0-9]{6}$/;
    const cardNameRegex = /^[a-zA-Z ]{1,}$/;
    if (name.length <= 10 || !cardNameRegex.test(name)) {
      errors.push(ErrorMessages.invalidCreditCardName);
    }
    if (cardNumber.length !== 6 || !cardNumberRegex.test(cardNumber)) {
      errors.push(ErrorMessages.invalidCreditCardNumber);
    }
    return errors;
  }

  useEffect(() => {
    clearAuthErrors();
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.isVisible}
      onRequestClose={closeModal}>
      <AddCCFormOverlayView>
        <Title>Add New Credit Card</Title>
        <AuthInputBox
          placeholder="Name of Card"
          placeholderTextColor="#AFAEAE"
          onChange={event => setName(event.nativeEvent.text)}
        />
        <AuthInputBox
          placeholder="First Six Digits"
          placeholderTextColor="#AFAEAE"
          onChange={event => handleCCNumChange(event)}
        />
        <FormDateView>
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
          style: 'm-2 w-1/2',
        })}
        <AuthButton onPress={handleSubmit} className="mt-1">
          <AuthButtonText>Submit</AuthButtonText>
        </AuthButton>
        <AuthButton onPress={closeModal}>
          <AuthButtonText>Close</AuthButtonText>
        </AuthButton>
        {AuthErrorComponent && <AuthErrorComponent />}
      </AddCCFormOverlayView>
    </Modal>
  );
};

export default AddCreditCardForm;
