import React, {useRef} from 'react';
import type {PropsWithChildren} from 'react';
import type {
  LocationNavigationRoutesType,
  NavigationRoutesType,
} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import {
  GoogleMapsMarker,
  GoogleMapsView,
  NearbyLocationScrollView,
  Title,
  WrapperView,
} from '../../../Helpers/StylizedComponents';
import {Text, View, Pressable} from 'react-native';
import {styled} from 'nativewind';
import {Place} from '../../../types/Location';
import {Platform} from 'react-native';
import {PROVIDER_GOOGLE, PROVIDER_DEFAULT} from 'react-native-maps';
import locationContext from '../../../Context/locationContext';
import {LocationContext} from '../../../types/LocationContextType';
import Icon from 'react-native-ionicons';

type LocationScreenProps = CompositeScreenProps<
  NativeStackScreenProps<LocationNavigationRoutesType, 'LocationScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const StlyizedText = styled(Text, 'text-lg text-dark-green');
const StyledView = styled(View);

const LocationScreen: React.FC<LocationScreenProps> = () => {
  const {location, places, updateLocation, locationLoading} = React.useContext(
    locationContext,
  ) as LocationContext;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentViewPlace, setCurrentViewedPlace] = React.useState<Place[]>(
    [] as Place[],
  );

  const renderPlace = (place: Place) => {
    return (
      <StyledView className="py-2 flex-1 bg-white flex-col h-20 w-full">
        <StyledView className="flex-1 flex-row place-content-between w-full">
          <StlyizedText
            numberOfLines={1}
            className="font-bold pl-4 text-xl w-3/4 text-left">
            {place.displayName.text}
          </StlyizedText>
          <StlyizedText className="text-gray-400 w-1/4 text-md text-right pr-4">
            {place.distance} mi
          </StlyizedText>
        </StyledView>
        <StyledView className="flex-1 flex-row place-content-between w-full">
          <StlyizedText className="pl-4 text-lg w-3/4 text-left">
            {place.primaryTypeDisplayName?.text || place.types[0] || ''}
          </StlyizedText>
          <StlyizedText className="text-gray-400 w-1/4 text-sm self-center text-right pr-4">
            See Rewards
          </StlyizedText>
        </StyledView>
      </StyledView>
    );
  };

  const seperatorComponent: React.FC = () => {
    return <StyledView className="w-full h-0.5 bg-slate-200" />;
  };

  const onViewRef = useRef((viewableItems: any) => {
    const check: Place[] = viewableItems.viewableItems.map(
      (item: any) => item.item as Place,
    );
    setCurrentViewedPlace(check);
  });

  const markerFactory = (title: string, description: string) => {
    return (
      <GoogleMapsMarker
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
        title={title}
        description={description}
      />
    );
  };

  return (
    <WrapperView>
      <Title className="mt-20">This is the location screen</Title>
      <GoogleMapsView
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        customMapStyle={mapStyle}
        provider={Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE}>
        {markerFactory('test marker', 'test description')}
      </GoogleMapsView>
      <StyledView className="flex-1 absolute bottom-0 left-0 w-full h-1/3 bg-white rounded-t-xl">
        <StyledView className="flex-1 flex-row shrink justify-center rounded-t-xl border-b-2 h-4 min-h-0 max-h-10 border-slate-200 border bg-white items-center">
          <StlyizedText className="text-center grow pl-6">
            Nearby Locations
          </StlyizedText>
          <Pressable
            className="ml-auto pr-2"
            onPress={() => {
              locationLoading ? null : updateLocation();
            }}
            disabled={locationLoading}>
            {<Icon name="refresh" color="#4d654e" />}
          </Pressable>
        </StyledView>
        <NearbyLocationScrollView
          className="text-black z-50"
          data={places}
          renderItem={({item}) => renderPlace(item as Place)}
          ItemSeparatorComponent={seperatorComponent}
          showsHorizontalScrollIndicator={false}
          horizontal={false}
          onViewableItemsChanged={onViewRef.current} // To get the current viewed card. Can't add method here. Throws error.
          keyExtractor={item => (item as Place).id}
          snapToAlignment="start"
          decelerationRate={'fast'}
          snapToInterval={82}
        />
      </StyledView>
    </WrapperView>
  ); //add button up here^^ between view and mapview <Button
};

const mapStyle = [
  {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
  {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
  {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{color: '#263c3f'}],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{color: '#6b9a76'}],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{color: '#38414e'}],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{color: '#212a37'}],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{color: '#9ca5b3'}],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{color: '#746855'}],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{color: '#1f2835'}],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{color: '#f3d19c'}],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{color: '#2f3948'}],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{color: '#17263c'}],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{color: '#515c6d'}],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{color: '#17263c'}],
  },
];

export default LocationScreen;
