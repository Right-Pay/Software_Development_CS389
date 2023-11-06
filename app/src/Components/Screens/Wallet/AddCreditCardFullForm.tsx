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
  //Context
  const {addAuthError, clearAuthErrors, AuthErrorComponent} = React.useContext(
    authContext,
  ) as AuthContextType;
  const {
    reviewCreditCard,
    updatingDropdown,
    setUpdatingDropdown,
    bankOptions,
    setBankOptions,
    typeOptions,
    setTypeOptions,
    CreditCardForms,
    setCreditCardForms,
  } = React.useContext(Context) as AppContext;

  //card stuff
  const [cardName, setCardName] = React.useState<string>('');
  const [nickname, setNickName] = React.useState<string>('');
  const [bankName, setBankName] = React.useState<string>('');
  const [cardNumber, setCardNumber] = React.useState<string>('');
  const [cardType, setCardType] = React.useState<string>('visa');
  const [expirationMonth, setExpirationMonth] = React.useState<string>('1');
  const currentYear = new Date().getFullYear().toString().split('20')[1];
  const years = Array.from(Array(6).keys()).map(i =>
    (i + parseInt(currentYear, 10)).toString(),
  );
  const [expirationYear, setExpirationYear] =
    React.useState<string>(currentYear);
  const [expirationDate, setExpirationDate] = React.useState<string>(
    `${expirationMonth}/${expirationYear}`,
  );

  //consts
  const ErrorMessages = Consts.authErrorMessages;
  const ModalMode = Consts.DropdownListModes.MODAL;

  //Add New Options
  const [newBankOption, setNewBankOption] = useState<string>('');
  const [newTypeOption, setNewTypeOption] = useState<string>('');

  const setShowAddBankOption = (show: boolean) => {
    setCreditCardForms({...CreditCardForms, AddBankOption: show});
  };

  const setShowAddTypeOption = (show: boolean) => {
    setCreditCardForms({...CreditCardForms, AddTypeOption: show});
  };

  //onChange Methods
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

  const onCCNumberChange = (event: any) => {
    setCardNumber(event.nativeEvent.text);
  };

  const checkForAddNew = (item: string) => {
    const regex: RegExp = /^Add New\s.*/;
    const AddNew = regex.test(item);
    if (AddNew && !updatingDropdown) {
      switch (item.split('Add New')[1].trim()) {
        case 'Bank':
          setShowAddBankOption(true);
          break;
        case 'Type':
          setShowAddTypeOption(true);
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

  //Handlers
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
      nickname: nickname,
      bankName: bankName,
      cardType: cardType,
    };
    reviewCreditCard(newCard);
  };

  const closeModal = () => {
    setCreditCardForms({...CreditCardForms, Full: false});
    setCardName('');
    setNickName('');
    setBankName('');
    setCardNumber('');
    setExpirationDate('');
    setExpirationYear('');
    setExpirationMonth('');
    clearAuthErrors();
  };

  function validateForm() {
    const errors: string[] = [];
    const cardNumberRegex = /^[0-9]{6}$/;
    const cardNameRegex = /^[a-zA-Z ]{1,}$/;
    if (cardName.length <= 10 || !cardNameRegex.test(cardName)) {
      errors.push(ErrorMessages.invalidCreditCardName);
    }
    if (nickname.length <= 3 || !cardNameRegex.test(nickname)) {
      errors.push(ErrorMessages.invalidCreditCardNickName);
    }
    if (cardNumber.length !== 6 || !cardNumberRegex.test(cardNumber)) {
      errors.push(ErrorMessages.invalidCreditCardNumber);
    }
    return errors;
  }

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

  //useEffect
  useEffect(() => {
    clearAuthErrors();
    setCardName('');
    setCardNumber('');
    setExpirationDate('');
    setExpirationYear('');
    setExpirationMonth('');
  }, [CreditCardForms.Full]);

  useEffect(() => {
    if (newTypeOption !== '') {
      setCardType(newTypeOption);
      setTypeOptions([
        ...typeOptions.slice(0, -1),
        newTypeOption,
        typeOptions.slice(-1)[0],
      ]);
    }
    setCreditCardForms({...CreditCardForms, AddTypeOption: false});
  }, [newTypeOption]);

  useEffect(() => {
    if (newBankOption !== '') {
      setBankName(newBankOption);
      setBankOptions([
        ...bankOptions.slice(0, -1),
        newBankOption,
        bankOptions.slice(-1)[0],
      ]);
    }
    setCreditCardForms({...CreditCardForms, AddBankOption: false});
  }, [newBankOption]);

  useEffect(() => {
    setBankName(bankOptions[0]);
  }, [CreditCardForms.AddBankOption]);

  useEffect(() => {
    setCardType(typeOptions[0]);
  }, [CreditCardForms.AddTypeOption]);

  useEffect(() => {
    setExpirationDate(`${expirationMonth}/${expirationYear}`);
  }, [expirationMonth, expirationYear]);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={CreditCardForms.Full}
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
            placeholder="Nickname"
            placeholderTextColor="#AFAEAE"
            onChange={event => setNickName(event.nativeEvent.text)}
          />
          <AuthInputBox
            placeholder="First Six Digits"
            placeholderTextColor="#AFAEAE"
            onChange={event => onCCNumberChange(event)}
          />
          <DropdownComponent
            options={bankOptions}
            placeholder={bankOptions[0]}
            onDropdownChange={onBankNameDropdownChange}
            mode={ModalMode}
            style="m-2 w-2/3 h-auto z-50"
            refresh={CreditCardForms.AddBankOption} //Fix this refresh
          />
          <AddNewDropdownOption
            name="Bank"
            setOption={setNewBankOption}
            show={CreditCardForms.AddBankOption}
            setShow={setShowAddBankOption}
          />
          <DropdownComponent
            options={typeOptions}
            placeholder={typeOptions[0]}
            onDropdownChange={onCardTypeDropdownChange}
            mode={ModalMode}
            style="m-2 w-2/3 h-auto z-40"
            refresh={CreditCardForms.AddTypeOption}
          />
          <AddNewDropdownOption
            name="Type"
            setOption={setNewTypeOption}
            show={CreditCardForms.AddTypeOption}
            setShow={setShowAddTypeOption}
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
              style: 'w-1/2',
            })}
            {DropdownComponent({
              options: years,
              placeholder: currentYear,
              onDropdownChange: onExpirationYearDropdownChange,
              mode: ModalMode,
              style: 'w-1/2',
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
