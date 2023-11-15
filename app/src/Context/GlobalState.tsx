import React, {useCallback, useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import Context from './context';
import {
  CardFormDetails,
  CardFormsType,
  Card,
  Reward,
  CardBank,
  CardBrand,
} from '../types/CardType';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {Location} from '../types/Location';
import Consts from '../Helpers/Consts';
import Config from 'react-native-config';
import {AuthContextType} from '../types/AuthContextType';
import AuthContext from './authContext';
const baseURL = Config.REACT_APP_API_URL;

const GlobalState: React.FC<PropsWithChildren> = ({children}) => {
  const {refreshAuth0Token, userToken, userProfile, addAuthError} =
    React.useContext(AuthContext) as AuthContextType;

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [location, setLocation] = useState<Location>({} as Location);

  const [rewards] = React.useState<Reward[]>(Consts.dummyCardRewards);
  const ErrorMessages = Consts.authErrorMessages;

  const [CardForms, setCardForms] = useState<CardFormsType>({
    Full: false,
    Review: false,
    Rewards: false,
    AddBankOption: false,
  });
  const [newCardBin, setNewCardBin] = React.useState<number>(0o0);

  const [bankOptions, setBankOptions] = useState<CardBank[]>([]);

  const [brandOptions, setBrandOptions] = useState<CardBrand[]>([]);

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
        await refreshAuth0Token();
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
        if (content.data.code === 'invalid_token') {
          await refreshAuth0Token();
          if (tryAgain) {
            setTimeout(() => {
              linkToUser(false);
            }, 20);
          }
          return false;
        }
        if (!content.success) {
          return false;
        }
        setNewCardBin(0o0);
        setCardForms({
          ...CardForms,
          Review: false,
          Full: false,
        });
        const retCard = content.data as Card;
        const cardWithBankAndBrand = {
          ...retCard,
          card_bank_name:
            bankOptions.find(b => b.id === +(retCard.card_bank_id as number))
              ?.bank_name ?? '',
          card_brand_name:
            brandOptions.find(b => b.id === +(retCard.card_brand_id as number))
              ?.brand_name ?? '',
        } as Card;
        userProfile.cards.push(cardWithBankAndBrand);
        return true;
      } catch (e) {
        console.log(e);
        addAuthError(ErrorMessages.undefined);
      }
    };

    let success = await linkToUser(true);
    if (!success) {
      return false;
    }
    setIsLoading(false);
    return true;
  };

  const unlinkCard = async (card: Card): Promise<Boolean> => {
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
          await refreshAuth0Token();
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
    let success = await unlinkToUser(false);
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
    const regex: RegExp = /^[a-zA-Z ]{10,}$/;
    return regex.test(cardName);
  }

  function testCardBin() {
    const regex: RegExp = /^[0-9]{6}$/;
    return regex.test(newCardBin.toString());
  }

  function testBankName(bankName: string) {
    const regex: RegExp = /^[a-zA-Z ]{3,}$/;
    return regex.test(bankName);
  }

  function testLevel(level: string) {
    const regex: RegExp = /^[a-zA-Z ]{3,}$/;
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
    if (!testCardBin()) {
      errors.push(ErrorMessages.invalidCardBin);
    }
    if (formDetails.cardName !== undefined) {
      if (!testCardName(formDetails.cardName as string)) {
        errors.push(ErrorMessages.invalidCardName);
      }
    }
    if (formDetails.bankName !== undefined) {
      if (!testBankName(formDetails.bankName as string)) {
        errors.push(ErrorMessages.invalidCardBankName);
      }
    }
    if (formDetails.level !== undefined) {
      if (!testLevel(formDetails.level as string)) {
        errors.push(ErrorMessages.invalidCardLevel);
      }
    }
    return errors;
  }

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization('whenInUse');
        return true;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Geolocation Permission',
            message: 'Can we access your location?',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === 'granted') {
          return true;
        } else {
          return false;
        }
      }
    } catch (err) {
      return false;
    }
  };

  const getLocation = useCallback(() => {
    const result = requestLocationPermission();
    result.then(res => {
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            const coords = position.coords;
            setLocation({
              latitude: coords.latitude,
              longitude: coords.longitude,
              altitude: coords.altitude,
              accuracy: coords.accuracy,
            } as Location);
          },
          error => {
            // See error code charts below.
            setLocation({} as Location);
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 1},
        );
      }
    });
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

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

    let set = new Set();
    let arr: any = [];

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

  useEffect(() => {
    if (userToken) {
      fetchBanks();
      fetchBrands();
    }
  }, [fetchBanks, fetchBrands, userToken]);

  return (
    <Context.Provider
      value={{
        rewards,
        findCard,
        linkCard,
        unlinkCard,
        addNewReward,
        removeReward,
        location,
        isLoading,
        bankOptions,
        setBankOptions,
        brandOptions,
        CardForms,
        setCardForms,
        validateCardForm,
        newCardBin,
        setNewCardBin,
      }}>
      {children}
    </Context.Provider>
  );
};

export default GlobalState;

interface linkCardBodyProps {
  new_card?: Card;
  card_id?: number;
  exp_date?: string;
}
