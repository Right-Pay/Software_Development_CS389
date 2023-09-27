import Config from 'react-native-config';

const fetchAddObjectHere = async (url: String) => {
  const baseURL = Config.REACT_APP_API_URL;

  const result = await fetch(`${baseURL}${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'text/html',
      'Access-Control-Allow-Origin': '*',
    },
  });

  const text = await result.text();

  return text;
};

export default fetchAddObjectHere;
