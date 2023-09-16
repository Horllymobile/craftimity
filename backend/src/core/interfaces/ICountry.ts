export interface ICountry {
  id?: number;
  name: string;
  code: string;
  phone_code: string;
  currency: string;
  currency_code: string;
  symbol?: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}
