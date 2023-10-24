import {styled} from 'nativewind';
import {TextInput, Text, View, Pressable, FlatList, Image} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

export const WrapperView = styled(View, 'flex-1 items-center bg-light-green');

export const Title = styled(
  Text,
  'text-3xl text-center font-bold text-dark-green',
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
  'flex-initial flex-col justify-center items-center h-1/2 w-1/2',
);

export const CreditCardList = styled(FlatList, 'w-full');

export const CreditCardListView = styled(View, 'h-1/3 mt-10 w-full');

export const CreditCardView = styled(
  View,
  'rounded-xl bg-dark-green h-full w-screen pt-8 pl-8 pr-8',
);

export const CreditCardText = styled(
  Text,
  'text-2xl text-white text-left mb-2',
);

export const CreditCardItemSeperator = styled(View, 'w-12');

export const AddCreditCardIcon = styled(Image, 'w-full h-full');

export const AddCreditCardView = styled(
  View,
  'flex flex-col items-center rounded-xl bg-dark-green h-full w-screen pt-8 pl-8 pr-8',
);

export const AddCreditCardButton = styled(
  Pressable,
  'w-40 h-40 items-center justify-center',
);

export const AddCCFormOverlayView = styled(
  View,
  'flex-1 justify-center items-center bg-light-green',
);

export const RewardsView = styled(
  View,
  'flex-1 flex-col ml-20 mr-20 mb-2 mt-10',
);
