import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import Context from './context';
import {CreditCard, CreditCardReward} from '../types/CreditCardType';
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
  const [cardForm, setCardForm] = React.useState<string | null>(null);
  const [newCreditCard, setNewCard] = React.useState<CreditCard | null>(null);

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [location, setLocation] = useState<Location>({} as Location);

  const findCreditCard = (cardNumber: number) => {
    //Check db for card
    //found card will need to be set if found
    const foundCard = {
      id: Math.random() * 100 + creditCards.length, // not really unique - but fine for this example
      cardName: 'Chase Sapphire Reserved',
      nickName: '',
      bankName: 'Chase',
      cardNumber: cardNumber.toString(),
      cardType: 'visa',
      expirationDate: '12/22',
    } as CreditCard;
    if (foundCard === null) {
      console.log('found card');
      setNewCard(foundCard);
      setCardForm('Review');
    } else {
      setCardForm('Full');
    }
  };

  const reviewCreditCard = (creditCard: CreditCard) => {
    setNewCard(creditCard);
    setCardForm('Review');
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
        cardForm,
        setCardForm,
      }}>
      {children}
    </Context.Provider>
  );
};

export default GlobalState;
