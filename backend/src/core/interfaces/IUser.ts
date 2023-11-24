export interface IUser {
  id?: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  email: string;
  phone_number: string;
  password?: string;
  address?: IAddress;
  active: boolean;
  enabled: boolean;
  phone_verified: boolean;
  email_verified: boolean;
  role: string;
  created_at: string;
  updated_at: string;
  decrypted_password?: string;
  is_onboarded?: boolean;
}

export interface IAddress {
  floor: number;
  house: number;
  street: string;
  country: any;
  state: any;
  city: any;
  created_at: string;
  updated_at: string;
  updated_by: string;
}
