import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ICategory } from '../../models/category';
import { Observable, map } from 'rxjs';
import { IAPICallResponse, IPaginationResponse } from '../../models/response';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = environment.BASE_URL;
  constructor(private http: HttpClient) {}

  getCategories(params?: {
    page?: number;
    size?: number;
  }): Observable<ICategory[]> {
    return this.http
      .get<IAPICallResponse<IPaginationResponse<ICategory>>>(
        `${this.baseUrl}/categories`,
        { params }
      )
      .pipe(map((res) => res.data.data));
  }
}
