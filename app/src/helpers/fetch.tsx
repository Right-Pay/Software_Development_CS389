const baseURL = `http://${process.env.REACT_APP_IP_ADDRESS}:3000/api/`;
//const baseURL = `http://192.168.253.1:3000/api/`;

export async function fetchWithError(url: string) {
  console.log(`${baseURL}${url}`);
  console.log(process.env);
  try {
    const res = await fetch(`${baseURL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
      },
    });

    const data = await res.text();
    const status = await res.status;

    return {
      data: status >= 200 && status < 300 ? data : null,
      status,
      error:
        status >= 200 && status < 300
          ? null
          : {
              status,
              message: data,
            },
    };
  } catch (error) {
    return {
      data: null,
      status: null,
      error: {
        status: 500,
        message: error,
      },
    };
  }
}
