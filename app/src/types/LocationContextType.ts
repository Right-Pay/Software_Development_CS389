import { Card } from './CardType';
import { Location, Place } from './Location';

export interface LocationContext {
  location: Location;
  fetchPlaces: () => void;
  places: Place[];
  fetchAddress: () => void;
  address: Place | undefined;
  requestLocationPermission: () => Promise<boolean>;
  updateLocation: () => void;
  locationLoading: boolean;
  locationGrantType: boolean;
  selectedLocation: Place | null;
  updateSelectedLocation: (place: Place) => void;
  topFiveCards: rewardToCardLink[];
  fetchCardById: (cardId: number) => Card;
  getAcceptedLocationsByKey: (key: string) => string[];
  getAcceptedLocationKeyByValue: (value: string) => string | null;
}

export interface rewardToCardLink {
  cardId: number;
  rewardId: number;
  percent: number;
}
