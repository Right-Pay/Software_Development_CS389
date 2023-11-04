import {CreditCard} from './CreditCardType';
import {Profile} from './ProfileType';

interface AuthErrorMessagesType {
  [key: string]: string;
}

interface CredtCardFormsType {
  [key: string]: string;
}

interface DropdownListModesType {
  [key: string]: string;
}

export default interface ConstsType {
  CredtCardForms: CredtCardFormsType;
  authErrorMessages: AuthErrorMessagesType;
  DropdownListModes: DropdownListModesType;
  dummyProfile: Profile;
  dummyCreditCards: CreditCard[];
  dummyCreditCardRewards: any[];
};
