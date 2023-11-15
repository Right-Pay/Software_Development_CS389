import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  AddCFormOverlayView,
  BankOptionsView,
  BanksView,
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
import authContext from '../../../Context/authContext';
import {AuthContextType} from '../../../types/AuthContextType';
import {CardBank} from '../../../types/CardType';

const ReviewCardForm = () => {
  //Context
  const {addAuthError} = React.useContext(authContext) as AuthContextType;

  const {
    addCard,
    newCard,
    bankOptions,
    brandOptions,
    CardForms,
    setCardForms,
    setNewCard,
    validateCardForm,
    setNewCardBin,
  } = React.useContext(Context) as AppContext;

  //Constants
  const ModalMode = Consts.DropdownListModes.MODAL;

  const currentYear = new Date().getFullYear().toString().split('20')[1];
  const years = Array.from(Array(6).keys()).map(i =>
    (i + parseInt(currentYear, 10)).toString(),
  );

  const [bankSearch, setBankSearch] = useState<string>('');

  const [filteredBankOptions, setFilteredBankOptions] = useState<CardBank[]>(
    [],
  );

  //Functions
  const closeModal = () => {
    setNewCardBin(0o0);
    setCardForms({
      ...CardForms,
      Review: false,
    });
  };

  //renderers
  const renderBankOption = ({item}: {item: CardBank}) => (
    <Pressable
      onPress={() => {
        if (newCard) {
          newCard.card_bank_id = item.id;
        }
        setBankSearch(item.bank_name);
        setFilteredBankOptions([]);
        Keyboard.dismiss();
      }}
      className="p-2 cursor-pointer hover:bg-gray-200">
      <Text className="text-black text-xl text-left">{item.bank_name}</Text>
    </Pressable>
  );

  //handlers
  const handleExpirationMonthChange = (month: string) => {
    const currentExpirationDate = newCard?.exp_date;
    const year = currentExpirationDate?.split('-')[0];
    if (currentExpirationDate) {
      setNewCard({...newCard, exp_date: `${year}-${month}`});
    }
  };

  const handleExpirationYearChange = (year: string) => {
    const currentExpirationDate = newCard?.exp_date;
    const month = currentExpirationDate?.split('-')[1];
    if (currentExpirationDate) {
      setNewCard({...newCard, exp_date: `${year}-${month}`});
    }
  };

  const handleSubmit = () => {
    if (!newCard) {
      return;
    }
    const errors = validateCardForm({
      bankName: bankOptions.find(b => b.id === newCard.card_bank_id)?.bank_name,
      level: newCard.card_level,
    });
    if (errors.length > 0) {
      errors.forEach(error => addAuthError(error));
      return;
    }
    Keyboard.dismiss();
    addCard();
  };

  const filterBank = useCallback(
    (item: string) => {
      if (item.length <= 3) {
        setFilteredBankOptions([]);
        return;
      }
      const filter = [
        ...bankOptions.filter(b =>
          b.bank_name.toLowerCase().startsWith(item.toLowerCase()),
        ),
        ...bankOptions.filter(
          b =>
            !b.bank_name.toLowerCase().startsWith(item.toLowerCase()) &&
            b.bank_name.toLowerCase().includes(item.toLowerCase()),
        ),
      ];

      setFilteredBankOptions(filter);
    },
    [bankOptions],
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
    filterBank(bankSearch);
  }, [bankSearch, filterBank]);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={CardForms.Review}
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
        {newCard && (
          <TouchableWithoutFeedback
            onPress={() => {
              setTimeout(() => {
                Keyboard.dismiss();
                setFilteredBankOptions([]);
              }, 1000);
            }}>
            <AddCFormOverlayView className="flex-auto ">
              <Title>Review Card</Title>
              <FormInputBox
                defaultValue={newCard.card_bin?.toString() ?? ''}
                placeholder="Card Number"
                placeholderTextColor={'grey'}
                maxLength={6}
                onChange={event => (newCard.card_bin = +event.nativeEvent.text)}
              />
              <FormInputBox
                placeholder="Level"
                placeholderTextColor="#AFAEAE"
                onChange={event =>
                  (newCard.card_level = event.nativeEvent.text)
                }
                defaultValue={
                  newCard.card_level && newCard.card_level?.length > 0
                    ? newCard.card_level
                    : 'Level'
                }
              />
              <BanksView>
                <FormInputBox
                  placeholder="Bank Name"
                  placeholderTextColor="#AFAEAE"
                  onChange={event => setBankSearch(event.nativeEvent.text)}
                  defaultValue={
                    bankOptions.find(
                      b => b.id === +(newCard?.card_bank_id ?? 0),
                    )?.bank_name ?? ''
                  }
                  //value={bankSearch}
                  className="mb-0 w-full border-0 rounded-none"
                />
                {filteredBankOptions.length > 0 && (
                  <BankOptionsView>
                    <FlatList
                      data={filteredBankOptions}
                      renderItem={renderBankOption}
                      keyExtractor={item => item.id.toString()}
                      keyboardShouldPersistTaps="handled"
                    />
                  </BankOptionsView>
                )}
              </BanksView>
              <DropdownComponent
                options={brandOptions.map(b => b.brand_name)}
                placeholder={
                  newCard.card_brand_name ?? brandOptions[0].brand_name
                }
                onDropdownChange={event => {
                  newCard.card_brand_id = brandOptions.find(
                    b => b.brand_name === event,
                  )?.id;
                }}
                mode={ModalMode}
                dropdownStyle="m-2 h-auto w-2/3"
              />
              <DropdownComponent
                options={['Debit', 'Credit']}
                placeholder="Credit"
                onDropdownChange={event => (newCard.card_type = event)}
                mode={ModalMode}
                dropdownStyle="m-2 w-2/3 h-auto"
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
                  placeholder={newCard?.exp_date?.split('-')[1] ?? '1'}
                  onDropdownChange={handleExpirationMonthChange}
                  mode={ModalMode}
                  dropdownStyle="w-1/3 mr-4"
                />
                <DropdownComponent
                  options={years}
                  placeholder={newCard?.exp_date?.split('-')[0] ?? currentYear}
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
            </AddCFormOverlayView>
          </TouchableWithoutFeedback>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ReviewCardForm;
