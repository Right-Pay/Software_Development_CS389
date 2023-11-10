export interface Card {
  id?: number;
  card_bin: number;
  card_name: string;
  card_brand?: string;
  card_bank?: string;
  card_type?: string;
  card_level?: string;
  card_country?: string;
  exp_date?: string;
  // used when returning a card linked to a user
  rewards?: Reward[];
  date_card_linked?: string;
}

export interface Reward {
  id?: number;
  reward_name: string;
  reward_description: string;
  reward_type: string;
  reward_value: number;
  reward_value_type: string;
  reward_value_currency: string;
}

export interface CreditCardFormProps {}

export interface CreditCardFormsType {
  [key: string]: boolean;
}

export interface CreditCardFormDetails {
  cardName?: string;
  cardBin?: number;
  bankName?: string;
  nickname?: string;
}

export enum CreditCardFormTypes {
  Full = 'Full',
  Search = 'Search',
  Review = 'Review',
  AddBank = 'AddBank',
}
