export interface IUser {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password?: string;
  address: string;
  active: boolean;
  enabled: boolean;
  phone_verified: boolean;
  email_verified: boolean;
  role: string;
  created_at: string;
  updated_at: string;
  country_id: string;
  state_id: string;
  city_id: string;
  decrypted_password?: string;
}
