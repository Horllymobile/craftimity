import { EApprovalStatus } from "../enums/approval-status";

export interface ICraftsman {
  id?: string;
  name: string;
  business_name: string;
  category?: any;
  approved?: EApprovalStatus;
  certificate: string;
  work_id: string;
  work_id_approved?: EApprovalStatus;
  certificate_approved?: EApprovalStatus;
  created_at?: string;
  updated_at?: string;
  user?: any;
}
