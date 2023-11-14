import React, {useEffect, useState} from 'react';
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
  const {refreshAuth0Token, userToken, userProfile} = React.useContext(
    AuthContext,
  ) as AuthContextType;

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [location, setLocation] = useState<Location>({} as Location);

  const [Cards, setCards] = React.useState<Card[]>([]);
  const [rewards] = React.useState<Reward[]>(Consts.dummyCardRewards);
  const ErrorMessages = Consts.authErrorMessages;

  const [CardForms, setCardForms] = useState<CardFormsType>({
    Full: false,
    Review: false,
    Rewards: false,
    AddBankOption: false,
  });
  const [newCard, setNewCard] = React.useState<Card | null>(null);
  const [newCardBin, setNewCardBin] = React.useState<number>(0o0);
  const [updatingDropdown, setUpdatingDropdown] =
    React.useState<boolean>(false);

  const [cardInDB, setCardInDB] = React.useState<boolean>(false);

  const [bankOptions, setBankOptions] = useState<CardBank[]>([]);

  const [brandOptions, setBrandOptions] = useState<CardBrand[]>([]);

  /* Card Add Flow
   * 1. Search for card using 6 digit number
   * 2. If found show review screen and make sure it is correct. User will enter nickname and maybe update card. Send this card to users db
   * 3. If not found show full form. User will enter all info and send to db
   * 4. Rewards will be found using a few details from card. Rewards review screen will show which will allow the user to enter rewards and see rewards already associated to that card. Send rewards to db
   *
   */
  const findCard = async (cardBin: number) => {
    //Check db for card
    //found card will need to be set if found
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', `bearer ${userToken}`);

    const raw = {
      card_bin: cardBin,
    };
    console.log(raw);
    const response = await fetch(`${baseURL}cards`, {
      method: 'GET',
      headers: headers,
    });
    const content = await response.text();

    console.log(content, 'find card');

    if (response.status === 200) {
      reviewCard(JSON.parse(content));
      setCardInDB(true);
      return false;
    } else {
      return true;
    }
  };

  const reviewCard = (card: Card) => {
    setNewCard(card);
    setCardForms(c => ({...c, Full: false}));
    setCardForms(c => ({...c, Review: true}));
  };

  const addCard = () => {
    //add to db
    //Two steps
    //If cardInDb just link to user
    //Else also add to db
    const createNew = async () => {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Authorization', `bearer ${userToken}`);

      const raw = {
        card_name: newCard?.card_name,
        card_bin: newCard?.card_bin,
        card_bank_id: newCard?.card_bank_id,
        card_brand_id: newCard?.card_brand_id,
        card_level: newCard?.card_level,
        card_type: newCard?.card_type,
        card_country: 'United States',
      };

      const response = await fetch(`${baseURL}cards`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(raw),
      });
      const content = await response.text();

      const data = JSON.parse(content).data;
      console.log(data.card_name);
      if (response.status === 201) {
        const card = {
          ...newCard,
          card_name: data.card_name,
          id: data.id,
        } as Card;
        console.log(card, 'create new');
        await setNewCard(card);

        linkToUser(card);
      }
    };

    const linkToUser = async (card: Card) => {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Authorization', `bearer ${userToken}`);

      const date = testExpirationDate(card.exp_date as string);

      const raw = {
        card_id: card?.id,
        exp_date: date,
      };

      const response = await fetch(`${baseURL}users/linkCard`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(raw),
      });
      const content = await response.text();
    };

    if (!cardInDB) {
      createNew();
    } else {
      linkToUser(newCard as Card);
    }
    setCards([...Cards, newCard as Card]);
    setNewCard(null);
    return true;
  };

  const addNewReward = (cardReward: Reward) => {
    //Do something here
  };

  const removeCard = (card: Card) => {
    setCards(Cards.filter(c => c.id !== card.id));
  };

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

  function testExpirationDate(expirationDate: string) {
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

  const getLocation = () => {
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
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    const fetchBanks = async () => {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Authorization', `bearer ${userToken}`);

      const response = await fetch(`${baseURL}banks/all`, {
        method: 'GET',
        headers: headers,
      });
      const content = await response.text();

      let set = new Set();
      let arr: any = [];

      JSON.parse(content).data.forEach((b: CardBank) => {
        if (set.has(b.bank_name)) {
          return;
        }
        arr.push(b);
        set.add(b.bank_name);
      });

      setBankOptions(arr);
    };
    const fetchBrands = async () => {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Authorization', `bearer ${userToken}`);

      const response = await fetch(`${baseURL}brands/all`, {
        method: 'GET',
        headers: headers,
      });
      const content = await response.text();
      setBrandOptions(Array.from(new Set(JSON.parse(content).data)));
    };
    if (userToken && (bankOptions.length === 0 || brandOptions.length === 0)) {
      fetchBanks();
      fetchBrands();
      setCards(userProfile.cards.length > 0 ? userProfile.cards : []);
    }
    setUpdatingDropdown(true);
  }, [userProfile]);

  return (
    <Context.Provider
      value={{
        Cards,
        newCard,
        rewards,
        findCard,
        addCard,
        removeCard,
        addNewReward,
        removeReward,
        location,
        isLoading,
        setIsLoading,
        updatingDropdown,
        setUpdatingDropdown,
        bankOptions,
        setBankOptions,
        brandOptions,
        setBrandOptions,
        CardForms,
        setCardForms,
        validateCardForm,
        setNewCard,
        newCardBin,
        setNewCardBin,
        reviewCard,
      }}>
      {children}
    </Context.Provider>
  );
};

export default GlobalState;
