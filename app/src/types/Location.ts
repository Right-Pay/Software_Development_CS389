export interface Location {
  accuracy: number;
  altitude: number;
  latitude: number;
  longitude: number;
}

export interface Place {
  displayName: DisplayName; // inline object type here
  businessStatus: string;
  primaryType: string;
  id: string;
}

export interface DisplayName {
  text: string;
  languageCode: string;
}
