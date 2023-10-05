import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import Context from './context';
import AuthContext from './authContext';
import {CreditCard} from '../types/CreditCardType';
import {Profile} from '../types/ProfileType';
import {PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { Location } from '../types/Location';

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

  const [userProfile, setUserProfile] = React.useState<Profile>({} as Profile);

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

  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isSignout, setIsSignout] = React.useState<boolean>(false);
  const [userToken, setUserToken] = React.useState<string | null>('');

  const signIn = (email: string, password: string) => {
    // replace with sign in function
    setIsLoading(false);
    setUserToken('asdf');
    setIsLoggedIn(true);
    setUserProfile({
      id: 1,
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      phone: '1234567890',
      address: '1234 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      subscribed: true,
    });
    return email + password;
  };

  useEffect(() => {
    // simulate loading
    setTimeout(() => {
      signIn('johndoe@gmail.com', 'password');
    }, 2000);
  }, []);

  const signOut = () => {
    // replace with sign out function
    setIsLoading(true);
    // simulate loading
    setTimeout(() => {
      setUserToken(null);
      setIsLoggedIn(false);
      setIsLoading(false);
      setUserProfile({} as Profile);
    }, 2000);
    return;
  };

  const signUp = (email: string, password: string) => {
    return email + password;
  };

  const [location, setLocation] = useState({} as any);

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
            setLocation(position as Location);
            console.log(position as Location);
          },
          error => {
            // See error code charts below.
            setLocation(false);
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });
  };

  useEffect(() => {
    getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        isLoading,
        setIsLoading,
        isSignout,
        setIsSignout,
        userToken,
        setUserToken,
        signIn,
        signOut,
        signUp,
      }}>
      <Context.Provider
        value={{
          creditCards,
          addNewCreditCard,
          removeCreditCard,
          userProfile,
          setUserProfile,
          location,
        }}>
        {children}
      </Context.Provider>
    </AuthContext.Provider>
  );
};

export default GlobalState;
