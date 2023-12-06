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
}
