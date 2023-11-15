import {
  Card,
  CardBank,
  CardBrand,
  CardFormDetails,
  CardFormsType,
  Reward,
} from './CardType';
import {Location} from './Location';

export interface AppContext {
  newCard: Card | null;
  rewards: Reward[];
  findCard: (_cardBin: number) => Promise<boolean>;
  addCard: () => boolean;
  unlinkCard: (_Card: Card) => void;
  addNewReward: (_reward: Reward) => void;
  removeReward: (_reward: Reward) => void;
  location: Location;
  isLoading: boolean;
  setIsLoading: (_isLoading: boolean) => void;
  updatingDropdown: boolean;
  setUpdatingDropdown: (_updatingDropdown: boolean) => void;
  bankOptions: CardBank[];
  setBankOptions: (_bankOptions: CardBank[]) => void;
  brandOptions: CardBrand[];
  setBrandOptions: (_brandOptions: CardBrand[]) => void;
  CardForms: CardFormsType;
  setCardForms: (_CardForms: CardFormsType) => void;
  validateCardForm: (_formDetails: CardFormDetails) => string[];
  setNewCard: (_newCard: Card | null) => void;
  setNewCardBin: (_newCardBin: number) => void;
  newCardBin: number;
  reviewCard: (_card: Card) => void;
}
