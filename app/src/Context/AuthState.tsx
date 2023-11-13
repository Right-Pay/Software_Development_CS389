import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import AuthContext from './authContext';
import {Profile} from '../types/ProfileType';
import {HttpResponse} from '../types/HttpResponse';
import GlobalState from './GlobalState';
import AuthErrorComponent from '../Helpers/AuthErrorComponent';
import Consts from '../Helpers/Consts';
import Config from 'react-native-config';
import {tokenType} from '../types/AuthContextType';

const AuthState: React.FC<PropsWithChildren> = ({children}) => {
  const [authError, setAuthError] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [userProfile, setUserProfile] = React.useState<Profile>({} as Profile);
  const [userToken, setUserToken] = React.useState<string | null>(null);
  const [refreshToken, setRefreshToken] = React.useState<string | null>(null);
  const [lang, setLang] = React.useState<string>('en');
  const baseURL = Config.REACT_APP_API_URL;
  const auth0URL = Config.REACT_APP_AUTH0_DOMAIN;
  const auth0ClientId = Config.REACT_APP_AUTH0_CLIENT_ID;
  const auth0Audience = Config.REACT_APP_AUTH0_AUDIENCE;
  const ErrorMessages = Consts.authErrorMessages;

  const resetVariables = () => {
    setUserToken(null);
    setRefreshToken(null);
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

  const refreshAuth0Token = async () => {
    if (!refreshToken) {
      addAuthError(ErrorMessages.invalidToken);
      return false;
    }
    var requestOptions = {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: auth0ClientId,
        refresh_token: refreshToken as string,
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
            setRefreshToken(result.refresh_token);
            setUserToken(result.access_token);
            return true;
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

  const signIn = async (email: string, password: string) => {
    resetVariables();
    if (!checkValidEmail(email)) {
      addAuthError(ErrorMessages.invalidEmail);
    } else if (!checkValidPassword(password)) {
      addAuthError(ErrorMessages.invalidPassword);
    } else {
      const {access_token, refresh_token} = (await signInAuth(
        email,
        password,
      )) as tokenType;
      if (refresh_token) {
        setRefreshToken(refresh_token);
      }
      if (access_token) {
        setIsLoading(true);
        await getUser(access_token).then(result => {
          console.log(result);
          let res = result as HttpResponse;
          if (res.success) {
            setUserToken(access_token);
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
      }),
      body: new URLSearchParams({
        grant_type: 'password',
        username: email,
        password: password,
        client_id: auth0ClientId,
        audience: auth0Audience,
        scope: 'offline_access',
      }).toString(),
    };
    return await fetch(`${auth0URL}/oauth/token`, requestOptions)
      .then(response => response.json())
      .then(async result => {
        switch (result.error) {
          case 'invalid_grant':
            addAuthError(ErrorMessages.userNotFound);
            return false;
          case 'too_many_attempts':
            addAuthError(ErrorMessages.tooManyAttepts);
            return false;
          case undefined:
            return {
              access_token: result.access_token,
              refresh_token: result.refresh_token,
            };
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
        authorization: `Bearer ${token}`,
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
      const {access_token}: tokenType = (await createNewAuth0User(
        email,
        password,
        username,
      ).then(async () => {
        return await signInAuth(email, password);
      })) as tokenType;
      if (access_token) {
        await createNewDatabaseUser(access_token, email, username, phone).then(
          result => {
            let res = result as HttpResponse;
            setIsLoading(false);
            if (res.success) {
              setUserToken(res.data.auth_token);
              const cards = res.data.cards.map((card: any) => {
                return {
                  ...card,
                  exp_date: card.expiration_date,
                };
              });
              setUserProfile({
                ...res.data,
                cards: cards,
              });

              clearAuthErrors();
            } else {
              setUserToken(null);
              setUserProfile({} as Profile);
              addAuthError(res.message as string);
            }
          },
        );
      } else {
        addAuthError(ErrorMessages.errorCreatingUser);
      }
    }
  };

  const createNewAuth0User = async (
    email: string,
    password: string,
    username: string,
  ) => {
    var requestOptions = {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        client_id: auth0ClientId,
        email: email,
        password: password,
        name: username,
        connection: 'Username-Password-Authentication',
      }),
    };

    return await fetch(`${auth0URL}/dbconnections/signup`, requestOptions)
      .then(response => response.json())
      .then(result => {
        return result;
      })
      .catch(() => {
        addAuthError(ErrorMessages.errorCreatingUser);
        false;
      });
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

  const resetPassword = async (email: string) => {
    resetVariables();
    if (!checkValidEmail(email)) {
      addAuthError(ErrorMessages.invalidEmail);
    } else {
      var requestOptions = {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          client_id: auth0ClientId,
          email: email,
          connection: 'Username-Password-Authentication',
        }),
      };
      return await fetch(
        `${auth0URL}/dbconnections/change_password`,
        requestOptions,
      )
        .then(response => response.text())
        .then(result => {
          addAuthError(ErrorMessages.sentRestEmail);
          return result;
        })
        .catch(error => {
          addAuthError(ErrorMessages.errorChangingPassword);
          console.log(error);
          false;
        });
    }
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

  useEffect(() => {
    setLang('en');
  }, []);

  /*//Api Bypass. Delete this when done testing
  const apiBypass: string | boolean = userToken
    ? false
    : Config.REACT_APP_API_BYPASS;

  useEffect(() => {
    const signInDummy = async () => {
      //await signIn('JohnDoe@JohnDoe.com', 'JohnDoe1234!');
      const {access_token} = (await signInAuth(
        'JohnDoe@JohnDoe.com',
        'JohnDoe1234!',
      )) as tokenType;
      setUserToken(access_token);
    };
    if (false) {
      setIsLoading(true);
      signInDummy();
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [apiBypass]);*/

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userProfile,
        userToken,
        authError,
        setIsLoading,
        setUserToken,
        setRefreshToken,
        refreshAuth0Token,
        signIn,
        signOut,
        signUp,
        resetPassword,
        clearAuthErrors,
        addAuthError,
        removeAuthError,
        setUserProfile,
        checkValidEmail,
        checkValidPassword,
        checkEqualPasswords,
        AuthErrorComponent,
        resetVariables,
      }}>
      <GlobalState>{children}</GlobalState>
    </AuthContext.Provider>
  );
};

export default AuthState;
