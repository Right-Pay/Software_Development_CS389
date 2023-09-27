# Templates for Frontend and Backend

## Fetch

```
import Config from 'react-native-config';

const fetchAddObjectHere = async () => {
    const baseURL = Config.REACT_APP_API_URL;

    const [data, setData] = useState({} as YOUR DATA OBJECT)

    await fetch(`${baseURL}${url}`, {
      method: 'NAMEMETHOD',
      headers: {
        'Content-Type': 'NAMECONTENTTYPE',
        'Access-Control-Allow-Origin': '* OR CUSTOM PATH',
      },
    }).then(res => {
        if(res.ok)
            setData(res.CONTENTTYPE() /*text/json for ex would be res.json()*/ as YOUR DATA OBJECT) 
        else
            console.log("Error: ", res);
    }).catch(error => {
        console.log(error)
    });

    return data;
}

export default fetchADDOBJECTHERE
```