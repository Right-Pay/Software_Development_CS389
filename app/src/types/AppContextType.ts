import {CreditCard, CreditCardReward} from './CreditCardType';
import {Location} from './Location';

export interface AppContext {
  creditCards: CreditCard[];
  rewards: CreditCardReward[];
  addNewCreditCard: (_creditCard: CreditCard) => void;
  removeCreditCard: (_creditCard: CreditCard) => void;
  addNewReward: (_reward: CreditCardReward) => void;
  removeReward: (_reward: CreditCardReward) => void;
  location: Location;
  isLoading: boolean;
  setIsLoading: (_isLoading: boolean) => void;
}
