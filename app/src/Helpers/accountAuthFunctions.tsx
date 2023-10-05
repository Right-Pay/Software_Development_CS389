import {Profile} from '../types/ProfileType';

async function getUsernameId(username: string): Promise<number> {
  const foundUsername = username.length > 0 ? 1 : -1; //Need a api call here eventually
  return foundUsername;
}

async function checkPasswordInSystem(
  usernameId: number,
  password: string,
): Promise<boolean> {
  const foundPassword = usernameId === 1 && password.length !== 0; //Need a api call here eventually using userid

  return foundPassword;
}

async function checkUsernameInSystem(
  username: string,
): Promise<Number | boolean> {
  return await getUsernameId(username).then(result => {
    if (result) {
      return result;
    } else {
      return false;
    }
  });
}

async function checkCredentialsInSystem(
  username: string,
  password: string,
): Promise<Profile | Number> {
  const userId = await checkUsernameInSystem(username).then(result => {
    if (typeof result === 'number') {
      return result;
    } else {
      return -1;
    }
  });
  if (userId === -1) {
    return 2;
  }
  const foundPassword = await checkPasswordInSystem(userId, password).then(
    result => {
      return result;
    },
  );
  if (foundPassword === false) {
    return 1;
  }
  return {
    id: userId,
    name: 'John Doe',
    email: username,
  } as Profile;
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

async function checkNoUserAlreadyCreated(username: string): Promise<boolean> {
  let usernameId = -1;
  await getUsernameId(username).then(result => {
    if (result) {
      usernameId = result;
    }
  });
  return usernameId === -1;
}

const accountAuthFunctions = {
  checkCredentialsInSystem,
  checkValidPassword,
  checkValidUsername,
  checkNoUserAlreadyCreated,
};

export default accountAuthFunctions;
