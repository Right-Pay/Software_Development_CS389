import React, {useCallback, useEffect, useRef, useState} from 'react';
import type {PropsWithChildren} from 'react';
import Context from './context';
import {
  CardFormDetails,
  CardFormsType,
  Card,
  Reward,
  CardBank,
  CardBrand,
} from '../types/CardType';
import {AppState, Keyboard, PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Consts from '../Helpers/Consts';
import Config from 'react-native-config';
import {AuthContextType} from '../types/AuthContextType';
import AuthContext from './authContext';
import {Location, Place, PlaceLocation} from '../types/Location';
const baseURL = Config.REACT_APP_API_URL;

const GlobalState: React.FC<PropsWithChildren> = ({children}) => {
  const {refreshAuth0Token, userToken, userProfile, addAuthError} =
    React.useContext(AuthContext) as AuthContextType;

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [location, setLocation] = useState<Location>({} as Location);
  const [places, setPlaces] = useState<Place[]>([] as Place[]);
  const [address, setAddress] = useState<Place | undefined>(undefined);

  const [rewards] = React.useState<Reward[]>(Consts.dummyCardRewards);
  const ErrorMessages = Consts.authErrorMessages;

  const [CardForms, setCardForms] = useState<CardFormsType>({
    Full: false,
    Review: false,
    Rewards: false,
    AddBankOption: false,
  });
  const [newCardBin, setNewCardBin] = React.useState<number>(0o0);

  const [bankOptions, setBankOptions] = useState<CardBank[]>([]);

  const [brandOptions, setBrandOptions] = useState<CardBrand[]>([]);

  /* Card Add Flow
   * 1. Search for card using 6 digit number
   * 2. If found show review screen and make sure it is correct. User will enter nickname and maybe update card. Send this card to users db
   * 3. If not found show full form. User will enter all info and send to db
   * 4. Rewards will be found using a few details from card. Rewards review screen will show which will allow the user to enter rewards and see rewards already associated to that card. Send rewards to db
   *
   */

  const findCard = async (
    cardBin: number,
    tryAgain: boolean,
  ): Promise<Card | false> => {
    setIsLoading(true);
    //Check db for card
    //found card will need to be set if found
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', `bearer ${userToken}`);

    const query = `?card_bin=${cardBin}`;
    try {
      const response = await fetch(`${baseURL}cards${query}`, {
        method: 'GET',
        headers: headers,
      });
      const content = await response.json();

      if (content.data.code === 'invalid_token') {
        await refreshAuth0Token();
        if (tryAgain) {
          setTimeout(() => {
            findCard(cardBin, false);
          }, 20);
        }
        setIsLoading(false);
        return false;
      }

      if (response.status === 200) {
        const card = content.data;
        const modifiedCard = {
          ...card,
          card_bank_name:
            bankOptions.find(b => b.id === +card.card_bank_id)?.bank_name ?? '',
          card_brand_name:
            brandOptions.find(b => b.id === +card.card_brand_id)?.brand_name ??
            '',
          exp_date: '23-01',
        } as Card;
        setIsLoading(false);
        return modifiedCard;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (e) {
      console.log(e);
      addAuthError(ErrorMessages.undefined);
      setIsLoading(false);
      return false;
    }
  };

  const linkCard = async (card: Card, new_card: boolean): Promise<boolean> => {
    setIsLoading(true);
    const linkToUser = async (tryAgain: boolean) => {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Authorization', `bearer ${userToken}`);
      const date = formatExpirationDate(card.exp_date as string);

      const raw: linkCardBodyProps = new_card
        ? {
            new_card: {
              card_bin: card?.card_bin as number,
              card_bank_id: card?.card_bank_id,
              card_brand_id: card?.card_brand_id,
              card_level: card?.card_level,
              card_type: card?.card_type,
              card_country: 'United States',
              exp_date: date,
            },
          }
        : {
            card_id: card?.id,
          };

      raw.exp_date = date;

      try {
        const response = await fetch(`${baseURL}users/linkCard`, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify(raw),
        });

        const content = await response.json();
        //check
        if (
          content &&
          content.data &&
          content.data.code &&
          content.data.code === 'invalid_token'
        ) {
          await refreshAuth0Token();
          if (tryAgain) {
            setTimeout(() => {
              linkToUser(false);
            }, 20);
          }
          return false;
        }
        if (!content.success) {
          return false;
        }
        setNewCardBin(0o0);
        setCardForms({
          ...CardForms,
          Review: false,
          Full: false,
        });
        const retCard = content.data as Card;
        const cardWithBankAndBrand = {
          ...retCard,
          card_bank_name:
            bankOptions.find(b => b.id === +(retCard.card_bank_id as number))
              ?.bank_name ?? '',
          card_brand_name:
            brandOptions.find(b => b.id === +(retCard.card_brand_id as number))
              ?.brand_name ?? '',
        } as Card;
        userProfile.cards.push(cardWithBankAndBrand);
        return true;
      } catch (e) {
        console.log(e);
        addAuthError(ErrorMessages.undefined);
      }
    };
    let success = await linkToUser(true);
    if (!success) {
      return false;
    }
    setIsLoading(false);
    return true;
  };

  const unlinkCard = async (card: Card): Promise<Boolean> => {
    setIsLoading(true);
    const unlinkToUser = async (tryAgain: boolean) => {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Authorization', `bearer ${userToken}`);

      const raw = {
        card_id: card?.id,
      };

      try {
        const response = await fetch(`${baseURL}users/unlinkCard`, {
          method: 'DELETE',
          headers: headers,
          body: JSON.stringify(raw),
        });
        const content = await response.json();
        if (content.data.code === 'invalid_token') {
          await refreshAuth0Token();
          if (tryAgain) {
            setTimeout(() => {
              unlinkToUser(false);
            }, 20);
          }
          return false;
        }
        return content.success;
      } catch (e) {
        console.log(e);
        addAuthError(ErrorMessages.undefined);
        return false;
      }
    };
    let success = await unlinkToUser(false);
    userProfile.cards = userProfile.cards.filter(c => c.id !== card.id);
    setIsLoading(false);
    return success;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addNewReward = (cardReward: Reward) => {
    //Do something here
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const removeReward = (CardReward: Reward) => {
    //Do something here
  };

  function testCardName(cardName: string) {
    const regex: RegExp = /^[a-zA-Z ]{10,}$/;
    return regex.test(cardName);
  }

  function testCardBin(cardBin: number) {
    const regex: RegExp = /^[0-9]{6}$/;
    return regex.test(cardBin.toString());
  }

  function testBankName(bankName: string) {
    const regex: RegExp = /^[a-zA-Z &,.]{4,}$/;
    return regex.test(bankName);
  }

  function testLevel(level: string) {
    const regex: RegExp = /^[a-zA-Z ]{3,}$/;
    return regex.test(level);
  }

  function formatExpirationDate(expirationDate: string) {
    const date = expirationDate.split('-');
    let year = date[0];
    let month = date[1];

    if (year.length === 1) {
      year = `2${year}`;
    }
    if (year.length > 2 || year.length === 0) {
      year = '23';
    }
    if (month.length === 1) {
      month = `0${month}`;
    }
    if (month.length > 2 || month.length === 0) {
      month = '01';
    }

    return `${year}-${month}`;
  }

  function validateCardForm(formDetails: CardFormDetails) {
    const errors: string[] = [];
    if (formDetails.cardBin !== undefined) {
      if (!testCardBin(Number(formDetails.cardBin))) {
        errors.push(ErrorMessages.invalidCardBin);
      }
    }
    if (formDetails.cardName !== undefined) {
      if (!testCardName(formDetails.cardName as string)) {
        errors.push(ErrorMessages.invalidCardName);
      }
    }
    if (formDetails.bankName !== undefined) {
      if (!testBankName(formDetails.bankName as string)) {
        errors.push(ErrorMessages.invalidBankName);
      }
    }
    if (formDetails.level !== undefined) {
      if (!testLevel(formDetails.level as string)) {
        errors.push(ErrorMessages.invalidCardLevel);
      }
    }
    return errors;
  }

  const requestLocationPermission = async () => {
    try {
      let granted = 'false';
      if (Platform.OS === 'ios') {
        granted = await Geolocation.requestAuthorization('whenInUse');
      } else {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Geolocation Permission',
            message: 'Can we access your location?',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
      }
      if (granted === 'denied') {
        return false;
      } else {
        return true;
      }
    } catch (err) {
      return false;
    }
  };

  const fetchAddress = useCallback(async () => {
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

    setAddress(resultAddress[0]);
  }, [location]);

  const calculateDistanceLatLong = (
    location1: PlaceLocation,
    location2: PlaceLocation,
  ) => {
    const toRadians = (degrees: number): number => {
      return degrees * (Math.PI / 180);
    };

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

  const fetchPlaces = useCallback(async () => {
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

    setPlaces(resultPlaces);
  }, [location]);

  const getLocation = useCallback(() => {
    const result = requestLocationPermission();
    result.then(res => {
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            const coords = position.coords;
            console.log(coords);
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
      } else {
        //Basic location
        setLocation({
          latitude: 0,
          longitude: 0,
          altitude: 0,
          accuracy: 0,
        } as Location);
        fetchPlaces();
        fetchAddress();
      }
    });
  }, []);

  const updateLocation = () => {
    setIsLoading(true);
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
            fetchPlaces();
            fetchAddress();
          },
          error => {
            // See error code charts below.
            setLocation({
              latitude: 0,
              longitude: 0,
              altitude: 0,
              accuracy: 0,
            } as Location);
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 1},
        );
      } else {
        //Basic location
        setLocation({
          latitude: 0,
          longitude: 0,
          altitude: 0,
          accuracy: 0,
        } as Location);
        fetchPlaces();
        fetchAddress();
      }
    });
    setIsLoading(false);
  };

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const fetchBanks = useCallback(async () => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', `bearer ${userToken}`);

    const response = await fetch(`${baseURL}banks/all`, {
      method: 'GET',
      headers: headers,
    });
    const content = await response.json();

    let set = new Set();
    let arr: any = [];

    content.data.forEach((b: CardBank) => {
      if (set.has(b.bank_name)) {
        return;
      }
      arr.push(b);
      set.add(b.bank_name);
    });

    setBankOptions(arr);
  }, [userToken]);

  const fetchBrands = useCallback(async () => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Authorization', `bearer ${userToken}`);

    const response = await fetch(`${baseURL}brands/all`, {
      method: 'GET',
      headers: headers,
    });
    const content = await response.json();
    setBrandOptions(Array.from(new Set(content.data)));
  }, [userToken]);

  useEffect(() => {
    if (userToken) {
      fetchBanks();
      fetchBrands();
    }
  }, [fetchBanks, fetchBrands, userToken]);

  useEffect(() => {
    fetchPlaces();
    fetchAddress();
  }, [fetchAddress, fetchPlaces, location]);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const handler = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      handler.remove();
    };
  }, []);

  return (
    <Context.Provider
      value={{
        rewards,
        findCard,
        linkCard,
        unlinkCard,
        addNewReward,
        removeReward,
        location,
        isLoading,
        setIsLoading,
        bankOptions,
        setBankOptions,
        brandOptions,
        CardForms,
        setCardForms,
        validateCardForm,
        newCardBin,
        setNewCardBin,
        fetchPlaces,
        places,
        fetchAddress,
        address,
        isKeyboardVisible,
        requestLocationPermission,
        appStateVisible,
        updateLocation,
      }}>
      {children}
    </Context.Provider>
  );
};

export default GlobalState;

interface linkCardBodyProps {
  new_card?: Card;
  card_id?: number;
  exp_date?: string;
}
