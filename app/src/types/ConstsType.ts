import {CreditCard} from './CreditCardType';
import {Profile} from './ProfileType';

interface AuthErrorMessagesType {
  [key: string]: string;
}

export default interface ConstsType {
  authErrorMessages: AuthErrorMessagesType;
  dummyProfile: Profile;
  dummyCreditCards: CreditCard[];
  dummyCreditCardRewards: any[];
};
