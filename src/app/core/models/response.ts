export interface IAPIResponse {
  message: string;
  status: string;
}

export interface IAPICallResponse<T> {
  message: string;
  data: T;
  status: string;
}

export interface IPaginationResponse<T> {
  page: string;
  size: string;
  total: number;
  data: T[];
}
