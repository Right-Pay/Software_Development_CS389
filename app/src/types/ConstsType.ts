import {CreditCard} from './CreditCardType';
import {Profile} from './ProfileType';

interface AuthErrorMessagesType {
  [key: string]: string;
}

interface CredtCardFormsType {
  [key: string]: string;
}

export default interface ConstsType {
  CredtCardForms: CredtCardFormsType;
  authErrorMessages: AuthErrorMessagesType;
  dummyProfile: Profile;
  dummyCreditCards: CreditCard[];
  dummyCreditCardRewards: any[];
};
