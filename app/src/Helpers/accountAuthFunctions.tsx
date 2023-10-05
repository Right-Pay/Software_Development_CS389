import {Profile} from '../types/ProfileType';
//import Config from 'react-native-config';

const fetchUserProfile = async (/*url: String*/) => {
  //const baseURL = Config.REACT_APP_API_URL;

  const response = {
    json: {
      //Need to change this with an api call
      id: 1,
      name: 'John Doe',
      email: 'JohnDoe@gmail.com',
      phone: '1234567890',
      address: '1234 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      subscribed: true,
    } as Profile,
  } as any;
  /*await fetch(`${baseURL}${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });*/

  // Manipulate result to return
  const result =
    response.json as Profile; /*await response.json().then(data => {
    return data as Profile;
  });*/

  return result;
};

async function checkCredentialsInSystem(): Promise<Profile | false> {
  /*username: string,*/
  const userProfile = await fetchUserProfile(/*`fakeurl/${username}`*/).then(
    response => {
      return response as Profile;
    },
  ); //Need to call api here eventually

  const userId = userProfile.id;
  if (userId === -1) {
    return false;
  }
  return userProfile;
}

function checkValidPassword(password: string): boolean {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,12}$/;
  return password.length > 0 && passwordRegex.test(password);
}

function checkValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return username.length > 0 && usernameRegex.test(username);
}

async function checkNoUserAlreadyCreated(/*username: string*/): Promise<boolean> {
  const userProfile = await fetchUserProfile(/*`fakeurl/${username}`*/).then(
    response => {
      return response as Profile;
    },
  );
  return userProfile !== undefined;
}

const accountAuthFunctions = {
  checkCredentialsInSystem,
  checkValidPassword,
  checkValidUsername,
  checkNoUserAlreadyCreated,
};

export default accountAuthFunctions;
