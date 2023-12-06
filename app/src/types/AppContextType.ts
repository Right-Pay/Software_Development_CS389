import {
  Card,
  CardBank,
  CardBrand,
  CardFormDetails,
  CardFormsType,
  Category,
  Reward,
} from './CardType';

export interface AppContext {
  rewards: Reward[];
  findCard: (_cardBin: number, _tryAgain: boolean) => Promise<Card | false>;
  findCardByAPI: (
    _cardBin: number,
    _tryAgain: boolean,
  ) => Promise<Card | false>;
  linkCard: (_card: Card, _newCard: boolean) => Promise<boolean>;
  unlinkCard: (_Card: Card) => void;
  linkReward: (
    _reward: Reward,
    _newReward: boolean,
    _addToCard: boolean,
  ) => Promise<boolean>;
  addNewReward: (_reward: Reward) => void;
  removeReward: (_reward: Reward) => void;
  isLoading: boolean;
  setIsLoading: (_isLoading: boolean) => void;
  bankOptions: CardBank[];
  setBankOptions: (_bankOptions: CardBank[]) => void;
  brandOptions: CardBrand[];
  categoryOptions: Category[];
  CardForms: CardFormsType;
  setCardForms: (_CardForms: CardFormsType) => void;
  validateCardForm: (_formDetails: CardFormDetails) => string[];
  setNewCardBin: (_newCardBin: number) => void;
  newCardBin: number;
  appStateVisible: string;
  setShowBottomSheetModal: (_showBottomSheetModal: boolean) => void;
  showBottomSheetModal: boolean;
  setBottomSheetModal: (_bottomSheetModal: BottomSheetModalType) => void;
  bottomSheetModal: BottomSheetModalType;
  getCardTypeFromBin: (_cardBin: number) => string;
  selectedCard: Card;
}

export enum BottomSheetTypes {
  SETTINGS = 'Settings',
}

export interface BottomSheetModalType {
  type: BottomSheetTypes;
  snapPoints: string[];
}
