import Config from 'react-native-config';

export async function fetchWithError(url: string) {
  const baseURL = Config.REACT_APP_API_URL;
  console.log(`${baseURL}${url}`);
  try {
    const res = await fetch(`${baseURL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
      },
    });

    const message = await res.text();
    const status = await res.status;
    console.log(res);

    return {
      data: status >= 200 && status < 300 ? message : null,
      status,
      error: status >= 200 && status < 300 ? null : {...{status, message}},
    };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      status: null,
      error: {...{status: 500, message: error}},
    };
  }
}
