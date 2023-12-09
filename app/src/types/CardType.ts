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
  user_to_card_link_id?: number;
}

export interface CardBrand {
  id: number;
  brand_name: string;
  brand_abbr: string;
}

export interface CardBank {
  id: number;
  bank_name: string;
  abbr: string;
}

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
  new_category?: Category;
}

export enum RewardType {
  Cashback = 'cashback',
  Points = 'points',
}

// export interface CardFormProps {}

export interface CardFormsType {
  Full: boolean;
  Rewards: boolean;
  AddBankOption: boolean;
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

export interface CardProps {
  card: Card;
  deleteCard?: boolean;
  handleDelete?: () => void;
  setDeleteCard?: (setCardTo: boolean) => void;
  handleCardPress?: () => void;
  classNameProp?: string;
}

export interface Category {
  id: number;
  category_name: string;
  specific_places: string[];
  category_slug: string;
}
