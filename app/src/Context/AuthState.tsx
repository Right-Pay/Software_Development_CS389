import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import AuthContext from './authContext';
import {Profile} from '../types/ProfileType';
import {HttpError, HttpResponse} from '../types/HttpResponse';
import GlobalState from './GlobalState';
import AuthError from '../Helpers/AuthError';

const AuthState: React.FC<PropsWithChildren> = ({children}) => {
  const [signInError, setAuthError] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isSignout, setIsSignout] = React.useState<boolean>(false);
  const [userProfile, setUserProfile] = React.useState<Profile>({} as Profile);
  const [userToken, setUserToken] = React.useState<string | null>(null);
  const [signedUp, setSignedUp] = React.useState<boolean>(false);

  const addAuthError = (error: string) => {
    setAuthError(prevErrors => Array.from(new Set([...prevErrors, error])));
  };

  const clearAuthErrors = () => {
    setAuthError([]);
  };

  const removeAuthError = (error: string) => {
    setAuthError(prevErrors => prevErrors.filter(value => value !== error));
  };

  const signIn = async (email: string, password: string) => {
    if (!checkValidEmail(email)) {
      addAuthError('1');
    } else if (!checkValidPassword(password)) {
      addAuthError('2');
    } else {
      await signInAuth(email /*email, password*/) //email is temp for not till backend is done
        .then((result: any) => {
          setIsLoading(false);
          if (typeof result === 'string') {
            setUserToken(null);
            setUserProfile({} as Profile);
            addAuthError(result);
          } else {
            setUserToken('asdf');
            setUserProfile(result as Profile);
            clearAuthErrors();
          }
        });
    }
    setIsLoading(false);
  };

  const signOut = () => {
    // replace with sign out function
    setIsLoading(true);
    // simulate loading
    setTimeout(() => {
      setUserToken(null);
      setIsLoading(false);
      setUserProfile({} as Profile);
    }, 2000);
    return;
  };

  const createNewUser = async (/*email: string, password: string*/) => {
    //do things
    return true;
  };

  const signUp = async (
    email: string,
    password: string,
    repeatedPassword: string,
  ) => {
    clearAuthErrors();
    setSignedUp(false);

    const canSignUp = checkNoUserAlreadyCreated(email);

    if (!canSignUp) {
      addAuthError('4');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    if (!checkValidEmail(email)) {
      addAuthError('1');
    } else if (!checkValidPassword(password)) {
      addAuthError('2');
    } else if (!checkEqualPasswords(password, repeatedPassword)) {
      addAuthError('3');
    } else {
      const newUserCreated = await createNewUser(/*email, password*/);

      if (newUserCreated) {
        signIn(email, password);
        setSignedUp(true);
      } else {
        addAuthError('5');
      }
    }

    setIsLoading(false);
  };

  const postUserCredentials = async (url: String) => {
    // const baseURL = Config.REACT_APP_API_URL;
    const response = {
      data:
        url === 'johndoe@gmail.com' || url === 'notfound@a.com'
          ? ({
              //Need to change this with an api call
              id: 1,
              name: 'John Doe',
              email: 'johndoe@gmail.com',
              phone: '1234567890',
              address: '1234 Main St',
              city: 'Anytown',
              state: 'CA',
              zip: '12345',
              subscribed: true,
            } as Profile)
          : '1',
      status:
        url === 'johndoe@gmail.com' || url === 'notfound@a.com' ? 200 : 404,
      error:
        url === 'johndoe@gmail.com' || url === 'notfound@a.com'
          ? null
          : ({
              status: 404,
              message: '1',
            } as HttpError),
    }; /*await fetch(`${baseURL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });*/
    // Manipulate result to return
    const result = response;
    //await response.json();
    return result;
  };

  async function signInAuth( //update this
    tempURL: string /*email: string,password: string,*/,
  ): Promise<Profile | string> {
    const fetchedUserProfile = await postUserCredentials(
      tempURL /*endpointtosendpasswordandemail*/,
    ).then(r => {
      const res = r as HttpResponse;
      const status = res.status;
      return status >= 200 && status < 300
        ? (res.data as Profile)
        : (res.error?.message as string); //Data will stand for profile if found and error message if status not correct
    });

    return fetchedUserProfile;
  }

  function checkValidPassword(password: string): boolean {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{12,}$/;
    return password.length > 0 && passwordRegex.test(password);
  }

  function checkValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return email.length > 0 && emailRegex.test(email);
  }

  function checkNoUserAlreadyCreated(email: string): boolean {
    const foundUserProfile =
      email === 'notfound@a.com' ? true : false; /*async (url: String) => {
      const baseURL = Config.REACT_APP_API_URL;
      const response = await fetch(`${baseURL}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
      // Manipulate result to return
      const result = await response.json().exists;
      return result;
    };
    return false;*/
    return foundUserProfile;
  }

  function checkEqualPasswords(password: string, repeatedPassword: string) {
    return password === repeatedPassword && checkValidPassword(password);
  }

  useEffect(() => {
    // simulate loading
    setIsLoading(true);
    setTimeout(() => {
      signIn('johndoe@gmail.com', '123456789aA!');
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userProfile,
        userToken,
        isSignout,
        signInError,
        signedUp,
        setIsLoading,
        setIsSignout,
        setUserToken,
        signIn,
        signOut,
        signUp,
        clearAuthErrors,
        addAuthError,
        removeAuthError,
        setUserProfile,
        checkValidEmail,
        checkValidPassword,
        checkEqualPasswords,
        AuthError,
      }}>
      <GlobalState>{children}</GlobalState>
    </AuthContext.Provider>
  );
};

export default AuthState;
