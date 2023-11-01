import {styled} from 'nativewind';
import {TextInput, Text, View, Pressable, FlatList, Image} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import DropDownPicker from 'react-native-dropdown-picker';

<<<<<<< HEAD
const styledView = (styles: string) => styled(View, styles);
const styledText = (styles: string) => styled(Text, styles);
const styledPressable = (styles: string) => styled(Pressable, styles);
const styledFlatList = (styles: string) => styled(FlatList, styles);
const styledMapView = (styles: string) => styled(MapView, styles);

export const WrapperView = styledView(
  'flex-1 items-center h-full overflow-y-scroll justify-center space-between bg-light-green pb-12',
);
export const Title = styledText(
  'text-3xl text-4xl pl-10 pr-10 text-center font-bold text-dark-green',
);
export const Subtitle = styledText('text-xl text-center text-dark-green');
export const FinePrint = styledText('text-sm text-black');
export const FinePrintButton = styledPressable('flex pb-1');
export const AuthButton = styledPressable(
  'flex items-center justify-center fixed m-2 text-xl text-black h-9 w-5/12 rounded-xl bg-dark-green',
=======
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
>>>>>>> main
);
export const AuthInputBox = styled(
  TextInput,
  'px-3 py-1 m-1 text-xl text-black flex h-9 w-1/2 rounded-xl border-2 border-dark-green bg-light-green bg-transparent shadow-sm transition-colors',
);
export const AuthButtonText = styledText('text-xl text-light-green');
export const MainButton = styledPressable(
  'text-3xl p-2 border-2 border-dark-green rounded-xl m-2',
);
export const MainButtonText = styledText('text-xl text-dark-green');

export const GoogleMapsView = styledMapView(
  'absolute top-0 left-0 right-0 bottom-0',
);
export const GoogleMapsMarker = styled(Marker);
export const ProfileList = styledFlatList('');
export const ProfileView = styledView(
  'flex-1 flex-col ml-20 mr-20 border-b-1 border-b-gray-500',
);
export const Logo = styled(Image, 'scale-15');
export const LogoContainer = styledView(
  'flex-col justify-center items-center h-1/2 w-1/2',
);
export const CreditCardList = styledFlatList('w-full');
export const CreditCardListView = styledView('h-1/3 mt-10 w-full');
export const CreditCardView = styledView(
  'h-full w-screen flex flex-col items-center justify-center',
);
export const SecondaryCreditCardView = styledView(
  'w-11/12 h-full bg-dark-green rounded-xl border-2 p-8',
);
export const CreditCardButton = styledPressable('w-full h-full');
export const CreditCardText = styledText('text-2xl text-white text-left mb-2');
export const CreditCardItemSeperator = styledView('w-12');
export const AddCreditCardIcon = styled(Image, 'w-full h-full');
export const AddCreditCardView = styledView(
  'flex flex-col items-center h-full w-screen',
);
export const SecondaryAddCreditCardView = styledView(
  'rounded-xl bg-dark-green p-8 border-2 w-11/12 h-full justify-center items-center',
);
export const AddCreditCardButton = styledPressable(
  'w-40 h-40 items-center justify-center',
);
export const AddCCFormOverlayView = styledView(
  'flex-1 justify-center items-center bg-light-green',
);
export const RewardsView = styledView('flex-1 flex-col ml-20 mr-20 mb-2 mt-10');
export const Dropdown = styled(
  DropDownPicker,
  'text-xl text-black h-12 rounded-xl border-2 border-dark-green bg-light-green shadow-sm transition-colors z-50',
);
export const FormDateView = styledView(
  'flex flex-row justify-center w-3/4 space-x-2',
);
