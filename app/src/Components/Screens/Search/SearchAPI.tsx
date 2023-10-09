import Config from 'react-native-config';

const fetchCreditCards = async (url: String) => {
  const baseURL = Config.REACT_APP_API_URL;

  const response = await fetch(`${baseURL}${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });

  // Manipulate result to return
  const result = await response.json();

  return result;
};

const SearchApi = {
  fetchCreditCards,
};

export default SearchApi;
