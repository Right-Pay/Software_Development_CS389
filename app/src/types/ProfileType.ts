export interface Profile {
  id: number;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  subscribed: boolean;
  // any more things we need to add to the profile?
}
