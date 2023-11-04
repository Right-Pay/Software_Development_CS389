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
import AddNewDropdownOption from './AddNewDropdownOption';

const AddCreditCardFullForm = () => {
  const {addAuthError, clearAuthErrors, AuthErrorComponent} = React.useContext(
    authContext,
  ) as AuthContextType;
  const {
    cardForm,
    setCardForm,
    reviewCreditCard,
    updatingDropdown,
    setUpdatingDropdown,
  } = React.useContext(Context) as AppContext;
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
  const Forms = Consts.CredtCardForms;
  const ModalMode = Consts.DropdownListModes.MODAL;

  const [newBankOption, setNewBankOption] = useState<string>('');
  const [showNewBankOption, setShowNewBankOption] = useState<boolean>(false);
  const [newTypeOption, setNewTypeOption] = useState<string>('');
  const [showNewTypeOption, setShowNewTypeOption] = useState<boolean>(false);

  const years = Array.from(Array(6).keys()).map(i =>
    (i + parseInt(currentYear, 10)).toString(),
  );

  //These consts need to be updated to be pulled from db and will add the Add New option
  const [bankOptions, setBankOptions] = useState<string[]>([
    'Bank of America',
    'Chase',
    'Wells Fargo',
    'Citi',
    'US Bank',
    'Capital One',
    'PNC',
    'TD Bank',
    'USAA',
    'Add New Bank',
  ]);

  const [typeOptions, setTypeOptions] = useState<string[]>([
    'Visa',
    'MasterCard',
    'Discover',
    'American Express',
    'Add New Type',
  ]);

  const onExpirationMonthDropdownChange = (item: string) =>
    setExpirationMonth(item);

  const onExpirationYearDropdownChange = (item: string) =>
    setExpirationYear(item);

  const onCardTypeDropdownChange = (item: string) => {
    if (!checkForAddNew(item)) {
      setCardType(item);
    }
  };

  const onBankNameDropdownChange = (item: string) => {
    if (!checkForAddNew(item)) {
      setBankName(item);
    }
  };

  const checkForAddNew = (item: string) => {
    const regex: RegExp = /^Add New\s.*/;
    const AddNew = regex.test(item);
    if (AddNew && !updatingDropdown) {
      switch (item.split('Add New')[1].trim()) {
        case 'Bank':
          setShowNewBankOption(true);
          break;
        case 'Type':
          setShowNewTypeOption(true);
          break;
        default:
          break;
      }
      return true;
    } else {
      setUpdatingDropdown(false);
      return false;
    }
  };

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
      id: Math.random() * 100, //Will need to be updated to be unique
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

  useEffect(() => {
    if (newBankOption !== '') {
      setBankName(newBankOption);
      setBankOptions([
        ...bankOptions.slice(0, -1),
        newBankOption,
        bankOptions.slice(-1)[0],
      ]);
    }
  }, [newBankOption]);

  useEffect(() => {
    if (newTypeOption !== '') {
      setCardType(newTypeOption);
      setTypeOptions([
        ...typeOptions.slice(0, -1),
        newTypeOption,
        typeOptions.slice(-1)[0],
      ]);
    }
  }, [newTypeOption]);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={cardForm === Forms.Full}
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
            placeholder="First Six Digits"
            placeholderTextColor="#AFAEAE"
            onChange={event => handleCCNumChange(event)}
          />
          {DropdownComponent({
            options: bankOptions,
            placeholder: bankOptions[0],
            onDropdownChange: onBankNameDropdownChange,
            mode: ModalMode,
            style: 'm-2 w-1/2 z-50',
            refresh: bankOptions,
          })}
          <AddNewDropdownOption
            name="Bank"
            setOption={setNewBankOption}
            show={showNewBankOption}
            setShow={setShowNewBankOption}
          />
          {DropdownComponent({
            options: typeOptions,
            placeholder: typeOptions[0],
            onDropdownChange: onCardTypeDropdownChange,
            mode: ModalMode,
            style: 'm-2 w-1/2 z-40',
            refresh: typeOptions,
          })}
          <AddNewDropdownOption
            name="Type"
            setOption={setNewTypeOption}
            show={showNewTypeOption}
            setShow={setShowNewTypeOption}
          />
          <FormDateView className="m-2 z-30">
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
              mode: ModalMode,
              style: 'w-1/3',
            })}
            {DropdownComponent({
              options: years,
              placeholder: currentYear,
              onDropdownChange: onExpirationYearDropdownChange,
              mode: ModalMode,
              style: 'w-1/3',
            })}
          </FormDateView>
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
