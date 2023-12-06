import { Card } from './CardType';

export interface Profile {
  id: number;
  username: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  subscribed: boolean;
  cards: Card[];
  points?: number;
  // any more things we need to add to the profile?
}
