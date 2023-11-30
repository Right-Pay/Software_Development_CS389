import { styled } from 'nativewind';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import MapView, { Marker } from 'react-native-maps';

//Component Wrappers
export const KeyboardAvoidingScroll = styled(
  ScrollView,
  'w-screen h-screen mb-0',
);

//Text
export const FinePrint = styled(Text, 'text-sm text-black');

//Auth Components
export const AuthInputBox = styled(
  TextInput,
  'px-2 py-1 m-1 text-xl text-left content-center justify-center text-black h-auto w-2/3 rounded-xl border-2 border-black bg-white bg-transparent',
);

//Form Components
export const FormInputBox = styled(
  TextInput,
  'px-2 py-1 m-1 text-xl text-left text-black h-auto w-2/3 rounded-xl border-2 border-dark-green bg-white',
);

export const FormDateView = styled(
  View,
  'flex flex-row justify-center w-3/4 mb-2',
);

//Google Maps
export const GoogleMapsView = styled(
  MapView,
  'absolute top-0 left-0 right-0 bottom-0',
);
export const GoogleMapsMarker = styled(Marker);

//Logo components
export const Logo = styled(Image, 'scale-15');
export const LogoContainer = styled(
  View,
  'flex-col justify-center items-center h-1/3 w-1/2',
);

//Profile Components
export const ProfileView = styled(
  View,
  'flex-1 flex-col w-full h-1/4 mt-4 mb-4 p-5 items-center space-between justify-center',
);

//Settings components

export const SettingsInputBox = styled(
  TextInput,
  'px-2 py-1 text-xl text-left text-black h-auto w-2/3 rounded-xl border-2 border-dark-green bg-white',
);
export const SettingsCardList = styled(View, 'flex-1 flex-col w-full h-full');
export const SettingsCardView = styled(
  View,
  'flex-auto flex-col mt-10 p-3 h-60 justify-start overflow-hidden rounded-xl',
);

//Card compoents

export const CardList = styled(FlatList, 'w-full');
export const CardListView = styled(View, 'aspect-video mt-10 w-full');
export const CardView = styled(
  View,
  'h-full w-screen flex flex-col items-center justify-center',
);
export const CardButton = styled(Pressable, 'w-full h-full p-2');
export const DeleteCardButton = styled(
  Pressable,
  'w-full h-full absolute top-0 left-0 flex bg-red-500 rounded-xl opacity-75 justify-center items-center',
);
export const CardText = styled(Text, 'text-2xl text-white text-left mb-2');
export const CardItemSeperator = styled(View, 'w-12');
export const AddCardIcon = styled(Image, 'w-full h-full');
export const AddCardView = styled(
  View,
  'flex flex-col items-center h-full w-screen',
);
export const AddCardButton = styled(
  Pressable,
  'w-20 h-20 items-center justify-center',
);
export const AddCFormOverlayView = styled(
  View,
  'justify-center items-center bg-dark',
);
export const BanksView = styled(
  View,
  'flex flex-col justify-center border-2 border-slate-600 rounded-xl w-2/3 p-0 z-50 sticky',
);
export const BankOptionsView = styled(
  View,
  'mb-2 ml-0 w-full fixed max-h-48 border-t flex bg-white z-50',
);

//Rewards components
export const RewardsView = styled(
  View,
  'flex-1 flex-col ml-20 mr-20 mb-2 mt-10',
);

//Location components
export const NearbyLocationScrollView = styled(FlatList, 'w-full h-1/3');
export const NearbyLocationSeperator = styled(
  View,
  'w-full h-4 border-l-2 border-r-2',
);

//Buttons
export const FinePrintButton = styled(Pressable, 'flex pb-1');

//MISC.
export const Dropdown = styled(
  DropDownPicker,
  'text-xl text-black h-12 rounded-xl border-2 border-slate-600 bg-white',
);
