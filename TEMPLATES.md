# Templates for Frontend and Backend

## Fetch for Frontend and Backend

```
import Config from 'react-native-config';
import AuthContext from '../../../Context/authContext';
import {AuthContextType} from '../../../types/AuthContextType';

const fetchAddObjectHere = async (url: String) => {
  
  const baseURL = Config.REACT_APP_API_URL;
  const {refreshToken()} = React.useContext(AuthContext) as AuthContextType;

  const response = await fetch(`${baseURL}${url}`, {
    method: ${Method Here},
    headers: {
      'Content-Type': ${Content Type},
      'Access-Control-Allow-Origin': '*',
    },
  });

  // Manipulate result to return
  const result = await response.json();
  if(result.error === 'expired token'){
    await refreshToken();
    return await fetchAddObjectHere(url);
  }

  return result;
};
```

## How to Use Fetch

```
import React, {useEffect, useState} from 'react';
import fetchAddObjectHere from './api'; // create a file called api to use the fetch function

interface DATAOBJECT {
  // define the structure of your data object here
}

const MyComponent = () => {
  const [data, setData] = useState<DATAOBJECT>({} as DATAOBJECT);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetchAddObjectHere('URLHERE');
      const data: DATAOBJECT = await res.json();
      setData(data);
    };

    fetchData();
  }, []);

  return <>{JSON.stringify(data)}</>;
};

export default MyComponent;
```