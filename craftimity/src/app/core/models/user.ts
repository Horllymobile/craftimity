import { ERole } from '../enums/role';

export interface IUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address?: IAddress;
  active: boolean;
  enabled: boolean;
  role: ERole;
  created_at: string;
  updated_at: string;
  profile_image: string;
  password: string;
  birthdate: string;
  email_verified: boolean;
  phone_verified: boolean;
  full_name?: string;
  is_onboarded: boolean;
}

export interface IAddress {
  floor?: number;
  house?: number;
  street?: string;
  country?: any;
  state?: any;
  city?: any;
  created_at?: string;
  updated_at?: string;
  updated_by?: string;
}
