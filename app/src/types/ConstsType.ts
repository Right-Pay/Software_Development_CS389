/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from './CardType';
import { Place } from './Location';
import { Profile } from './ProfileType';

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
  devLocations: Place[];
}

export default ConstsType;
