import { ApprovalStatus } from "../enums/approval-status";
import { ICategory } from "./category";

export interface IArtisan {
  id?: string;
  name: string;
  business_name: string;
  category?: ICategory;
  certificate: string;
  work_id: string;
  approved?: ApprovalStatus;
  work_id_approved?: ApprovalStatus;
  certificate_approved?: ApprovalStatus;
  created_at?: string;
  updated_at?: string;
  user?: any;
}

export interface CreateArtisan {
  user_id: string;
  name: string;
  business_name: string;
  category: number;
  certificate: string;
  work_id: string;
}
