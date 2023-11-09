import React, {useEffect, useState} from 'react';
import {Keyboard, KeyboardAvoidingView, Modal, Platform} from 'react-native';
import {
  AddCCFormOverlayView,
  FormButton,
  FormButtonText,
  FormInputBox,
  FormDateView,
  Title,
} from '../../../Helpers/StylizedComponents';
import {
  Card,
  Reward,
  Bank,
  Brand,
  CreditCardFormTypes,
} from '../../../types/CreditCardType';
import {AppContext} from '../../../types/AppContextType';
import Context from '../../../Context/context';
import DropdownComponent from '../../../Helpers/Dropdown';
import authContext from '../../../Context/authContext';
import {AuthContextType} from '../../../types/AuthContextType';
import Consts from '../../../Helpers/Consts';
import AddNewDropdownOption from './AddNewBankOption';

const AddCreditCardFullForm = () => {
  //Context
  const {addAuthError, clearAuthErrors, AuthErrorComponent} = React.useContext(
    authContext,
  ) as AuthContextType;
  const {
    reviewCreditCard,
    bankOptions,
    setBankOptions,
    typeOptions,
    CreditCardForms,
    setCreditCardForms,
    validateCreditCardForm,
  } = React.useContext(Context) as AppContext;

  //card stuff
  const [cardName, setCardName] = React.useState<string>('');
  const [nickname, setNickName] = React.useState<string>('');
  const [bankName, setBankName] = React.useState<string>('');
  const [cardBin, setCardBin] = React.useState<string>('');
  const [cardBrand, setCardBrand] = React.useState<string>('visa');
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
  const ModalMode = Consts.DropdownListModes.MODAL;

  //Add New Options
  const [newBankOption, setNewBankOption] = useState<string>('');

  const setShowAddBankOption = (show: boolean) => {
    setCreditCardForms({...CreditCardForms, AddBankOption: show});
  };

  //onChange Methods
  const onCardTypeDropdownChange = (item: string) => setCardBrand(item);

  const onBankNameDropdownChange = (item: string) => {
    if (item === 'Add New Bank' && newBankOption !== 'false') {
      setShowAddBankOption(true);
    }
    setBankName(bankOptions[0]);
  };

  const onCCNumberChange = (event: any) => {
    setCardBin(event.nativeEvent.text);
  };

  //Handlers
  const handleSubmit = () => {
    clearAuthErrors();
    const errors = validateCreditCardForm(
      {cardName, cardBin, bankName, nickname},
      CreditCardFormTypes.Full,
    );
    if (errors.length > 0) {
      errors.forEach(error => addAuthError(error));
      return;
    }
    const newCard: Card = {
      id: Math.random() * 100, //Will need to be updated to be unique
      card_name: cardName,
      card_bin: +`${cardBin.slice(0, 4)}${cardBin.slice(4, 7)}`,
      exp_date: expirationDate,
      card_bank: bankName,
      card_brand: cardBrand,
    };
    reviewCreditCard(newCard);
  };

  const closeModal = () => {
    setCreditCardForms({...CreditCardForms, Full: false});
    setCardName('');
    setNickName('');
    setBankName('');
    setCardBin('');
    setExpirationDate('');
    setExpirationYear('');
    setExpirationMonth('');
    clearAuthErrors();
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

  //useEffect
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
  }, [bankOptions]);

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
        <AddCCFormOverlayView className="flex-auto ">
          <Title>Add New Credit Card</Title>
          <FormInputBox
            placeholder="Name of Card"
            placeholderTextColor="#AFAEAE"
            onChange={event => setCardName(event.nativeEvent.text)}
          />
          <FormInputBox
            placeholder="First Six Digits"
            placeholderTextColor="#AFAEAE"
            onChange={event => onCCNumberChange(event)}
          />
          <DropdownComponent
            options={bankOptions}
            placeholder={bankOptions[0]}
            onDropdownChange={onBankNameDropdownChange}
            mode={ModalMode}
            dropdownStyle="m-2 w-2/3 h-auto z-50"
            refresh={CreditCardForms.AddBankOption}
          />
          <AddNewDropdownOption
            setOption={setNewBankOption}
            show={CreditCardForms.AddBankOption}
          />
          <DropdownComponent
            options={typeOptions}
            placeholder={typeOptions[0]}
            onDropdownChange={onCardTypeDropdownChange}
            mode={ModalMode}
            dropdownStyle="m-2 w-2/3 h-auto z-40"
            refresh={CreditCardForms.AddTypeOption}
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
              onDropdownChange: setExpirationMonth,
              mode: ModalMode,
              dropdownStyle: 'w-1/3 mr-4',
            })}
            {DropdownComponent({
              options: years,
              placeholder: currentYear,
              onDropdownChange: setExpirationYear,
              mode: ModalMode,
              dropdownStyle: 'w-1/3 ml-4',
            })}
          </FormDateView>
          <FormButton onPress={handleSubmit} className="mt-1 z-0">
            <FormButtonText>Submit</FormButtonText>
          </FormButton>
          <FormButton onPress={closeModal} className="z-0">
            <FormButtonText>Close</FormButtonText>
          </FormButton>
          {AuthErrorComponent && <AuthErrorComponent />}
        </AddCCFormOverlayView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddCreditCardFullForm;
