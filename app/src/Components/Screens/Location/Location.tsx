import React from 'react';
import type {PropsWithChildren} from 'react';
import type {
  LocationNavigationRoutesType,
  NavigationRoutesType,
} from '../../../types/NavigationRoutesType';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {CompositeScreenProps} from '@react-navigation/native';
import Context from '../../../Context/context';
import {AppContext} from '../../../types/AppContextType';
import {
  GoogleMapsMarker,
  GoogleMapsView,
  Title,
  WrapperView,
} from '../../../Helpers/StylizedComponents';
import {Platform} from 'react-native';
import {PROVIDER_GOOGLE, PROVIDER_DEFAULT} from 'react-native-maps';

type LocationScreenProps = CompositeScreenProps<
  NativeStackScreenProps<LocationNavigationRoutesType, 'LocationScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const LocationScreen: React.FC<LocationScreenProps> = () => {
  const {location} = React.useContext(Context) as AppContext;

  const markerFactory = (title: string, description: string) => {
    return (
      <GoogleMapsMarker
        coordinate={{
          latitude: location.latitude ?? 0,
          longitude: location.longitude ?? 0,
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
          latitude: location.latitude ?? 0,
          longitude: location.longitude ?? 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        region={{
          latitude: location.latitude ?? 0,
          longitude: location.longitude ?? 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        customMapStyle={mapStyle}
        provider={Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE}>
        {markerFactory('test marker', 'test description')}
      </GoogleMapsView>
    </WrapperView>
  ); //add button up here^^ between view and mapview <Button
  //title="Settings"
  //onPress={() => navigation.navigate('LocationSettings')}
  ///>
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
