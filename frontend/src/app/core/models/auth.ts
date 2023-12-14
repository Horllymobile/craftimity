import { EContactType } from "../enums/auth";

export interface ISignIn {
  type: EContactType;
  email?: string;
  phone?: string;
  password?: string;
}

export interface IVerifyOtp {
  type: EContactType;
  email?: string;
  phone?: string;
  code: string;
}

export interface IVerifyPhoneOtp {
  email?: string;
  phone?: string;
  code: string;
}

export interface IUpdateUser {
  first_name?: string;
  last_name?: string;
  profile_image?: string;
  address?: string;
  birthdate?: string;
  country?: number;
  state?: number;
  city?: number;
  password?: string;
}

export interface IRegisterUser {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
}
