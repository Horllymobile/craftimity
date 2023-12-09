import { ApprovalStatus } from "../enums/approval-status";
import { ERole } from "../enums/role";
import { IArtisan } from "./artisan";
import { ICountry, IState, ICity } from "./location";

export interface IUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  Address?: IAddress[];
  Artisan?: IArtisan;
  User_Identity?: IUserIdentity;
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
  id?: string;
  user_id: string;
  floor?: number;
  house?: number;
  street?: string;
  Country?: ICountry;
  State?: IState;
  City?: ICity;
  created_at?: string;
  updated_at?: string;
  updated_by?: string;
}

export interface IUserIdentity {
  id?: string;
  live_image: string;
  residential_address: string;
  live_image_approved?: ApprovalStatus;
  identity: string;
  residential_approved?: ApprovalStatus;
  identity_approved?: ApprovalStatus;
  created_at?: string;
  updated_at?: string;
}

export interface IRegister {
  first_name: string;
  last_name: string;
  email: string;
  is_artisan?: boolean;
  phone: string;
  password: string;
}
