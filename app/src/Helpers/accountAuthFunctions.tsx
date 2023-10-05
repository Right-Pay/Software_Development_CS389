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
  password: string,
): Promise<number> {
  let usernameId = -1;
  await getUsernameId(username).then(result => {
    if (result) {
      usernameId = result;
    }
  });
  const foundPassword = await checkPasswordInSystem(usernameId, password).then(
    result => {
      return result;
    },
  );
  if (foundPassword === false) {
    return 1;
  }
  const foundUsername = usernameId !== -1;
  if (foundUsername === false) {
    return 2;
  }
  return 0;
}

function checkValidPassword(password: string): boolean {
  return password.length > 0;
}

function checkValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9]+$/;
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
  checkUsernameInSystem,
  checkValidPassword,
  checkValidUsername,
  checkNoUserAlreadyCreated,
};

export default accountAuthFunctions;
