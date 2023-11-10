import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import Context from './context';
import {CardFormDetails, CardFormsType, Card, Reward} from '../types/CardType';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {Location} from '../types/Location';
import Consts from '../Helpers/Consts';

const GlobalState: React.FC<PropsWithChildren> = ({children}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [location, setLocation] = useState<Location>({} as Location);

  const [Cards, setCards] = React.useState<Card[]>(Consts.dummyCards);
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

  const [bankOptions, setBankOptions] = useState<string[]>([
    'Bank of America',
    'Chase',
    'Wells Fargo',
    'Citi',
    'US Bank',
    'Capital One',
    'PNC',
    'TD Bank',
    'USAA',
  ]);

  const [typeOptions, setTypeOptions] = useState<string[]>([
    'Visa',
    'MasterCard',
    'Discover',
    'American Express',
  ]);

  /* Card Add Flow
   * 1. Search for card using 6 digit number
   * 2. If found show review screen and make sure it is correct. User will enter nickname and maybe update card. Send this card to users db
   * 3. If not found show full form. User will enter all info and send to db
   * 4. Rewards will be found using a few details from card. Rewards review screen will show which will allow the user to enter rewards and see rewards already associated to that card. Send rewards to db
   *
   */
  const findCard = (cardBin: number) => {
    //Check db for card
    //found card will need to be set if found
    const foundCard = {
      id: Math.random() * 100 + Cards.length, // not really unique - but fine for this example
      card_bank: 'Chase',
      card_bin: cardBin,
      card_brand: 'visa',
      card_level: 'Platinum Reserved',
      card_type: 'Credit',
      exp_date: '12/22',
    } as Card;
    if (foundCard === null) {
      //Card was found in the db
      reviewCard(foundCard);
      return false;
    } else {
      //Card was not found in the db. Going to addFullForm
      return true;
    }
  };

  const reviewCard = (card: Card) => {
    //This step will be done in the backend. Just doing it now for temp
    card.card_name = `${card.card_bank} ${card.card_level}`;
    setNewCard(card);
    setCardForms(c => ({...c, Full: false}));
    setCardForms(c => ({...c, Review: true}));
  };

  const addCard = () => {
    //add to db
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
        typeOptions,
        setTypeOptions,
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
