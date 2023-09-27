# Templates for Frontend and Backend

## Fetch

```
import Config from 'react-native-config';

const fetchAddObjectHere = async (url: String) => {
  const baseURL = Config.REACT_APP_API_URL;

  const response = await fetch(`${baseURL}${url}`, {
    method: ${Method Here},
    headers: {
      'Content-Type': ${Content Type},
      'Access-Control-Allow-Origin': '*',
    },
  });

  // Manipulate result to return
  const result = await response.json();

  return result;
};
```