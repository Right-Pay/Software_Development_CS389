import {Card} from './CardType';
import {Profile} from './ProfileType';

interface hashType {
  [key: string]: string;
}

interface ConstsType {
  CardFormEnum: any;
  authErrorMessages: hashType;
  DropdownListModes: hashType;
  dummyProfile: Profile;
  dummyCards: Card[];
  dummyCardRewards: any[];
  cardItemSeparatorWidth: number;
  addCard: Card;
}

export default ConstsType;
