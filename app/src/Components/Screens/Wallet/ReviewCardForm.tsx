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
  FormButton,
  FormButtonText,
  FormInputBox,
  FormDateView,
  Title,
  FinePrint,
  BankOptionsView,
  BanksView,
} from '../../../Helpers/StylizedComponents';
import {Card, CardBank} from '../../../types/CardType';
import {AppContext} from '../../../types/AppContextType';
import Context from '../../../Context/context';
import DropdownComponent from '../../../Helpers/Dropdown';
import authContext from '../../../Context/authContext';
import {AuthContextType} from '../../../types/AuthContextType';
import Consts from '../../../Helpers/Consts';
import AddNewDropdownOption from './AddNewBankOption';
import AuthErrorComponent from '../../../Helpers/AuthErrorComponent';

const ReviewCardForm = () => {
  //Context
  const [filteredBankOptions, setFilteredBankOptions] = useState<CardBank[]>(
    [],
  );

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
