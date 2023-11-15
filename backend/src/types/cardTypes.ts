import { Bank } from "./bankTypes";
import { Brand } from "./brandTypes";

export interface Card {
  id?: number;
  card_bin: number;
  card_name?: string;
  card_brand_id: number;
  card_bank_id: number;
  card_type: string;
  card_level: string;
  card_country: string;

  // used when returning a card linked to a user
  rewards?: Reward[];
  card_bank_name?: string;
  card_bank_abbr?: string;
  card_brand_name?: string;
  exp_date?: string;
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