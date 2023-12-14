export interface IService {
  id?: string;
  name: string;
  price: number;
  description?: string;
  category?: any;
  created_at?: string;
  updated_at?: string;
  platform_percentage?: number;
  artisan?: string;
  negotiable?: boolean;
}
