import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Modal,
  NativeSyntheticEvent,
  Pressable,
  Text,
  TextInputChangeEventData,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-ionicons';
import authContext from '../../../Context/authContext';
import Context from '../../../Context/context';
import useColorsMode from '../../../Helpers/Colors';
import Consts from '../../../Helpers/Consts';
import { FormDateView } from '../../../Helpers/StylizedComponents';
import { AppContext } from '../../../types/AppContextType';
import { AuthContextType } from '../../../types/AuthContextType';
import { Card, CardBank } from '../../../types/CardType';
import DropdownComponent, { OptionsProps } from '../../Common/Dropdown';
import InputBox from '../../Common/InputBox';
import ModalOverlayView from '../../Common/ModalOverlayView';
import PrimaryButton from '../../Common/PrimaryButton';
import PrimaryText from '../../Common/PrimaryText';
import TitleText from '../../Common/TitleText';
import { LanguageContextType } from '../../../types/LanguageContextType';
import LanguageContext from '../../../Context/languageContext';

const AddCardFullForm: React.FC = () => {
  //Context
  const {
    addAuthError,
    clearAuthErrors,
    AuthErrorComponent,
    removeAuthError,
    isKeyboardVisible,
  } = React.useContext(authContext) as AuthContextType;
  const {
    linkCard,
    bankOptions,
    CardForms,
    setCardForms,
    validateCardForm,
    findCard,
    findCardByAPI,
    getCardTypeFromBin,
  } = React.useContext(Context) as AppContext;
  const { translate } = React.useContext(
    LanguageContext,
  ) as LanguageContextType;

  const { themeMode } = useColorsMode();

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
  const [monthOptions, setMonthOptions] = useState<OptionsProps[]>(
    Array.from(Array(12).keys()).map(i => {
      return {
        label: (i + 1).toString(),
        value: (i + 1).toString(),
      };
    }),
  );

  enum EditStates {
    Bin = 'Bin',
    Add = 'Add',
    Review = 'Review',
    Invalid = 'Invalid',
  }
  enum EditForm {
    Type = 'Type',
    Bank = 'Bank',
    Level = 'Level',
  }
  const [editState, setEditState] = useState<EditStates>(EditStates.Bin);
  const [editForm, setEditForm] = useState<EditForm>(EditForm.Type);

  //consts
  const [bankSetFromList, setBankSetFromList] = useState<boolean>(false);

  //Add New Options
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [newBankOption, setNewBankOption] = useState<string>('');

  //onChange Methods
  const filterBank = useCallback(
    (item: string) => {
      if (item.length < 2) {
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
      setBankSetFromList(filter.length > 0);
      setFilteredBankOptions(filter);
    },
    [bankOptions],
  );

  //handlers
  const handleExpirationMonthChange = useCallback(
    (month: string) => {
      const currentExpirationDate = card?.exp_date;
      const year = currentExpirationDate?.split('-')[0];
      if (currentExpirationDate) {
        setCard({ ...card, exp_date: `${year}-${month}` });
      }
    },
    [card],
  );

  const handleExpirationYearChange = useCallback(
    (year: string) => {
      const currentExpirationDate = card?.exp_date;
      const month = currentExpirationDate?.split('-')[1];
      if (currentExpirationDate) {
        setCard({ ...card, exp_date: `${year}-${month}` });
      }

      if (year === currentYear) {
        setMonthOptions(
          monthOptions.filter(o => {
            return parseInt(o.label, 10) >= new Date().getMonth() + 1;
          }),
        );
      } else {
        setMonthOptions(
          Array.from(Array(12).keys()).map(i => {
            return {
              label: (i + 1).toString(),
              value: (i + 1).toString(),
            };
          }),
        );
      }
    },
    [card, currentYear, monthOptions],
  );

  const handleSubmit = async () => {
    clearAuthErrors();
    Keyboard.dismiss();
    if (EditStates.Bin === editState) {
      const errors = validateCardForm({
        cardBin: card.card_bin,
      });
      if (errors.length > 0) {
        errors.forEach(error => addAuthError(error));
        return;
      }
      const searchForCard = await findCard(card.card_bin as number, true);
      if (searchForCard) {
        searchForCard.exp_date =
          currentYear + '-' + (new Date().getMonth() + 1);
        setCard(searchForCard);
        setBankSearch(searchForCard.card_bank_name || '');
        setFilteredBankOptions([]);
        setEditState(EditStates.Review);
        setEditForm(EditForm.Type);
      } else {
        const searchForCard2 = await findCardByAPI(
          card.card_bin as number,
          false,
        );
        if (searchForCard2) {
          searchForCard2.exp_date =
            currentYear + '-' + (new Date().getMonth() + 1);
          setCard(searchForCard2);
          setBankSearch(searchForCard2.card_bank_name || '');
          setFilteredBankOptions([]);
          setEditState(EditStates.Review);
          setEditForm(EditForm.Type);
        } else {
          setCard({ ...card, exp_date: '23-01' });
          setEditState(EditStates.Invalid);
          setEditForm(EditForm.Type);
        }
      }
    } else {
      if (editForm === EditForm.Type) {
        if (
          card.card_type === '' ||
          (card.card_type !== 'Credit' && card.card_type !== 'Debit')
        ) {
          console.log('invalid card type');
          console.log(Consts.authErrorMessages.invalidCardType);
          addAuthError(Consts.authErrorMessages.invalidCardType);
          return;
        }
        setEditForm(EditForm.Bank);
      } else if (editForm === EditForm.Bank) {
        if (card.card_bank_id === 0) {
          addAuthError(Consts.authErrorMessages.invalidBankName);
          return;
        }
        setEditForm(EditForm.Level);
      } else if (editForm === EditForm.Level) {
        if (card.card_level === '') {
          addAuthError(Consts.authErrorMessages.invalidCardLevel);
          return;
        }
        // if add state, pass true to new card bool
        if (await linkCard(card, EditStates.Add === editState)) {
          closeModal(true);
        }
      }
    }
  };

  const closeModal = useCallback(
    (rewards = false) => {
      setCardForms({
        Full: false,
        Rewards: rewards,
        AddBankOption: false,
      });
      setCard({} as Card);
      setBankSearch('');
      clearAuthErrors();
      setEditState(EditStates.Bin);
    },
    [EditStates, clearAuthErrors, setCardForms],
  );

  const renderBankOption = useCallback(
    ({ item }: { item: CardBank }) => (
      <Pressable
        onPress={() => {
          const bank_id = Number(item.id);
          const bank_name = item.bank_name;
          if (
            editState === EditStates.Review &&
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
    ),
    [EditStates.Add, EditStates.Review, card, editState],
  );

  useEffect(() => {
    clearAuthErrors();
  }, [clearAuthErrors, CardForms.Full]);

  useEffect(() => {
    filterBank(bankSearch);
  }, [bankSearch, filterBank]);

  const renderBinInput = () => {
    const updateBin = (
      event: NativeSyntheticEvent<TextInputChangeEventData>,
    ) => {
      const bin = Number(event.nativeEvent.text);
      if (editState === EditStates.Review && Number(card.card_bin) !== bin) {
        setEditState(EditStates.Add);
      }
      const cardType = getCardTypeFromBin(bin);
      card.card_brand_name = cardType;

      if (isNaN(bin)) {
        addAuthError(Consts.authErrorMessages.invalidCardBin);
        return;
      }

      removeAuthError(Consts.authErrorMessages.invalidCardBin);
      setCard({ ...card, card_bin: bin });
    };
    const classes =
      'absolute right-2 mb-auto mt-auto text-xl rounded-full' +
      (themeMode === 'dark' ? ' bg-light-green' : ' bg-dark-green');

    return (
      <>
        <View className="relative w-2/3 flex justify-center items-center">
          <InputBox
            placeholder={translate('Wallet', 'Bin')}
            className="w-full"
            value={card.card_bin ? card.card_bin.toString() : ''}
            maxLength={6}
            keyboardType="numeric"
            onChange={updateBin}
          />
          {card.card_brand_name && card.card_bin > 0 && (
            <View className={classes}>
              <PrimaryText type="secondary" className="text-right p-2">
                {card.card_brand_name}
              </PrimaryText>
            </View>
          )}
        </View>
      </>
    );
  };

  const renderLevelInput = () => {
    const updateLevel = (text: string) => {
      if (editState === EditStates.Review && card.card_level !== text) {
        setEditState(EditStates.Add);
      }
      setCard({ ...card, card_level: text });
    };
    return (
      <InputBox
        placeholder={translate('Wallet', 'Level')}
        onChangeText={updateLevel}
        value={card?.card_level || ''}
      />
    );
  };

  const renderBankDropdown = useCallback(() => {
    const viewStyles =
      'mb-2 ml-0 w-full fixed max-h-48 border flex z-50' +
      (themeMode === 'dark'
        ? ' bg-neutral-700 text-gray-100'
        : ' bg-gray-100 text-black border-gray-400 border');
    return (
      <>
        <View className="flex flex-col justify-center w-2/3 p-0 z-50 sticky">
          <InputBox
            placeholder={translate('Wallet', 'BankName')}
            onChange={event => setBankSearch(event.nativeEvent.text)}
            value={bankSearch}
            defaultValue={card?.card_bank_name}
            className="mb-0 w-full"
          />
          {filteredBankOptions.length > 0 && isKeyboardVisible && (
            <View className={viewStyles}>
              <FlatList
                data={filteredBankOptions}
                renderItem={renderBankOption}
                keyExtractor={item => item.id.toString()}
                keyboardShouldPersistTaps="handled"
              />
            </View>
          )}
        </View>
      </>
    );
  }, [
    bankSearch,
    card?.card_bank_name,
    filteredBankOptions,
    isKeyboardVisible,
    renderBankOption,
    themeMode,
    translate,
  ]);

  const renderTypeDropdown = () => {
    const updateType = (event: string) => {
      if (editState === EditStates.Review && card.card_type !== event) {
        setEditState(EditStates.Add);
      }
      setCard({ ...card, card_type: event });
    };
    return (
      <DropdownComponent
        options={[
          {
            label: `${translate('Wallet', 'Credit')}`,
            value: 'Credit',
          },
          {
            label: `${translate('Wallet', 'Debit')}`,
            value: 'Debit',
          },
        ]}
        placeholder={
          card?.card_type ||
          `${translate('Wallet', 'Credit')} ${translate(
            'Wallet',
            'Or',
          )} ${translate('Wallet', 'Debit')}`
        }
        onDropdownChange={updateType}
        dropdownStyle="m-2 w-2/3 h-auto z-40"
      />
    );
  };

  const renderExpirationDropdown = useCallback(() => {
    return (
      <FormDateView className="m-2">
        <DropdownComponent
          options={monthOptions}
          placeholder={card?.exp_date?.split('-')[1] || '1'}
          onDropdownChange={handleExpirationMonthChange}
          dropdownStyle="w-1/3 mr-4"
        />
        <DropdownComponent
          options={years}
          placeholder={currentYear}
          onDropdownChange={handleExpirationYearChange}
          dropdownStyle="w-1/3 ml-4"
        />
      </FormDateView>
    );
  }, [
    monthOptions,
    card?.exp_date,
    handleExpirationMonthChange,
    years,
    currentYear,
    handleExpirationYearChange,
  ]);

  const backButton = useCallback(() => {
    return (
      <Pressable
        className="flex-1 flex-row pl-4 h-10 justify-start items-center text-center top-10 left-0 absolute"
        onPress={() => closeModal(false)}>
        <Icon name="close-outline" color="#4d654e" />
        <PrimaryText className="ml-2 text-xl text-center font-bold">
          {translate('Common', 'Close')}
        </PrimaryText>
      </Pressable>
    );
  }, [closeModal, translate]);

  const backForm = useCallback(() => {
    if (editForm === EditForm.Type) {
      return () => {
        setEditState(EditStates.Bin);
      };
    }
    if (editForm === EditForm.Bank) {
      return () => {
        setEditForm(EditForm.Type);
      };
    }
    if (editForm === EditForm.Level) {
      return () => {
        setEditForm(EditForm.Bank);
      };
    }
  }, [EditForm, EditStates, editForm]);

  const renderTitle = useCallback(() => {
    if (editState === EditStates.Review) {
      if (editForm === EditForm.Type) {
        return translate('Wallet', 'Verifycard');
      }
      if (editForm === EditForm.Bank) {
        return translate('Wallet', 'Verifybank');
      }
      if (editForm === EditForm.Level) {
        return translate('Wallet', 'Verifylevel');
      }
    } else if (editState === EditStates.Bin) {
      return translate('Wallet', 'Enterdigits');
    } else {
      if (editForm === EditForm.Type) {
        return translate('Wallet', 'cardtypeexp');
      }
      if (editForm === EditForm.Bank) {
        return translate('Wallet', 'Enterbank');
      }
      if (editForm === EditForm.Level) {
        return translate('Wallet', 'Enterlevel');
      }
    }
  }, [
    EditForm.Bank,
    EditForm.Level,
    EditForm.Type,
    EditStates.Bin,
    EditStates.Review,
    editForm,
    editState,
    translate,
  ]);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={CardForms.Full}
      onRequestClose={() => closeModal(false)}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          setFilteredBankOptions([]);
        }}>
        <ModalOverlayView className="flex-auto text-left z-0 pt-20">
          {editState !== EditStates.Invalid && (
            <>
              <TitleText className="mb-10 mt-4 w-9/12">
                {renderTitle()}
              </TitleText>
              {editState === EditStates.Bin && renderBinInput()}
              {editState !== EditStates.Bin && (
                <>
                  {editForm === EditForm.Level && renderLevelInput()}
                  {editForm === EditForm.Bank && renderBankDropdown()}
                  {/* {renderBrandDropdown()} */}
                  {editForm === EditForm.Type && renderTypeDropdown()}
                  {editForm === EditForm.Type && renderExpirationDropdown()}
                </>
              )}
              <View className="mt-10">
                {AuthErrorComponent && <AuthErrorComponent />}
              </View>
              <View className="flex-1 flex-row justify-end">
                {editState !== EditStates.Bin && (
                  <PrimaryButton
                    type="primary"
                    onPress={backForm()}
                    className="z-0">
                    <PrimaryText
                      type="secondary"
                      className="text-center text-xl">
                      {translate('Common', 'Back')}
                    </PrimaryText>
                  </PrimaryButton>
                )}
                <PrimaryButton
                  type="primary"
                  onPress={handleSubmit}
                  className="z-0">
                  <PrimaryText type="secondary" className="text-center text-xl">
                    {translate('Common', 'Next')}
                  </PrimaryText>
                </PrimaryButton>
              </View>
              {backButton()}
            </>
          )}
          {editState === EditStates.Invalid && (
            <>
              <TitleText className="mb-10 mt-4 w-9/12">Oh No!</TitleText>
              <PrimaryText className="text-center text-lg w-9/12">
                {translate('Wallet', 'Nosupport')}
              </PrimaryText>
              {backButton()}
            </>
          )}
        </ModalOverlayView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddCardFullForm;
