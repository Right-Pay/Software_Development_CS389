import React from 'react';
import {Modal} from 'react-native';
import {
  AddCCFormOverlayView,
  AuthButton,
  AuthButtonText,
  AuthInputBox,
  Title,
} from '../../../Helpers/StylizedComponents';
import {CreditCard, CreditCardFormProps} from '../../../types/CreditCardType';
import {AppContext} from '../../../types/AppContextType';
import Context from '../../../Context/context';

const AddCreditCardForm = (props: CreditCardFormProps) => {
  const {addNewCreditCard} = React.useContext(Context) as AppContext;
  const closeModal = () => props.setIsVisible(false);
  const [name, setName] = React.useState<string>('');
  const [cardNumber, setCardNumber] = React.useState<string>('');
  const [expirationDate, setExpirationDate] = React.useState<string>('');
  const [cardType, setCardType] = React.useState<string>('');

  const handleSubmit = () => {
    const newCard: CreditCard = {
      id: 1,
      name: name,
      cardNumber: cardNumber,
      expirationDate: expirationDate,
      securityCode: '123',
      cardType: cardType,
    };
    addNewCreditCard(newCard);
    closeModal();
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.isVisible}
      onRequestClose={closeModal}>
      <AddCCFormOverlayView>
        <Title>Overlay Form</Title>
        <AuthInputBox
          placeholder="Enter Name of Card"
          placeholderTextColor="#AFAEAE"
          onChange={event => setName(event.nativeEvent.text)}
        />
        <AuthInputBox
          placeholder="Enter First Six Digits of Card"
          placeholderTextColor="#AFAEAE"
          onChange={event => setCardNumber(event.nativeEvent.text)}
        />
        <AuthInputBox //Change this to dropdown
          placeholder="Enter Expiration Date"
          placeholderTextColor="#AFAEAE"
          onChange={event => setExpirationDate(event.nativeEvent.text)}
        />
        <AuthInputBox //Change this to dropdown
          placeholder="Enter Card Type"
          placeholderTextColor="#AFAEAE"
          onChange={event => setCardType(event.nativeEvent.text)}
        />
        <AuthButton onPress={handleSubmit}>
          <AuthButtonText>Submit</AuthButtonText>
        </AuthButton>
        <AuthButton onPress={closeModal}>
          <AuthButtonText>Close</AuthButtonText>
        </AuthButton>
      </AddCCFormOverlayView>
    </Modal>
  );
};

export default AddCreditCardForm;
