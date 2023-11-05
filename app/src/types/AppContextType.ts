import {CreditCard, CreditCardReward} from './CreditCardType';
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
  cardForm: string | null;
  setCardForm: (_cardForm: string) => void;
  updatingDropdown: boolean;
  setUpdatingDropdown: (_updatingDropdown: boolean) => void;
}
