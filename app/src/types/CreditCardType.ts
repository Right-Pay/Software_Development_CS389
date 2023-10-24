export interface CreditCard {
  id: number;
  name: string;
  cardNumber?: string;
  expirationDate?: string;
  securityCode?: string;
  cardType?: string;
}

export interface CreditCardReward {
  id: number;
  creditCardId: number;
  name: string;
  description: string;
  amount: number;
  date: string;
}

export interface CreditCardFormProps {
  isVisible: boolean;
  setIsVisible: (_isVisible: boolean) => void;
}
