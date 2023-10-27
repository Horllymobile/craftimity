import { ICategory } from "./ICategory";
import { IUser } from "./IUser";

export interface ICraftsman {
  id?: string;
  name: string;
  business_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user?: IUser;
  category?: ICategory;
}
