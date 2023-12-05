import type { PropsWithChildren } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
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
  const [localPassword, setLocalPassword] = React.useState<string>('');
  const [lang, setLang] = React.useState<string>('en');
  const [notVerified, setNotVerified] = React.useState<boolean>(false);

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
    setNotVerified(false);
    setLocalPassword('');
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
      console.log(error);
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

  const storeEmail = async (stoEmail: string) => {
    try {
      await EncryptedStorage.setItem('rp_email', stoEmail);
    } catch (error) {
      return false;
    }
  };

  const removeEmail = async () => {
    try {
      await EncryptedStorage.removeItem('rp_email');
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

  const retrieveEmail = useCallback(async (): Promise<string | null> => {
    try {
      const cachedEmail = await EncryptedStorage.getItem('rp_email');
      if (!cachedEmail) {
        return null;
      }
      return cachedEmail;
    } catch (error) {
      return null;
    }
  }, []);

  const checkoauthReturn = async (ret: auth0response) => {
    switch (ret.error) {
      case 'invalid_grant':
        addAuthError(ErrorMessages.userNotFound);
        return false;
      case 'too_many_attempts':
        addAuthError(ErrorMessages.tooManyAttepts);
        return false;
      case 'access_denied':
        if (ret.error_description === 'Not_Verified') {
          setNotVerified(true);
          return false;
        } else {
          addAuthError(ErrorMessages.userNotFound);
          return false;
        }
      case undefined:
        await storeAuth0Token(ret.access_token as string);
        await storeAuth0RefreshToken(ret.refresh_token as string);
        return true;
      default:
        addAuthError(ErrorMessages.userNotFound);
        return false;
    }
  };

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
      .then(async result => checkoauthReturn(result))
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
    setKeyboardVisible(false);
    await resetVariables();

    if (checkSignInValues(email, password, inputUsername)) {
      await storeEmail(email);
      setLocalPassword(password);

      await signInAuth(email, password);
      await retrieveUserAuth().then(async result => {
        setUserToken(result?.access_token || null);
        setRefreshToken(result?.refresh_token || null);
        if (result?.access_token && result?.refresh_token) {
          await backendSignIn(result?.access_token, email);
        } else {
          setNotVerified(true);
        }
      });
    }
  };

  const backendSignIn = async (access_token: string, email: string) => {
    await getUser(access_token).then(async result => {
      const res = result as HttpResponse<Profile>;
      if (res.success) {
        setIsLoading(true);
        await setUserProfile(res.data as Profile);
        clearAuthErrors();
        setIsLoading(false);
      } else {
        if (res.message.includes('existe' || 'exist')) {
          const user = await retrieveUsername();
          if (!user) {
            setNeedsUsername(true);
            addAuthError(ErrorMessages.addUsername);
            return false;
          } else {
            await createNewDatabaseUser(access_token, email, user).then(
              async createResult => {
                const createRes = createResult as HttpResponse<Profile>;
                if (createRes.success) {
                  setIsLoading(true);
                  await setUserProfile(createRes.data as Profile);
                  clearAuthErrors();
                  setIsLoading(false);
                  return true;
                } else {
                  //Database error
                  addAuthError(createRes.message as string);
                  return false;
                }
              },
            );
          }
        } else {
          //Database error
          addAuthError(res.message as string);
          return false;
        }
      }
    });
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
        checkoauthReturn(result);
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

  const checkVerfiedEmail = async () => {
    const cached_email = await retrieveEmail();
    if (cached_email && localPassword) {
      signInAuth(cached_email, localPassword);

      if (userToken && refreshToken) {
        await backendSignIn(userToken, cached_email);
        return true;
      } else {
        setNotVerified(true);
        return false;
      }
    } else {
      return false;
    }
  };

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
        setIsLoading(true);
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
    /**
     * 1. Validate all fields
     * 2. Create new Auth0 user
     * 3. If successful, store username in encrypted local storage
     * 4. Take user to email verification page
     * 5. User clicks on link in email
     * 6. User email is verified
     * 7. User comes back to the app
     *
     * If the app is open
     * 1. The email verification page that comes up will check if the email was verified,
     * 2. If email is verified, we create the user in the database, if successful, we log
     *    the user in. If not, we prompt the user to log in again and have a page to re-enter
     *    the username.
     *
     * If the app was closed
     * 1. The user goes to the log in page, if the user logs in and the email is not
     *    verified, we prompt the user to verify the email. If the user logs in and the
     *    email is verified, we create the user in the database, if successful, we log
     *    them in.
     * 2. In the case the username is not stored anymore, prompt the user to re-enter the username.
     * 3. Then create user in database, if successful, log them in.
     *
     */
    //Comment from Tyler. The problem with this is that the way we have the code we'd have to store the password somewhere as that is the only way we can authenticate with auth0. Which I don't want to bother doing and I don't want to waste time doing

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
      return await createNewAuth0User(email, password, newUsername).then(
        async r => {
          if (r.code && r.code === 'invalid_signup') {
            addAuthError(ErrorMessages.userAlreadyExists);
            return false;
          } else {
            setLocalPassword(password);
            //await storeUsername(newUsername);
            await storeEmail(email);
            return true;
          }
        },
      );
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
        console.log(result);
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
              setIsLoading(true);
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
        checkVerfiedEmail,
        notVerified,
      }}>
      <GlobalState>{children}</GlobalState>
    </AuthContext.Provider>
  );
};

export default AuthState;

interface auth0response {
  error?: string;
  error_description?: string;
  access_token?: string;
  refresh_token?: string;
}
