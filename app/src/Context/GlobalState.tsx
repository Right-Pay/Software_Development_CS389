import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import Context from './context';
import {CreditCard} from '../types/CreditCardType';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {Location, Place, PlaceLocation} from '../types/Location';

const GlobalState: React.FC<PropsWithChildren> = ({children}) => {
  const [creditCards, setCreditCards] = React.useState<CreditCard[]>([
    {
      id: 1,
      cardNumber: '1234 5678 9012 3456',
      name: 'John Doe',
      expirationDate: '12/24',
      securityCode: '123',
      cardType: 'Visa',
    },
    {
      id: 2,
      cardNumber: '1234 5678 9012 3456',
      name: 'John Doe',
      expirationDate: '12/24',
      securityCode: '123',
      cardType: 'Visa',
    },
  ]);

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [location, setLocation] = useState<Location>({} as Location);
  const [places, setPlaces] = useState<Place[]>([] as Place[]);
  const [address, setAddress] = useState<Place | undefined>(undefined);

  const addNewCreditCard = (creditCard: CreditCard) => {
    const newCard: CreditCard = {
      id: Math.random(), // not really unique - but fine for this example
      name: creditCard.name,
      cardNumber: creditCard.cardNumber,
      expirationDate: creditCard.expirationDate,
      securityCode: creditCard.securityCode,
      cardType: creditCard.cardType,
    };
    setCreditCards([...creditCards, newCard]);
  };

  const removeCreditCard = (creditCard: CreditCard) => {
    setCreditCards(creditCards.splice(creditCard.id, 1));
  };

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization('whenInUse');
        return true;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Geolocation Permission',
            message: 'Can we access your location?',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === 'granted') {
          return true;
        } else {
          return false;
        }
      }
    } catch (err) {
      return false;
    }
  };

  const fetchAddress = async () => {
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append(
      'X-Goog-FieldMask',
      'places.displayName,places.businessStatus,places.primaryType',
    );
    myHeaders.append(
      'X-Goog-Api-Key',
      'AIzaSyDSQqzE6cXDeUCWEquYC4PPCCpk9KRJiw8',
    );

    var raw = JSON.stringify({
      excludedTypes: ['parking'],
      maxResultCount: 1,
      rankPreference: 'DISTANCE',
      locationRestriction: {
        circle: {
          center: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          radius: 50000,
        },
      },
    });

    const response = await fetch(
      'https://places.googleapis.com/v1/places:searchNearby',
      {
        method: 'POST',
        headers: myHeaders,
        body: raw,
      },
    );

    // Manipulate result to return
    const result = await response.json();
    const resultAddress = result.places.map((place: Place, index: number) => {
      return {
        ...place,
        id: index.toString(),
      } as Place;
    });
    //console.log(resultAddress[0].displayName);
    setAddress(resultAddress[0]);
  };

  const calculateDistanceLatLong = (
    location1: PlaceLocation,
    location2: PlaceLocation,
  ) => {
    const toRadians = (degrees: number): number => {
      return degrees * (Math.PI / 180);
    };
    //console.log(location1);
    //console.log(location2);
    const earthRadius = 3958.8;
    const lat1 = location1.latitude;
    const lat2 = location2.latitude;
    const lon1 = location1.longitude;
    const lon2 = location2.longitude;
    const sinLat1 = Math.sin(toRadians(lat1));
    const sinLat2 = Math.sin(toRadians(lat2));
    const cosLat1 = Math.cos(toRadians(lat1));
    const cosLat2 = Math.cos(toRadians(lat2));
    const lonDifference = toRadians(lon2 - lon1);
    const distance =
      Math.acos(
        sinLat1 * sinLat2 + cosLat1 * cosLat2 * Math.cos(lonDifference),
      ) * earthRadius;
    return Math.round(distance * 100) / 100;
  };

  const fetchPlaces = async () => {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append(
      'X-Goog-FieldMask',
      'places.displayName,places.businessStatus,places.primaryType,places.location,places.primaryTypeDisplayName,places.types',
    );
    headers.append('X-Goog-Api-Key', 'AIzaSyDSQqzE6cXDeUCWEquYC4PPCCpk9KRJiw8');

    var placesTypes = {
      restaurant: 'Restaurant',
      museum: 'Museum',
      movie_theater: 'Movie Theater',
      gas_station: 'Gas Station',
      car_wash: 'Car Wash',
      car_repair: 'Car Repair',
      car_rental: 'Car Rental',
      car_dealer: 'Car Dealer',
      electric_vehicle_charging_station: 'EV Charging Station',
      rest_stop: 'Rest Stop',
    };

    var raw = JSON.stringify({
      includedTypes: Object.keys(placesTypes),
      maxResultCount: 20,
      rankPreference: 'DISTANCE',
      locationRestriction: {
        circle: {
          center: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          radius: 50000,
        },
      },
    });

    const response = await fetch(
      'https://places.googleapis.com/v1/places:searchNearby',
      {
        method: 'POST',
        headers: headers,
        body: raw,
      },
    );

    // Manipulate result to return
    const result = await response.json();
    const resultPlaces = result.places
      .filter((place: Place) => {
        return place.businessStatus === 'OPERATIONAL';
      })
      .map((place: Place, index: number) => {
        let primaryTypeDisplayName = {};
        if (
          !place.hasOwnProperty('primaryType') &&
          place.types.length > 0 &&
          placesTypes.hasOwnProperty(place.types[0].toString())
        ) {
          primaryTypeDisplayName = {
            lang: 'en-US',
            text: placesTypes[place.types[0] as keyof typeof placesTypes],
          };
        } else if (!place.hasOwnProperty('primaryType')) {
          let type = place.types[0];
          let displayName = '';
          type.split('_').forEach(name => {
            displayName +=
              name.charAt(0).toUpperCase() + name.substring(1) + ' ';
          });
          primaryTypeDisplayName = {
            lang: 'en-US',
            text: displayName,
          };
        } else {
          primaryTypeDisplayName = place.primaryTypeDisplayName;
        }
        return {
          ...place,
          primaryTypeDisplayName: primaryTypeDisplayName,
          distance: calculateDistanceLatLong(location, place.location),
          id: index.toString(),
        } as Place;
      });
    console.log(resultPlaces);
    setPlaces(resultPlaces);
  };

  const getLocation = () => {
    const result = requestLocationPermission();
    result.then(res => {
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            const coords = position.coords;
            setLocation({
              latitude: coords.latitude,
              longitude: coords.longitude,
              altitude: coords.altitude,
              accuracy: coords.accuracy,
            } as Location);
          },
          error => {
            // See error code charts below.
            setLocation({} as Location);
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 1},
        );
      }
    });
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    fetchPlaces();
    fetchAddress();
  }, [location]);

  return (
    <Context.Provider
      value={{
        creditCards,
        addNewCreditCard,
        removeCreditCard,
        location,
        isLoading,
        setIsLoading,
        fetchPlaces,
        places,
        fetchAddress,
        address,
      }}>
      {children}
    </Context.Provider>
  );
};

export default GlobalState;
