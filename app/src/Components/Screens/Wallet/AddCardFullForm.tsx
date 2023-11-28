import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  AddCFormOverlayView,
  FormButton,
  FormButtonText,
  FormInputBox,
  FormDateView,
  Title,
  // FinePrint,
  BankOptionsView,
  BanksView,
} from '../../../Helpers/StylizedComponents';
import { Card, CardBank } from '../../../types/CardType';
import { AppContext } from '../../../types/AppContextType';
import Context from '../../../Context/context';
import DropdownComponent, { OptionsProps } from '../../../Helpers/Dropdown';
import authContext from '../../../Context/authContext';
import { AuthContextType } from '../../../types/AuthContextType';
import Consts from '../../../Helpers/Consts';
// import AddNewDropdownOption from './AddNewBankOption';

const AddCardFullForm = () => {
  //Context
  const { addAuthError, clearAuthErrors, AuthErrorComponent, removeAuthError } =
    React.useContext(authContext) as AuthContextType;
  const {
    linkCard,
    bankOptions,
    // setBankOptions,
    brandOptions,
    CardForms,
    setCardForms,
    validateCardForm,
    findCard,
  } = React.useContext(Context) as AppContext;

  const currentYear = new Date().getFullYear().toString().split('20')[1];
  const years = Array.from(Array(6).keys()).map(i => {
    return {
      label: (i + parseInt(currentYear, 10)).toString(),
      value: (i + parseInt(currentYear, 10)).toString(),
    };
  });

  //card stuff
  const [bankSearch, setBankSearch] = React.useState<string>('');
  const [filteredBankOptions, setFilteredBankOptions] = useState<CardBank[]>(
    [],
  );
  const [card, setCard] = useState<Card>({} as Card);
  enum EditStates {
    Bin = 'Bin',
    Add = 'Add',
    Edit = 'Edit',
  }
  const [editState, setEditState] = useState<EditStates>(EditStates.Bin);

  //consts
  const ModalMode = Consts.DropdownListModes.MODAL;

  //Add New Options
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [newBankOption, setNewBankOption] = useState<string>('');

  //onChange Methods
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

  //handlers
  const handleExpirationMonthChange = (month: string) => {
    const currentExpirationDate = card?.exp_date;
    const year = currentExpirationDate?.split('-')[0];
    if (currentExpirationDate) {
      setCard({ ...card, exp_date: `${year}-${month}` });
    }
  };

  const handleExpirationYearChange = (year: string) => {
    const currentExpirationDate = card?.exp_date;
    const month = currentExpirationDate?.split('-')[1];
    if (currentExpirationDate) {
      setCard({ ...card, exp_date: `${year}-${month}` });
    }
  };

  const handleSubmit = async () => {
    clearAuthErrors();
    Keyboard.dismiss();
    if (EditStates.Edit === editState || EditStates.Add === editState) {
      // link card, if new pass whole card, if edit pass card id
      const cardDetails = {
        cardBin: card?.card_bin,
        bankName: card?.card_bank_name,
        level: card?.card_level,
      };
      const errors = validateCardForm(cardDetails);
      if (errors.length > 0) {
        errors.forEach(error => addAuthError(error));
        return;
      }
      // if add state, pass true to new card bool
      if (await linkCard(card, EditStates.Add === editState)) {
        closeModal();
      }
    } else {
      const searchForCard = await findCard(card.card_bin as number, true);
      if (searchForCard) {
        searchForCard.exp_date = '23-01';
        setCard(searchForCard);
        setBankSearch(searchForCard.card_bank_name || '');
        setFilteredBankOptions([]);
        setEditState(EditStates.Edit);
      } else {
        setCard({ ...card, exp_date: '23-01' });
        setEditState(EditStates.Add);
      }
    }
    // link card
    // addCard();
  };

  const closeModal = () => {
    setCardForms({ ...CardForms, Full: false });
    setCard({} as Card);
    setBankSearch('');
    clearAuthErrors();
    setEditState(EditStates.Bin);
  };

  const renderBankOption = ({ item }: { item: CardBank }) => (
    <Pressable
      onPress={() => {
        let bank_id = Number(item.id);
        let bank_name = item.bank_name;
        if (
          editState === EditStates.Edit &&
          Number(card?.card_bank_id) !== bank_id
        ) {
          setEditState(EditStates.Add);
        }
        if (card) {
          card.card_bank_id = bank_id;
          card.card_bank_name = bank_name;
        }
        setBankSearch(item.bank_name);
        setFilteredBankOptions([]);
        Keyboard.dismiss();
      }}
      className="p-2 cursor-pointer hover:bg-gray-200">
      <Text className="text-black text-xl text-left">{item.bank_name}</Text>
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

  // useEffect(() => {
  //   if (newBankOption !== '') {
  //     const newBank = {
  //       id: bankOptions.length + 1,
  //       bank_name: newBankOption,
  //       abbr: newBankOption.substring(0, 3),
  //     };

  //     setCard({
  //       ...card,
  //       card_bank_name: newBankOption,
  //       card_bank_id: newBank.id,
  //     });

  //     setBankOptions([
  //       ...bankOptions.slice(0, -1),
  //       newBank,
  //       bankOptions.slice(-1)[0],
  //     ]);
  //   }
  // }, []);

  useEffect(() => {
    clearAuthErrors();
  }, [clearAuthErrors, CardForms.Full]);

  useEffect(() => {
    filterBank(bankSearch);
  }, [bankSearch, filterBank]);

  const renderBinInput = () => {
    const updateBin = (event: any) => {
      let bin = Number(event.nativeEvent.text);
      if (editState === EditStates.Edit && Number(card.card_bin) !== bin) {
        setEditState(EditStates.Add);
      }

      if (isNaN(bin)) {
        addAuthError(Consts.authErrorMessages.invalidCardBin);
        return;
      }

      removeAuthError(Consts.authErrorMessages.invalidCardBin);
      setCard({ ...card, card_bin: bin });
    };
    return (
      <FormInputBox
        placeholder="First Six Digits"
        placeholderTextColor="#AFAEAE"
        value={card.card_bin ? card.card_bin.toString() : ''}
        maxLength={6}
        onChange={updateBin}
      />
    );
  };

  const renderLevelInput = () => {
    const updateLevel = (text: string) => {
      if (editState === EditStates.Edit && card.card_level !== text) {
        setEditState(EditStates.Add);
      }
      setCard({ ...card, card_level: text });
    };
    return (
      <FormInputBox
        placeholder="Level"
        placeholderTextColor="#AFAEAE"
        onChangeText={updateLevel}
        value={card?.card_level || ''}
      />
    );
  };

  const renderBankDropdown = () => {
    return (
      <>
        <BanksView>
          <FormInputBox
            placeholder="Bank Name"
            placeholderTextColor="#AFAEAE"
            onChange={event => setBankSearch(event.nativeEvent.text)}
            value={bankSearch}
            defaultValue={card?.card_bank_name}
            className="mb-0 w-full border-0 rounded-none"
          />
          {filteredBankOptions.length > 0 && isKeyboardVisible && (
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
        {/* <FinePrint
          onPress={() => {
            setCardForms({...CardForms, AddBankOption: true});
          }}
          className="text-left">
          Don't see your Bank? Click Here!
        </FinePrint>
        <AddNewDropdownOption
          setOption={setNewBankOption}
          show={CardForms.AddBankOption}
        />*/}
      </>
    );
  };

  const renderBrandDropdown = () => {
    const updateBrand = (event: any) => {
      let brand_id = Number(event);
      let brand_name = brandOptions.find(b => b.id === brand_id)?.brand_name;
      if (isNaN(brand_id)) {
        return;
      }
      if (
        editState === EditStates.Edit &&
        Number(card.card_brand_id) !== brand_id
      ) {
        setEditState(EditStates.Add);
      }
      setCard({
        ...card,
        card_brand_id: brand_id,
        card_brand_name: brand_name,
      });
    };
    return (
      <DropdownComponent
        options={brandOptions.map((b): OptionsProps => {
          return {
            label: b.brand_name,
            value: b.id.toString(),
          };
        })}
        placeholder={card?.card_brand_name || 'Visa, JSB, etc...'}
        onDropdownChange={updateBrand}
        mode={ModalMode}
        dropdownStyle="m-2 w-2/3 h-auto z-40 border-slate-600"
      />
    );
  };

  const renderTypeDropdown = () => {
    const updateType = (event: any) => {
      if (
        editState === EditStates.Edit &&
        card.card_type !== event.toString()
      ) {
        setEditState(EditStates.Add);
      }
      setCard({ ...card, card_type: event.toString() });
    };
    return (
      <DropdownComponent
        options={[
          {
            label: 'Credit',
            value: 'Credit',
          },
          {
            label: 'Debit',
            value: 'Debit',
          },
        ]}
        placeholder={card?.card_type || 'Credit or Debit'}
        onDropdownChange={updateType}
        mode={ModalMode}
        dropdownStyle="m-2 w-2/3 h-auto z-40"
      />
    );
  };

  const renderExpirationDropdown = () => {
    return (
      <FormDateView className="m-2 z-30">
        <DropdownComponent
          options={Array.from({ length: 12 }, (_, i) => {
            return {
              label: (i + 1).toString(),
              value: (i + 1).toString(),
            };
          })}
          placeholder="1"
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
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={CardForms.Full}
      onRequestClose={closeModal}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          setFilteredBankOptions([]);
        }}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          enabled={isKeyboardVisible}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 10}>
          <AddCFormOverlayView className="flex-auto text-left z-0">
            <Title>
              {editState !== EditStates.Edit
                ? 'Enter Card Details'
                : 'Edit Card Details'}
            </Title>
            {renderBinInput()}
            {editState !== EditStates.Bin && (
              <>
                {renderLevelInput()}
                {renderBankDropdown()}
                {renderBrandDropdown()}
                {renderTypeDropdown()}
                {renderExpirationDropdown()}
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
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
  },
});

export default AddCardFullForm;
