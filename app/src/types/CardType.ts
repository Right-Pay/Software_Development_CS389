export interface Card {
  id?: number;
  card_bin: number;
  card_name?: string;
  card_brand_id?: number;
  card_brand_name?: string;
  card_bank_id?: number;
  card_bank_name?: string;
  card_type?: string;
  card_level?: string;
  card_country?: string;
  exp_date?: string;
  // used when returning a card linked to a user
  rewards?: Reward[];
  date_card_linked?: string;
}

export interface CardBrand {
  id: number;
  brand_name: string;
}

export interface CardBank {
  id: number;
  bank_name: string;
  abbr: string;
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

export interface CardFormProps {}

export interface CardFormsType {
  [key: string]: boolean;
}

export interface CardFormDetails {
  cardName?: string;
  cardBin?: number;
  bankName?: string;
  nickname?: string;
  level?: string;
}

export enum CardFormTypes {
  Full = 'Full',
  Review = 'Review',
  AddBank = 'AddBank',
}
