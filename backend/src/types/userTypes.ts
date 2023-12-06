import { Card } from "./cardTypes";

export interface User {
  id: number;
  username: string;
  email: string;
  auth_id: string;
  auth_token?: string;
  phone?: string;
  cards: Card[];
  points: number;
}