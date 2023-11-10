import {Card, CardFormDetails, CardFormsType, Reward} from './CardType';
import {Location} from './Location';

export interface AppContext {
  Cards: Card[];
  newCard: Card | null;
  rewards: Reward[];
  findCard: (_cardBin: number) => boolean;
  addCard: () => boolean;
  removeCard: (_Card: Card) => void;
  addNewReward: (_reward: Reward) => void;
  removeReward: (_reward: Reward) => void;
  location: Location;
  isLoading: boolean;
  setIsLoading: (_isLoading: boolean) => void;
  updatingDropdown: boolean;
  setUpdatingDropdown: (_updatingDropdown: boolean) => void;
  bankOptions: string[];
  setBankOptions: (_bankOptions: string[]) => void;
  typeOptions: string[];
  setTypeOptions: (_typeOptions: string[]) => void;
  CardForms: CardFormsType;
  setCardForms: (_CardForms: CardFormsType) => void;
  validateCardForm: (_formDetails: CardFormDetails) => string[];
  setNewCard: (_newCard: Card | null) => void;
  setNewCardBin: (_newCardBin: number) => void;
  newCardBin: number;
  reviewCard: (_card: Card) => void;
}
