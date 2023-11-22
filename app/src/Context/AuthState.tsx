import React, {useCallback, useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import AuthContext from './authContext';
import {Profile} from '../types/ProfileType';
import {HttpResponse} from '../types/HttpResponse';
import GlobalState from './GlobalState';
import AuthErrorComponent from '../Helpers/AuthErrorComponent';
import Consts from '../Helpers/Consts';
import Config from 'react-native-config';
import {TokenType} from '../types/AuthContextType';
import EncryptedStorage from 'react-native-encrypted-storage';

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

  const resetVariables = async () => {
    setUserToken(null);
    await removeAuth0Token();
    setRefreshToken(null);
    await removeAuth0RefreshToken();
    setUserProfile({} as Profile);
    clearAuthErrors();
  };

  const addAuthError = (error: string) => {
    setAuthError(prevErrors => Array.from(new Set([...prevErrors, error])));
  };

  const clearAuthErrors = useCallback(() => {
    setAuthError([]);
  }, []);

  const removeAuthError = (error: string) => {
    setAuthError(prevErrors => prevErrors.filter(value => value !== error));
  };

  const storeAuth0Token = async (token: string) => {
    try {
      await EncryptedStorage.setItem('rp_auth0_token', token);
    } catch (error) {
      return false;
    }
  };

  const storeAuth0RefreshToken = async (token: string) => {
    try {
      await EncryptedStorage.setItem('rp_auth0_refresh_token', token);
    } catch (error) {
      return false;
    }
  };

  const removeAuth0Token = async () => {
    try {
      await EncryptedStorage.removeItem('rp_auth0_token');
    } catch (error) {
      return false;
    }
  };

  const removeAuth0RefreshToken = async () => {
    try {
      await EncryptedStorage.removeItem('rp_auth0_refresh_token');
    } catch (error) {
      return false;
    }
  };

  const retrieveUserAuth = useCallback(async (): Promise<TokenType | null> => {
    try {
      const auth0Token = await EncryptedStorage.getItem('rp_auth0_token');
      const auth0RefreshToken = await EncryptedStorage.getItem(
        'rp_auth0_refresh_token',
      );
      if (!auth0Token && !auth0RefreshToken) {
        return null;
      }
      const tokens = {
        access_token: auth0Token,
        refresh_token: auth0RefreshToken,
      };
      return tokens;
    } catch (error) {
      return null;
    }
  }, []);

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
      .then(async result => {
        switch (result.error) {
          case 'invalid_grant':
            addAuthError(ErrorMessages.userNotFound);
            return false;
          case 'too_many_attempts':
            addAuthError(ErrorMessages.tooManyAttepts);
            return false;
          case undefined:
            setRefreshToken(result.refresh_token);
            await storeAuth0RefreshToken(result.refresh_token);
            setUserToken(result.access_token);
            await storeAuth0Token(result.access_token);
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
    await resetVariables();
    if (!checkValidEmail(email)) {
      addAuthError(ErrorMessages.invalidEmail);
    } else if (!checkValidPassword(password)) {
      addAuthError(ErrorMessages.invalidPassword);
    } else {
      const {access_token, refresh_token} = (await signInAuth(
        email,
        password,
      )) as TokenType;
      if (refresh_token) {
        setRefreshToken(refresh_token);
        await storeAuth0RefreshToken(refresh_token);
      }
      if (access_token) {
        setIsLoading(true);
        await getUser(access_token).then(async result => {
          let res = result as HttpResponse;
          if (res.success) {
            setUserToken(access_token);
            await storeAuth0Token(access_token);
            setUserProfile(res.data as Profile);
            clearAuthErrors();
          } else {
            setUserToken(null);
            await removeAuth0Token();
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

  const getUser = useCallback(
    async (token: string) => {
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
    },
    [ErrorMessages.errorGettingUser, baseURL, lang],
  );

  const signUp = async (
    email: string,
    username: string,
    password: string,
    repeatedPassword: string,
    phone?: string,
  ) => {
    await resetVariables();

    if (!checkValidEmail(email)) {
      addAuthError(ErrorMessages.invalidEmail);
    } else if (!checkValidPassword(password)) {
      addAuthError(ErrorMessages.invalidPassword);
    } else if (!checkEqualPasswords(password, repeatedPassword)) {
      addAuthError(ErrorMessages.passwordsDoNotMatch);
    } else {
      const {access_token}: TokenType = (await createNewAuth0User(
        email,
        password,
        username,
      ).then(async () => {
        return await signInAuth(email, password);
      })) as TokenType;

      if (access_token) {
        await createNewDatabaseUser(access_token, email, username, phone).then(
          async result => {
            let res = result as HttpResponse;
            setIsLoading(false);
            if (res.success) {
              setUserToken(access_token);
              await storeAuth0Token(access_token);
              setUserProfile(res.data as Profile);
              clearAuthErrors();
            } else {
              setUserToken(null);
              await removeAuth0Token();
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

  const signOut = async () => {
    // replace with sign out function
    setIsLoading(true);
    // simulate loading
    setTimeout(async () => {
      await resetVariables();
      setIsLoading(false);
    }, 2000);
    return;
  };

  const resetPassword = async (email: string) => {
    await resetVariables();
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
    async function loadFromStorage() {
      setIsLoading(true);
      setLang('es');
      await retrieveUserAuth().then(async result => {
        setUserToken(result?.access_token || null);
        setRefreshToken(result?.refresh_token || null);
        if (result?.access_token) {
          await getUser(result.access_token).then(async userResult => {
            let res = userResult as HttpResponse;
            if (res.success) {
              setUserProfile(res.data as Profile);
              clearAuthErrors();
            } else {
              setUserToken(null);
              await removeAuth0Token();
              // need to replace with refresh token logic,
              // ie if error is invalid token, use refresh token
              // get new token, then try again with that new token
              setRefreshToken(null);
              await removeAuth0RefreshToken();
              setUserProfile({} as Profile);
              addAuthError(res.message as string);
            }
          });
        }
      });
      setIsLoading(false);
    }
    loadFromStorage();
  }, [retrieveUserAuth, getUser, clearAuthErrors]);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userProfile,
        userToken,
        authError,
        signIn,
        signOut,
        signUp,
        resetPassword,
        clearAuthErrors,
        addAuthError,
        removeAuthError,
        checkValidEmail,
        checkValidPassword,
        checkEqualPasswords,
        AuthErrorComponent,
        refreshAuth0Token,
        setUserProfile,
      }}>
      <GlobalState>{children}</GlobalState>
    </AuthContext.Provider>
  );
};

export default AuthState;
