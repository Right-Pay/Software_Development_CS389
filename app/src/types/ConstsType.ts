import {Card} from './CardType';
import {Profile} from './ProfileType';

interface AuthErrorMessagesType {
  [key: string]: string;
}

interface DropdownListModesType {
  [key: string]: string;
}

export default interface ConstsType {
  CardFormEnum: any;
  authErrorMessages: AuthErrorMessagesType;
  DropdownListModes: DropdownListModesType;
  dummyProfile: Profile;
  dummyCards: Card[];
  dummyCardRewards: any[];
  cardItemSeparatorWidth: number;
};
