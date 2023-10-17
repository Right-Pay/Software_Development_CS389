export interface User {
  id: number;
  username: string;
  email: string;
  auth_id: string;
  auth_token?: string;
  phone?: string;
}

export interface UserCreate {
  username: string;
  email: string;
  auth_id: string;
  auth_token?: string;
  phone?: string;
}

export interface UserUpdate {
  id: number;
  username: string;
  email: string;
  auth_id: string;
  auth_token?: string;
  phone?: string;
}

export interface UserDelete {
  auth_id: string;
}

export interface UserGet {
  auth_id: string;
}