import React, { useCallback, useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  TextInputChangeEventData,
  TouchableWithoutFeedback,
} from 'react-native';
import authContext from '../../../Context/authContext';
import Context from '../../../Context/context';
import Consts from '../../../Helpers/Consts';
import { FormInputBox } from '../../../Helpers/StylizedComponents';
import { AppContext } from '../../../types/AppContextType';
import { AuthContextType } from '../../../types/AuthContextType';
import { Card, CardBank } from '../../../types/CardType';
import ModalOverlayView from '../../Common/ModalOverlayView';
import PrimaryButton from '../../Common/PrimaryButton';
import PrimaryText from '../../Common/PrimaryText';
import TitleText from '../../Common/TitleText';
import { LanguageContextType } from '../../../types/LanguageContextType';
import LanguageContext from '../../../Context/languageContext';

const AddCardFullForm = () => {
  //Context
  const { addAuthError, clearAuthErrors, AuthErrorComponent, removeAuthError } =
    React.useContext(authContext) as AuthContextType;
  const {
    linkCard,
    bankOptions,
    CardForms,
    setCardForms,
    validateCardForm,
    findCard,
  } = React.useContext(Context) as AppContext;
  const { translate } = React.useContext(
    LanguageContext,
  ) as LanguageContextType;

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
        placeholder="BIN i.e. 440066"
        placeholderTextColor="#AFAEAE"
        value={card.card_bin ? card.card_bin.toString() : ''}
        maxLength={6}
        onChange={updateBin}
      />
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
          <ModalOverlayView className="flex-auto text-left z-0">
            <TitleText>{translate('Wallet', 'Enterdigits')}</TitleText>
            {renderBinInput()}
            <PrimaryButton
              type="primary"
              onPress={handleSubmit}
              className="mt-1 z-0">
              <PrimaryText type="secondary" className="text-center text-xl">
                {translate('Common', 'Submit')}
              </PrimaryText>
            </PrimaryButton>
            <PrimaryButton onPress={closeModal} className="z-0">
              <PrimaryText type="secondary" className="text-center text-xl">
                {translate('Common', 'Close')}
              </PrimaryText>
            </PrimaryButton>
            {AuthErrorComponent && <AuthErrorComponent />}
          </ModalOverlayView>
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
