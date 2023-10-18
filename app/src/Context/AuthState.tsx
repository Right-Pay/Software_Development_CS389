import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import AuthContext from './authContext';
import {Profile} from '../types/ProfileType';
import {HttpResponse} from '../types/HttpResponse';
import GlobalState from './GlobalState';
import AuthErrorComponent from '../Helpers/AuthErrorComponent';
import ConstsType from '../Helpers/Consts';
import Config from 'react-native-config';

const AuthState: React.FC<PropsWithChildren> = ({children}) => {
  const [authError, setAuthError] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [userProfile, setUserProfile] = React.useState<Profile>({} as Profile);
  const [userToken, setUserToken] = React.useState<string | null>(null);
  const [lang, setLang] = React.useState<string>('en');
  const baseURL = Config.REACT_APP_API_URL;
  const auth0URL = Config.REACT_APP_AUTH0_DOMAIN;
  const auth0ClientId = Config.REACT_APP_AUTH0_CLIENT_ID;
  const auth0Audience = Config.REACT_APP_AUTH0_AUDIENCE;
  const ErrorMessages = ConstsType.authErrorMessages;

  const resetVariables = () => {
    setUserToken(null);
    setUserProfile({} as Profile);
    clearAuthErrors();
  };

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
    resetVariables();
    if (!checkValidEmail(email)) {
      addAuthError(ErrorMessages.invalidEmail);
    } else if (!checkValidPassword(password)) {
      addAuthError(ErrorMessages.invalidPassword);
    } else {
      const authorized = await signInAuth(email, password);
      if (authorized) {
        setIsLoading(true);
        await getUser(authorized as string).then(result => {
          let res = result as HttpResponse;
          setIsLoading(false);
          if (res.success) {
            setUserToken(res.data.auth_token);
            setUserProfile(res.data as Profile);
            clearAuthErrors();
          } else {
            setUserToken(null);
            setUserProfile({} as Profile);
            addAuthError(res.message as string);
          }
        });
      }
    }
    setIsLoading(false);
  };

  const signInAuth = async (email: string, password: string) => {
    var requestOptions = {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Request-Headers': '*',
      }),
      body: new URLSearchParams({
        grant_type: 'password',
        username: email,
        password: password,
        client_id: auth0ClientId,
        audience: auth0Audience,
      }).toString(),
    };

    return await fetch(`${auth0URL}/oauth/token`, requestOptions)
      .then(response => response.json())
      .then(result => {
        switch (result.error) {
          case 'invalid_grant':
            addAuthError(ErrorMessages.userNotFound);
            return false;
          case 'too_many_attempts':
            addAuthError(ErrorMessages.tooManyAttepts);
            return false;
          case undefined:
            return result.access_token;
          default:
            addAuthError(ErrorMessages.userNotFound);
            return false;
        }
      })
      .catch(() => {
        addAuthError(ErrorMessages.userNotFound);
        false;
      });
  };

  const getUser = async (token: string) => {
    let result = {};

    await fetch(`${baseURL}users`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token as string}`,
        'X-Preferred-Language': lang,
      },
    })
      .then(async res => (result = await res.json()))
      .catch(() => {
        result = {
          success: false,
          message: ErrorMessages.errorGettingUser,
        };
      });

    return result;
  };

  const signUp = async (
    email: string,
    username: string,
    password: string,
    repeatedPassword: string,
    phone?: string,
  ) => {
    resetVariables();

    if (!checkValidEmail(email)) {
      addAuthError(ErrorMessages.invalidEmail);
    } else if (!checkValidPassword(password)) {
      addAuthError(ErrorMessages.invalidPassword);
    } else if (!checkEqualPasswords(password, repeatedPassword)) {
      addAuthError(ErrorMessages.passwordsDoNotMatch);
    } else {
      //! Create new user using Auth0, get Auth0 token
      // const newAuth0UserCreated = await createNewAuth0User(email, password);
      //! For now we don't have creating the user setup with Auth0 so we must do it from the dashboard, thus:
      const newAuth0UserCreated = await signInAuth(email, password);
      //! Create new user using our backend, use Auth0 token
      if (newAuth0UserCreated) {
        await createNewDatabaseUser(
          newAuth0UserCreated,
          email,
          username,
          phone,
        ).then(result => {
          let res = result as HttpResponse;
          setIsLoading(false);
          if (res.success) {
            setUserToken(res.data.auth_token);
            setUserProfile(res.data as Profile);
            clearAuthErrors();
          } else {
            setUserToken(null);
            setUserProfile({} as Profile);
            addAuthError(res.message as string);
          }
        });
      } else {
        addAuthError(ErrorMessages.errorCreatingUser);
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const createNewAuth0User = async (email: string, password: string) => {
    //do things
    console.log('attempting auth0 signup: ' + email, password);
    let result = {};

    //! return auth0 token if valid, if not return false or error message auth0 gives us
    if (!userToken) {
      return false;
    }
    await fetch(`${baseURL}users`, {
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + userToken,
        'X-Preferred-Language': lang,
      },
    })
      .then(async res => (result = await res.json()))
      .catch(() => {
        result = {
          success: false,
          message: ErrorMessages.errorGettingUser,
        };
      });

    return result;
  };

  const createNewDatabaseUser = async (
    token: string,
    email: string,
    username: string,
    phone?: string,
  ) => {
    let result = {};

    await fetch(`${baseURL}users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Ensure this is set
        authorization: `Bearer ${token as string}`,
        'X-Preferred-Language': lang,
      },
      body: JSON.stringify({
        email: email,
        username: username,
        phone: phone,
      }),
    })
      .then(async res => (result = await res.json()))
      .catch(() => {
        result = {
          success: false,
          message: ErrorMessages.errorCreatingUser,
        };
      });
    return result;
  };

  const signOut = () => {
    // replace with sign out function
    setIsLoading(true);
    // simulate loading
    setTimeout(() => {
      resetVariables();
      setIsLoading(false);
    }, 2000);
    return;
  };

  function checkValidPassword(password: string): boolean {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#-])[A-Za-z\d@$!%*?&#-]{12,}$/;
    const test = password.length > 0 && passwordRegex.test(password);
    if (!test) {
      addAuthError(ErrorMessages.invalidPassword);
      return false;
    }
    return test;
  }

  function checkValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const test = email.length > 0 && emailRegex.test(email);
    if (!test) {
      addAuthError(ErrorMessages.invalidEmail);
      return false;
    }
    return test;
  }

  function checkEqualPasswords(password: string, repeatedPassword: string) {
    return password === repeatedPassword && checkValidPassword(password);
  }

  function verifyCode(code: string) {
    //will need to make this an api call at some point
    const test = code?.length > 0;
    if (!test) {
      addAuthError(ErrorMessages.invalidCode);
      return false;
    }
    console.log('code: ' + code);
    return true;
  }

  useEffect(() => {
    setLang('es');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userProfile,
        userToken,
        authError,
        setIsLoading,
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
        verifyCode,
        AuthErrorComponent,
      }}>
      <GlobalState>{children}</GlobalState>
    </AuthContext.Provider>
  );
};

export default AuthState;
