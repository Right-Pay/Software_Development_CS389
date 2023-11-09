import {
  Card,
  CreditCardFormDetails,
  CreditCardFormsType,
  Reward,
} from './CreditCardType';
import {Location} from './Location';

export interface AppContext {
  creditCards: Card[];
  newCreditCard: Card | null;
  rewards: Reward[];
  reviewCreditCard: (_creditCard: Card) => void;
  findCreditCard: (_cardBin: number) => void;
  addCreditCard: () => boolean;
  removeCreditCard: (_creditCard: Card) => void;
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
  CreditCardForms: CreditCardFormsType;
  setCreditCardForms: (_creditCardForms: CreditCardFormsType) => void;
  validateCreditCardForm: (
    _formDetails: CreditCardFormDetails,
    _formType: string,
  ) => string[];
  setNewCreditCard: (_newCreditCard: Card | null) => void;
}
