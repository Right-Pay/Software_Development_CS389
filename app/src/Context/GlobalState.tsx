import type { PropsWithChildren } from 'react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AppState } from 'react-native';
import Config from 'react-native-config';
import Consts from '../Helpers/Consts';
import {
  BottomSheetModalType,
  BottomSheetTypes,
} from '../types/AppContextType';
import { AuthContextType } from '../types/AuthContextType';
import {
  Card,
  CardBank,
  CardBrand,
  CardFormDetails,
  CardFormsType,
  Category,
  Reward,
} from '../types/CardType';
import LocationState from './LocationState';
import AuthContext from './authContext';
import Context from './context';
const baseURL = Config.REACT_APP_API_URL;

const GlobalState: React.FC<PropsWithChildren> = ({ children }) => {
  const {
    refreshAuth0Token,
    userToken,
    userProfile,
    refreshUserProfile,
    addAuthError,
  } = React.useContext(AuthContext) as AuthContextType;

  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const [rewards] = React.useState<Reward[]>(Consts.dummyCardRewards);
  const ErrorMessages = Consts.authErrorMessages;

  const [showBottomSheetModal, setShowBottomSheetModal] =
    useState<boolean>(false);
  const [bottomSheetModal, setBottomSheetModal] =
    useState<BottomSheetModalType>({
      type: BottomSheetTypes.SETTINGS,
      snapPoints: ['30%'],
    });

  const [CardForms, setCardForms] = useState<CardFormsType>({
    Full: false,
    Rewards: false,
    AddBankOption: false,
  });
  const [newCardBin, setNewCardBin] = React.useState<number>(0o0);

  const [bankOptions, setBankOptions] = useState<CardBank[]>([]);

  const [brandOptions, setBrandOptions] = useState<CardBrand[]>([]);

  const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);

  const [selectedCard, setSelectedCard] = useState<Card>({} as Card);

  /* Card Add Flow
   * 1. Search for card using 6 digit number
   * 2. If found show review screen and make sure it is correct. User will enter nickname and maybe update card. Send this card to users db
   * 3. If not found show full form. User will enter all info and send to db
   * 4. Rewards will be found using a few details from card. Rewards review screen will show which will allow the user to enter rewards and see rewards already associated to that card. Send rewards to db
   *
   */

  const findCard = async (
    cardBin: number,
    tryAgain: boolean,
  ): Promise<Card | false> => {
    setIsLoading(true);
    //Check db for card
    //found card will need to be set if found
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', `bearer ${userToken}`);

    const query = `?card_bin=${cardBin}`;
    try {
      const response = await fetch(`${baseURL}cards${query}`, {
        method: 'GET',
        headers: headers,
      });
      const content = await response.json();

      if (content.data.code === 'invalid_token') {
        await refreshAuth0Token('findCard');
        if (tryAgain) {
          setTimeout(() => {
            findCard(cardBin, false);
          }, 20);
        }
        setIsLoading(false);
        return false;
      }

      if (response.status === 200) {
        const card = content.data;
        const modifiedCard = {
          ...card,
          card_bank_name:
            bankOptions.find(b => b.id === +card.card_bank_id)?.bank_name ?? '',
          card_brand_name:
            brandOptions.find(b => b.id === +card.card_brand_id)?.brand_name ??
            '',
          exp_date: '23-01',
        } as Card;
        setIsLoading(false);
        return modifiedCard;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (e) {
      console.log(e);
      addAuthError(ErrorMessages.undefined);
      setIsLoading(false);
      return false;
    }
  };

  const findCardByAPI = async (
    cardBin: number,
    tryAgain: boolean,
  ): Promise<Card | false> => {
    setIsLoading(true);
    //Check api for card
    //found card will need to be set if found
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', `bearer ${userToken}`);

    const query = `?card_bin=${cardBin}`;
    try {
      const response = await fetch(`${baseURL}cards/rapidapi${query}`, {
        method: 'GET',
        headers: headers,
      });
      const content = await response.json();

      if (content.data.code === 'invalid_token') {
        await refreshAuth0Token('findCard');
        if (tryAgain) {
          setTimeout(() => {
            findCardByAPI(cardBin, false);
          }, 20);
        }
        setIsLoading(false);
        return false;
      }

      if (response.status === 200) {
        const card = content.data;
        const modifiedCard = {
          ...card,
          exp_date: '23-01',
        } as Card;
        setIsLoading(false);
        return modifiedCard;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (e) {
      console.log(e);
      addAuthError(ErrorMessages.undefined);
      setIsLoading(false);
      return false;
    }
  };

  const linkCard = async (card: Card, new_card: boolean): Promise<boolean> => {
    setIsLoading(true);
    const linkToUser = async (tryAgain: boolean) => {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Authorization', `bearer ${userToken}`);
      const date = formatExpirationDate(card.exp_date as string);

      const raw: linkCardBodyProps = new_card
        ? {
            new_card: {
              card_bin: card?.card_bin as number,
              card_bank_id: card?.card_bank_id,
              card_brand_id: card?.card_brand_id,
              card_level: card?.card_level,
              card_type: card?.card_type,
              card_country: 'United States',
              exp_date: date,
            },
          }
        : {
            card_id: card?.id,
          };

      raw.exp_date = date;

      try {
        const response = await fetch(`${baseURL}users/linkCard`, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify(raw),
        });

        const content = await response.json();
        //check
        if (
          content &&
          content.data &&
          content.data.code &&
          content.data.code === 'invalid_token'
        ) {
          await refreshAuth0Token('linkCard');
          if (tryAgain) {
            setTimeout(() => {
              linkToUser(false);
            }, 20);
          }
          return false;
        }
        if (!content.success) {
          addAuthError(content.message);
          return false;
        }
        setNewCardBin(0o0);
        setCardForms({
          ...CardForms,
          Full: false,
          Rewards: true,
        });
        console.log('Setting to rewards form');
        const retCard = content.data as Card;
        console.log(retCard);
        const cardWithBankAndBrand = {
          ...retCard,
          card_bank_name:
            bankOptions.find(b => b.id === +(retCard.card_bank_id as number))
              ?.bank_name ?? '',
          card_brand_name:
            brandOptions.find(b => b.id === +(retCard.card_brand_id as number))
              ?.brand_name ?? '',
        } as Card;
        setSelectedCard(cardWithBankAndBrand);
        return true;
      } catch (e) {
        console.log(e);
        addAuthError(ErrorMessages.undefined);
      }
    };
    const success = await linkToUser(true);
    if (!success) {
      return false;
    }
    setIsLoading(false);
    refreshUserProfile();
    return true;
  };

  const linkReward = async (
    reward: Reward,
    new_reward: boolean,
    add_to_card: boolean,
  ): Promise<boolean> => {
    setIsLoading(true);
    const linkToReward = async (tryAgain: boolean) => {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Authorization', `bearer ${userToken}`);
      if (new_reward) {
        if (reward.category_id === undefined || !reward.category_id) {
          reward.new_category = reward.category;
        }
        if (reward.category_id) {
          const matchingCategory = categoryOptions.find(
            c => c.id === reward.category_id,
          );
          if (
            reward.category?.specific_places !==
            matchingCategory?.specific_places
          ) {
            reward.new_category = reward.category;
          }
        }
      }
      const raw = new_reward
        ? {
            new_reward: reward,
            card_id: selectedCard?.id,
            user_to_card_link_id: selectedCard?.user_to_card_link_id,
            type: 'cashback',
          }
        : {
            reward_id: reward.id,
            card_id: selectedCard?.id,
            user_to_card_link_id: selectedCard?.user_to_card_link_id,
            type: 'cashback',
          };

      try {
        const response = await fetch(`${baseURL}cards/linkReward`, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify(raw),
        });
        const content = await response.json();
        if (content.data.code === 'invalid_token') {
          await refreshAuth0Token('linkReward');
          if (tryAgain) {
            setTimeout(() => {
              linkToReward(false);
            }, 20);
          }
          return false;
        }
        if (!content.success) {
          console.log(content);
          if (content.data.code === 'reward_already_linked') {
            return true;
          }
          addAuthError(content.message);
          return false;
        }
        const retReward = content.data as Reward;
        if (add_to_card) {
          if (selectedCard.rewards) {
            selectedCard.rewards.push(retReward);
          } else {
            selectedCard.rewards = [retReward];
          }
        }
        return true;
      } catch (e) {
        console.log(e);
        addAuthError(ErrorMessages.undefined);
        return false;
      }
    };
    const success = await linkToReward(false);
    setIsLoading(false);
    return success;
  };

  const unlinkCard = async (card: Card): Promise<boolean> => {
    setIsLoading(true);
    const unlinkToUser = async (tryAgain: boolean) => {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Authorization', `bearer ${userToken}`);

      const raw = {
        card_id: card?.id,
      };

      try {
        const response = await fetch(`${baseURL}users/unlinkCard`, {
          method: 'DELETE',
          headers: headers,
          body: JSON.stringify(raw),
        });
        const content = await response.json();
        if (content.data.code === 'invalid_token') {
          await refreshAuth0Token('unlinkCard');
          if (tryAgain) {
            setTimeout(() => {
              unlinkToUser(false);
            }, 20);
          }
          return false;
        }
        return content.success;
      } catch (e) {
        console.log(e);
        addAuthError(ErrorMessages.undefined);
        return false;
      }
    };
    const success = await unlinkToUser(false);
    userProfile.cards = userProfile.cards.filter(c => c.id !== card.id);
    setIsLoading(false);
    return success;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addNewReward = (cardReward: Reward) => {
    //Do something here
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const removeReward = (CardReward: Reward) => {
    //Do something here
  };

  function testCardName(cardName: string) {
    const regex = /^[a-zA-Z ]{10,}$/;
    return regex.test(cardName);
  }

  function testCardBin(cardBin: number) {
    const regex = /^[0-9]{6}$/;
    return regex.test(cardBin.toString());
  }

  function testBankName(bankName: string) {
    const regex = /^[a-zA-Z &,.]{4,}$/;
    return regex.test(bankName);
  }

  function testLevel(level: string) {
    const regex = /^[a-zA-Z ]{3,}$/;
    return regex.test(level);
  }

  function formatExpirationDate(expirationDate: string) {
    const date = expirationDate.split('-');
    let year = date[0];
    let month = date[1];

    if (year.length === 1) {
      year = `2${year}`;
    }
    if (year.length > 2 || year.length === 0) {
      year = '23';
    }
    if (month.length === 1) {
      month = `0${month}`;
    }
    if (month.length > 2 || month.length === 0) {
      month = '01';
    }

    return `${year}-${month}`;
  }

  function validateCardForm(formDetails: CardFormDetails) {
    const errors: string[] = [];
    if (formDetails.cardBin !== undefined) {
      if (!testCardBin(Number(formDetails.cardBin))) {
        errors.push(ErrorMessages.invalidCardBin);
      }
    }
    if (formDetails.cardName !== undefined) {
      if (!testCardName(formDetails.cardName as string)) {
        errors.push(ErrorMessages.invalidCardName);
      }
    }
    if (formDetails.bankName !== undefined) {
      if (!testBankName(formDetails.bankName as string)) {
        errors.push(ErrorMessages.invalidBankName);
      }
    }
    if (formDetails.level !== undefined) {
      if (!testLevel(formDetails.level as string)) {
        errors.push(ErrorMessages.invalidCardLevel);
      }
    }
    return errors;
  }

  const cardTypes = useMemo(
    () => [
      {
        name: 'amex',
        display_name: 'American Express',
        short_name: 'Amex',
        ranges: [
          { start: 34, end: 34 },
          { start: 37, end: 37 },
        ],
      },
      {
        name: 'diners_club_enroute',
        display_name: 'Diners Club enRoute',
        short_name: 'Diners',
        ranges: [
          { start: 2014, end: 2014 },
          { start: 2149, end: 2149 },
        ],
      },
      {
        name: 'diners_club_carte_blanche',
        display_name: 'Diners Club Carte Blanche',
        short_name: 'Diners',
        ranges: [{ start: 300, end: 305 }],
      },
      {
        name: 'diners_club_international',
        display_name: 'Diners Club International',
        short_name: 'Diners',
        ranges: [
          { start: 3095, end: 3095 },
          { start: 36, end: 36 },
          { start: 38, end: 39 },
        ],
      },
      {
        name: 'jcb',
        display_name: 'JCB',
        short_name: 'JCB',
        ranges: [
          { start: 3088, end: 3094 },
          { start: 3096, end: 3102 },
          { start: 3112, end: 3120 },
          { start: 3158, end: 3159 },
          { start: 3337, end: 3349 },
          { start: 3528, end: 3589 },
        ],
      },
      {
        name: 'laser',
        display_name: 'Laser',
        short_name: 'Laser',
        ranges: [
          { start: 6304, end: 6304 },
          { start: 6706, end: 6706 },
          { start: 6709, end: 6709 },
          { start: 6771, end: 6771 },
        ],
      },
      {
        name: 'visa_electron',
        display_name: 'Visa Electron',
        short_name: 'Visa',
        ranges: [
          { start: 4026, end: 4026 },
          { start: 417500, end: 417500 },
          { start: 4508, end: 4508 },
          { start: 4844, end: 4844 },
          { start: 4913, end: 4913 },
          { start: 4917, end: 4917 },
        ],
      },
      {
        name: 'mastercard',
        display_name: 'MasterCard',
        short_name: 'MasterCard',
        ranges: [
          { start: 51, end: 55 },
          { start: 2221, end: 2720 },
        ],
      },
      {
        name: 'discover',
        display_name: 'Discover',
        short_name: 'Discover',
        ranges: [
          { start: 6011, end: 6011 },
          { start: 622126, end: 622925 },
          { start: 624, end: 626 },
          { start: 6282, end: 6288 },
          { start: 64, end: 65 },
        ],
      },
      {
        name: 'dankort',
        display_name: 'Dankort',
        short_name: 'Dankort',
        ranges: [
          { start: 5019, end: 5019 },
          { start: 4571, end: 4571 },
        ],
      },
      {
        name: 'maestro',
        display_name: 'Maestro',
        short_name: 'Maestro',
        ranges: [
          { start: 50, end: 50 },
          { start: 56, end: 69 },
        ],
      },
      {
        name: 'uatp',
        display_name: 'Universal Air Travel Program',
        short_name: 'UATP',
        ranges: [{ start: 1, end: 1 }],
      },
      {
        name: 'mir',
        display_name: 'Mir',
        short_name: 'Mir',
        ranges: [{ start: 2200, end: 2204 }],
      },
      {
        name: 'visa',
        display_name: 'Visa',
        short_name: 'Visa',
        ranges: [{ start: 4, end: 4 }],
      },
    ],
    [],
  );

  const getCardTypeFromBin = useCallback(
    (bin: number) => {
      // Iterate through the card_types array to find the matching card type
      if (bin === 0) {
        return '';
      }
      for (const cardType of cardTypes) {
        for (const { start, end } of cardType.ranges) {
          const binString = bin.toString();
          const rangeLength = end.toString().length;
          if (binString.length < rangeLength) {
            continue;
          }
          if (
            binString.substring(0, rangeLength) >= start.toString() &&
            binString.substring(0, rangeLength) <= end.toString()
          ) {
            return cardType.short_name;
          }
        }
      }

      if (bin.toString().length === 6) {
        return 'Unknown';
      } else {
        return '';
      }
    },
    [cardTypes],
  );

  const fetchBanks = useCallback(async () => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', `bearer ${userToken}`);

    const response = await fetch(`${baseURL}banks/all`, {
      method: 'GET',
      headers: headers,
    });
    const content = await response.json();

    const set = new Set();
    const arr: CardBank[] = [];

    content.data.forEach((b: CardBank) => {
      if (set.has(b.bank_name)) {
        return;
      }
      arr.push(b);
      set.add(b.bank_name);
    });

    setBankOptions(arr);
  }, [userToken]);

  const fetchBrands = useCallback(async () => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', `bearer ${userToken}`);

    const response = await fetch(`${baseURL}brands/all`, {
      method: 'GET',
      headers: headers,
    });
    const content = await response.json();
    setBrandOptions(Array.from(new Set(content.data)));
  }, [userToken]);

  const fetchCategories = useCallback(async () => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', `bearer ${userToken}`);

    const response = await fetch(`${baseURL}categories/all`, {
      method: 'GET',
      headers: headers,
    });
    const content = await response.json();
    setCategoryOptions(content.data);
  }, [userToken]);

  useEffect(() => {
    if (userToken) {
      fetchBanks();
      fetchBrands();
      fetchCategories();
    }
  }, [fetchBanks, fetchBrands, fetchCategories, userToken]);

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const handler = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      handler.remove();
    };
  }, []);

  return (
    <Context.Provider
      value={{
        rewards,
        findCard,
        findCardByAPI,
        linkCard,
        linkReward,
        unlinkCard,
        addNewReward,
        removeReward,
        isLoading,
        setIsLoading,
        bankOptions,
        setBankOptions,
        brandOptions,
        categoryOptions,
        CardForms,
        setCardForms,
        validateCardForm,
        newCardBin,
        setNewCardBin,
        appStateVisible,
        setShowBottomSheetModal,
        showBottomSheetModal,
        setBottomSheetModal,
        bottomSheetModal,
        getCardTypeFromBin,
        selectedCard,
      }}>
      <LocationState>{children}</LocationState>
    </Context.Provider>
  );
};

export default GlobalState;

interface linkCardBodyProps {
  new_card?: Card;
  card_id?: number;
  exp_date?: string;
}
