export interface Card {
  id: number;
  card_bin: number;
  card_name: string;
  card_brand_id?: number;
  card_brand?: Brand;
  card_bank_id?: number;
  card_bank?: Bank;
  card_type?: string;
  card_level?: string;
  card_country?: string;
  exp_date?: string;
  nickname?: string;
  rewards?: Reward[];
}

export interface Reward {
  id: number;
  reward_name: string;
  reward_description: string;
  reward_type: string;
  reward_value: number;
  reward_value_type: string;
  reward_value_currency: string;
}

export interface Bank {
  id?: number;
  bank_name: string;
  abbr: string;
}


export interface Brand {
  id?: number;
  brand_name: string;
}


export interface CreditCardFormProps {}

export interface CreditCardFormsType {
  [key: string]: boolean;
}

export interface CreditCardFormDetails {
  cardName?: string;
  cardBin?: string;
  bankName?: string;
  nickname?: string;
}

export enum CreditCardFormTypes {
  Full = 'Full',
  Search = 'Search',
  Review = 'Review',
  AddBank = 'AddBank',
}
