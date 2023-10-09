import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import Context from './context';
import AuthContext from './authContext';
import {CreditCard} from '../types/CreditCardType';
import {Profile} from '../types/ProfileType';
import accountAuthFunctions from '../Helpers/accountAuthFunctions';
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
  const [signInError, setSignInError] = React.useState<string[]>([]);

  const addSignInError = (error: string) => {
    setSignInError(prevErrors => Array.from(new Set([...prevErrors, error])));
  };

  const clearSignInErrors = () => {
    setSignInError([]);
  };

  const removeSignInError = (error: string) => {
    setSignInError(prevErrors => prevErrors.filter(value => value !== error));
  };

  const signIn = async (email: string, password: string) => {
    if (!accountAuthFunctions.checkValidEmail(email)) {
      addSignInError('1');
    } else if (!accountAuthFunctions.checkValidPassword(password)) {
      addSignInError('2');
    } else {
      await accountAuthFunctions
        .signInAuth(email /*email, password*/) //email is temp for not till backend is done
        .then((result: any) => {
          setIsLoading(false);
          if (typeof result === 'string') {
            setUserToken(null);
            setIsLoggedIn(false);
            setUserProfile({} as Profile);
            addSignInError(result);
          } else {
            setUserToken('asdf');
            setIsLoggedIn(true);
            setUserProfile(result as Profile);
            clearSignInErrors();
          }
        });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // simulate loading
    setTimeout(() => {
      signIn('johndoe@gmail.com', '123456789aA!');
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

  const createNewUser = async (/*email: string, password: string*/) => {
    //do things
    return true;
  };

  const signUp = async (email: string, password: string) => {
    const canSignUp = accountAuthFunctions.checkNoUserAlreadyCreated(
      'notfound@a.com' /*email*/,
    );
    switch (canSignUp) {
      case true:
        if (!accountAuthFunctions.checkValidEmail(email)) {
          addSignInError('1');
          setIsLoading(false);
          return false;
        }
        if (!accountAuthFunctions.checkValidPassword(password)) {
          addSignInError('2');
          setIsLoading(false);
          return false;
        }
        createNewUser(/*email, password*/).then(r => {
          if (r) {
            signIn(email, password);
          } else {
            addSignInError('5');
          }
        });
        return true;
      case false:
        addSignInError('4');
        setIsLoading(false);
        return false;
      default:
        addSignInError('1');
        setIsLoading(false);
        return false;
    }
  };

  const [location, setLocation] = useState<Location>({} as Location);

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
        signInError,
        addSignInError,
        clearSignInErrors,
        removeSignInError,
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
