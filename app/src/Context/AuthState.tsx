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
  const [isSignout, setIsSignout] = React.useState<boolean>(false);
  const [isSignedIn, setIsSignedIn] = React.useState<boolean>(false);
  const [userProfile, setUserProfile] = React.useState<Profile>({} as Profile);
  const [userToken, setUserToken] = React.useState<string | null>(null);
  const [auth0Token, setAuth0Token] = React.useState<string | null>(null);
  const [signedUp, setSignedUp] = React.useState<boolean>(false);
  const [lang, setLang] = React.useState<string>('en');
  const baseURL = Config.REACT_APP_API_URL;
  const ErrorMessages = ConstsType.authErrorMessages;

  const resetVariables = () => {
    setIsSignout(false);
    setIsSignedIn(false);
    setSignedUp(false);
    setUserToken(null);
    setAuth0Token(null);
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
      if ((authorized as boolean) !== false) {
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
        client_id: 'QMtWfucpCQDThBGf2hJ1uuwh4VTZ0C45',
        scope: 'openid name email nickname',
        audience: 'http://localhost:3001/',
      }).toString(),
    };

    return await fetch(
      'https://dev-6uux541sywon80js.us.auth0.com/oauth/token',
      requestOptions,
    )
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
            setAuth0Token(result.access_token);
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
        authorization: `bearer: ${token as string}`,
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

    //! api does this on the backend, no need to do this on the front end
    //! both our backend and the auth0 backend will check for this and return errors
    // const canSignUp = checkNoUserAlreadyCreated(email);
    // if (!canSignUp) {
    //   addAuthError('userAlreadyExists');
    //   setIsLoading(false);
    //   return;
    // }

    if (!checkValidEmail(email)) {
      addAuthError(ErrorMessages.invalidEmail);
    } else if (!checkValidPassword(password)) {
      addAuthError(ErrorMessages.invalidPassword);
    } else if (!checkEqualPasswords(password, repeatedPassword)) {
      addAuthError(ErrorMessages.passwordsDoNotMatch);
    } else {
      //! Create new user using Auth0, get Auth0 token
      const newAuth0UserCreated = await createNewAuth0User(email, password);
      //! Create new user using our backend, use Auth0 token
      if (newAuth0UserCreated) {
        await createNewDatabaseUser(email, username, phone).then(result => {
          let res = result as HttpResponse;
          setIsLoading(false);
          if (res.success) {
            setUserToken(res.data.auth_token);
            setUserProfile(res.data as Profile);
            clearAuthErrors();
          } else {
            console.log('error: ' + res.message);
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

  const createNewAuth0User = async (email: string, password: string) => {
    //do things
    console.log('attempting auth0 signup: ' + email, password);
    let result = {};

    //! return auth0 token if valid, if not return false or error message auth0 gives us
    if (!auth0Token) {
      return false;
    }
    await fetch(`${baseURL}users`, {
      method: 'GET',
      headers: {
        authorization: 'Bearer ' + auth0Token,
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
    email: string,
    username: string,
    phone?: string,
  ) => {
    let result = {};

    await fetch(`${baseURL}users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Ensure this is set
        authorization: auth0Token as string,
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
    // simulate loading
    setIsLoading(true);
    setIsSignedIn(false);
    setTimeout(() => {
      setIsLoading(false);
    });
    setLang('en');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userProfile,
        userToken,
        isSignout,
        isSignedIn,
        authError,
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
        verifyCode,
        AuthErrorComponent,
      }}>
      <GlobalState>{children}</GlobalState>
    </AuthContext.Provider>
  );
};

export default AuthState;
