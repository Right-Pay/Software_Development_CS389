import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { styled } from 'nativewind';
import type { PropsWithChildren } from 'react';
import React, { useCallback, useEffect, useRef } from 'react';
import { Platform, Pressable, View, ViewToken } from 'react-native';
import Icon from 'react-native-ionicons';
import { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import context from '../../../Context/context';
import locationContext from '../../../Context/locationContext';
import useColorsMode from '../../../Helpers/Colors';
import {
  GoogleMapsMarker,
  GoogleMapsView,
  NearbyLocationScrollView,
} from '../../../Helpers/StylizedComponents';
import { AppContext, BottomSheetTypes } from '../../../types/AppContextType';
import { Place } from '../../../types/Location';
import { LocationContext } from '../../../types/LocationContextType';
import type {
  LocationNavigationRoutesType,
  NavigationRoutesType,
} from '../../../types/NavigationRoutesType';
import PrimaryText from '../../Common/PrimaryText';
import WrapperView from '../../Common/WrapperView';
import i18n from '../../../Localization/i18n';

type LocationScreenProps = CompositeScreenProps<
  NativeStackScreenProps<LocationNavigationRoutesType, 'LocationScreen'>,
  BottomTabScreenProps<NavigationRoutesType>
> &
  PropsWithChildren;

const StyledView = styled(View);

const LocationScreen: React.FC<LocationScreenProps> = () => {
  const {
    location,
    places,
    updateLocation,
    locationLoading,
    updateSelectedLocation,
    address,
  } = React.useContext(locationContext) as LocationContext;
  const { setBottomSheetModal, setShowBottomSheetModal, showBottomSheetModal } =
    React.useContext(context) as AppContext;

  const { colors, themeMode } = useColorsMode();
  const isDarkTheme = themeMode === 'dark';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentViewPlace, setCurrentViewedPlace] = React.useState<Place[]>(
    [] as Place[],
  );

  const handlePresentModalPress = useCallback(() => {
    setBottomSheetModal({
      type: BottomSheetTypes.LOCATION,
      snapPoints: ['30%', '80%'],
    });
    setShowBottomSheetModal(!showBottomSheetModal);
  }, [setBottomSheetModal, setShowBottomSheetModal, showBottomSheetModal]);

  const renderPlace = (place: Place, index: number) => {
    return (
      <Pressable
        key={index}
        className={
          isDarkTheme
            ? 'py-2 flex-1 flex-col h-20 w-full bg-dark'
            : 'py-2 flex-1 flex-col h-20 w-full bg-white'
        }
        onPress={() => {
          updateSelectedLocation(place);
          handlePresentModalPress();
        }}>
        <StyledView className="flex-1 flex-row place-content-between w-full">
          <PrimaryText
            numberOfLines={1}
            className="font-bold pl-4 text-xl w-3/4 text-left">
            {place.displayName.text}
          </PrimaryText>
          <PrimaryText className="text-gray-400 w-1/4 text-md text-right pr-4">
            {place.distance} mi
          </PrimaryText>
        </StyledView>
        <StyledView className="flex-1 flex-row place-content-between w-full">
          <PrimaryText className="pl-4 text-lg w-3/4 text-left">
            {place.primaryTypeDisplayName?.text || place.types[0] || ''}
          </PrimaryText>
          <PrimaryText className="text-gray-400 w-1/4 text-sm self-center text-right pr-4">
            {i18n.t('Location.Seerewards')}
          </PrimaryText>
        </StyledView>
      </Pressable>
    );
  };

  const seperatorComponent: React.FC = () => {
    return <StyledView className="w-full h-0.5 bg-gray-200" />;
  };

  type Info = {
    viewableItems: ViewToken[];
    changed: ViewToken[];
  };

  const onViewRef = useRef((info: Info) => {
    const check: Place[] = info.viewableItems.map(item => item.item as Place);
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
        customMapStyle={isDarkTheme ? mapStyle : []}
        provider={Platform.OS === 'ios' ? PROVIDER_DEFAULT : PROVIDER_GOOGLE}>
        {markerFactory(
          i18n.t('Location.Currentlocation'),
          address?.displayName.text ?? 'Unknown',
        )}
      </GoogleMapsView>
      <StyledView
        className={
          isDarkTheme
            ? 'absolute bottom-0 left-0 w-full h-1/3 bg-dark rounded-t-xl'
            : 'absolute bottom-0 left-0 w-full h-1/3 bg-white rounded-t-xl'
        }>
        <StyledView className="flex-1 flex-row shrink justify-center rounded-t-xl border-b-2 h-4 min-h-0 max-h-10 border-gray-200 items-center">
          <PrimaryText className="text-lg text-center grow pl-6">
            {i18n.t('Location.Nearby')}
          </PrimaryText>
          <Pressable
            className="ml-auto pr-2"
            onPress={() => {
              locationLoading ? null : updateLocation();
            }}
            disabled={locationLoading}>
            {<Icon name="refresh" color={colors.primary} />}
          </Pressable>
        </StyledView>
        <NearbyLocationScrollView
          className="text-black z-50"
          data={places}
          renderItem={({ item, index }) => renderPlace(item as Place, index)}
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
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
];

export default LocationScreen;
