import Config from 'react-native-config';

const fetch__fetching__ = async (url: String) => {
  const baseURL = Config.REACT_APP_API_URL;

  const response = await fetch(`${baseURL}${url}`, {
    method: '__method__ConstantCase__',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });

  // Manipulate result to return
  const result = await response.json();

  return result;
};

const __name__Api = {
  fetch__fetching__,
};

export default __name__Api;
