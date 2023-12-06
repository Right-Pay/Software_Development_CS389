import { Category } from "./categoryTypes";

export interface Reward {
  id?: number;
  category_id: number;
  category?: Category;
  initial_percentage: number;
  initial_limit: number;
  term_length_months: number;
  fallback_percentage?: number;
  type?: RewardType;
  crowd_source_score?: number;
  card_to_reward_link_id?: number;
}

export enum RewardType {
  Cashback = 'cashback',
  Points = 'points'
}
