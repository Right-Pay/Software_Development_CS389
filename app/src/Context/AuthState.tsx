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
  const [userProfile, setUserProfile] = React.useState<Profile>({} as Profile);
  const [userToken, setUserToken] = React.useState<string | null>(null);
  const [signedUp, setSignedUp] = React.useState<boolean>(false);
  const [lang, setLang] = React.useState<string>('en');
  const testToken = 'Bearer ' + Config.REACT_APP_API_KEY;
  const baseURL = Config.REACT_APP_API_URL;
  const ErrorMessages = ConstsType.authErrorMessages;

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
    setUserToken(null);
    if (!checkValidEmail(email)) {
      addAuthError(ErrorMessages.invalidEmail);
    } else if (!checkValidPassword(password)) {
      addAuthError(ErrorMessages.invalidPassword);
    } else {
      await signInAuth(email, password).then(() => {
        if (userToken !== undefined) {
          postUserCredentials().then(r => console.log(r));
        }
      });
    }
    setIsLoading(false);
  };

  const postUserCredentials = async () => {
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
          : {
              status: 404,
              message: 'invalidPassword',
            },
    };
    const result = response;
    return result;
  };

  async function signInAuth(email: string, password: string) {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');
    myHeaders.append('Access-Control-Request-Headers', '*');

    var body = new URLSearchParams();
    body.append('grant_type', 'password');
    body.append('username', email);
    body.append('password', password);
    body.append('client_id', 'QMtWfucpCQDThBGf2hJ1uuwh4VTZ0C45');
    body.append('scope', 'openid name email nickname');
    body.append('audience', 'http://localhost:3001/');

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: body.toString(),
    };

    fetch(
      'https://dev-6uux541sywon80js.us.auth0.com/oauth/token',
      requestOptions,
    )
      .then(response => response.text())
      .then(result => setUserToken(JSON.parse(result).access_token))
      .catch(error =>
        /*addAuthError(error.message + 'error')*/ console.log(
          error.message + 'error',
        ),
      );
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

  const createNewAuth0User = async (email: string, password: string) => {
    //do things
    console.log('attempting auth0 signup: ' + email, password);
    const auth0Token = testToken; //! replace with auth0 token from auth0js

    //! return auth0 token if valid, if not return false or error message auth0 gives us
    if (!auth0Token) {
      return false;
    }
    return testToken;
  };

  const signUp = async (
    email: string,
    username: string,
    password: string,
    repeatedPassword: string,
    phone?: string,
  ) => {
    clearAuthErrors();
    setSignedUp(false);

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
        await createNewUser(email, username, newAuth0UserCreated, phone).then(
          result => {
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
          },
        );
      } else {
        addAuthError(ErrorMessages.errorCreatingUser);
      }
    }
  };

  const getUser = async (auth0Token: string) => {
    let result = {};

    await fetch(`${baseURL}users`, {
      method: 'GET',
      headers: {
        authorization: auth0Token,
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

  const createNewUser = async (
    email: string,
    username: string,
    auth0Token: string,
    phone?: string,
  ) => {
    let result = {};

    await fetch(`${baseURL}users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Ensure this is set
        authorization: auth0Token,
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
    console.log('result: ' + JSON.stringify(result));
    return result;
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
    setTimeout(() => {
      signIn(ConstsType.dummyProfile.email, 'yUTZ9J-=xc|<!');
      setIsLoading(false);
    }, 2000);
    setLang('en');
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
