import { IUser } from './user';

export interface ISignIn {
  type: string;
  email?: string;
  phone?: string;
  password?: string;
  remember?: boolean;
}

export interface IRegister {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
}

export interface IVerifyOtp {
  type: string;
  email?: string;
  phone?: string;
  code: string;
}

export interface IVerifyPhoneOtp {
  email?: string;
  phone?: string;
  code: string;
}

export interface IForgotPassword {
  type: 'email' | 'phone';
  email?: string;
  phone?: string;
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

export interface ILoginResponse {
  metaData: IUser;
  access_token: string;
}
