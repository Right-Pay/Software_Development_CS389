import { Category } from "./categoryTypes";

export interface Reward {
  id?: number;
  category_id: number;
  category?: Category;
  intitial_percentage: number;
  initial_limit: number;
  term_length_months: number;
  fallback_percentage?: number;
}
