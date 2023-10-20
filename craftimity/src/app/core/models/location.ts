export interface ICountry {
  id: number;
  name: string;
  code: string;
  currency: string;
  currency_code: string;
  phone_code: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  symbol: string;
}

export interface IState {
  id: number;
  name: string;
}

export interface ICity {
  id: number;
  name: string;
}
