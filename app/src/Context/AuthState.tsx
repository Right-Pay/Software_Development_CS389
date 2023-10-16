import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import AuthContext from './authContext';
import {Profile} from '../types/ProfileType';
import {HttpError, HttpResponse} from '../types/HttpResponse';
import GlobalState from './GlobalState';
import AuthErrorComponent from '../Helpers/AuthErrorComponent';
import ConstsType from '../Helpers/Consts';
import Auth0Params from './Auth0Params.json';

const AuthState: React.FC<PropsWithChildren> = ({children}) => {
  const [authError, setAuthError] = React.useState<string[]>([]);
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
      addAuthError('invalidEmail');
    } else if (!checkValidPassword(password)) {
      addAuthError('invalidPassword');
    } else {
      await signInAuth(email, password);
      if (userToken !== null) {
        postUserCredentials().then(r => {
          const res = r as HttpResponse;
          const status = res.status;
          return status >= 200 && status < 300
            ? setUserProfile(res.data as Profile)
            : addAuthError(res.error?.message as string); //Data will stand for profile if found and error message if status not correct
        });
      }
    }
    setIsLoading(false);
  };

  const postUserCredentials = async () => {
    const baseURL = ''; //Config.REACT_APP_API_URL;
    const url = `${baseURL} /user/login?${userToken}`; //send to actual api
    const response = {
      data:
        url === ConstsType.dummyProfile.email || url === 'notfound@a.com'
          ? ConstsType.dummyProfile
          : 'invalidPassword',
      status:
        url === ConstsType.dummyProfile.email || url === 'notfound@a.com'
          ? 200
          : 404,
      error:
        url === ConstsType.dummyProfile.email || url === 'notfound@a.com'
          ? null
          : ({
              status: 404,
              message: 'invalidPassword',
            } as HttpError),
    };
    const result = response;
    return result;
  };

  async function signInAuth(email: string, password: string) {
    const bodyParams = {
      client_id: Auth0Params.clientId,
      grant_type: 'http://auth0.com/oauth/grant-type/password-realm',
      username: email,
      password: password,
      realm: Auth0Params.realm,
      audience: Auth0Params.apiAudience,
      scope: Auth0Params.scope,
    };

    await fetch(`https://${Auth0Params.domain}/oauth/token`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyParams),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.error) {
          return responseJson.error_description;
        }
        const {access_token} = responseJson;
        setUserToken(access_token);
        console.log('access_token: ', access_token);
      });
  }

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

  const signUp = async (
    email: string,
    password: string,
    repeatedPassword: string,
  ) => {
    clearAuthErrors();
    setSignedUp(false);

    const canSignUp = checkNoUserAlreadyCreated(email);

    if (!canSignUp) {
      addAuthError('userAlreadyExists');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    if (!checkValidEmail(email)) {
      addAuthError('invalidEmail');
    } else if (!checkValidPassword(password)) {
      addAuthError('invalidPassword');
    } else if (!checkEqualPasswords(password, repeatedPassword)) {
      addAuthError('passwordsDoNotMatch');
    } else {
      const newUserCreated = await createNewUser(/*email, password*/);

      if (newUserCreated) {
        signIn(email, password);
        setSignedUp(true);
      } else {
        addAuthError('errorCreatingUser');
      }
    }

    setIsLoading(false);
  };

  const createNewUser = async (/*email: string, password: string*/) => {
    //do things reach to auth0
    return true;
  };

  function checkValidPassword(password: string): boolean {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{12,}$/;
    const test = password.length > 0 && passwordRegex.test(password);
    if (!test) {
      addAuthError('invalidPassword');
      return false;
    }
    return test;
  }

  function checkValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const test = email.length > 0 && emailRegex.test(email);
    if (!test) {
      addAuthError('invalidEmail');
      return false;
    }
    return test;
  }

  function checkNoUserAlreadyCreated(email: string): boolean {  
    //This will have to react out to auth0 not sure how yet
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
    if (foundUserProfile) {
      addAuthError('userAlreadyExists');
      return false;
    }
    return foundUserProfile;
  }

  function checkEqualPasswords(password: string, repeatedPassword: string) {
    return password === repeatedPassword && checkValidPassword(password);
  }

  function verifyCode(code: string) {
    //will need to make this an api call at some point
    const test = code?.length > 0;
    if (!test) {
      addAuthError('invalidCode');
      return false;
    }
    console.log('code: ' + code);
    return true;
  }

  useEffect(() => {
    // simulate loading
    setIsLoading(true);
    setTimeout(() => {
      signIn(ConstsType.dummyProfile.email, '123456789aA!');
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
