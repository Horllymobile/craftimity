import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IService } from '../../models/service';
import { map } from 'rxjs';
import { IAPICallResponse, IPaginationResponse } from '../../models/response';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  private baseUrl = environment.BASE_URL;
  constructor(private http: HttpClient) {}

  create(payload: IService) {
    return this.http
      .post<IAPICallResponse<any>>(`${this.baseUrl}/services`, payload)
      .pipe(map((res) => res.message));
  }

  update(id: string, payload: IService) {
    return this.http
      .put<IAPICallResponse<any>>(`${this.baseUrl}/services/${id}`, payload)
      .pipe(map((res) => res.message));
  }

  delete(id: string) {
    return this.http
      .delete<IAPICallResponse<any>>(`${this.baseUrl}/services/${id}`)
      .pipe(map((res) => res.message));
  }

  getServices(params?: {
    page?: number;
    size?: number;
    category?: number;
    name?: string;
  }) {
    return this.http
      .get<IAPICallResponse<IPaginationResponse<any>>>(
        `${this.baseUrl}/services`,
        { params }
      )
      .pipe(map((res) => res));
  }

  getService(id?: string) {
    return this.http
      .get<IAPICallResponse<any>>(`${this.baseUrl}/services/${id}`)
      .pipe(map((res) => res.data));
  }
}
