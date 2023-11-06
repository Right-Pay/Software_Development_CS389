export interface CreditCard {
  id: number;
  cardName: string;
  cardNumber?: string;
  expirationDate?: string;
  cardType?: string;
  bankName?: string;
  nickname?: string;
}

export interface CreditCardReward {
  id: number;
  creditCardId: number;
  name: string;
  description: string;
  amount: number;
  date: string;
}

export interface CreditCardFormProps {}

export interface CreditCardFormsType {
  [key: string]: boolean;
}
