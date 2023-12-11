import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Modal,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-ionicons';
import authContext from '../../../Context/authContext';
import Context from '../../../Context/context';
import useColorsMode from '../../../Helpers/Colors';
import Consts from '../../../Helpers/Consts';
import { AppContext } from '../../../types/AppContextType';
import { AuthContextType } from '../../../types/AuthContextType';
import { Category, Reward } from '../../../types/CardType';
import InputBox from '../../Common/InputBox';
import ModalOverlayView from '../../Common/ModalOverlayView';
import PrimaryButton from '../../Common/PrimaryButton';
import PrimaryText from '../../Common/PrimaryText';
import TitleText from '../../Common/TitleText';
import i18n from '../../../Localization/i18n';

const AddRewardForm: React.FC = () => {
  //Context
  const {
    addAuthError,
    clearAuthErrors,
    AuthErrorComponent,
    isKeyboardVisible,
    userProfile,
    refreshUserProfile,
  } = React.useContext(authContext) as AuthContextType;
  const {
    categoryOptions,
    // setBankOptions,
    CardForms,
    setCardForms,
    selectedCard,
    linkReward,
    addPoints,
    pointCount,
  } = React.useContext(Context) as AppContext;

  const { themeMode } = useColorsMode();

  //reward stuff
  const [categorySearch, setCategorySearch] = React.useState<string>('');
  const [filteredCategoryOptions, setFilteredCategoryOptions] = useState<
    Category[]
  >([]);
  const [newReward, setNewReward] = useState<Reward>({} as Reward);

  enum EditStates {
    Main = 'Main',
    Edit = 'Edit',
    Add = 'Add',
  }
  enum EditForm {
    CategoryForm = 'Category',
    Percentages = 'Percentages',
  }
  const [editState, setEditState] = useState<EditStates>(EditStates.Main);
  const [editForm, setEditForm] = useState<EditForm>(EditForm.CategoryForm);
  // const [bankSetFromList, setBankSetFromList] = useState<boolean>(false);

  //onChange Methods
  const filterCategory = useCallback(
    (item: string) => {
      if (item.length < 2) {
        setFilteredCategoryOptions([]);
        return;
      }
      const filter = [
        ...categoryOptions.filter(b =>
          b.category_name.toLowerCase().startsWith(item.toLowerCase()),
        ),
        ...categoryOptions.filter(
          b =>
            !b.category_name.toLowerCase().startsWith(item.toLowerCase()) &&
            b.category_name.toLowerCase().includes(item.toLowerCase()),
        ),
      ];
      // setBankSetFromList(filter.length > 0);
      setFilteredCategoryOptions(filter);
    },
    [categoryOptions],
  );

  const handleSubmit = async () => {
    clearAuthErrors();
    Keyboard.dismiss();
    if (EditStates.Add === editState) {
      if (editForm === EditForm.CategoryForm) {
        if (newReward.category?.category_name === '') {
          addAuthError(Consts.authErrorMessages().invalidCategory);
          return;
        }
        setEditForm(EditForm.Percentages);
      } else if (editForm === EditForm.Percentages) {
        if (!newReward.initial_percentage) {
          addAuthError(Consts.authErrorMessages().invalidInitialPercentage);
          return;
        }
        // if add state, pass true to new reward bool
        // for now always creating a new reward as we don't allow editing rewards
        const newLink = await linkReward(newReward, true, true);
        if (newLink) {
          setEditForm(EditForm.CategoryForm);
          setEditState(EditStates.Main);
        }
      }
    } else if (EditStates.Main === editState) {
      let errors = false;
      if (selectedCard.rewards) {
        for (const reward of selectedCard.rewards) {
          // linking all rewards that haven't been linked or edited yet
          if (await linkReward(reward, false, false)) {
            continue;
          } else {
            console.log('error');
            errors = true;
          }
        }
      }
      if (!errors) {
        await refreshUserProfile();
        closeModal();
      }
    }
  };

  const addReward = useCallback(async () => {
    clearAuthErrors();
    Keyboard.dismiss();
    setEditForm(EditForm.CategoryForm);
    setEditState(EditStates.Add);
    setNewReward({} as Reward);
    setCategorySearch('');
    setFilteredCategoryOptions([]);
  }, [EditForm.CategoryForm, EditStates.Add, clearAuthErrors]);

  const closeModal = useCallback(async () => {
    setCardForms({ ...CardForms, Full: false, Rewards: false });
    setNewReward({} as Reward);
    setCategorySearch('');
    clearAuthErrors();
    setEditState(EditStates.Main);
    if (pointCount > 0) {
      await addPoints(pointCount, true);
    }
  }, [
    CardForms,
    EditStates.Main,
    addPoints,
    clearAuthErrors,
    pointCount,
    setCardForms,
  ]);

  const renderCategoryOption = useCallback(
    ({ item }: { item: Category }) => (
      <Pressable
        onPress={() => {
          const category_id = Number(item.id);
          const category_name = item.category_name;
          if (editState === EditStates.Edit) {
            setEditState(EditStates.Add);
          }
          if (newReward) {
            newReward.category_id = category_id;
            newReward.category = {
              id: category_id,
              category_name,
              specific_places: newReward.category?.specific_places || [],
              category_slug: '',
            };
          }
          setCategorySearch(item.category_name);
          setFilteredCategoryOptions([]);
          Keyboard.dismiss();
        }}
        className="p-2 cursor-pointer hover:bg-gray-200">
        <Text className="text-black text-xl text-left">
          {item.category_name}
        </Text>
      </Pressable>
    ),
    [editState, EditStates.Edit, EditStates.Add, newReward],
  );

  useEffect(() => {
    clearAuthErrors();
  }, [clearAuthErrors, CardForms.Full]);

  useEffect(() => {
    filterCategory(categorySearch);
  }, [categorySearch, filterCategory]);

  const renderSpecificPlaces = () => {
    const updateSpecificPlaces = (text: string) => {
      setNewReward({
        ...newReward,
        category: {
          id: newReward.category?.id || 0,
          category_name: newReward.category?.category_name || '',
          specific_places: text.replace(/\s/g, '').split(','),
          category_slug: newReward.category?.category_slug || '',
        },
      });
    };
    return (
      <InputBox
        className="mt-2"
        placeholder={i18n.t('Wallet.SpecificPlaces')}
        onChangeText={updateSpecificPlaces}
        value={newReward?.category?.specific_places.join(', ') || ''}
      />
    );
  };

  const renderCategoryDropdown = useCallback(() => {
    const viewStyles =
      'mb-2 ml-0 w-full fixed max-h-48 border flex z-50' +
      (themeMode === 'dark'
        ? ' bg-neutral-700 text-gray-100'
        : ' bg-gray-100 text-black border-gray-400 border');
    return (
      <>
        <View className="flex flex-col justify-center w-2/3 p-0 z-50 sticky">
          <InputBox
            placeholder={i18n.t('Wallet.Categoryie')}
            onChange={event => setCategorySearch(event.nativeEvent.text)}
            value={categorySearch}
            defaultValue={newReward?.category?.category_name || ''}
            className="mb-0 w-full"
          />
          {filteredCategoryOptions.length > 0 && isKeyboardVisible && (
            <View className={viewStyles}>
              <FlatList
                data={filteredCategoryOptions}
                renderItem={renderCategoryOption}
                keyExtractor={item => item.id.toString()}
                keyboardShouldPersistTaps="handled"
              />
            </View>
          )}
        </View>
      </>
    );
  }, [
    themeMode,
    categorySearch,
    newReward?.category?.category_name,
    filteredCategoryOptions,
    isKeyboardVisible,
    renderCategoryOption,
  ]);

  const renderInitialPercentage = () => {
    const updateInitialPercentage = (text: string) => {
      setNewReward({ ...newReward, initial_percentage: Number(text) });
    };
    return (
      <InputBox
        className="mb-2 mr-2"
        placeholder={`${i18n.t('Wallet.Initial')} ${i18n.t(
          'Wallet',
          'Percentage',
        )}`}
        inputMode="decimal"
        onChangeText={updateInitialPercentage}
        value={
          newReward?.initial_percentage
            ? String(newReward?.initial_percentage)
            : ''
        }
      />
    );
  };

  const renderInitialLimit = () => {
    const updateInitialLimit = (text: string) => {
      setNewReward({ ...newReward, initial_limit: Number(text) });
    };
    return (
      <InputBox
        className="mb-2 mr-2"
        placeholder={`${i18n.t('Wallet.Initial')} ${i18n.t('Wallet', 'Limit')}`}
        inputMode="decimal"
        onChangeText={updateInitialLimit}
        value={newReward?.initial_limit ? String(newReward?.initial_limit) : ''}
      />
    );
  };

  const renderFallbackPercentage = () => {
    const updateFallbackPercentage = (text: string) => {
      setNewReward({ ...newReward, fallback_percentage: Number(text) });
    };
    return (
      <InputBox
        className="mb-2 mr-2"
        placeholder={`${i18n.t('Wallet.FallbackPercentage')}`}
        inputMode="decimal"
        onChangeText={updateFallbackPercentage}
        value={
          newReward?.fallback_percentage
            ? String(newReward?.fallback_percentage)
            : ''
        }
      />
    );
  };

  const renderTermLengthMonths = () => {
    const updateTermLengthMonths = (text: string) => {
      setNewReward({ ...newReward, term_length_months: Number(text) });
    };
    return (
      <InputBox
        className="mr-2"
        placeholder={i18n.t('Wallet.Term')}
        onChangeText={updateTermLengthMonths}
        inputMode="numeric"
        value={
          newReward?.term_length_months
            ? String(newReward?.term_length_months)
            : ''
        }
      />
    );
  };

  const renderReward = useCallback((item: Reward) => {
    const formatPercentage = (percentage: number) => {
      return percentage.toFixed(2) + '%';
    };
    const formatMoney = (money: number) => {
      return '$' + money.toFixed(2);
    };
    return (
      <View className="flex flex-row space-between">
        <PrimaryText className="text-left w-3/12 text-md">
          {item.category?.category_name || i18n.t('Wallet.All')}
        </PrimaryText>
        <PrimaryText className="text-left w-3/12 text-md">
          {formatPercentage(Number(item?.initial_percentage || 0))}
        </PrimaryText>
        <PrimaryText className="text-left w-3/12 text-md">
          {formatMoney(Number(item?.initial_limit || 0))}
        </PrimaryText>
        <PrimaryText className="text-left w-3/12 text-md">
          {formatPercentage(Number(item?.fallback_percentage || 0))}
        </PrimaryText>
      </View>
    );
  }, []);

  const itemSeparatorComponent = useCallback(
    () => <View className="border-b border-gray-400 w-full my-2" />,
    [],
  );

  const renderRewards = useCallback(() => {
    return (
      <>
        <View className="flex flex-row space-between w-3/4">
          <PrimaryText className="text-left w-3/12 text-md">
            {i18n.t('Wallet.Category')}
          </PrimaryText>
          <PrimaryText className="text-left w-3/12 text-md">
            {`${i18n.t('Wallet.Initial')}${i18n.t('Wallet.Percentage')}`}
          </PrimaryText>
          <PrimaryText className="text-left w-3/12 text-md">
            {`${i18n.t('Wallet.Initial')} ${i18n.t('Wallet.Limit')}`}
          </PrimaryText>
          <PrimaryText className="text-left w-3/12 text-md">
            {`${i18n.t('Wallet.Fallback')}`}
          </PrimaryText>
        </View>
        <FlatList
          className="w-3/4"
          data={selectedCard.rewards}
          renderItem={({ item }) => renderReward(item)}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={itemSeparatorComponent}
          keyboardShouldPersistTaps="handled"
        />
      </>
    );
  }, [itemSeparatorComponent, renderReward, selectedCard.rewards]);

  const backButton = useCallback(() => {
    return (
      <Pressable
        className="flex-1 flex-row pl-4 h-10 justify-start items-center text-center top-10 left-0 absolute"
        onPress={closeModal}>
        <Icon name="close-outline" color="#4d654e" />
        <PrimaryText className="ml-2 text-xl text-center font-bold">
          {i18n.t('Common.Close')}
        </PrimaryText>
      </Pressable>
    );
  }, [closeModal]);

  const backForm = useCallback(() => {
    if (editForm === EditForm.CategoryForm) {
      return () => {
        setEditState(EditStates.Main);
      };
    }
    if (editForm === EditForm.Percentages) {
      return () => {
        setEditForm(EditForm.CategoryForm);
      };
    }
  }, [EditForm, EditStates, editForm]);

  const renderTitle = useCallback(() => {
    if (editState === EditStates.Edit) {
      if (editForm === EditForm.CategoryForm) {
        return i18n.t('Wallet.Verifyreward');
      }
      if (editForm === EditForm.Percentages) {
        return i18n.t('Wallet.Verifypercent');
      }
    } else if (editState === EditStates.Main) {
      return i18n.t('Wallet.Rewards');
    } else {
      if (editForm === EditForm.CategoryForm) {
        return i18n.t('Wallet.Addrewardcat');
      }
      if (editForm === EditForm.Percentages) {
        return i18n.t('Wallet.Addpercent');
      }
    }
  }, [
    EditForm.CategoryForm,
    EditForm.Percentages,
    EditStates.Edit,
    EditStates.Main,
    editForm,
    editState,
  ]);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={CardForms.Rewards}
      onRequestClose={closeModal}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          setFilteredCategoryOptions([]);
        }}>
        <ModalOverlayView className="flex-auto text-left z-0 pt-20">
          {editState !== EditStates.Main &&
            editForm === EditForm.CategoryForm && (
              <>
                <TitleText className="mt-4 mb-2 w-9/12">
                  {renderTitle()}
                </TitleText>
                <View className="mb-4 w-11/12">
                  <PrimaryText className="text-center w-full text-md mb-2">
                    {i18n.t('Wallet.longdescription')}
                  </PrimaryText>
                </View>
              </>
            )}
          {editState !== EditStates.Main &&
            editForm === EditForm.Percentages && (
              <TitleText className="mt-4 mb-10 w-9/12">
                {renderTitle()}
              </TitleText>
            )}
          {editState === EditStates.Main && (
            <TitleText className="mb-10 mt-4 w-9/12">
              {i18n.t('Wallet.Rewards')}
            </TitleText>
          )}
          {editState === EditStates.Main && renderRewards()}
          {editState !== EditStates.Main && (
            <>
              {editForm === EditForm.CategoryForm && renderCategoryDropdown()}
              {editForm === EditForm.CategoryForm && renderSpecificPlaces()}
              {editForm === EditForm.Percentages && renderInitialPercentage()}
              {editForm === EditForm.Percentages && renderInitialLimit()}
              {editForm === EditForm.Percentages && renderFallbackPercentage()}
              {editForm === EditForm.Percentages && renderTermLengthMonths()}
            </>
          )}
          <View className="mt-10">
            {AuthErrorComponent && <AuthErrorComponent />}
          </View>
          <View className="flex-1 flex-row justify-end">
            {editState !== EditStates.Main && (
              <>
                <PrimaryButton
                  type="primary"
                  onPress={backForm()}
                  className="z-0">
                  <PrimaryText type="secondary" className="text-center text-xl">
                    {i18n.t('Common.Back')}
                  </PrimaryText>
                </PrimaryButton>
                <PrimaryButton
                  type="primary"
                  onPress={handleSubmit}
                  className="z-0">
                  <PrimaryText type="secondary" className="text-center text-xl">
                    {editForm === EditForm.CategoryForm ? 'Next' : 'Submit'}
                  </PrimaryText>
                </PrimaryButton>
              </>
            )}
            {editState === EditStates.Main && (
              <>
                <PrimaryButton
                  type="primary"
                  onPress={addReward}
                  className="z-0">
                  <PrimaryText type="secondary" className="text-center text-xl">
                    {i18n.t('Wallet.Addreward')}
                  </PrimaryText>
                </PrimaryButton>
                <PrimaryButton
                  type="primary"
                  onPress={handleSubmit}
                  className="z-0">
                  <PrimaryText type="secondary" className="text-center text-xl">
                    {i18n.t('Common.Submit')}
                  </PrimaryText>
                </PrimaryButton>
              </>
            )}
          </View>
          {backButton()}
        </ModalOverlayView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddRewardForm;
