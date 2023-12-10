import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import Config from 'react-native-config';
import Geolocation from 'react-native-geolocation-service';
import { AppContext } from '../types/AppContextType';
import { AuthContextType } from '../types/AuthContextType';
import { Location, Place, PlaceLocation } from '../types/Location';
import authContext from './authContext';
import context from './context';
import LocationContext from './locationContext';
import Consts from '../Helpers/Consts';

const LocationState: React.FC<PropsWithChildren> = ({ children }) => {
  const [location, setLocation] = useState<Location>({} as Location);
  const [places, setPlaces] = useState<Place[]>([]);
  const [address, setAddress] = useState<Place | undefined>(undefined);
  const [locationGrantType, setLocationGrantType] = useState<boolean>(false);
  const { appStateVisible, setTopFiveCards } = useContext(
    context,
  ) as AppContext;
  const { userProfile } = useContext(authContext) as AuthContextType;
  const [locationLoading, setLocationLoading] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<Place | null>(null);

  const apiURL = Config.REACT_APP_GOOGLE_API;

  const supportedLocation = Consts.SupportedLocationsEnum;

  const requestLocationPermission = useCallback(async () => {
    try {
      if (Platform.OS === 'ios') {
        const grant = await Geolocation.requestAuthorization('whenInUse');
        setLocationGrantType(grant === 'granted');
      } else {
        const grant = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Geolocation Permission',
            message: 'Can we access your location?',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        setLocationGrantType(grant === 'granted');
      }
      return locationGrantType;
    } catch (err) {
      return false;
    }
  }, [locationGrantType]);

  const fetchAddress = useCallback(async () => {
    await requestLocationPermission();
    if (locationGrantType === false) {
      setAddress({
        businessStatus: 'OPERATIONAL',
        displayName: { text: 'Location Permission Denied', languageCode: '' },
        location: { longitude: 0, latitude: 0 },
        primaryType: 'restaurant',
        primaryTypeDisplayName: { text: 'Restaurant', languageCode: '' },
        types: ['Restaurant'],
        readableType: 'Restaurant',
        id: '0',
        formattedAddress: 'Unavailable',
        cardRewards: [],
      });
      return;
    }
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append(
      'X-Goog-FieldMask',
      'places.displayName,places.businessStatus,places.primaryType,places.types',
    );
    myHeaders.append('X-Goog-Api-Key', apiURL);

    const raw = JSON.stringify({
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
  }, [location, locationGrantType, requestLocationPermission, apiURL]);

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
    setLocationLoading(true);
    await requestLocationPermission();
    if (locationGrantType === false) {
      setPlaces([
        {
          businessStatus: 'OPERATIONAL',
          displayName: { text: 'Location Permission Denied', languageCode: '' },
          location: { longitude: 0, latitude: 0 },
          primaryType: 'restaurant',
          primaryTypeDisplayName: { text: 'Restaurant', languageCode: '' },
          types: ['Restaurant'],
          readableType: 'Restaurant',
          id: '0',
          formattedAddress: 'Unavailable',
          cardRewards: [],
        },
      ]);
      return;
    }
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append(
      'X-Goog-FieldMask',
      'places.displayName,places.businessStatus,places.primaryType,places.location,places.primaryTypeDisplayName,places.types,places.formattedAddress',
    );
    headers.append('X-Goog-Api-Key', apiURL);

    const placesTypes = {
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
      drugstore: 'Drugstore',
      pharmacy: 'Pharmacy',
      hotel: 'Hotel',
      subway_station: 'Subway Station',
      wholesaler: 'Wholesaler',
      supermarket: 'Supermarket',
      store: 'Store',
      grocery_store: 'Grocery Store',
    };

    const raw = JSON.stringify({
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
          placesTypes.hasOwnProperty.call(place, 'primaryType') &&
          place.types.length > 0 &&
          placesTypes.hasOwnProperty(place.types[0].toString())
        ) {
          primaryTypeDisplayName = {
            lang: 'en-US',
            text: placesTypes[place.types[0] as keyof typeof placesTypes],
          };
        } else if (!place.hasOwnProperty('primaryType')) {
          const type = place.types[0];
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
    // setPlaces(Consts.devLocations as unknown as Place[]);
    setLocationLoading(false);
  }, [location, requestLocationPermission, locationGrantType, apiURL]);

  const getLocation = useCallback(async () => {
    await requestLocationPermission();
    if (locationGrantType) {
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
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 1 },
      );
    } else {
      //Basic location
      setLocation({
        latitude: 0,
        longitude: 0,
        altitude: 0,
        accuracy: 0,
      } as Location);
    }
  }, [requestLocationPermission, locationGrantType]);

  const updateLocation = useCallback(() => {
    setPlaces([]);
    setLocationLoading(true);
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
            setLocation({
              latitude: 0,
              longitude: 0,
              altitude: 0,
              accuracy: 0,
            } as Location);
            console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 1 },
        );
      } else {
        //Basic location
        setLocation({
          latitude: 0,
          longitude: 0,
          altitude: 0,
          accuracy: 0,
        } as Location);
      }
      setLocationLoading(false);
    });
  }, [requestLocationPermission]);

  const fetchRewards = useCallback(async () => {
    places?.forEach(place => {
      const placeType = place.primaryType.toLowerCase();
      const placeSecondaryTypes = place.types;
      const cards = userProfile.cards?.filter(card => {
        const filteredCardRewards = card?.rewards?.filter(reward => {
          const rewardType = reward.category?.category_name.toLowerCase();
          const rewardSlug = reward.category?.category_slug;
          const rewardSecondaryTypes = reward.category?.specific_places;

          const placeMap =
            supportedLocation[rewardSlug as keyof typeof supportedLocation];
          if (placeMap) {
            return placeMap.includes(placeType);
          } else if (placeType === rewardType) return true;
          else {
            rewardSecondaryTypes?.filter(type => {
              return placeSecondaryTypes.includes(type.toLowerCase());
            });
          }
        });
        if (filteredCardRewards && filteredCardRewards.length > 0) {
          return true;
        } else {
          return false;
        }
      });
      place.cardRewards = cards;
    });
  }, [places, supportedLocation, userProfile.cards]);

  useEffect(() => {
    fetchRewards();
  }, [places, fetchRewards, userProfile.cards]);

  const topFiveCards = useCallback(async () => {
    const addressPlaces = address?.types || [];
    const topSortedIds: any[] = [];
    const topFiveCards = userProfile.cards?.filter(card => {
      let hasMatchingReward = false;
      card.rewards?.forEach(reward => {
        const rewardType = reward.category?.category_name?.toLowerCase();
        const rewardSlug = reward.category?.category_slug;
        const placeMap =
          supportedLocation[rewardSlug as keyof typeof supportedLocation];

        if (
          rewardType === 'all' ||
          (placeMap && placeMap.some(place => addressPlaces.includes(place)))
        ) {
          topSortedIds.push({
            Percent: reward.initial_percentage || 0,
            Id: card.id,
          });
          hasMatchingReward = true;
        }
      });
      return hasMatchingReward;
    });

    topSortedIds.sort((a, b) => b.Percent - a.Percent);

    const sortedIds = topSortedIds.map(item => item.Id);
    const sorted = topFiveCards
      ?.sort((a, b) => {
        const indexA = sortedIds.indexOf(a.id);
        const indexB = sortedIds.indexOf(b.id);
        return indexA - indexB;
      })
      .slice(0, 5);

    setTopFiveCards(sorted);
  }, [address?.types, setTopFiveCards, supportedLocation, userProfile.cards]);

  useEffect(() => {
    topFiveCards();
  }, [topFiveCards, address]);

  const updateSelectedLocation = useCallback(
    (newSelectedLocation: Place | null) => {
      setSelectedLocation(newSelectedLocation);
    },
    [setSelectedLocation],
  );

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  useEffect(() => {
    fetchPlaces();
    fetchAddress();
  }, [fetchAddress, fetchPlaces, location]);

  useEffect(() => {
    if (appStateVisible === 'active') {
      updateLocation();
    }
  }, [appStateVisible, updateLocation]);

  return (
    <LocationContext.Provider
      value={{
        location,
        fetchPlaces,
        places,
        fetchAddress,
        address,
        requestLocationPermission,
        updateLocation,
        locationGrantType,
        locationLoading,
        selectedLocation,
        updateSelectedLocation,
      }}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationState;
