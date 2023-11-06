import {styled} from 'nativewind';
import {TextInput, Text, View, Pressable, FlatList, Image} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import DropDownPicker from 'react-native-dropdown-picker';

const styledView = (styles: string) => styled(View, styles);
const styledText = (styles: string) => styled(Text, styles);
const styledPressable = (styles: string) => styled(Pressable, styles);
const styledFlatList = (styles: string) => styled(FlatList, styles);
const styledMapView = (styles: string) => styled(MapView, styles);

export const WrapperView = styledView(
  'flex-auto items-center h-full overflow-y-scroll justify-center space-between bg-light-green pb-12',
);
export const Title = styledText(
  'text-3xl text-4xl pl-10 pr-10 text-center font-bold text-dark-green',
);
export const Subtitle = styledText('text-xl text-center text-dark-green');
export const FinePrint = styledText('text-sm text-black');
export const FinePrintButton = styledPressable('flex pb-1');
export const AuthButton = styledPressable(
  'flex items-center justify-center fixed m-2 text-xl text-black h-9 w-5/12 rounded-xl bg-dark-green',
);
export const AuthInputBox = styled(
  TextInput,
  'px-2 py-1 m-1 text-xl text-left content-center justify-center text-black h-auto w-2/3 rounded-xl border-2 border-black bg-light-green bg-transparent shadow-sm transition-colors',
);
export const AuthButtonText = styledText(
  'text-center text-xl text-light-green',
);
export const MainButton = styledPressable(
  'text-3xl p-2 border-2 border-dark-green rounded-xl m-2',
);
export const MainButtonText = styledText('text-center text-xl text-dark-green');

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
export const CreditCardListView = styledView('h-1/2 mt-10 w-full');
export const CreditCardView = styledView(
  'h-full w-screen flex flex-col items-center justify-center',
);
export const SecondaryCreditCardView = styledView(
  'flex-1 flex-col w-11/12 h-full justify-center items-center bg-dark-green rounded-xl border-4',
);
export const CreditCardButton = styledPressable('w-full h-full p-8');
export const DeleteCreditCardButton = styledPressable(
  'w-full h-full absolute top-0 left-0 flex bg-red-500 rounded-xl opacity-75 justify-center items-center',
);
export const CreditCardText = styledText('text-2xl text-white text-left mb-2');
export const CreditCardItemSeperator = styledView('w-12');
export const AddCreditCardIcon = styled(Image, 'w-full h-full');
export const AddCreditCardView = styledView(
  'flex flex-col items-center h-full w-screen',
);
export const SecondaryAddCreditCardView = styledView(
  'rounded-xl bg-dark-green p-8 border-4 w-11/12 h-full justify-center items-center',
);
export const AddCreditCardButton = styledPressable(
  'w-40 h-40 items-center justify-center',
);
export const AddCCFormOverlayView = styledView(
  'flex-auto justify-center items-center bg-light-green',
);
export const RewardsView = styledView('flex-1 flex-col ml-20 mr-20 mb-2 mt-10');
export const Dropdown = styled(
  DropDownPicker,
  'text-xl text-black h-12 rounded-xl border-2 border-dark-green bg-light-green shadow-sm transition-colors z-50',
);
export const FormDateView = styledView(
  'flex flex-row justify-center w-2/3 space-x-2',
);
