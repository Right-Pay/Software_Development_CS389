import {
  CreditCard,
  CreditCardFormsType,
  CreditCardReward,
} from './CreditCardType';
import {Location} from './Location';

export interface AppContext {
  creditCards: CreditCard[];
  newCreditCard: CreditCard | null;
  rewards: CreditCardReward[];
  reviewCreditCard: (_creditCard: CreditCard) => void;
  findCreditCard: (_cardNumber: number) => void;
  addCreditCard: () => boolean;
  removeCreditCard: (_creditCard: CreditCard) => void;
  addNewReward: (_reward: CreditCardReward) => void;
  removeReward: (_reward: CreditCardReward) => void;
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
}
