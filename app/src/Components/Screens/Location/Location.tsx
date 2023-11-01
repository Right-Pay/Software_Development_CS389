import React, {useEffect, useRef} from 'react';
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
import {FlatList, View} from 'react-native';
import {styled} from 'nativewind';
import {Place} from '../../../types/Location';
const StyledView = styled(View);
const StyledFlatList = styled(FlatList);

type LocationScreenProps = CompositeScreenProps<
  NativeStackScreenProps<LocationNavigationRoutesType, 'LocationScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const LocationScreen: React.FC<LocationScreenProps> = ({navigation}) => {
  const {location, fetchPlaces, places} = React.useContext(
    Context,
  ) as AppContext;
  useEffect(() => {
    fetchPlaces();
  }, []);

  const [currentViewedPlace, setCurrentViewedPlace] = React.useState<Place[]>(
    [] as Place[],
  );

  const renderPlace = (place: Place) => {
    return (
      <StyledView className="flex-1 border-2 flex-col place-items-center h-36 justify-center justify-items-center">
        <Title>{place.displayName.text}</Title>
      </StyledView>
    );
  };

  const onViewRef = useRef((viewableItems: any) => {
    const check: Place[] = viewableItems.viewableItems.map(
      (item: any) => item.item as Place,
    );
    setCurrentViewedPlace(check);
  });

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
        customMapStyle={mapStyle}>
        <GoogleMapsMarker
          draggable
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          onDragEnd={e => console.log(JSON.stringify(e.nativeEvent.coordinate))}
          title={'Test Marker'}
          description={'This is a description of the marker'}
        />
      </GoogleMapsView>
      <StyledFlatList
        className="absolute bottom-0 left-0 bg-white text-black z-50 h-36 w-full"
        data={places}
        renderItem={({item}) => renderPlace(item as Place)}
        showsHorizontalScrollIndicator={false}
        horizontal={false}
        onViewableItemsChanged={onViewRef.current} // To get the current viewed card. Can't add method here. Throws error.
        keyExtractor={item => (item as Place).id}
        snapToAlignment="start"
        decelerationRate={'fast'}
        snapToInterval={36}
      />
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
