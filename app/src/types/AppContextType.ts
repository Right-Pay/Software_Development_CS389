import {CreditCard} from './CreditCardType';
import {Profile} from './ProfileType';

export interface AppContext {
  creditCards: CreditCard[];
  addNewCreditCard: (_creditCard: CreditCard) => void;
  removeCreditCard: (_creditCard: CreditCard) => void;
  userProfile: Profile;
  setUserProfile: (_profile: Profile) => void;
}
