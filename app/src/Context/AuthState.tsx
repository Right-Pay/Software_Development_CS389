import type { PropsWithChildren } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';
import AuthErrorComponent from '../Components/Common/AuthErrorComponent';
import Consts from '../Helpers/Consts';
import { TokenType } from '../types/AuthContextType';
import { HttpResponse } from '../types/HttpResponse';
import { Profile } from '../types/ProfileType';
import GlobalState from './GlobalState';
import AuthContext from './authContext';
import { Keyboard } from 'react-native';

const AuthState: React.FC<PropsWithChildren> = ({ children }) => {
  const [authError, setAuthError] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [userProfile, setUserProfile] = React.useState<Profile>({} as Profile);
  const [userToken, setUserToken] = React.useState<string | null>(null);
  const [refreshToken, setRefreshToken] = React.useState<string | null>(null);
  const [needsUsername, setNeedsUsername] = React.useState<boolean>(false);
  const [username, setUsername] = React.useState<string>('');
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
    setNeedsUsername(false);
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

  const storeUsername = async (stoUsername: string) => {
    try {
      await EncryptedStorage.setItem('rp_username', stoUsername);
    } catch (error) {
      return false;
    }
  };

  const removeUsername = async () => {
    try {
      await EncryptedStorage.removeItem('rp_username');
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

  const retrieveUsername = useCallback(async (): Promise<string | null> => {
    try {
      const cachedUsername = await EncryptedStorage.getItem('rp_username');
      if (!cachedUsername) {
        return null;
      }
      return cachedUsername;
    } catch (error) {
      return null;
    }
  }, []);

  const refreshAuth0Token = async () => {
    if (!refreshToken) {
      addAuthError(ErrorMessages.invalidToken);
      return false;
    }
    const requestOptions = {
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
          case 'access_denied':
            if (result.error_description === 'Not_Verified') {
              addAuthError(ErrorMessages.notVerified);
              return false;
            } else {
              addAuthError(ErrorMessages.userNotFound);
              return false;
            }
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

  function checkSignInValues(
    email: string,
    password: string,
    inputUsername?: string | undefined,
  ) {
    if (!checkValidEmail(email)) {
      addAuthError(ErrorMessages.invalidEmail);
      return false;
    } else if (!checkValidPassword(password)) {
      addAuthError(ErrorMessages.invalidPassword);
      return false;
    } else if (!checkValidUsername(inputUsername ?? 'PassThisCheck')) {
      addAuthError(ErrorMessages.invalidUsername);
      return false;
    }
    return true;
  }

  const signIn = async (
    email: string,
    password: string,
    inputUsername?: string | undefined,
  ) => {
    setIsLoading(true);
    setKeyboardVisible(false);
    await resetVariables();
    let access_token = '';
    await retrieveUserAuth().then(async result => {
      if (result?.access_token) {
        access_token = result.access_token;
      }
    });
    if (checkSignInValues(email, password, inputUsername)) {
      {
        const res = (await signInAuth(email, password)) as TokenType;
        if (res.refresh_token) {
          setRefreshToken(res.refresh_token);
          await storeAuth0RefreshToken(res.refresh_token);
        }
        if (res.access_token) {
          access_token = res.access_token;
        }
      }
      if (access_token.length > 0) {
        //Fetch userData
        //Check if user is created yes -> sign in, no -> create user
        //If user is not created
        //Check if there is cached username
        //yes -> create user with cached username then sign in
        //no set needsUsername true returns

        await getUser(access_token).then(async result => {
          const res = result as HttpResponse<Profile>;
          if (res.success) {
            setUserToken(access_token);
            await storeAuth0Token(access_token);
            setUserProfile(res.data as Profile);
            clearAuthErrors();
          } else {
            if (res.message.includes('existe' || 'exist')) {
              if (inputUsername) {
                await createNewDatabaseUser(
                  access_token,
                  email,
                  inputUsername,
                ).then(async createResult => {
                  const createRes = createResult as HttpResponse<Profile>;
                  if (createRes.success) {
                    setUserToken(access_token);
                    await storeAuth0Token(access_token);
                    setUserProfile(createRes.data as Profile);
                    clearAuthErrors();
                  } else {
                    //Database error
                    addAuthError(createRes.message as string);
                  }
                });
              } else {
                await retrieveUsername().then(async usernameResult => {
                  if (usernameResult) {
                    //Create user with usernameResult
                    //Sign in
                    await createNewDatabaseUser(
                      access_token,
                      email,
                      usernameResult,
                    ).then(async createResult => {
                      const createRes = createResult as HttpResponse<Profile>;
                      if (createRes.success) {
                        setUserToken(access_token);
                        await storeAuth0Token(access_token);
                        setUserProfile(createRes.data as Profile);
                        clearAuthErrors();
                      } else {
                        //Database error
                        addAuthError(createRes.message as string);
                      }
                    });
                  } else {
                    //requests user adds new username
                    setNeedsUsername(true);
                    addAuthError(ErrorMessages.addUsername);
                    return;
                  }
                });
              }
            } else {
              //Database error
              addAuthError(res.message as string);
            }
          }
        });
      }
    }
    setIsLoading(false);
  };

  const signInAuth = async (email: string, password: string) => {
    const requestOptions = {
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
        scope: 'offline_access email_verified',
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
          case 'access_denied':
            if (result.error_description === 'Not_Verified') {
              addAuthError(ErrorMessages.notVerified);
              return false;
            } else {
              addAuthError(ErrorMessages.userNotFound);
              return false;
            }
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

  const updateUserProfile = async (newUserProfile: Profile) => {
    //setUserProfile(newUserProfile);
    // We need to do this what is here is temporary
    const headers = {
      authorization: `Bearer ${userToken as string}`,
      'X-Preferred-Language': lang,
      'Content-Type': 'application/json',
    };
    const body = {
      username: newUserProfile.username,
      phone: newUserProfile.phone,
    };
    await fetch(`${baseURL}users`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(body),
    })
      .then(async res => {
        if (res.status === 200) {
          await refreshUserProfile();
        } else {
          addAuthError(ErrorMessages.errorUpdatingUser);
        }
      })
      .catch(() => {
        console.log('error');
        addAuthError(ErrorMessages.errorUpdatingUser);
      });
  };

  const refreshUserProfile = async () => {
    if (!userToken) {
      // need to replace with refresh token logic,
      addAuthError(ErrorMessages.invalidToken);
      return false;
    }
    await getUser(userToken).then(async result => {
      const res = result as HttpResponse<Profile>;
      if (res.success) {
        setUserProfile(res.data as Profile);
        clearAuthErrors();
      } else {
        setUserToken(null);
        await removeAuth0Token();
        setUserProfile({} as Profile);
        addAuthError(res.message as string);
      }
    });
  };

  const signUp = async (
    email: string,
    newUsername: string,
    password: string,
    repeatedPassword: string,
  ) => {
    await resetVariables();
    setKeyboardVisible(false);

    if (!checkValidEmail(email)) {
      addAuthError(ErrorMessages.invalidEmail);
      return false;
    } else if (!checkValidPassword(password)) {
      addAuthError(ErrorMessages.invalidPassword);
      return false;
    } else if (!checkEqualPasswords(password, repeatedPassword)) {
      addAuthError(ErrorMessages.passwordsDoNotMatch);
      return false;
    } else if (!checkValidUsername(newUsername)) {
      addAuthError(ErrorMessages.invalidUsername);
      return false;
    } else {
      await createNewAuth0User(email, password, newUsername).then(async r => {
        if (r.code && r.code === 'invalid_signup') {
          addAuthError(ErrorMessages.userAlreadyExists);
          return false;
        } else {
          await storeUsername(newUsername);
          const { access_token, refresh_token } = (await signInAuth(
            email,
            password,
          )) as TokenType;
          if (refresh_token) {
            setRefreshToken(refresh_token);
            await storeAuth0RefreshToken(refresh_token);
            await storeAuth0Token(access_token as string);
          }
        }
      });
      return true;
    }
  };

  const createNewAuth0User = async (
    email: string,
    password: string,
    newUsername: string,
  ) => {
    const requestOptions = {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        client_id: auth0ClientId,
        email: email,
        password: password,
        name: newUsername,
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
    newUsername: string,
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
        username: newUsername,
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
    setKeyboardVisible(false);
    await resetVariables();
    if (!checkValidEmail(email)) {
      addAuthError(ErrorMessages.invalidEmail);
    } else {
      const requestOptions = {
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

  function checkValidUsername(checkUsername: string): boolean {
    const usernameRegex = /^[a-zA-Z]{3,}$/;
    const test = checkUsername.length > 0 && usernameRegex.test(checkUsername);
    if (!test) {
      addAuthError(ErrorMessages.invalidUsername);
      return false;
    }
    return test;
  }

  function checkValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?(\d{1,3})?[- .]?\(?\d{3}\)?[- .]?\d{3}[- .]?\d{4}$/;
    const test = phone.length > 0 && phoneRegex.test(phone);
    if (!test) {
      addAuthError(ErrorMessages.invalidPhone);
      return false;
    }
    return test;
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
            const res = userResult as HttpResponse<unknown>;
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
  }, [retrieveUserAuth, getUser, clearAuthErrors, retrieveUsername]);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

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
        checkValidUsername,
        checkValidPhone,
        AuthErrorComponent,
        refreshAuth0Token,
        updateUserProfile,
        needsUsername,
        isKeyboardVisible,
      }}>
      <GlobalState>{children}</GlobalState>
    </AuthContext.Provider>
  );
};

export default AuthState;
