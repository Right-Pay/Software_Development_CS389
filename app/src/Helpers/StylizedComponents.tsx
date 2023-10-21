import {styled} from 'nativewind';
import {TextInput, Text, View, Pressable, FlatList} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

export const WrapperView = styled(View, 'flex-1 items-center bg-light-green');

export const Title = styled(
  Text,
  'mt-20 text-3xl text-center font-bold text-dark-green',
);

export const Subtitle = styled(Text, 'text-xl text-center text-dark-green');

export const FinePrint = styled(Text, 'text-sm text-black');

export const FinePrintButton = styled(Pressable, 'flex pb-1');

export const AuthButton = styled(
  Pressable,
  'flex color items-center justify-center m-2 text-xl text-black flex h-9 w-5/12 rounded-xl bg-dark-green shadow-sm transition-colors',
);

export const AuthInputBox = styled(
  TextInput,
  'px-3 py-1 m-1 text-xl text-black flex h-9 w-1/2 rounded-xl border border-dark-green bg-light-green bg-transparent shadow-sm transition-colors',
);

export const MainButton = styled(
  Pressable,
  'text-3xl p-2 border-2 border-gray-600 rounded-xl m-2',
);

export const ButtonText = styled(Text, 'text-xl text-white');

export const GoogleMapsView = styled(
  MapView,
  'absolute top-0 left-0 right-0 bottom-0',
);

export const GoogleMapsMarker = styled(Marker);

export const ProfileList = styled(FlatList);

export const ProfileView = styled(
  View,
  'flex-1 flex-col ml-20 mr-20 border-b-1 border-b-gray-500',
);
