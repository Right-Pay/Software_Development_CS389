import {styled} from 'nativewind';
import {TextInput, Text, View, Pressable, FlatList, Image} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

const styledFlatList = (styles: string) => styled(FlatList, styles);
const styledText = (styles: string) => styled(Text, styles);

export const WrapperView = styled(
  View,
  'flex-1 items-center h-full overflow-y-scroll justify-center space-between bg-light-green pb-12',
);

export const Title = styled(
  Text,
  'mt-10 text-4xl pl-10 pr-10 text-center font-bold text-dark-green',
);

export const Subtitle = styled(Text, 'text-xl text-center text-dark-green');

export const FinePrint = styled(Text, 'text-sm text-black');

export const FinePrintButton = styled(Pressable, 'flex pb-1');

export const AuthButton = styled(
  Pressable,
  'flex items-center justify-center fixed m-2 text-xl text-black  h-9 w-5/12 rounded-xl bg-dark-green',
);

export const AuthInputBox = styled(
  TextInput,
  'px-3 py-1 m-1 text-xl text-black flex h-9 w-1/2 rounded-xl border border-dark-green bg-light-green bg-transparent shadow-sm transition-colors',
);

export const AuthButtonText = styled(Text, 'text-xl text-light-green');

export const MainButton = styled(
  Pressable,
  'text-3xl p-2 border-2 border-dark-green rounded-xl m-2',
);

export const MainButtonText = styled(Text, 'text-xl text-dark-green');

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

export const Logo = styled(Image, 'scale-15');

export const LogoContainer = styled(
  View,
  'flex-col justify-center items-center h-1/2 w-1/2',
);

export const SettingsList = styledFlatList('flex-1 w-full p-10');
export const SettingsNavText = styledText(
  'text-2xl text-dark-green m-2 font-bold',
);
