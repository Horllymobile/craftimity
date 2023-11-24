import { ICategory } from "./ICategory";
import { IUser } from "./IUser";

export interface ICraftsman {
  id?: string;
  name: string;
  business_name: string;
  category?: any;
  approved?: boolean;
  certificate: string;
  work_id: string;
  work_id_approved?: boolean;
  certificate_approved?: boolean;
  created_at?: string;
  updated_at?: string;
  user?: any;
}
