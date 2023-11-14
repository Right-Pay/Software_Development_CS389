import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
} from 'react-native';
import {
  AddCFormOverlayView,
  FormButton,
  FormButtonText,
  FormInputBox,
  FormDateView,
  Title,
  FinePrint,
  BankOptionsView,
  BanksView,
} from '../../../Helpers/StylizedComponents';
import {Card} from '../../../types/CardType';
import {AppContext} from '../../../types/AppContextType';
import Context from '../../../Context/context';
import DropdownComponent from '../../../Helpers/Dropdown';
import authContext from '../../../Context/authContext';
import {AuthContextType} from '../../../types/AuthContextType';
import Consts from '../../../Helpers/Consts';
import AddNewDropdownOption from './AddNewBankOption';

const AddCardFullForm = () => {
  //Context
  const {addAuthError, clearAuthErrors, AuthErrorComponent, removeAuthError} =
    React.useContext(authContext) as AuthContextType;
  const {
    bankOptions,
    setBankOptions,
    brandOptions,
    CardForms,
    setCardForms,
    validateCardForm,
    updatingDropdown,
    setUpdatingDropdown,
    setNewCardBin,
    newCardBin,
    findCard,
    reviewCard,
  } = React.useContext(Context) as AppContext;

  //card stuff
  const [bankName, setBankName] = React.useState<string>('');
  const [level, setLevel] = React.useState<string>('');
  const [cardBrand, setCardBrand] = React.useState<string>('visa');
  const [cardType, setCardType] = React.useState<string>('Credit');
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

  const [filteredBankOptions, setFilteredBankOptions] = useState<string[]>([]);

  const [showFull, setShowFull] = useState<boolean>(false);

  //consts
  const ModalMode = Consts.DropdownListModes.MODAL;

  //Add New Options
  const [newBankOption, setNewBankOption] = useState<string>('');

  //onChange Methods
  const onBankNameChange = (item: string) => {
    setBankName(item);
    if (item.length <= 3) {
      setFilteredBankOptions([]);
      return;
    }
    const filter = bankOptions
      .filter(b => b.bank_name.toLowerCase().includes(item.toLowerCase()))
      .map(b => b.bank_name);
    setFilteredBankOptions(filter);
  };

  const onBinChange = (bin: number) => {
    if (isNaN(bin)) {
      addAuthError(Consts.authErrorMessages.invalidCardBin);
      return;
    }
    removeAuthError(Consts.authErrorMessages.invalidCardBin);
    setNewCardBin(bin);
  };

  //Handlers
  const handleSubmit = () => {
    clearAuthErrors();
    setExpirationDate(`${expirationYear}-${expirationMonth}`);
    const cardDetails = showFull ? {bankName, level} : {};
    const errors = validateCardForm(cardDetails);
    if (errors.length > 0) {
      errors.forEach(error => addAuthError(error));
      return;
    }
    Keyboard.dismiss();
    if (showFull) {
      const newCard: Card = {
        card_bin: newCardBin,
        exp_date: expirationDate,
        card_bank_name: bankName,
        card_bank_id: bankOptions.find(b => b.bank_name === bankName)?.id,
        card_brand_name: cardBrand,
        card_brand_id: brandOptions.find(b => b.brand_name === cardBrand)?.id,
        card_type: cardType,
        card_level: level,
      };
      setCardForms({...CardForms, Full: false});
      reviewCard(newCard);
      setShowFull(false);
    } else {
      const searchForCard = async () => {
        setShowFull(await findCard(+newCardBin as number));
      };
      searchForCard();
    }
  };

  const closeModal = () => {
    setCardForms({...CardForms, Full: false});
    setNewCardBin(0o0);
    clearAuthErrors();
    setShowFull(false);
  };

  const renderBankOption = ({item}: {item: string}) => (
    <Pressable
      onPress={() => {
        setBankName(item);
        setFilteredBankOptions([]);
      }}
      className="p-2 cursor-pointer hover:bg-gray-200">
      <Text className="text-black text-xl text-left">{item}</Text>
    </Pressable>
  );

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

  useEffect(() => {
    if (newBankOption !== '') {
      setBankName(newBankOption);
      setBankOptions([
        ...bankOptions.slice(0, -1),
        {
          id: bankOptions.length + 1,
          bank_name: newBankOption,
          abbr: newBankOption.substring(0, 3),
        },
        bankOptions.slice(-1)[0],
      ]);
    }
  }, [updatingDropdown]);

  useEffect(() => {
    clearAuthErrors();
  }, [CardForms.Full]);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={CardForms.Full}
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
        <AddCFormOverlayView
          className="flex-auto text-left"
          onTouchEnd={() => {
            if (filteredBankOptions.length > 0) {
              Keyboard.dismiss();
              setFilteredBankOptions([]);
            }
          }}>
          <Title>Enter Card Details</Title>
          <FormInputBox
            placeholder="First Six Digits"
            placeholderTextColor="#AFAEAE"
            value={newCardBin !== 0o0 ? newCardBin.toString() : ''}
            maxLength={6}
            onChange={event => onBinChange(+event.nativeEvent.text)}
          />
          {showFull && (
            <>
              <FormInputBox
                placeholder="Level"
                placeholderTextColor="#AFAEAE"
                onChange={event => setLevel(event.nativeEvent.text)}
                value={level}
              />
              <BanksView>
                <FormInputBox
                  placeholder="Bank Name"
                  placeholderTextColor="#AFAEAE"
                  onChange={event => onBankNameChange(event.nativeEvent.text)}
                  onPressOut={() => {
                    onBankNameChange(bankName);
                  }}
                  value={bankName}
                  className="mb-0 w-full border-0 rounded-none"
                />
                {filteredBankOptions.length > 0 && (
                  <BankOptionsView>
                    <FlatList
                      data={filteredBankOptions}
                      renderItem={renderBankOption}
                      keyExtractor={item => item}
                    />
                  </BankOptionsView>
                )}
              </BanksView>
              <FinePrint
                onPress={() => {
                  setUpdatingDropdown(true);
                  setCardForms({...CardForms, AddBankOption: true});
                }}
                className="text-left">
                Don't see your Bank? Click Here!
              </FinePrint>
              <AddNewDropdownOption
                setOption={setNewBankOption}
                show={CardForms.AddBankOption}
              />
              <DropdownComponent
                options={brandOptions.map(b => b.brand_name)}
                placeholder={brandOptions[0].brand_name}
                onDropdownChange={setCardBrand}
                mode={ModalMode}
                dropdownStyle="m-2 w-2/3 h-auto z-40"
              />
              <DropdownComponent
                options={['Credit', 'Debit']}
                placeholder="Credit"
                onDropdownChange={setCardType}
                mode={ModalMode}
                dropdownStyle="m-2 w-2/3 h-auto z-40"
              />
              <FormDateView className="m-2 z-30">
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
                  placeholder="1"
                  onDropdownChange={setExpirationMonth}
                  mode={ModalMode}
                  dropdownStyle="w-1/3 mr-4"
                />
                <DropdownComponent
                  options={years}
                  placeholder={currentYear}
                  onDropdownChange={setExpirationYear}
                  mode={ModalMode}
                  dropdownStyle="w-1/3 ml-4"
                />
              </FormDateView>
            </>
          )}

          <FormButton onPress={handleSubmit} className="mt-1 z-0">
            <FormButtonText>Submit</FormButtonText>
          </FormButton>
          <FormButton onPress={closeModal} className="z-0">
            <FormButtonText>Close</FormButtonText>
          </FormButton>
          {AuthErrorComponent && <AuthErrorComponent />}
        </AddCFormOverlayView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddCardFullForm;
