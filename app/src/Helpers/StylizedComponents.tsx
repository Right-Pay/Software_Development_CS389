import {styled} from 'nativewind';
import {TextInput, Text, View, Pressable, FlatList, Image} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import DropDownPicker from 'react-native-dropdown-picker';

export const WrapperView = styled(
  View,
  'flex-1 items-center h-full overflow-y-scroll justify-center space-between bg-light-green pb-12',
);
export const Title = styled(
  Text,
  'text-3xl text-4xl pl-10 pr-10 text-center font-bold text-dark-green',
);
export const Subtitle = styled(Text, 'text-xl text-center text-dark-green');
export const FinePrint = styled(Text, 'text-sm text-black');
export const FinePrintButton = styled(Pressable, 'flex pb-1');
export const AuthButton = styled(
  Pressable,
  'flex items-center justify-center fixed m-2 text-xl text-black h-9 w-5/12 rounded-xl bg-dark-green',
);
export const AuthInputBox = styled(
  TextInput,
  'px-2 py-1 m-1 text-xl text-left content-center justify-center text-black h-auto w-2/3 rounded-xl border-2 border-black bg-light-green bg-transparent',
);
export const AuthButtonText = styled(
  Text,
  'text-center text-xl text-light-green',
);
export const FormInputBox = styled(
  TextInput,
  'px-2 py-1 m-1 text-xl text-left content-center justify-center text-black h-auto w-2/3 rounded-xl border-2 border-black bg-light-green bg-transparent',
);
export const FormButton = styled(
  Pressable,
  'flex items-center justify-center fixed m-2 text-xl text-black h-9 w-5/12 rounded-xl bg-dark-green',
);
export const FormButtonText = styled(
  Text,
  'text-center text-xl text-light-green',
);
export const MainButton = styled(
  Pressable,
  'text-3xl p-2 border-2 border-dark-green rounded-xl m-2',
);
export const MainButtonText = styled(
  Text,
  'text-center text-xl text-dark-green',
);

export const GoogleMapsView = styled(
  MapView,
  'absolute top-0 left-0 right-0 bottom-0',
);
export const GoogleMapsMarker = styled(Marker);
export const ProfileList = styled(FlatList, '');
export const ProfileView = styled(
  View,
  'flex-1 flex-col ml-20 mr-20 border-b-1 border-b-gray-500',
);
export const Logo = styled(Image, 'scale-15');
export const LogoContainer = styled(
  View,
  'flex-col justify-center items-center h-1/2 w-1/2',
);
export const CardList = styled(FlatList, 'w-full');
export const CardListView = styled(View, 'h-1/2 mt-10 w-full');
export const CardView = styled(
  View,
  'h-full w-screen flex flex-col items-center justify-center',
);
export const SecondaryCardView = styled(
  View,
  'flex-1 flex-col w-11/12 h-full justify-center items-center bg-dark-green rounded-xl border-4',
);
export const CardButton = styled(Pressable, 'w-full h-full p-8');
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
export const SecondaryAddCardView = styled(
  View,
  'rounded-xl bg-dark-green p-8 border-4 w-11/12 h-full justify-center items-center',
);
export const AddCardButton = styled(
  Pressable,
  'w-40 h-40 items-center justify-center',
);
export const AddCFormOverlayView = styled(
  View,
  'justify-center items-center bg-light-green',
);
export const RewardsView = styled(
  View,
  'flex-1 flex-col ml-20 mr-20 mb-2 mt-10',
);
export const Dropdown = styled(
  DropDownPicker,
  'text-xl text-black h-12 rounded-xl border-2 bg-light-green',
);
export const FormDateView = styled(
  View,
  'flex flex-row justify-center w-3/4 mb-2',
);
