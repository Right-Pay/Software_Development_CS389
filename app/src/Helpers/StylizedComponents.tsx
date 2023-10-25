import {styled} from 'nativewind';
import {TextInput, Text, View, Pressable, FlatList, Image} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import DropDownPicker from 'react-native-dropdown-picker';

const styledView = (styles: string) => styled(View, styles);
const styledText = (styles: string) => styled(Text, styles);
const styledPressable = (styles: string) => styled(Pressable, styles);
const styledFlatList = (styles: string) => styled(FlatList, styles);

export const WrapperView = styledView('flex-1 items-center bg-light-green');
export const Title = styledText(
  'text-3xl text-center font-bold text-dark-green',
);
export const Subtitle = styledText('text-xl text-center text-dark-green');
export const FinePrint = styledText('text-sm text-black');
export const FinePrintButton = styledPressable('flex pb-1');
export const AuthButton = styledPressable(
  'flex color items-center justify-center m-2 text-xl text-black flex h-9 w-5/12 rounded-xl bg-dark-green shadow-sm transition-colors',
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
export const GoogleMapsView = styled(
  MapView,
  'absolute top-0 left-0 right-0 bottom-0',
);
export const GoogleMapsMarker = styled(Marker);
export const ProfileList = styledFlatList('');
export const ProfileView = styledView(
  'flex-1 flex-col ml-20 mr-20 border-b-1 border-b-gray-500',
);
export const Logo = styled(Image, 'scale-15');
export const LogoContainer = styledView(
  'flex-initial flex-col justify-center items-center h-1/2 w-1/2',
);
export const CreditCardList = styledFlatList('w-full');
export const CreditCardListView = styledView('h-1/3 mt-10 w-full');
export const CreditCardView = styledView(
  'rounded-xl bg-dark-green h-full w-screen pt-8 pl-8 pr-8',
);
export const CreditCardText = styledText('text-2xl text-white text-left mb-2');
export const CreditCardItemSeperator = styledView('w-12');
export const AddCreditCardIcon = styled(Image, 'w-full h-full');
export const AddCreditCardView = styledView(
  'flex flex-col items-center rounded-xl bg-dark-green h-full w-screen pt-8 pl-8 pr-8',
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
  'px-3 py-2 m-2 text-xl text-black flex h-12 w-1/2 rounded-xl border-2 border-dark-green bg-light-green bg-transparent shadow-sm transition-colors',
);
