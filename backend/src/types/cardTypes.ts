import { Bank } from "./bankTypes";
import { Brand } from "./brandTypes";

export interface Card {
  id?: number;
  card_bin: number;
  card_name: string;
  card_brand_id: number;
  card_brand: Brand;
  card_bank_id: number;
  card_bank: Bank;
  card_type: string;
  card_level: string;
  card_country: string;
  rewards: Reward[];
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