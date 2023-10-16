import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import Context from './context';
import {CreditCard} from '../types/CreditCardType';
import {PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {Location} from '../types/Location';

const GlobalState: React.FC<PropsWithChildren> = ({children}) => {
  const [creditCards, setCreditCards] = React.useState<CreditCard[]>([
    {
      id: 1,
      cardNumber: '1234 5678 9012 3456',
      name: 'John Doe',
      expirationDate: '12/24',
      securityCode: '123',
      cardType: 'Visa',
    },
    {
      id: 2,
      cardNumber: '1234 5678 9012 3456',
      name: 'John Doe',
      expirationDate: '12/24',
      securityCode: '123',
      cardType: 'Visa',
    },
  ]);

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [location, setLocation] = useState<Location>({} as Location);

  const addNewCreditCard = (creditCard: CreditCard) => {
    const newCard: CreditCard = {
      id: Math.random(), // not really unique - but fine for this example
      name: creditCard.name,
      cardNumber: creditCard.cardNumber,
      expirationDate: creditCard.expirationDate,
      securityCode: creditCard.securityCode,
      cardType: creditCard.cardType,
    };
    setCreditCards([...creditCards, newCard]);
  };

  const removeCreditCard = (creditCard: CreditCard) => {
    setCreditCards(creditCards.splice(creditCard.id, 1));
  };

  const requestLocationPermission = async () => {
    try {
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
        addNewCreditCard,
        removeCreditCard,
        location,
        isLoading,
        setIsLoading,
      }}>
      {children}
    </Context.Provider>
  );
};

export default GlobalState;
