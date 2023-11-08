import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import Context from './context';
import {
  CreditCard,
  CreditCardFormDetails,
  CreditCardFormsType,
  CreditCardReward,
  CreditCardFormTypes,
} from '../types/CreditCardType';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {Location} from '../types/Location';
import Consts from '../Helpers/Consts';

const GlobalState: React.FC<PropsWithChildren> = ({children}) => {
  const [creditCards, setCreditCards] = React.useState<CreditCard[]>(
    Consts.dummyCreditCards,
  );
  const [rewards, setRewards] = React.useState<CreditCardReward[]>(
    Consts.dummyCreditCardRewards,
  );
  const ErrorMessages = Consts.authErrorMessages;

  const [CreditCardForms, setCreditCardForms] = useState<CreditCardFormsType>({
    Search: false,
    Full: false,
    Review: false,
    Rewards: false,
    AddBankOption: false,
    AddTypeOption: false,
  });
  const [newCreditCard, setNewCard] = React.useState<CreditCard | null>(null);
  const [updatingDropdown, setUpdatingDropdown] =
    React.useState<boolean>(false);

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [location, setLocation] = useState<Location>({} as Location);

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
    'Add New Bank',
  ]);

  const [typeOptions, setTypeOptions] = useState<string[]>([
    'Visa',
    'MasterCard',
    'Discover',
    'American Express',
  ]);

  /*Credit Card Add Flow
   * 1. Search for card using 6 digit number
   * 2. If found show review screen and make sure it is correct. User will enter nickname and maybe update card. Send this card to users db
   * 3. If not found show full form. User will enter all info and send to db
   * 4. Rewards will be found using a few details from card. Rewards review screen will show which will allow the user to enter rewards and see rewards already associated to that card. Send rewards to db
   *
   */
  const findCreditCard = async (cardNumber: number) => {
    //Check db for card
    //found card will need to be set if found
    const foundCard = {
      id: Math.random() * 100 + creditCards.length, // not really unique - but fine for this example
      cardName: 'Chase Sapphire Reserved',
      nickname: '',
      bankName: 'Chase',
      cardNumber: cardNumber.toString(),
      cardType: 'visa',
      expirationDate: '12/22',
    } as CreditCard;
    setCreditCardForms(c => ({...c, Search: false}));
    if (foundCard !== null) {
      setNewCard(foundCard);
      setCreditCardForms(c => ({...c, Review: true}));
    } else {
      setCreditCardForms(c => ({...c, Full: true}));
    }
  };

  const reviewCreditCard = (creditCard: CreditCard) => {
    setNewCard(creditCard);
    setCreditCardForms(c => ({...c, Review: false}));
  };

  const addCreditCard = () => {
    //add to db
    setCreditCards([...creditCards, newCreditCard as CreditCard]);
    return true;
  };

  const addNewReward = (creditCardReward: CreditCardReward) => {
    const newReward: CreditCardReward = {
      id: Math.random() * 10, // not really unique - but fine for this example
      creditCardId: creditCardReward.creditCardId,
      name: creditCardReward.name,
      description: creditCardReward.description,
      amount: creditCardReward.amount,
      date: creditCardReward.date,
    };
    setRewards([...rewards, newReward]);
  };

  const removeCreditCard = (creditCard: CreditCard) => {
    setCreditCards(creditCards.filter(c => c.id !== creditCard.id));
  };

  const removeReward = (creditCardReward: CreditCardReward) => {
    setRewards(rewards.splice(creditCardReward.id, 1));
  };

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

  function testCardName(cardName: string) {
    const regex: RegExp = /^[a-zA-Z ]{10,}$/;
    return regex.test(cardName);
  }

  function testCardNumber(cardNumber: string) {
    const regex: RegExp = /^[0-9]{6}$/;
    return regex.test(cardNumber);
  }

  function testNickname(nickname: string) {
    const regex: RegExp = /^[a-zA-Z ]{3,}$/;
    return regex.test(nickname);
  }

  function testBankName(bankName: string) {
    const regex: RegExp = /^[a-zA-Z ]{3,}$/;
    return regex.test(bankName);
  }

  function validateCreditCardForm(
    formDetails: CreditCardFormDetails,
    formType: string,
  ) {
    const errors: string[] = [];
    switch (formType) {
      case CreditCardFormTypes.Full:
        if (formDetails.cardName && !testCardName(formDetails.cardName)) {
          errors.push(ErrorMessages.invalidCreditCardName);
        }
        if (formDetails.nickname && testNickname(formDetails.nickname)) {
          errors.push(ErrorMessages.invalidCreditCardNickName);
        }
        if (formDetails.cardNumber && testCardNumber(formDetails.cardNumber)) {
          errors.push(ErrorMessages.invalidCreditCardNumber);
        }
        break;
      case CreditCardFormTypes.Search:
        if (formDetails.cardNumber && testCardNumber(formDetails.cardNumber)) {
          errors.push(ErrorMessages.invalidCreditCardNumber);
        }
        break;
      case CreditCardFormTypes.Review:
        if (formDetails.cardName && !testCardName(formDetails.cardName)) {
          errors.push(ErrorMessages.invalidCreditCardName);
        }
        if (formDetails.nickname && testNickname(formDetails.nickname)) {
          errors.push(ErrorMessages.invalidCreditCardNickName);
        }
        if (formDetails.cardNumber && testCardNumber(formDetails.cardNumber)) {
          errors.push(ErrorMessages.invalidCreditCardNumber);
        }
        break;
      case CreditCardFormTypes.AddBank:
        if (formDetails.bankName && testBankName(formDetails.bankName)) {
          errors.push(ErrorMessages.invalidBankName);
        }
        break;
      default:
        break;
    }

    return errors;
  }

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <Context.Provider
      value={{
        creditCards,
        newCreditCard,
        rewards,
        reviewCreditCard,
        findCreditCard,
        addCreditCard,
        removeCreditCard,
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
        CreditCardForms,
        setCreditCardForms,
        validateCreditCardForm,
      }}>
      {children}
    </Context.Provider>
  );
};

export default GlobalState;
