import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import Context from './context';
import AuthContext from './authContext';
import {CreditCard} from '../types/CreditCardType';
import {Profile} from '../types/ProfileType';
import accountAuthFunctions from '../Helpers/accountAuthFunctions';

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
  const [signInError, setSignInError] = React.useState<string | null>(null);

  const signIn = async (email: string, password: string) => {
    if (!accountAuthFunctions.checkValidUsername(email)) {
      setSignInError('Invalid Username');
    } else if (!accountAuthFunctions.checkValidPassword(password)) {
      setSignInError('Invalid Password');
    } else {
      await accountAuthFunctions
        .checkCredentialsInSystem(email, password)
        .then((result: any) => {
          setIsLoading(false);
          if (typeof result === 'object') {
            setUserToken('asdf');
            setIsLoggedIn(true);
            setUserProfile({
              //Need to change this with an api call
              id: result.id,
              name: result.name,
              email: result.email,
              phone: '1234567890',
              address: '1234 Main St',
              city: 'Anytown',
              state: 'CA',
              zip: '12345',
              subscribed: true,
            } as Profile);
            setSignInError(null);
          } else {
            setUserToken(null);
            setIsLoggedIn(false);
            setUserProfile({} as Profile);
            setSignInError(
              result === 1 ? 'Incorrect Password' : 'Username not found',
            );
          }
        });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // simulate loading
    setTimeout(() => {
      signIn('johndoe@gmail.com', '123aA!');
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

  const signUp = async (email: string, password: string) => {
    let signedUp = false;
    await accountAuthFunctions.checkNoUserAlreadyCreated(email).then(result => {
      if (result) {
        setSignInError('Username already exists');
      } else if (!accountAuthFunctions.checkValidUsername(email)) {
        setSignInError('Invalid Username');
      } else if (!accountAuthFunctions.checkValidPassword(password)) {
        setSignInError('Invalid Password');
      } else {
        //create a new user
        createNewUser(/*email, password*/).then(r => {
          if (r) {
            signIn(email, password);
          } else {
            setSignInError('Error creating user');
          }
        });
        signedUp = true;
      }
    });
    setIsLoading(false);
    return signedUp;
  };

  const createNewUser = async (/*email: string, password: string*/) => {
    //do things
    return true;
  };

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
      }}>
      <Context.Provider
        value={{
          creditCards,
          addNewCreditCard,
          removeCreditCard,
          userProfile,
          setUserProfile,
        }}>
        {children}
      </Context.Provider>
    </AuthContext.Provider>
  );
};

export default GlobalState;
