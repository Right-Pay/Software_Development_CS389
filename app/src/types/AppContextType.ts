import {
  Card,
  CardBank,
  CardBrand,
  CardFormDetails,
  CardFormsType,
  Reward,
} from './CardType';

export interface AppContext {
  rewards: Reward[];
  findCard: (_cardBin: number, _tryAgain: boolean) => Promise<Card | false>;
  linkCard: (_card: Card, _newCard: boolean) => Promise<boolean>;
  unlinkCard: (_Card: Card) => void;
  addNewReward: (_reward: Reward) => void;
  removeReward: (_reward: Reward) => void;
  isLoading: boolean;
  setIsLoading: (_isLoading: boolean) => void;
  bankOptions: CardBank[];
  setBankOptions: (_bankOptions: CardBank[]) => void;
  brandOptions: CardBrand[];
  CardForms: CardFormsType;
  setCardForms: (_CardForms: CardFormsType) => void;
  validateCardForm: (_formDetails: CardFormDetails) => string[];
  setNewCardBin: (_newCardBin: number) => void;
  newCardBin: number;
  isKeyboardVisible: boolean;
  appStateVisible: string;
}
