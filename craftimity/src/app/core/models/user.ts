export interface IUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  active: boolean;
  enabled: boolean;
  role: string;
  country_id: number;
  state_id: number;
  city_id: number;
  created_at: string;
  updated_at: string;
  profile_image: string;
  password: string;
  birthdate: string;
  email_verified: boolean;
  phone_verified: boolean;
  full_name?: string;
}
