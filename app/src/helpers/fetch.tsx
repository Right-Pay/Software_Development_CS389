import { useState } from 'react';
import Config from 'react-native-config';

const fetchAddObjectHere = async (url: String) => {
    const baseURL = Config.REACT_APP_API_URL;

    const [data, setData] = useState({} as String)

    await fetch(`${baseURL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
      },
    }).then(res => {
        if(res.ok)
            setData(res.text() /*text/json for ex would be res.json()*/ as String) 
        else
            console.log("Error: ", res);
    }).catch(error => {
        console.log(error)
    });

    return data;
}

export default fetchAddObjectHere;