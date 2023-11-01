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

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [location, setLocation] = useState<Location>({} as Location);

  const addNewCreditCard = (creditCard: CreditCard) => {
    const newCard: CreditCard = {
      id: Math.random() * 100 + creditCards.length, // not really unique - but fine for this example
      name: creditCard.name,
      cardNumber: creditCard.cardNumber,
      expirationDate: creditCard.expirationDate,
      securityCode: creditCard.securityCode,
      cardType: creditCard.cardType,
    };
    setCreditCards([...creditCards, newCard]);
  };

  const addNewReward = (creditCardReward: CreditCardReward) => {
    const newReward: CreditCardReward = {
      id: Math.random() * 100 + rewards.length, // not really unique - but fine for this example
      creditCardId: creditCardReward.creditCardId,
      name: creditCardReward.name,
      description: creditCardReward.description,
      amount: creditCardReward.amount,
      date: creditCardReward.date,
    };
    setRewards([...rewards, newReward]);
  };

  const removeCreditCard = (creditCard: CreditCard) => {
    setCreditCards(creditCards.splice(creditCard.id, 1));
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
        rewards,
        addNewCreditCard,
        removeCreditCard,
        addNewReward,
        removeReward,
        location,
        isLoading,
        setIsLoading,
      }}>
      {children}
    </Context.Provider>
  );
};

export default GlobalState;
