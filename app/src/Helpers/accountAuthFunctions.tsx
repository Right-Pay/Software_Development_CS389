import {Profile} from '../types/ProfileType';
import {HttpError, HttpResponse} from '../types/HttpResponse';
//import Config from 'react-native-config';

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
    status: url === 'johndoe@gmail.com' || url === 'notfound@a.com' ? 200 : 404,
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

async function signInAuth(
  tempURL: string /*email: string,password: string,*/,
): Promise<Profile | string> {
  const userProfile = await postUserCredentials(
    tempURL /*endpointtosendpasswordandemail*/,
  ).then(r => {
    const res = r as HttpResponse;
    const status = res.status;
    return status >= 200 && status < 300
      ? (res.data as Profile)
      : (res.error?.message as string); //Data will stand for profile if found and error message if status not correct
  });

  return userProfile;
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

const accountAuthFunctions = {
  signInAuth,
  checkValidPassword,
  checkValidEmail,
  checkNoUserAlreadyCreated,
};

export default accountAuthFunctions;
