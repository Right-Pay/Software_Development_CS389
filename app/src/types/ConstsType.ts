import {CreditCard} from './CreditCardType';
import {Profile} from './ProfileType';

interface AuthErrorMessagesType {
  [key: string]: string;
}

interface DropdownListModesType {
  [key: string]: string;
}

export default interface ConstsType {
  CreditCardFormEnum: any;
  authErrorMessages: AuthErrorMessagesType;
  DropdownListModes: DropdownListModesType;
  dummyProfile: Profile;
  dummyCreditCards: CreditCard[];
  dummyCreditCardRewards: any[];
}
