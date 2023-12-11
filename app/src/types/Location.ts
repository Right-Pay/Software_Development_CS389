import { Card } from './CardType';
import { rewardToCardLink } from './RewardContextType';

export interface Location {
  accuracy: number;
  altitude: number;
  latitude: number;
  longitude: number;
}

export interface Place {
  displayName: DisplayName; // inline object type here
  businessStatus: string;
  types: string[];
  primaryType: string;
  primaryTypeDisplayName: DisplayName;
  readableType: string;
  distance?: number;
  id: string;
  location: PlaceLocation;
  formattedAddress: string;
  cardRewards: rewardToCardLink[];
}

export interface DisplayName {
  text: string;
  languageCode: string;
}

export interface PlaceLocation {
  latitude: number;
  longitude: number;
}
