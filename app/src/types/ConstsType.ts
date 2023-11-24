import {Card} from './CardType';
import {Profile} from './ProfileType';

interface AuthErrorMessagesType {
  [key: string]: string;
}

interface DropdownListModesType {
  [key: string]: string;
}

interface SettingsTextType {
  [key: string]: string | hashType;
}

export default interface ConstsType {
  CardFormEnum: any;
  authErrorMessages: AuthErrorMessagesType;
  DropdownListModes: DropdownListModesType;
  dummyProfile: Profile;
  dummyCards: Card[];
  dummyCardRewards: any[];
  cardItemSeparatorWidth: number;
  addCard: Card;
  settingsText: SettingsTextType;
};

export interface hashType {
  [key: string]: string;
}
